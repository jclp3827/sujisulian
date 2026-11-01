#!/usr/bin/env python3
"""Verify the R1-D contract addendum carries no R1 implementation into DS-2.3."""

import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
BASE = "123f3c7f2e4ea497a9767be73db3c56e95d708ec"
SOURCE = "56442332150732b96e442202c33b81efa0375542"


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True).strip()


errors = []
registry = json.loads((ROOT / "docs/design-system/registry.json").read_text())
old = json.loads(git("show", f"{BASE}:docs/design-system/registry.json"))
approval = json.loads(
    (ROOT / "docs/design-system/approvals/ds3-r1d-20261029.json").read_text()
)
contracts = (ROOT / "docs/design-system/contracts.md").read_text()
entries = {entry["id"]: entry for entry in registry["entries"]}
old_entries = {entry["id"]: entry for entry in old["entries"]}

if registry["designSystemVersion"] != old["designSystemVersion"] != approval["governanceVersion"]:
    errors.append("governance version mismatch")
if registry["activation"] != old["activation"]:
    errors.append("formal activation declaration changed")
if set(entries) != set(old_entries):
    errors.append("registry entry set changed")
for entry_id, entry in entries.items():
    prior = old_entries[entry_id]
    if entry_id not in ("PAT-CHOICE", "PAT-PROGRESS") and entry != prior:
        errors.append(f"unrelated registry entry changed: {entry_id}")
    if entry["status"] != prior["status"]:
        errors.append(f"implementation status changed: {entry_id}")
    if entry_id in ("PAT-CHOICE", "PAT-PROGRESS"):
        for field in ("sources", "consumers", "rolePages", "applicablePages", "examples", "implementation"):
            if entry.get(field) != prior.get(field):
                errors.append(f"consumer/source identity changed: {entry_id}.{field}")
        ap = entry.get("designContractApproval", {})
        if ap.get("status") != "approved" or ap.get("implementationStatus") != "draft-not-migrated":
            errors.append(f"approval/implementation boundary wrong: {entry_id}")
        if ap.get("reference") != "docs/design-system/approvals/ds3-r1d-20261029.json":
            errors.append(f"approval reference wrong: {entry_id}")
        if not (ROOT / ap.get("reference", "missing")).is_file():
            errors.append(f"approval reference missing: {entry_id}")

for contract_id in ("DS-SEM-004", "DS-PAT-006", "DS-EXP-004"):
    section = re.search(
        rf"^### {contract_id}[^\n]*\n(.*?)(?=^### |^## |\Z)",
        contracts,
        flags=re.M | re.S,
    )
    if not section or not re.search(r"^状态: approved$", section.group(1), re.M):
        errors.append(f"approved contract missing: {contract_id}")
if approval["approvedContractIds"] != ["DS-SEM-004", "DS-PAT-006", "DS-EXP-004"]:
    errors.append("approval contract set wrong")
if approval["productDecisionSourceCommit"] != SOURCE or approval["targetBefore"] != BASE:
    errors.append("approval source/target mismatch")

product_trees = {}
for scope in ("miniprogram", "cloudfunctions", "assets-source"):
    expected = git("rev-parse", f"{BASE}:{scope}")
    current = git("rev-parse", f"HEAD:{scope}")
    # Also inspect working changes; the commit tree alone does not cover uncommitted files.
    changed = git("diff", "--name-only", BASE, "--", scope)
    untracked = git("ls-files", "--others", "--exclude-standard", "--", scope)
    if expected != current or changed or untracked:
        errors.append(f"product drift: {scope}")
    product_trees[scope] = expected
for path in (
    "miniprogram/styles/ds3-r1-results.wxss",
    "miniprogram/templates/learning-progress.wxml",
):
    if (ROOT / path).exists():
        errors.append(f"R1 implementation unexpectedly present: {path}")

result = {
    "ok": not errors,
    "errors": errors,
    "governanceVersion": registry["designSystemVersion"],
    "approvedContracts": approval["approvedContractIds"],
    "draftEntries": ["PAT-CHOICE", "PAT-PROGRESS"],
    "otherEntriesUnchanged": len(entries) - 2,
    "productTreesEqualBase": product_trees,
    "implementationMigrated": False,
}
print(json.dumps(result, ensure_ascii=False, indent=2))
raise SystemExit(0 if result["ok"] else 1)
