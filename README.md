# Sub Sheet Builder - Backend

MCA underwriting sub sheet analyzer. Node.js backend that proxies Anthropic API calls.

## Setup

### 1. Create GitHub Repository
1. Go to https://github.com/new
2. Name: `subsheet-backend`
3. Private
4. Create repository

### 2. Push Code to GitHub
```bash
cd ~/Documents/subsheet-backend

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/mollyp999/subsheet-backend.git
git push -u origin main
```

### 3. Deploy on Render
1. Go to https://dashboard.render.com
2. New → Web Service → Connect GitHub → Select `subsheet-backend`
3. Settings:
   - **Name:** subsheet-builder
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Environment Variables:
   - `ANTHROPIC_API_KEY` = your Anthropic API key
   - `PORT` = 3000

### 4. Access
Once deployed, your team accesses it at:
`https://subsheet-builder-xxxx.onrender.com`

## Files
- `server.js` - Express server with API proxy endpoints
- `public/index.html` - HTML shell
- `public/app.jsx` - React app (compiled in-browser via Babel)
- `package.json` - Dependencies

## API Endpoints
- `POST /api/analyze` - Proxies bank statement analysis to Anthropic
- `POST /api/screen` - Proxies public records screening (with web search)
- `GET /api/health` - Health check
