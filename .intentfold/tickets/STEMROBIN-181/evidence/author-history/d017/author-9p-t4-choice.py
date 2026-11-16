"""Offline t4 author reasoning, key-free projection and a single structural check."""

import argparse
import hashlib
import json
from fractions import Fraction
from pathlib import Path
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[4]
TMP = Path(__file__).resolve().parent
SCRIPTS = ROOT / ".agents/skills/ld-s10y-choice/scripts"
sys.path.insert(0, str(SCRIPTS))
from prepare import digest, file_hash, load_json


SEED = TMP / "9p-t4-choice-seed.json"
DRAFT = TMP / "9p-t4-choice-draft.json"
VIEW = TMP / "9p-t4-choice-view.json"
MANIFEST = TMP / "9p-t4-choice-author-manifest.json"
REASONING = TMP / "9p-t4-choice-reasoning.json"
SEED_DIGEST = "7d20000e9c58acfc59bae2a6c49c8cbfaac963794196abeca87b5758d4704a59"
FIGURE_DIR = ROOT / ".tmp/STEMROBIN-181/9p-d017-t4-figures"

FIGURE_OBSERVATIONS = {
    "fig-101": "实际打开原PNG与640/331/342完整现代SVG预览：单个圆盘去掉上方扇形，两个径向边界在中心相交，缺口内有φ角标，剩余盘面斜线填充。现代图的最右和最下圆周完整可见，没有温度、长度或角度数值读数；只作为自由均匀膨胀的构型。",
    "fig-102": "实际打开原PNG与640/331/342完整现代SVG预览：左侧交流端、下方串联Heater、右侧回路线、水平牢固结合的上下两层金属片（下层斜线填充）及来自上方的接点完整可见。沿用右侧连接/固定端和上方接点构型，不从线稿臆测胀系数或温度数值，不实际操作电路。",
}

# This complete source reasoning is frozen before any candidate options are written.
INDEPENDENT_SOLUTIONS = [
    {
        "source_number": "1",
        "task": "判断缺口角φ的变化，并解释均匀自由热膨胀的几何作用。",
        "solution": "均匀各向同性、温度均匀、无约束的膨胀将每个线性尺寸乘同一正比例因子。两个缺口边界的方向关系不变，圆盘与缺口保持几何相似，φ不变。空缺本身不是不膨胀的实体；边界距离也随盘的尺寸成比例变化。",
        "distinction": "统一线性尺度变化保持角度，不是把缺口固定或让盘面填入缺口。",
        "limitations": ["选择判断和理由，不证明学习者能独立写出几何说明。"],
    },
    {
        "source_number": "2",
        "task": "解释液体和容器都膨胀时液面仍上升的相对体积变化。",
        "solution": "在该观察成立的温区中，液体的体积相对增加大于容器内腔对应体积的相对增加。比较原液面以下内腔随容器膨胀的体积，液体占据的体积增长更多，液面因此上升。不能比较部分充液体积的增量和任意大容器总容量的增量来作普遍判断。容器也膨胀、液体质量保持不变，现象并非适用于所有材料组合。",
        "distinction": "真实膨胀与相对容器的表观膨胀；固定质量的密度变化不是质量增添。",
        "limitations": ["选择物理解释，不证明学习者能独立撰写开放说明。"],
    },
    {
        "source_number": "3",
        "task": "比较同毛细管面积、不同水银槽体积的平衡读数灵敏度。",
        "solution": "同样温差下的有效体积增量等于水银槽参考体积乘相同的液体与内腔体胀系数差再乘温差。液柱高度增量等于有效体积增量除以共同毛细管截面积，因此高度灵敏度与水银槽体积成正比。水银槽大者平衡读数更灵敏；这不判定谁升温或响应更快。沿用液面会上升的工作温区，忽略毛细管水银体积的源模型。",
        "distinction": "平衡高度响应幅度与达到平衡所需时间是不同量。",
        "limitations": ["选择比较及比例理由，不证明独立写出推导。"],
    },
    {
        "source_number": "4",
        "task": "从装配直径差算参考内径，并求自由线性膨胀的最小温升。",
        "solution": "D0=1m−0.005m=0.995m。临界配合时内径增量为0.005m。用D=D0(1+βΔT)得到ΔT=0.005/(0.995×12×10^-6)=250000/597°C≈418.760°C。温升取整到1°C为419°C；温升和温度差的摄氏度数值与开尔文数值相同。这不是最终绝对温度，也不另加间隙。",
        "distinction": "膨胀参考尺寸是加热前铁箍内径，而不是木轮直径；直径差无需再加倍。",
        "limitations": ["选择完整参考尺寸和计算结果，不证明独立建立等式和计算。"],
    },
    {
        "source_number": "5",
        "task": "把同体积、不同温度的样本重量转成密度比，再求初始体积参考的体胀系数。",
        "solution": "同一实际体积、同当地g意味着ρ60/ρ0=83/88，两份样本不是同质量。改为跟踪同质量样本时V60/V0=ρ0/ρ60=88/83。α=(88/83−1)/60=5/(83×60)=1/996°C^-1≈1.004016×10^-3°C^-1。直接用重量损失占88的比例给9.47×10^-4，是把密度相对变化误当初始体积相对变化。",
        "distinction": "同体积取样密度比需要倒置才得到同质量体积比；线性体胀使用V0参考。",
        "limitations": ["选择密度比、体积比和系数关系，不证明独立完成数值推导。"],
    },
    {
        "source_number": "6",
        "task": "在初始无预应力、轴向完全受限的线弹性模型下求墙所受压应力大小。",
        "solution": "自由热应变为β(T−0)，被墙约束后由相反机械应变抵消。压应力大小为Eβ(T−0)。材料系数、间距和接触面积恒定，因此σ25/σ10=25/10，σ25=3×10^7×25/10=7.5×10^7N/m²。25−10给的是从10°C到25°C的应力增量，不是最终总应力。",
        "distinction": "总应力以0°C的无预应力状态为参考，不以已有10°C状态重新归零。",
        "limitations": ["选择最终总应力，不证明独立推导约束应变关系。"],
    },
    {
        "source_number": "7",
        "task": "完整判断温控反馈机制、下面层的胀系数大小及升温接通信号回路的接点布置。",
        "solution": "图示两层牢固结合，右侧端固定，上方接点在冷态接通加热器。当温度上升时，片应向下弯离上方接点，切断加热器；冷却后可返回重新闭合，形成温度反馈而非任意时刻精确恒温。向下弯意味着下层位于短弧内侧，上层较长；升温时上层自由伸长更大，因此β下面<β上面。保持片与固定端构型，只把接点置于片下侧升温运动路径并在初始状态留下间隙，可在升温时闭合一个概念上的信号回路。保留上方接点会随升温分离，不能产生所需升温闭合动作。",
        "distinction": "差异热伸长决定弯曲侧；接点相对运动决定开闭逻辑；反馈不等于无温度波动。",
        "limitations": ["选择完整概念结论，不证明独立设计或接线；不提供电路、水银或汽油实际操作。"],
    },
]


