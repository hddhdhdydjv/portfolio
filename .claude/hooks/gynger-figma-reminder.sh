#!/usr/bin/env bash
# UserPromptSubmit hook: when a prompt is about Figma, make Claude load the gynger-figma skill first.
input=$(cat)
if printf '%s' "$input" | grep -qiE 'figma|brisk|design file|dev file|design system'; then
  echo "This prompt is about Gynger's Figma work. Before any Figma tool call, invoke the gynger-figma skill (Skill tool) and follow it: use the Brisk design system, ask before deleting or changing existing components, reply in Spanish and write in English inside Figma. For DS audits, follow ds-audit.md and update docs/brisk-ds-audit-status.md and docs/brisk-ds-backlog.md in hddhdhdydjv/Onboarding-gynger-."
fi
exit 0
