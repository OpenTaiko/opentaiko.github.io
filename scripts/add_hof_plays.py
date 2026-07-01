#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Add Hall-of-Fame plays to hof.db3 from a TSV.

Each input line is one play, tab-separated, in the column order of the
`scores` table (the auto-increment scoreId is NOT included):

    entryId  difficulty  player  status  score  grade  goodCount  okCount  badCount  videoLink  imageLink

Example line (videoLink is empty here -> two tabs before the image URL):

    CoLlaPSEPaNDEMOniUm<TAB>4<TAB>Unused<TAB>Clear<TAB>951910<TAB>S<TAB>796<TAB>79<TAB>17<TAB><TAB>https://i.ibb.co/VW559WxC/image.png

The composite key is (entryId, difficulty, player) -- the UNIQUE index
`scoreEntry` on the `scores` table. On a collision with an existing row:

  * status  : keep the HIGHEST of the two, ranked  Clear < Full Combo < Perfect.
  * the rest: if the incoming score is strictly higher than the stored score,
              replace  score, grade, goodCount, okCount, badCount, videoLink, imageLink
              with the incoming play's values; otherwise keep the stored ones.

These two rules are applied independently (a status upgrade can happen even
when the score is not replaced, and vice-versa) -- exactly as specified.

Usage:
    python scripts/add_hof_plays.py plays.tsv
    python scripts/add_hof_plays.py plays.tsv --db public/hof.db3
    some_command | python scripts/add_hof_plays.py -          # read from stdin
    python scripts/add_hof_plays.py plays.tsv --dry-run       # report, write nothing