def binding(path):
    return {"path": path.relative_to(ROOT).as_posix(), "sha256": file_hash(path)}


def write_new(path, value):
    if path.exists():
        raise SystemExit(f"Refusing to overwrite {path.relative_to(ROOT)}")
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def guard_seed():
    seed = load_json(SEED)
    if digest(seed) != SEED_DIGEST:
        raise SystemExit("Native seed content changed.")
    if [row["number"] for row in seed["exercises"]] != [str(i) for i in range(1, 8)]:
        raise SystemExit("Native seed does not contain every selected source task.")
    if seed["concepts"] or seed["source"]["concept_figure_ids"]:
        raise SystemExit("Expected the explicitly authorized no-concepts seed.")
    return seed


def observed_assets():
    assets = []
    for figure in ("fig-101", "fig-102"):
        original = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p/figures" / (figure + ".png")
        assets.append({**binding(original), "figure_id": figure, "kind": "original", "actually_opened": True})
        preview_manifest = load_json(FIGURE_DIR / (figure + ".preview-manifest.json"))
        seed_asset = next(row["assets"][0] for row in guard_seed()["figures"] if row["id"] == figure)
        if preview_manifest["svg"]["sha256"] != seed_asset["sha256"]:
            raise SystemExit("Existing complete previews are not bound to the seeded SVG.")
        if file_hash(ROOT / seed_asset["path"]) != seed_asset["sha256"]:
            raise SystemExit("Seeded SVG bytes changed.")
        for width in (640, 331, 342):
            entry = next(row for row in preview_manifest["previews"] if row["width"] == width)
            image = ROOT / entry["path"]
            if file_hash(image) != entry["sha256"]:
                raise SystemExit("Actually observed width-preview bytes changed.")
            assets.append({
                **binding(image), "figure_id": figure, "kind": "complete-native-svg-preview",
                "width": width, "actually_opened": True,
                "svg_binding": seed_asset, "right_and_bottom_edges_visible": True,
            })
    return assets


def solve():
    if DRAFT.exists():
        raise SystemExit("Independent source reasoning must precede the authored options.")
    guard_seed()
    hoop_rise = Fraction(5, 1000) / (Fraction(995, 1000) * Fraction(12, 1000000))
    volume_coefficient = (Fraction(88, 83) - 1) / 60
    final_stress = Fraction(3 * 10**7) * Fraction(25, 10)
    record = {
        "role": "author independent reasoning before alternatives; not answer-key input or semantic review",
        "seed": {**binding(SEED), "canonical_sha256": SEED_DIGEST},
        "source_solutions": INDEPENDENT_SOLUTIONS,
        "exact_calculations": {
            "hoop_temperature_rise": str(hoop_rise),
            "volume_coefficient": str(volume_coefficient),
            "final_compressive_stress": str(final_stress),
        },
        "figure_observations": FIGURE_OBSERVATIONS,
        "actually_opened_assets": observed_assets(),
        "options_created_at_this_stage": False,
        "answer_or_previous_choice_inputs": [],
    }
    write_new(REASONING, record)
    print("Independent source reasoning frozen before options; no author keys emitted.")


