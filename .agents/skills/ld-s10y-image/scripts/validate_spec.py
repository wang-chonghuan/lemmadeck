#!/usr/bin/env python3
"""Validate an ld-s10y-image FigureSpec and its mathematical assertions."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
from pathlib import Path
from typing import Any


SCHEMA = "ld-s10y-image/figure-spec@2"
LEGACY_SCHEMA = "ld-s10y-image/figure-spec@1"
NON_ENGLISH = re.compile(
    r"[\u0400-\u04ff\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]"
)
CENTRAL_SYMMETRY = re.compile(
    r"中心对称|对称中心|central symmetry|centrally symmetric|half-turn|"
    r"180(?:°| degrees?)",
    re.IGNORECASE,
)
GEOMETRY_TYPES = {
    "point", "segment", "line", "arrow", "circle", "polygon", "arc",
    "grid", "axis", "measure", "svgPath",
}
SUPPORTED_TYPES = GEOMETRY_TYPES | {"text", "image"}
COLOR_ROLES = {"ink", "muted", "accent", "accentSoft", "grid", "paper"}


def load(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise SystemExit(f"ERROR: missing spec: {path}")
    except json.JSONDecodeError as error:
        raise SystemExit(f"ERROR: invalid JSON {path}: {error}")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def finite_number(value: Any) -> bool:
    return (
        isinstance(value, (int, float))
        and not isinstance(value, bool)
        and math.isfinite(value)
    )


def coordinate(value: Any) -> bool:
    return (
        isinstance(value, list)
        and len(value) == 2
        and all(finite_number(item) for item in value)
    )


def point_map(objects: list[dict]) -> dict[str, tuple[float, float]]:
    points = {}
    for item in objects:
        if item.get("type") == "point" and coordinate(item.get("at")):
            points[item["id"]] = tuple(item["at"])
    return points


def resolve_point(
    value: Any,
    points: dict[str, tuple[float, float]],
    label: str,
    errors: list[str],
) -> tuple[float, float] | None:
    if coordinate(value):
        return float(value[0]), float(value[1])
    if isinstance(value, str) and value in points:
        return points[value]
    errors.append(f"{label}: expected coordinate or point id")
    return None


def resolve_position(
    value: Any,
    objects_by_id: dict[str, dict],
    points: dict[str, tuple[float, float]],
    label: str,
    errors: list[str],
) -> tuple[float, float] | None:
    if isinstance(value, str):
        obj = objects_by_id.get(value)
        if isinstance(obj, dict) and obj.get("type") in {"point", "text"}:
            at = obj.get("at")
            if coordinate(at):
                return float(at[0]), float(at[1])
    return resolve_point(value, points, label, errors)


def distance(a: tuple[float, float], b: tuple[float, float]) -> float:
    return math.hypot(a[0] - b[0], a[1] - b[1])


def vector(a: tuple[float, float], b: tuple[float, float]) -> tuple[float, float]:
    return b[0] - a[0], b[1] - a[1]


def cross(a: tuple[float, float], b: tuple[float, float]) -> float:
    return a[0] * b[1] - a[1] * b[0]


def dot(a: tuple[float, float], b: tuple[float, float]) -> float:
    return a[0] * b[0] + a[1] * b[1]


def point_to_segment_distance(
    point: tuple[float, float],
    start: tuple[float, float],
    end: tuple[float, float],
) -> float:
    segment = vector(start, end)
    length_squared = dot(segment, segment)
    if length_squared == 0:
        return distance(point, start)
    offset = vector(start, point)
    position = max(0.0, min(1.0, dot(offset, segment) / length_squared))
    projection = (
        start[0] + segment[0] * position,
        start[1] + segment[1] * position,
    )
    return distance(point, projection)


def point_in_polygon(
    point: tuple[float, float],
    polygon: list[tuple[float, float]],
) -> bool:
    inside = False
    previous = polygon[-1]
    for current in polygon:
        crosses = (current[1] > point[1]) != (previous[1] > point[1])
        if crosses:
            edge_x = (
                (previous[0] - current[0])
                * (point[1] - current[1])
                / (previous[1] - current[1])
                + current[0]
            )
            if point[0] < edge_x:
                inside = not inside
        previous = current
    return inside


def relation_membership_errors(
    spec: dict,
    objects: list[dict],
    points: dict[str, tuple[float, float]],
    assertions: list[dict],
    current: bool,
) -> list[str]:
    if not current:
        return []

    set_polygons = {
        item.get("id"): item
        for item in objects
        if isinstance(item, dict)
        and item.get("type") == "polygon"
        and isinstance(item.get("id"), str)
        and item["id"].endswith("-set")
    }
    connects = [
        item
        for item in assertions
        if isinstance(item, dict) and item.get("type") == "connects"
    ]
    if len(set_polygons) < 2 or not connects:
        return []

    objects_by_id = {
        item.get("id"): item
        for item in objects
        if isinstance(item, dict) and isinstance(item.get("id"), str)
    }
    memberships: dict[str, list[dict]] = {}
    for assertion in assertions:
        if not isinstance(assertion, dict) or assertion.get("type") != "inside":
            continue
        member_id = assertion.get("point")
        if isinstance(member_id, str):
            memberships.setdefault(member_id, []).append(assertion)

    members = {
        item["id"]: next(
            (
                container_id
                for container_id in set_polygons
                if re.fullmatch(
                    rf"{re.escape(container_id[:-4])}-\d+(?:-label)?",
                    item["id"],
                )
            ),
            None,
        )
        for item in objects
        if isinstance(item, dict)
        and item.get("visible") is not False
        and isinstance(item.get("id"), str)
        and (
            item.get("type") == "point"
            or (
                item.get("type") == "text"
                and item["id"].endswith("-label")
            )
        )
    }
    members = {
        member_id: container_id
        for member_id, container_id in members.items()
        if container_id is not None
    }
    errors = []
    canvas_width = spec.get("canvas", {}).get("width")
    bounding_box = spec.get("canvas", {}).get("boundingBox")
    widths = spec.get("display", {}).get("widths")
    user_width = (
        bounding_box[2] - bounding_box[0]
        if isinstance(bounding_box, list)
        and len(bounding_box) == 4
        and all(finite_number(value) for value in bounding_box)
        else None
    )
    user_units_per_canvas_px = (
        user_width / canvas_width
        if finite_number(user_width)
        and finite_number(canvas_width)
        and canvas_width > 0
        else 1.0
    )
    user_units_per_product_px = (
        user_width / min(widths)
        if finite_number(user_width)
        and isinstance(widths, list)
        and widths
        and all(finite_number(width) and width > 0 for width in widths)
        else user_units_per_canvas_px
    )

    for member_id, expected_container in sorted(members.items()):
        member_assertions = [
            assertion
            for assertion in memberships.get(member_id, [])
            if assertion.get("container") == expected_container
        ]
        if not member_assertions:
            errors.append(
                "set-relation figure requires an inside assertion for "
                f"member {member_id!r} in {expected_container!r}"
            )
            continue

        member = objects_by_id[member_id]
        position = resolve_position(
            member_id,
            objects_by_id,
            points,
            f"set member {member_id!r}",
            errors,
        )
        if position is None:
            continue

        if member.get("type") == "text":
            font_size = member.get("fontSize", 16)
            text = member.get("text", "")
            half_height = font_size * 0.5 if finite_number(font_size) else 8
            half_width = (
                font_size * 0.3 * max(len(text), 1)
                if finite_number(font_size)
                else 8
            )
            required_clearance = (
                max(half_height, half_width) * user_units_per_canvas_px
                + 4 * user_units_per_product_px
            )
        else:
            size = member.get("size", 3)
            required_clearance = (
                size if finite_number(size) and size >= 0 else 3
            ) * user_units_per_canvas_px + 4 * user_units_per_product_px

        clearances = []
        for assertion in member_assertions:
            container = set_polygons.get(assertion.get("container"))
            if container is None:
                continue
            polygon = []
            for value in container.get("points", []):
                resolved = resolve_point(
                    value,
                    points,
                    f"container {container.get('id')!r}",
                    errors,
                )
                if resolved is not None:
                    polygon.append(resolved)
            if len(polygon) >= 3 and point_in_polygon(position, polygon):
                clearances.append(min(
                    point_to_segment_distance(position, start, end)
                    for start, end in zip(polygon, polygon[1:] + polygon[:1])
                ))

        if clearances and max(clearances) < required_clearance:
            errors.append(
                f"set member {member_id!r} has {max(clearances):.3g} units "
                f"of boundary clearance; requires {required_clearance:.3g}"
            )

    return errors


def completeness_errors(
    spec: dict,
    objects: list[dict],
    points: dict[str, tuple[float, float]],
    assertions: list[dict],
    current: bool,
) -> list[str]:
    errors = []
    inventory = spec.get("source", {}).get("inventory")
    by_id = {item.get("id"): item for item in objects if isinstance(item, dict)}
    assertions_by_id = {
        item.get("id"): item
        for item in assertions
        if isinstance(item, dict) and isinstance(item.get("id"), str)
    }
    if inventory is not None:
        if not isinstance(inventory, list) or not inventory:
            errors.append("source.inventory must be a nonempty array")
        else:
            inventory_ids = []
            for index, group in enumerate(inventory):
                label = f"source.inventory[{index}]"
                if not isinstance(group, dict) or not group.get("description"):
                    errors.append(f"{label} needs a source-based description")
                    continue
                if current:
                    inventory_id = group.get("id")
                    if not isinstance(inventory_id, str) or not inventory_id:
                        errors.append(f"{label}.id must be nonempty")
                    else:
                        inventory_ids.append(inventory_id)
                required_objects = group.get("objects")
                required_assertions = group.get("assertions", [])
                if not isinstance(required_objects, list):
                    errors.append(f"{label}.objects must be an array")
                    required_objects = []
                if current and not isinstance(required_assertions, list):
                    errors.append(f"{label}.assertions must be an array")
                    required_assertions = []
                if (
                    current
                    and spec.get("mode") != "generated"
                    and not required_objects
                    and not required_assertions
                ):
                    errors.append(
                        f"{label} must map at least one object or assertion"
                    )
                if not current and not required_objects:
                    errors.append(f"{label}.objects must be nonempty")
                for object_id in required_objects:
                    obj = by_id.get(object_id) if isinstance(object_id, str) else None
                    if obj is None or obj.get("visible") is False:
                        errors.append(f"{label}: missing visible object {object_id!r}")
                for assertion_id in required_assertions:
                    if assertion_id not in assertions_by_id:
                        errors.append(
                            f"{label}: missing assertion {assertion_id!r}"
                        )
            if current and len(inventory_ids) != len(set(inventory_ids)):
                errors.append("source.inventory ids must be unique")

    box = spec.get("canvas", {}).get("boundingBox")
    if not isinstance(box, list) or len(box) != 4 or not all(map(finite_number, box)):
        return errors
    xmin, ymax, xmax, ymin = box
    for obj in objects:
        if not isinstance(obj, dict) or obj.get("visible") is False:
            continue
        kind = obj.get("type")
        # Infinite lines and viewport grids are intentionally bounded by the viewport.
        if kind in {"line", "svgPath", "image"}:
            continue
        coordinates = []
        if kind == "grid":
            bounds = obj.get("bounds")
            if isinstance(bounds, list) and len(bounds) == 4:
                coordinates = [
                    [bounds[0], bounds[1]],
                    [bounds[2], bounds[3]],
                ]
            else:
                continue
        elif kind in {"point", "text"}:
            coordinates = [obj.get("at")]
        elif kind in {"segment", "arrow", "measure", "axis"}:
            coordinates = [obj.get("from"), obj.get("to")]
        elif kind == "polygon":
            coordinates = obj.get("points", [])
        elif kind == "circle" and finite_number(obj.get("radius")):
            center = obj.get("center")
            center = points.get(center) if isinstance(center, str) else center
            if center is not None and len(center) == 2:
                radius = obj["radius"]
                coordinates = [
                    [center[0] - radius, center[1] - radius],
                    [center[0] + radius, center[1] + radius],
                ]
        elif kind == "arc":
            coordinates = [obj.get("start"), obj.get("end")]
        for value in coordinates:
            value = points.get(value) if isinstance(value, str) else value
            if not isinstance(value, (list, tuple)) or len(value) != 2:
                continue
            if not all(map(finite_number, value)):
                continue
            if not (xmin <= value[0] <= xmax and ymin <= value[1] <= ymax):
                errors.append(f"{obj.get('id')}: geometry outside canvas at {value}")
                break
    return errors


def assertion_errors(
    assertions: list[dict],
    objects: list[dict],
    points: dict[str, tuple[float, float]],
) -> list[str]:
    errors = []
    objects_by_id = {
        item.get("id"): item
        for item in objects
        if isinstance(item, dict) and isinstance(item.get("id"), str)
    }
    for index, item in enumerate(assertions):
        label = f"assertions[{index}]"
        kind = item.get("type")
        tolerance = item.get("tolerance", 1e-6)
        if not finite_number(tolerance) or tolerance < 0:
            errors.append(f"{label}.tolerance must be a nonnegative number")
            continue
        if kind == "objectCount":
            object_type = item.get("objectType")
            expected = item.get("count")
            actual = sum(obj.get("type") == object_type for obj in objects)
            if not isinstance(expected, int) or actual != expected:
                errors.append(
                    f"{label}: expected {expected} {object_type}, found {actual}"
                )
            continue
        if kind == "pointOnCircle":
            point = resolve_point(item.get("point"), points, f"{label}.point", errors)
            center = resolve_point(item.get("center"), points, f"{label}.center", errors)
            radius = item.get("radius")
            if not finite_number(radius) or radius <= 0:
                errors.append(f"{label}.radius must be positive")
            elif point is not None and center is not None:
                if abs(distance(point, center) - radius) > tolerance:
                    errors.append(f"{label}: point is not on circle")
            continue
        if kind == "centralSymmetry":
            center = resolve_point(
                item.get("center"), points, f"{label}.center", errors
            )
            pairs = item.get("pairs")
            if not isinstance(pairs, list) or not pairs:
                errors.append(f"{label}.pairs must be a nonempty array")
                continue
            if center is None:
                continue
            for pair_index, pair in enumerate(pairs):
                pair_label = f"{label}.pairs[{pair_index}]"
                if not isinstance(pair, dict):
                    errors.append(f"{pair_label} must be an object")
                    continue
                first = resolve_point(
                    pair.get("a"), points, f"{pair_label}.a", errors
                )
                second = resolve_point(
                    pair.get("b"), points, f"{pair_label}.b", errors
                )
                if first is None or second is None:
                    continue
                midpoint = (
                    (first[0] + second[0]) / 2,
                    (first[1] + second[1]) / 2,
                )
                if distance(midpoint, center) > tolerance:
                    errors.append(
                        f"{pair_label}: midpoint {midpoint} != center {center}"
                    )
            continue
        if kind == "inside":
            point = resolve_position(
                item.get("point"),
                objects_by_id,
                points,
                f"{label}.point",
                errors,
            )
            container_id = item.get("container")
            container = objects_by_id.get(container_id)
            if not isinstance(container, dict) or container.get("type") != "polygon":
                errors.append(f"{label}.container must reference a polygon")
                continue
            polygon = []
            for point_index, value in enumerate(container.get("points", [])):
                resolved = resolve_point(
                    value,
                    points,
                    f"{label}.container.points[{point_index}]",
                    errors,
                )
                if resolved is not None:
                    polygon.append(resolved)
            margin = item.get("margin", 0)
            if not finite_number(margin) or margin < 0:
                errors.append(f"{label}.margin must be a nonnegative number")
                continue
            if point is not None and len(polygon) >= 3:
                if not point_in_polygon(point, polygon):
                    errors.append(
                        f"{label}: point {item.get('point')!r} is outside "
                        f"{container_id!r}"
                    )
                elif margin and min(
                    point_to_segment_distance(point, start, end)
                    for start, end in zip(polygon, polygon[1:] + polygon[:1])
                ) < margin:
                    errors.append(
                        f"{label}: point {item.get('point')!r} is inside "
                        f"{container_id!r} but violates margin {margin}"
                    )
            continue
        if kind == "connects":
            arrow_id = item.get("arrow")
            arrow = objects_by_id.get(arrow_id)
            if not isinstance(arrow, dict) or arrow.get("type") != "arrow":
                errors.append(f"{label}.arrow must reference an arrow")
                continue
            actual_from = resolve_point(
                arrow.get("from"), points, f"{label}.arrow.from", errors
            )
            actual_to = resolve_point(
                arrow.get("to"), points, f"{label}.arrow.to", errors
            )
            expected_from = resolve_point(
                item.get("from"), points, f"{label}.from", errors
            )
            expected_to = resolve_point(
                item.get("to"), points, f"{label}.to", errors
            )
            if all(
                value is not None
                for value in (actual_from, actual_to, expected_from, expected_to)
            ):
                if distance(actual_from, expected_from) > tolerance:
                    errors.append(
                        f"{label}: arrow {arrow_id!r} starts at the wrong member"
                    )
                if distance(actual_to, expected_to) > tolerance:
                    errors.append(
                        f"{label}: arrow {arrow_id!r} ends at the wrong member"
                    )
            continue

        names = {
            "distance": ("a", "b"),
            "equalDistance": ("a", "b", "c", "d"),
            "collinear": ("a", "b", "c"),
            "parallel": ("a", "b", "c", "d"),
            "perpendicular": ("a", "b", "c", "d"),
            "pointOnLine": ("point", "a", "b"),
        }.get(kind)
        if not names:
            errors.append(f"{label}: unsupported assertion type {kind!r}")
            continue
        resolved = {
            name: resolve_point(item.get(name), points, f"{label}.{name}", errors)
            for name in names
        }
        if any(value is None for value in resolved.values()):
            continue

        if kind == "distance":
            actual = distance(resolved["a"], resolved["b"])
            expected = item.get("value")
            if not finite_number(expected) or abs(actual - expected) > tolerance:
                errors.append(
                    f"{label}: distance {actual:.8g} != {expected!r}"
                )
        elif kind == "equalDistance":
            first = distance(resolved["a"], resolved["b"])
            second = distance(resolved["c"], resolved["d"])
            if abs(first - second) > tolerance:
                errors.append(
                    f"{label}: distances {first:.8g} and {second:.8g} differ"
                )
        elif kind == "collinear":
            value = abs(cross(
                vector(resolved["a"], resolved["b"]),
                vector(resolved["a"], resolved["c"]),
            ))
            if value > tolerance:
                errors.append(f"{label}: points are not collinear")
        elif kind in {"parallel", "perpendicular"}:
            first = vector(resolved["a"], resolved["b"])
            second = vector(resolved["c"], resolved["d"])
            scale = max(math.hypot(*first) * math.hypot(*second), 1.0)
            value = (
                abs(cross(first, second))
                if kind == "parallel"
                else abs(dot(first, second))
            )
            if value > tolerance * scale:
                errors.append(f"{label}: lines are not {kind}")
        elif kind == "pointOnLine":
            value = abs(cross(
                vector(resolved["a"], resolved["b"]),
                vector(resolved["a"], resolved["point"]),
            ))
            if value > tolerance:
                errors.append(f"{label}: point is not on line")
    return errors


def validate(spec_path: Path, stage: str) -> list[str]:
    spec = load(spec_path)
    errors: list[str] = []
    schema = spec.get("schema")
    if schema not in {SCHEMA, LEGACY_SCHEMA}:
        errors.append(f"schema must be {SCHEMA}")
    current = schema == SCHEMA
    if (
        not isinstance(spec.get("id"), str)
        or not re.fullmatch(r"(fig|tbl)-[A-Za-z0-9-]+", spec["id"])
    ):
        errors.append("id must start with fig- or tbl-")
    mode = spec.get("mode")
    if mode not in {"deterministic", "hybrid", "generated"}:
        errors.append("mode must be deterministic, hybrid, or generated")
    if not isinstance(spec.get("description"), str) or not spec["description"].strip():
        errors.append("description must be nonempty")

    source = spec.get("source")
    if not isinstance(source, dict):
        errors.append("source must be an object")
        source = {}
    source_image = source.get("image")
    if not isinstance(source_image, dict):
        errors.append("source.image must be an object")
        source_image = {}
    image_path = source_image.get("path")
    image_sha = source_image.get("sha256")
    if not isinstance(image_path, str) or not image_path:
        errors.append("source.image.path must be nonempty")
    elif stage in {"rendered", "approved"}:
        path = Path(image_path)
        if not path.is_file():
            errors.append(f"missing source image: {path}")
        elif image_sha != sha256(path):
            errors.append("source.image.sha256 is stale")
    if not isinstance(image_sha, str) or not re.fullmatch(r"[a-f0-9]{64}", image_sha):
        errors.append("source.image.sha256 must be lowercase SHA-256")
    authoritative = source.get("authoritativeText")
    if not isinstance(authoritative, list) or not authoritative:
        errors.append("source.authoritativeText must be nonempty")
        authoritative = []
    elif any(
        not isinstance(item, dict)
        or not isinstance(item.get("text"), str)
        or not item["text"].strip()
        for item in authoritative
    ):
        errors.append("every authoritativeText item needs nonempty text")
    if current and not source.get("inventory"):
        errors.append("current FigureSpec requires source.inventory")

    canvas = spec.get("canvas")
    if not isinstance(canvas, dict):
        errors.append("canvas must be an object")
        canvas = {}
    for key in ("width", "height"):
        value = canvas.get(key)
        if not isinstance(value, int) or not 320 <= value <= 4096:
            errors.append(f"canvas.{key} must be an integer from 320 to 4096")
    bounding_box = canvas.get("boundingBox")
    if (
        not isinstance(bounding_box, list)
        or len(bounding_box) != 4
        or not all(finite_number(item) for item in bounding_box)
    ):
        errors.append("canvas.boundingBox must contain four finite numbers")
    elif not (
        bounding_box[0] < bounding_box[2]
        and bounding_box[3] < bounding_box[1]
    ):
        errors.append("canvas.boundingBox must be [xMin, yMax, xMax, yMin]")
    if current and canvas.get("background", "paper") not in {
        "paper", "transparent"
    }:
        errors.append("canvas.background must be paper or transparent")

    display = spec.get("display")
    if current:
        if not isinstance(display, dict):
            errors.append("current FigureSpec requires display")
            display = {}
        layout = display.get("layout")
        if layout not in {"inline", "scroll"}:
            errors.append("display.layout must be inline or scroll")
        min_text = display.get("minTextPx")
        if not finite_number(min_text) or min_text < 16:
            errors.append("display.minTextPx must be at least 16")
        widths = display.get("widths")
        if (
            not isinstance(widths, list)
            or not widths
            or any(
                not isinstance(width, int) or not 240 <= width <= 1600
                for width in widths
            )
        ):
            errors.append(
                "display.widths must be a nonempty array of widths from 240 to 1600"
            )
        elif layout == "inline" and min(widths) > 352:
            errors.append("inline display must include a width of 352px or less")
        if "palette" in spec:
            errors.append(
                "current FigureSpec uses semantic color roles; remove palette"
            )
        if "review" in spec:
            errors.append(
                "current FigureSpec review evidence belongs in a separate review file"
            )

    objects = spec.get("objects")
    if not isinstance(objects, list):
        errors.append("objects must be an array")
        objects = []
    ids = [item.get("id") for item in objects if isinstance(item, dict)]
    if any(not isinstance(value, str) or not value for value in ids):
        errors.append("every object needs a nonempty id")
    if len(ids) != len(set(ids)):
        errors.append("object ids must be unique")
    assets = spec.get("assets", [])
    if not isinstance(assets, list):
        errors.append("assets must be an array")
        assets = []
    asset_ids = {
        item.get("id")
        for item in assets
        if isinstance(item, dict) and isinstance(item.get("id"), str)
    }
    if len(asset_ids) != len(assets):
        errors.append("asset ids must be present and unique")

    points = point_map(objects)
    labels = []
    image_count = 0
    for index, item in enumerate(objects):
        label = f"objects[{index}]"
        if not isinstance(item, dict):
            errors.append(f"{label} must be an object")
            continue
        kind = item.get("type")
        if kind not in SUPPORTED_TYPES:
            errors.append(f"{label}: unsupported type {kind!r}")
            continue
        if current:
            for field in ("stroke", "fill", "labelColor"):
                role = item.get(field)
                if role is not None and role not in COLOR_ROLES:
                    errors.append(
                        f"{label}.{field} must use a semantic color role"
                    )
        for field in ("label", "text"):
            text = item.get(field)
            if isinstance(text, str) and text:
                labels.append((label, text))
        if kind == "point" and not coordinate(item.get("at")):
            errors.append(f"{label}.at must be [x, y]")
        elif kind in {"segment", "line", "arrow", "axis", "measure"}:
            resolve_point(item.get("from"), points, f"{label}.from", errors)
            resolve_point(item.get("to"), points, f"{label}.to", errors)
        elif kind == "circle":
            resolve_point(item.get("center"), points, f"{label}.center", errors)
            if not finite_number(item.get("radius")) or item["radius"] <= 0:
                errors.append(f"{label}.radius must be positive")
        elif kind == "polygon":
            values = item.get("points")
            if not isinstance(values, list) or len(values) < 3:
                errors.append(f"{label}.points needs at least three points")
            else:
                for point_index, value in enumerate(values):
                    resolve_point(
                        value, points, f"{label}.points[{point_index}]", errors
                    )
        elif kind == "arc":
            for field in ("center", "start", "end"):
                resolve_point(item.get(field), points, f"{label}.{field}", errors)
        elif kind == "grid":
            for field in ("xStep", "yStep"):
                if not finite_number(item.get(field)) or item[field] <= 0:
                    errors.append(f"{label}.{field} must be positive")
            for field in ("xOffset", "yOffset"):
                if field in item and not finite_number(item.get(field)):
                    errors.append(f"{label}.{field} must be finite")
            bounds = item.get("bounds")
            if bounds is not None:
                if (
                    not isinstance(bounds, list)
                    or len(bounds) != 4
                    or not all(map(finite_number, bounds))
                ):
                    errors.append(
                        f"{label}.bounds must be [xMin, yMax, xMax, yMin]"
                    )
                elif not (bounds[0] < bounds[2] and bounds[3] < bounds[1]):
                    errors.append(
                        f"{label}.bounds must be [xMin, yMax, xMax, yMin]"
                    )
        elif kind == "text":
            resolve_point(item.get("at"), points, f"{label}.at", errors)
            if not isinstance(item.get("text"), str) or not item["text"].strip():
                errors.append(f"{label}.text must be nonempty")
        elif kind == "image":
            image_count += 1
            if item.get("asset") not in asset_ids:
                errors.append(f"{label}.asset does not resolve")
            if not coordinate(item.get("at")) or not coordinate(item.get("size")):
                errors.append(f"{label}.at and size must be [x, y]")
            elif item["size"][0] <= 0 or item["size"][1] <= 0:
                errors.append(f"{label}.size values must be positive")
            rotation = item.get("rotation")
            if rotation is not None:
                if not isinstance(rotation, dict):
                    errors.append(f"{label}.rotation must be an object")
                else:
                    if not finite_number(rotation.get("angleDegrees")):
                        errors.append(
                            f"{label}.rotation.angleDegrees must be finite"
                        )
                    if not coordinate(rotation.get("center")):
                        errors.append(
                            f"{label}.rotation.center must be [x, y]"
                        )
        elif kind == "svgPath":
            if not isinstance(item.get("d"), str) or not item["d"].strip():
                errors.append(f"{label}.d must be nonempty")
    for label, text in labels:
        if NON_ENGLISH.search(text):
            errors.append(f"{label}: visible text must be English: {text!r}")

    if mode == "generated" and objects:
        errors.append("generated mode must not contain deterministic objects")
    if mode == "hybrid" and image_count == 0:
        errors.append("hybrid mode requires an image object")
    if mode == "hybrid":
        first_geometry = next(
            (
                index
                for index, item in enumerate(objects)
                if isinstance(item, dict) and item.get("type") != "image"
            ),
            len(objects),
        )
        if any(
            isinstance(item, dict) and item.get("type") == "image"
            for item in objects[first_geometry:]
        ):
            errors.append("hybrid image objects must precede overlay objects")
    if mode == "deterministic" and image_count:
        errors.append("deterministic mode cannot contain image objects")

    if stage in {"rendered", "approved"}:
        for index, asset in enumerate(assets):
            path = Path(asset.get("path", ""))
            if not path.is_file():
                errors.append(f"assets[{index}]: missing file {path}")
            metadata = asset.get("metadata")
            if metadata and not Path(metadata).is_file():
                errors.append(f"assets[{index}]: missing metadata {metadata}")

    assertions = spec.get("assertions")
    if not isinstance(assertions, list):
        errors.append("assertions must be an array")
        assertions = []
    if current:
        assertion_ids = [
            item.get("id")
            for item in assertions
            if isinstance(item, dict)
        ]
        if any(
            not isinstance(assertion_id, str) or not assertion_id
            for assertion_id in assertion_ids
        ):
            errors.append("every current assertion needs a nonempty id")
        if len(assertion_ids) != len(set(assertion_ids)):
            errors.append("assertion ids must be unique")
    if mode in {"deterministic", "hybrid"} and any(
        item.get("type") in GEOMETRY_TYPES
        for item in objects
        if isinstance(item, dict)
    ) and not assertions:
        errors.append("mathematical objects require assertions")
    errors += assertion_errors(assertions, objects, points)
    errors += completeness_errors(spec, objects, points, assertions, current)
    errors += relation_membership_errors(
        spec, objects, points, assertions, current
    )
    symmetry_text = " ".join([
        spec.get("description", ""),
        *[
            item.get("text", "")
            for item in authoritative
            if isinstance(item, dict)
        ],
    ])
    if (
        mode in {"deterministic", "hybrid"}
        and CENTRAL_SYMMETRY.search(symmetry_text)
        and not any(
            isinstance(item, dict) and item.get("type") == "centralSymmetry"
            for item in assertions
        )
    ):
        errors.append(
            "central-symmetry content requires a centralSymmetry assertion"
        )

    if not current:
        review = spec.get("review")
        if not isinstance(review, dict) or review.get("status") not in {
            "draft", "pass", "fail"
        }:
            errors.append("review.status must be draft, pass, or fail")
        elif stage == "approved" and review.get("status") != "pass":
            errors.append("approved stage requires review.status pass")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("spec", type=Path)
    parser.add_argument(
        "--stage",
        choices=("draft", "rendered", "approved"),
        default="draft",
    )
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    errors = validate(args.spec, args.stage)
    payload = {
        "schema": "ld-s10y-image/spec-validation@1",
        "spec": args.spec.as_posix(),
        "stage": args.stage,
        "status": "fail" if errors else "pass",
        "errors": errors,
    }
    if args.json:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
    elif errors:
        for error in errors:
            print(f"ERROR: {error}")
    else:
        print(f"PASS: {args.spec}")
    return 2 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