A timestamped backup (hof.db3.<timestamp>.bak) is created before any write
unless --no-backup or --dry-run is given. Runs on Python 2.7 and 3.x.
"""

from __future__ import print_function

import argparse
import io
import os
import shutil
import sqlite3
import sys
from datetime import datetime

# Lowest -> highest. Extend here if new statuses are ever introduced.
STATUS_RANK = {"Clear": 0, "Full Combo": 1, "Perfect": 2}

# scores columns, in TSV order (scoreId is auto-increment, not supplied).
COLUMNS = ["entryId", "difficulty", "player", "status", "score", "grade",
           "goodCount", "okCount", "badCount", "videoLink", "imageLink"]
INT_COLUMNS = {"difficulty", "score", "goodCount", "okCount", "badCount"}
# Fields that get replaced together when the incoming score is higher.
SCORE_FIELDS = ["score", "grade", "goodCount", "okCount", "badCount",
                "videoLink", "imageLink"]

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_DB = os.path.join(REPO_ROOT, "public", "hof.db3")


class RowError(Exception):
    pass


def read_lines(path):
    """Read all lines from a file path (utf-8, BOM-tolerant) or stdin ('-'/None)."""
    if path and path != "-":
        with io.open(path, "r", encoding="utf-8-sig", newline="") as f:
            return f.read().splitlines()
    raw = sys.stdin.read()
    if isinstance(raw, bytes):
        raw = raw.decode("utf-8")
    return raw.lstrip(u"﻿").splitlines()


def parse_row(line, lineno):
    """Turn one TSV line into a dict of typed values. Raises RowError on bad data."""
    fields = [f.strip() for f in line.split("\t")]
    # videoLink / imageLink may be omitted entirely (no trailing tabs) -> pad.
    if len(fields) < 9:
        raise RowError("line %d: expected at least 9 columns, got %d" % (lineno, len(fields)))
    if len(fields) > 11:
        raise RowError("line %d: expected at most 11 columns, got %d" % (lineno, len(fields)))
    fields = (fields + ["", ""])[:11]

    row = dict(zip(COLUMNS, fields))

    for col in INT_COLUMNS:
        try:
            row[col] = int(row[col])
        except ValueError:
            raise RowError("line %d: column '%s' is not an integer: %r"
                           % (lineno, col, row[col]))

    if not row["entryId"]:
        raise RowError("line %d: entryId is empty" % lineno)
    if row["status"] not in STATUS_RANK:
        raise RowError("line %d: unknown status %r (expected one of %s)"
                       % (lineno, row["status"], ", ".join(sorted(STATUS_RANK, key=STATUS_RANK.get))))
    return row


def merge_existing(existing, row):
    """Given a stored (status, score) and an incoming row, build the UPDATE.

    Returns a list of (column, new_value) pairs to write, or [] if nothing
    changes."""
    cur_status, cur_score = existing["status"], existing["score"]
    changes = []

    # Rule 1: keep the highest status (independent of score).
    if STATUS_RANK.get(row["status"], -1) > STATUS_RANK.get(cur_status, -1):
        changes.append(("status", row["status"]))

    # Rule 2: replace the score-related fields only if the incoming score wins.
    if row["score"] > cur_score:
        for col in SCORE_FIELDS:
            changes.append((col, row[col]))

    return changes


def main(argv=None):
    ap = argparse.ArgumentParser(description="Add Hall-of-Fame plays to hof.db3 from a TSV.")
    ap.add_argument("input", nargs="?", default="-",
                    help="TSV file (default: stdin, or pass '-')")
    ap.add_argument("--db", default=DEFAULT_DB,
                    help="path to hof.db3 (default: %s)" % DEFAULT_DB)
    ap.add_argument("--dry-run", action="store_true",
                    help="report what would change; write nothing")
    ap.add_argument("--no-backup", action="store_true",
                    help="do not create a .bak copy before writing")
    args = ap.parse_args(argv)

    if not os.path.exists(args.db):
        ap.error("database not found: %s" % args.db)

    lines = read_lines(args.input)

    # Parse first so a bad row is caught before we touch the DB.
    rows, skipped = [], []
    for i, line in enumerate(lines, 1):
        if not line.strip():
            continue
        if line.lstrip().startswith("#"):
            continue
        # Tolerate an optional header line.
        if i == 1 and line.split("\t")[0].strip() == "entryId":
            continue
        try:
            rows.append((i, parse_row(line, i)))
        except RowError as e:
            skipped.append(str(e))

    if not rows:
        print("No valid data rows found.")
        for s in skipped:
            print("  SKIP:", s)
        return 1

    if not args.dry_run and not args.no_backup:
        stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        backup = "%s.%s.bak" % (args.db, stamp)
        shutil.copy2(args.db, backup)
        print("Backup written: %s" % backup)

    con = sqlite3.connect(args.db)
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    known_ids = set(r[0] for r in cur.execute("SELECT uniqueId FROM entries"))

    inserted = updated = unchanged = 0
    unknown_entry = set()

    try:
        for lineno, row in rows:
            if row["entryId"] not in known_ids:
                unknown_entry.add(row["entryId"])

            existing = cur.execute(
                "SELECT scoreId, status, score FROM scores "
                "WHERE entryId=? AND difficulty=? AND player=?",
                (row["entryId"], row["difficulty"], row["player"]),
            ).fetchone()

            if existing is None:
                cur.execute(
                    "INSERT INTO scores (%s) VALUES (%s)"
                    % (", ".join(COLUMNS), ", ".join(["?"] * len(COLUMNS))),
                    [row[c] for c in COLUMNS],
                )
                inserted += 1
            else:
                changes = merge_existing(existing, row)
                if changes:
                    set_clause = ", ".join("%s=?" % c for c, _ in changes)
                    params = [v for _, v in changes] + [existing["scoreId"]]
                    cur.execute("UPDATE scores SET %s WHERE scoreId=?" % set_clause, params)
                    updated += 1
                else:
                    unchanged += 1

        if args.dry_run:
            con.rollback()
        else:
            con.commit()
    except Exception:
        con.rollback()
        raise
    finally:
        con.close()

    print("")
    print("%s%d play(s) processed:" % ("(dry-run) " if args.dry_run else "", len(rows)))
    print("  inserted : %d" % inserted)
    print("  updated  : %d" % updated)
    print("  unchanged: %d" % unchanged)
    if skipped:
        print("  skipped  : %d (invalid rows)" % len(skipped))
        for s in skipped:
            print("      -", s)
    if unknown_entry:
        print("  note: %d entryId(s) not found in the 'entries' table "
              "(inserted anyway -- check for typos):" % len(unknown_entry))
        for e in sorted(unknown_entry):
            print("      -", e)
    if args.dry_run:
        print("\nDry run -- no changes written.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