def freeze():
    seed = guard_seed()
    if not REASONING.exists() or not DRAFT.exists():
        raise SystemExit("Missing prior independent reasoning or authored draft.")
    if VIEW.exists() or MANIFEST.exists():
        raise SystemExit("View or author manifest already exists; refusing repeat verification.")
    draft = load_json(DRAFT)
    if draft["seed_sha256"] != digest(seed):
        raise SystemExit("Authored draft not bound to native seed.")
    if draft["new_figures"]:
        raise SystemExit("No new figure authoring is authorized.")
    for path in (SEED, DRAFT):
        if not path.is_relative_to(TMP):
            raise SystemExit("Writes must remain ticket scratch.")
    observed_assets()
    command = [
        "python3", ".agents/skills/ld-s10y-choice/scripts/validate.py", "--repo", ".",
        "--seed", SEED.relative_to(ROOT).as_posix(),
        "--draft", DRAFT.relative_to(ROOT).as_posix(),
    ]
    checked = subprocess.run(command, cwd=ROOT, text=True, capture_output=True)
    projection = {
        "questions": [{"id": row["id"], **row["view"]} for row in draft["questions"]],
        "figures": seed["figures"],
    }
    if any(set(row) != {"id", "mode", "stem", "figure_ids", "options"} for row in projection["questions"]):
        raise SystemExit("Key-free view projection contains a non-view field.")
    write_new(VIEW, projection)
    report = {
        "ticket": "STEMROBIN-181",
        "batch": "D017",
        "role": "choice-author-only",
        "status": "frozen-pending-main-view-first-semantic-review" if checked.returncode == 0 else "blocked-structural",
        "bindings": {
            "seed": {**binding(SEED), "canonical_sha256": digest(seed)},
            "draft": {**binding(DRAFT), "canonical_sha256": digest(draft)},
            "view": {**binding(VIEW), "canonical_sha256": digest(projection)},
            "independent_author_reasoning": binding(REASONING),
            "helper": binding(Path(__file__).resolve()),
            "native_prepare": binding(SCRIPTS / "prepare.py"),
            "native_validate": binding(SCRIPTS / "validate.py"),
        },
        "native_seed_scope": {"card": "phy9-c1-s7-t4", "source_tasks": 7, "selected_numbers": list(range(1, 8)), "no_concepts": True},
        "prepare": {"invocations": 1, "canonical_sha256": SEED_DIGEST},
        "structural_validation": {
            "command": " ".join(command), "invocations": 1, "exit_code": checked.returncode,
            "stdout": checked.stdout, "stderr": checked.stderr,
            "semantic_review": "pending; no author self-review or independent approval",
        },
        "response_units": {
            "questions": len(draft["questions"]),
            "options": sum(len(row["view"]["options"]) for row in draft["questions"]),
            "modes": {mode: sum(row["view"]["mode"] == mode for row in draft["questions"]) for mode in ("single", "multiple")},
            "reason": "One coherent physical or numerical response unit per genuinely independent source problem; source7 keeps all three related apparatus judgments in one multiple selection rather than three answer slots.",
        },
        "coverage": draft["coverage"],
        "source7_target_coverage": {
            "feedback_mechanism": "q-switch",
            "lower_layer_smaller_linear_expansion": "q-switch",
            "warming_closed_signal_contact_below": "q-switch",
        },
        "actually_observed_assets": load_json(REASONING)["actually_opened_assets"],
        "projection_policy": "Main reads the frozen view before private draft/author reasoning; view contains only local IDs, mode, stem, image references and visible options, never keys/intents/source selectors.",
        "answer_or_previous_choice_inputs": [],
        "new_figures": [],
        "independent_approval": False,
        "finalize_or_promotion": False,
        "browser_runs": 0,
        "in_flight_processes": [],
    }
    write_new(MANIFEST, report)
    print(f"structural_exit={checked.returncode}; author keys remain outside view.")
    print(checked.stdout.strip())
    if checked.stderr:
        print(checked.stderr.strip())
    for name, path in (("seed", SEED), ("draft", DRAFT), ("view", VIEW), ("author_manifest", MANIFEST)):
        print(f"{name}={path.relative_to(ROOT)} sha256={file_hash(path)}")
    if checked.returncode:
        raise SystemExit(checked.returncode)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=("solve", "freeze"))
    action = parser.parse_args().action
    if action == "solve":
        solve()
    else:
        freeze()
