# volens.tech

Static site. Deploys to GitHub Pages (free, included with your GitHub Student account).

## Deploy in ~5 minutes
1. `gh auth login` (once), then inside this folder: `./deploy.sh`
2. In your .TECH domain control panel (get.tech → Manage → DNS), add:
   - A    @    185.199.108.153
   - A    @    185.199.109.153
   - A    @    185.199.110.153
   - A    @    185.199.111.153
   - CNAME www  <your-github-username>.github.io
3. GitHub → repo → Settings → Pages → Custom domain = volens.tech → wait for the DNS check → tick "Enforce HTTPS".

## Form submissions
Open index.html, find `var FORM_ENDPOINT='';` and paste your Pageclip (free in the Student Pack) or Formspree endpoint.

## Email for hello@volens.tech
Cloudflare Email Routing or ImprovMX (both free) forward to your inbox; Zoho Mail free plan gives a real mailbox.
