# Deployment Guide - Vercel

## Prerequisites

1. GitHub/GitLab/Bitbucket repository
2. Vercel account (free tier is fine)
3. Your production API URL

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure `.env` is in `.gitignore` (already done):

```gitignore
# Environment variables
.env
.env.local
```

Commit and push your code:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your Git repository
4. Vercel will auto-detect Vite settings

### 3. Configure Environment Variables

**Before clicking "Deploy"**, add environment variables:

1. In the import screen, expand **"Environment Variables"** section
2. Add your variables:

   ```
   Key: VITE_API_BASE_URL
   Value: https://your-production-api.com
   ```

   > **Important:** For Vite, all environment variables MUST start with `VITE_`

3. Choose which environments to apply to:
   - ✅ **Production**
   - ✅ **Preview** (for PR previews)
   - ✅ **Development** (optional)

### 4. Deploy

Click **"Deploy"** and wait 1-2 minutes.

## Adding/Updating Environment Variables Later

### Via Dashboard

1. Go to your project → **Settings** → **Environment Variables**
2. Click **"Add New"** or edit existing variable
3. **Important:** After changing env vars, you must redeploy:
   - Go to **Deployments** tab
   - Click ⋯ menu on latest deployment
   - Click **"Redeploy"**

### Via CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Link your project (first time only)
vercel link

# Add environment variable
vercel env add VITE_API_BASE_URL production

# Pull environment variables to local (optional)
vercel env pull

# Deploy
vercel --prod
```

## Different Environment URLs

You'll likely want different API URLs for different environments:

### Production
```
VITE_API_BASE_URL=https://api.glowbook.com
```

### Preview (for testing PRs)
```
VITE_API_BASE_URL=https://staging-api.glowbook.com
```

### Development (local)
```
VITE_API_BASE_URL=http://localhost:8080
```

**How to set up multiple environments:**

1. In Vercel dashboard → Environment Variables
2. Add the same variable name multiple times
3. Check different environment boxes for each value

## Automatic Deployments

Vercel automatically deploys:
- **Production:** When you push to `main` branch
- **Preview:** When you open/update a pull request

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your domain (e.g., `booking.glowbook.com`)
3. Update DNS records as instructed
4. SSL certificate is automatically provisioned

## Troubleshooting

### Environment Variable Not Working

**Problem:** Changes not reflected after adding env var

**Solution:** You must redeploy after changing environment variables:
```bash
vercel --prod
# or via dashboard: Deployments → Redeploy
```

### Build Failing

**Check the build logs:**
1. Go to **Deployments** tab
2. Click on the failed deployment
3. Check build logs for errors

**Common issues:**
- TypeScript errors (fix locally first)
- Missing dependencies (check package.json)
- Wrong build command (should be `npm run build`)

### 404 on Routes

**Problem:** `/1`, `/2` etc. return 404

**Solution:** Already configured in `vercel.json` with SPA rewrites:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### CORS Errors in Production

**Problem:** API calls fail with CORS errors

**Solution:** Update your Go server's CORS configuration to include your Vercel domain:

```go
server.Use(cors.New(cors.Config{
    AllowOrigins: []string{
        "http://localhost:5173",
        "https://your-app.vercel.app",
        "https://booking.glowbook.com", // if using custom domain
    },
    AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    AllowCredentials: true,
    MaxAge:           12 * time.Hour,
}))
```

## Environment Variable Best Practices

### ✅ DO:
- Use `VITE_` prefix for all frontend env vars
- Keep `.env` in `.gitignore`
- Use `.env.example` for documentation
- Set different values per environment

### ❌ DON'T:
- Commit `.env` to Git
- Store secrets in frontend env vars (they're public!)
- Use same API URL for all environments
- Forget to redeploy after changing env vars

## Checking Your Deployment

After deployment:

1. **Visit your URL:** `https://your-app.vercel.app`
2. **Check env vars are loaded:**
   - Open browser console
   - Type: `import.meta.env.VITE_API_BASE_URL`
   - Should show your production URL
3. **Test API calls:**
   - Navigate to `/1` (or your master ID)
   - Services should load from your API

## Monitoring

Vercel provides:
- **Analytics:** See visitor stats
- **Speed Insights:** Performance metrics
- **Logs:** Runtime and build logs (under Functions tab if using serverless)

Access via: Project → **Analytics** / **Speed Insights**

## Local Development with Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Run with Vercel's environment
vercel dev

# This will:
# - Use your .env.development variables from Vercel
# - Simulate Vercel's production environment
# - Hot reload like `npm run dev`
```

## Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/projects/environment-variables)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Custom Domains Guide](https://vercel.com/docs/concepts/projects/domains)
