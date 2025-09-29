# Dealer Dashboard (Frontend)

## Quick start

1. Install dependencies
```powershell
npm install
```

2. Create a dev env file (optional, default points to 8080)
```powershell
Set-Content -Path .env.development -Value "VITE_API_URL=http://localhost:8080"
```

3. Start dev server
```powershell
npm run dev
```

Vite will start on http://localhost:5173

## Notes
- API calls are proxied to VITE_API_URL for paths starting with /api
- Update the env file if your gateway/backend runs on a different port
