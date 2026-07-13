# Delayed - Deployment Instructions

## Quick Deploy to Render

### Step 1: Push to GitHub
```bash
# Create a new repo on GitHub called "delayed-film"
# Then run:
git remote add origin https://github.com/AdamLozo/delayed-film.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Render
1. Go to https://render.com
2. Click "New +" → "Static Site"
3. Connect your GitHub account (if not already)
4. Select the "delayed-film" repository
5. Configure:
   - **Name:** `delayed`
   - **Branch:** `main`
   - **Build Command:** (leave blank)
   - **Publish Directory:** `.` (current directory)
6. Click "Create Static Site"

### Step 3: Configure Custom Domain
1. Once deployed, go to Settings → Custom Domains
2. Add custom domain: `delayed.adamlozo.com`
3. Render will provide you with a CNAME value

## GoDaddy DNS Configuration

**Add this CNAME record in GoDaddy:**

| Type  | Name    | Value (from Render)           | TTL     |
|-------|---------|-------------------------------|---------|
| CNAME | delayed | `delayed.onrender.com`        | 600     |

**Note:** Render will show you the exact CNAME value in the Custom Domain section. It will look like `delayed.onrender.com` or similar.

### DNS Propagation
- DNS changes can take 5-60 minutes to propagate
- Check status at: https://www.whatsmydns.net/#CNAME/delayed.adamlozo.com

## Site Structure
```
deploy/
├── index.html     # Main video player page
├── delayed.mp4    # The 45-second animation (6.7 MB)
└── README.md      # This file
```

## Post-Deployment
Once live, the site will be available at:
- **Production:** https://delayed.adamlozo.com
- **Render URL:** https://delayed.onrender.com
