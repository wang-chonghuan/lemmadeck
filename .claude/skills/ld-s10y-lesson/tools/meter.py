#!/usr/bin/env python3
"""Read a session's real token usage and record it in the production checkpoint.

Why this exists: production cost is dominated by re-reading one session's own
history, and a session that never ends pays for that history on every turn. The
meter makes the number visible while the session is still running, and fails when
it crosses the budget.

It reads only the usage counters. Session transcripts carry tool output, which can
contain secrets, so nothing but integers and the session id leaves this tool —
never a transcript excerpt and never an absolute path.

Standard library only.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import checkpoint as cp  # noqa: E402

DEFAULT_BUDGET = 8_000_000

# 每百万 token 的美元标价，2026-11-24 从官方价目页读取。
# 三类输入单价相差 20 倍（1 小时缓存写 $10 vs 缓存命中 $0.50），所以把它们并成
# 一栏的计量数字是没法折算成钱的——这是本工具上一版的实际缺陷。
RATES_USD_PER_MTOK = {
    "claude-opus-5":     {"input": 5.00, "output": 25.00, "write5m": 6.25, "write1h": 10.00, "read": 0.50},
    "claude-opus-5-5":   {"input": 4.00, "output": 20.00, "write5m": 5.00, "write1h": 8.00, "read": 0.20},
    "claude-sonnet-5-5": {"input": 2.00, "output": 10.00, "write5m": 2.50, "write1h": 4.00, "read": 0.10},
    "claude-fable-5-2":  {"input": 8.00, "output": 40.00, "write5m": 10.00, "write1h": 16.00, "read": 0.20},
}


def price_cents(usage: dict) -> int | None:
    """这次会话按标价值多少美分；模型不在价目表里就返回 None，不猜。"""
    rate = RATES_USD_PER_MTOK.get(usage.get("model") or "")
    if rate is None:
        return None
    usd = (
        usage["input"] * rate["input"]
        + usage["cacheWrite5m"] * rate["write5m"]
        + usage["cacheWrite1h"] * rate["write1h"]
        + usage["cached"] * rate["read"]
        + usage["output"] * rate["output"]
    ) / 1_000_000
    return round(usd * 100)
AMBIGUOUS_WINDOW_SECONDS = 2.0


class MeterError(ValueError):
    pass


def _claude_usage(path: Path) -> dict:
    """Claude Code: one `message.usage` per assistant turn, each a per-turn delta.

    Fresh input, cache writes and cache reads are kept apart because their unit
    prices differ by up to twentyfold; the 5-minute and 1-hour write TTLs differ
    again, and which one a session uses is not something the reader can assume.
    """
    fresh = write5m = write1h = write_flat = cached = output = turns = peak = 0
    models: dict[str, int] = {}
    for line in path.open(encoding="utf-8", errors="ignore"):
        if '"usage"' not in line:
            continue
        try:
            record = json.loads(line)
        except json.JSONDecodeError:
            continue
        message = record.get("message") or {}
        usage = message.get("usage")
        if not isinstance(usage, dict):
            continue
        read = int(usage.get("cache_read_input_tokens") or 0)
        write = int(usage.get("cache_creation_input_tokens") or 0)
        plain = int(usage.get("input_tokens") or 0)
        turns += 1
        cached += read
        fresh += plain
        detail = usage.get("cache_creation")
        if isinstance(detail, dict) and (detail.get("ephemeral_5m_input_tokens")
                                         or detail.get("ephemeral_1h_input_tokens")):
            write5m += int(detail.get("ephemeral_5m_input_tokens") or 0)
            write1h += int(detail.get("ephemeral_1h_input_tokens") or 0)
        else:
            write_flat += write
        output += int(usage.get("output_tokens") or 0)
        peak = max(peak, read + write + plain)
        if message.get("model"):
            models[message["model"]] = models.get(message["model"], 0) + 1
    if not turns:
        raise MeterError(f"no usage records in {path.name}")
    # 没有 TTL 明细的回合按 5 分钟计价（较便宜的一档），不虚报。
    write5m += write_flat
    usage = {
        "runtime": "claude",
        "model": max(models, key=models.get) if models else None,
        "turns": turns,
        "input": fresh,
        "cacheWrite": write5m + write1h,
        "cacheWrite5m": write5m,
        "cacheWrite1h": write1h,
        "cached": cached,
        "output": output,
        "total": fresh + write5m + write1h + cached + output,
        "peakContext": peak,
    }
    usage["costCents"] = price_cents(usage)
    return usage


def _codex_usage(path: Path) -> dict:
    """Codex: `total_token_usage` is cumulative, so the last one is the session total."""
    last = None
    turns = peak = 0
    for line in path.open(encoding="utf-8", errors="ignore"):
        marker = line.find('"total_token_usage"')
        if marker < 0:
            continue
        start = line.find("{", marker)
        end = line.find("}", start)
        if start < 0 or end < 0:
            continue
        try:
            usage = json.loads(line[start:end + 1])
        except json.JSONDecodeError:
            continue
        last = usage
        turns += 1
        peak = max(peak, int(usage.get("input_tokens") or 0))
    if last is None:
        raise MeterError(f"no total_token_usage records in {path.name}")
    cached = int(last.get("cached_input_tokens") or 0)
    fresh = int(last.get("input_tokens") or 0) - cached
    output = int(last.get("output_tokens") or 0)
    if fresh < 0:
        raise MeterError(
            f"{path.name} reports cached_input_tokens above input_tokens; refusing to guess"
        )
    return {
        "runtime": "codex",
        "model": None,
        "turns": turns,
        "input": fresh,
        "cacheWrite": 0,
        "cacheWrite5m": 0,
        "cacheWrite1h": 0,
        "cached": cached,
        "output": output,
        "total": fresh + cached + output,
        "peakContext": peak,
        "costCents": None,
    }


def read_transcript(path: Path) -> dict:
    path = Path(path).expanduser()
    if not path.is_file():
        raise MeterError(f"no transcript at {path}")
    head = ""
    with path.open(encoding="utf-8", errors="ignore") as stream:
        for _ in range(200):
            line = stream.readline()
            if not line:
                break
            head += line
    if '"total_token_usage"' in head or '"rollout' in path.name:
        usage = _codex_usage(path)
    elif '"usage"' in head or path.suffix == ".jsonl":
        usage = _claude_usage(path)
    else:
        raise MeterError(f"{path.name} is not a recognised session transcript")
    usage["session"] = path.stem
    return usage


def discover(repo: Path) -> Path:
    """Newest transcript in the cwd-derived project directory, or a loud failure.

    The project directory name is derived from the checkout path, but a renamed
    directory makes that derivation wrong — observed on this project. So a miss or a
    tie is an error telling the caller to pass --transcript, never a guess.
    """
    slug = str(repo).replace("/", "-")
    root = Path.home() / ".claude/projects" / slug
    if not root.is_dir():
        raise MeterError(
            f"no session directory for this checkout ({slug}); pass --transcript explicitly"
        )
    candidates = [p for p in root.glob("*.jsonl") if p.is_file()]
    if not candidates:
        raise MeterError(f"no transcripts under the session directory; pass --transcript")
    candidates.sort(key=lambda p: p.stat().st_mtime, reverse=True)
    newest = candidates[0]
    if len(candidates) > 1:
        gap = newest.stat().st_mtime - candidates[1].stat().st_mtime
        if gap < AMBIGUOUS_WINDOW_SECONDS:
            raise MeterError(
                f"two transcripts were modified {gap:.1f}s apart; pass --transcript explicitly"
            )
    return newest


def resolve(args) -> tuple[dict, Path]:
    if args.transcript:
        path = Path(args.transcript).expanduser()
    else:
        path = discover(cp.validate_repo(args.repo))
    return read_transcript(path), path


def cmd_read(args) -> int:
    usage, _ = resolve(args)
    print(json.dumps(usage, ensure_ascii=False, indent=2))
    return _budget_exit(usage, args.budget)


def cmd_record(args) -> int:
    repo = cp.validate_repo(args.repo)
    usage, _ = resolve(args)
    path = cp.checkpoint_path(repo, args.ticket)
    doc = cp.load(path)
    cp.validate(doc)
    cp.upsert(doc["sessions"], "session", usage["session"], {
        "ended": cp.now(),
        "turns": usage["turns"],
        "input": usage["input"],
        "cacheWrite": usage["cacheWrite"],
        "cached": usage["cached"],
        "output": usage["output"],
        "total": usage["total"],
        "peakContext": usage["peakContext"],
        **({"costCents": usage["costCents"]} if usage["costCents"] is not None else {}),
    })
    doc["updated"] = cp.now()
    cp.store(path, doc)
    print(json.dumps({"ok": True, **usage}, ensure_ascii=False, indent=2))
    return _budget_exit(usage, args.budget)


def _budget_exit(usage: dict, budget: int | None) -> int:
    if budget is None or usage["total"] <= budget:
        return 0
    over = usage["total"] - budget
    print(
        f"meter: session total {usage['total']:,} exceeds budget {budget:,} by {over:,}; "
        f"peak context {usage['peakContext']:,} over {usage['turns']:,} turns"
        + (f", about ${usage['costCents'] / 100:,.2f} at list price. "
           if usage.get("costCents") is not None else ". ")
        + 
        "End this session and start the next lesson in a new one.",
        file=sys.stderr,
    )
    return 1


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    commands = parser.add_subparsers(dest="command", required=True)

    read = commands.add_parser("read", help="print one session's usage, write nothing")
    read.add_argument("--repo", default=".")
    read.add_argument("--transcript")
    read.add_argument("--budget", type=int)
    read.set_defaults(func=cmd_read)

    record = commands.add_parser("record", help="write the usage into the ticket checkpoint")
    record.add_argument("--repo", required=True)
    record.add_argument("--ticket", required=True)
    record.add_argument("--transcript")
    record.add_argument("--budget", type=int, default=DEFAULT_BUDGET)
    record.set_defaults(func=cmd_record)

    args = parser.parse_args(argv)
    try:
        return args.func(args)
    except (MeterError, cp.CheckpointError) as error:
        print(f"meter: {error}", file=sys.stderr)
        return 1
    except OSError as error:
        print(f"meter: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
