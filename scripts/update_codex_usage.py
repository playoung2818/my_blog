#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import math
from collections import defaultdict
from datetime import UTC, datetime
from pathlib import Path
from zoneinfo import ZoneInfo

CHICAGO = ZoneInfo("America/Chicago")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate a blog-safe Codex usage snapshot.")
    parser.add_argument("--codex-home", type=Path, default=Path.home() / ".codex")
    parser.add_argument("--output", type=Path, default=Path("data/codex-usage.json"))
    return parser.parse_args()


def parse_iso_timestamp(raw: str | None) -> datetime | None:
    if not raw:
        return None
    try:
        return datetime.fromisoformat(raw.replace("Z", "+00:00")).astimezone(CHICAGO)
    except ValueError:
        return None


def estimate_active_minutes(events: list[datetime]) -> int:
    if not events:
        return 0
    events = sorted(events)
    total = 0.0
    for previous, current in zip(events, events[1:]):
        gap_min = (current - previous).total_seconds() / 60
        if gap_min <= 15:
            total += gap_min
    return max(5, math.ceil(total))


def build_snapshot(codex_home: Path) -> dict:
    history_path = codex_home / "history.jsonl"
    sessions_root = codex_home / "sessions"
    daily = defaultdict(lambda: {"prompts": 0, "sessions": 0, "commands": 0, "active_minutes": 0})
    session_days: dict[str, set[str]] = defaultdict(set)

    if history_path.exists():
        with history_path.open() as handle:
            for line in handle:
                line = line.strip()
                if not line:
                    continue
                try:
                    entry = json.loads(line)
                except json.JSONDecodeError:
                    continue
                ts = entry.get("ts")
                session_id = entry.get("session_id")
                if ts is None:
                    continue
                day = datetime.fromtimestamp(ts, tz=UTC).astimezone(CHICAGO).date().isoformat()
                daily[day]["prompts"] += 1
                if session_id:
                    session_days[session_id].add(day)

    if sessions_root.exists():
        for session_file in sorted(sessions_root.rglob("*.jsonl")):
            session_id = None
            touched_days: set[str] = set()
            command_days = defaultdict(int)
            event_times: list[datetime] = []

            with session_file.open() as handle:
                for line in handle:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        entry = json.loads(line)
                    except json.JSONDecodeError:
                        continue

                    timestamp = parse_iso_timestamp(entry.get("timestamp"))
                    payload = entry.get("payload") or {}
                    if timestamp:
                        event_times.append(timestamp)
                        touched_days.add(timestamp.date().isoformat())

                    if entry.get("type") == "session_meta":
                        session_id = payload.get("id")
                        session_timestamp = parse_iso_timestamp(payload.get("timestamp"))
                        if session_timestamp:
                            touched_days.add(session_timestamp.date().isoformat())

                    if entry.get("type") == "response_item" and payload.get("type") == "function_call":
                        if payload.get("name") == "exec_command" and timestamp:
                            command_days[timestamp.date().isoformat()] += 1

            if session_id and session_id in session_days:
                touched_days |= session_days[session_id]

            for day in touched_days:
                daily[day]["sessions"] += 1

            if event_times and touched_days:
                minutes_per_day = max(1, round(estimate_active_minutes(event_times) / len(touched_days)))
                for day in touched_days:
                    daily[day]["active_minutes"] += minutes_per_day

            for day, count in command_days.items():
                daily[day]["commands"] += count

    years: dict[str, dict] = {}
    for day in sorted(daily):
        year = day[:4]
        years.setdefault(year, {
            "summary": {
                "total_prompts": 0,
                "total_sessions": 0,
                "total_commands": 0,
                "total_active_minutes": 0,
            },
            "months": defaultdict(lambda: {
                "label": "",
                "prompts": 0,
                "sessions": 0,
                "commands": 0,
                "active_minutes": 0,
            }),
            "days": [],
        })
        metrics = daily[day]
        if not any(metrics.values()):
            continue
        years[year]["days"].append({"date": day, **metrics})
        years[year]["summary"]["total_prompts"] += metrics["prompts"]
        years[year]["summary"]["total_sessions"] += metrics["sessions"]
        years[year]["summary"]["total_commands"] += metrics["commands"]
        years[year]["summary"]["total_active_minutes"] += metrics["active_minutes"]

        month_key = day[:7]
        month_bucket = years[year]["months"][month_key]
        month_bucket["label"] = datetime.fromisoformat(f"{month_key}-01").strftime("%B %Y")
        month_bucket["prompts"] += metrics["prompts"]
        month_bucket["sessions"] += metrics["sessions"]
        month_bucket["commands"] += metrics["commands"]
        month_bucket["active_minutes"] += metrics["active_minutes"]

    serialized_years = {}
    for year, payload in years.items():
        serialized_years[year] = {
            "summary": payload["summary"],
            "months": list(payload["months"].values()),
            "days": payload["days"],
        }

    return {
        "meta": {
            "codex_home": str(codex_home),
            "timezone": "America/Chicago",
            "generated_at": datetime.now(CHICAGO).strftime("%Y-%m-%d %H:%M:%S"),
        },
        "available_years": [int(year) for year in sorted(serialized_years)],
        "years": serialized_years,
    }


def main() -> None:
    args = parse_args()
    payload = build_snapshot(args.codex_home.expanduser())
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {args.output}")


if __name__ == "__main__":
    main()
