#!/usr/bin/env bash
# One-time publish of this folder to GitHub Pages. Run from inside the unzipped volens-tech folder.
# Needs: git + GitHub CLI (gh) logged in:  gh auth login
set -e
REPO="${1:-volens-tech}"
git init -q && git add -A && git commit -qm "Volens site" && git branch -M main
gh repo create "$REPO" --public --source=. --remote=origin --push
gh api -X POST "repos/{owner}/$REPO/pages" -f 'source[branch]=main' -f 'source[path]=/' >/dev/null 2>&1 || true
gh api -X PUT "repos/{owner}/$REPO/pages" -f cname=volens.tech -F https_enforced=true >/dev/null 2>&1 || true
echo "Pushed. Now add the DNS records at get.tech (see README), then check: https://github.com/$(gh api user -q .login)/$REPO/settings/pages"
