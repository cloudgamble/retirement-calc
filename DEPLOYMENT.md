# 🚀 Deployment Guide

## Quick Start: Deploy to Cloudflare Pages

### Option 1: GitHub Integration (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Retirement Calculator"
   git branch -M main
   git remote add origin https://github.com/cloudgamble/retirement-calc.git
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
   - Authorize GitHub and select your `retirement-calc` repository
   
3. **Configure Build Settings:**
   - **Project name:** `retirement-calc`
   - **Production branch:** `main`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (leave empty if project is in root)

4. **Deploy:**
   - Click **Save and Deploy**
   - Wait 2-3 minutes for the first build
   - Your site will be live at `https://retirement-calc.pages.dev`

5. **Custom Domain (Optional):**
   - Go to your Cloudflare Pages project → **Custom domains**
   - Add your domain (e.g., `retirementcalc.com`)
   - Update DNS records as instructed
   - SSL is automatic!

---

### Option 2: Wrangler CLI (Manual Deploy)

1. **Install Wrangler:**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare:**
   ```bash
   wrangler login
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```
   
   This will:
   - Build the production bundle
   - Upload to Cloudflare Pages
   - Return your live URL

4. **Subsequent Deploys:**
   ```bash
   npm run deploy
   ```

---

## Alternative Platforms

### Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```
   
3. Follow prompts and deploy!

### Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

---

## Environment Variables

This project requires **no environment variables** — everything runs client-side!

If you add backend features later (e.g., email capture, premium features), add them via:

**Cloudflare Pages:**
- Dashboard → Your Project → Settings → Environment Variables

**Vercel:**
- Dashboard → Your Project → Settings → Environment Variables

**Netlify:**
- Dashboard → Site Settings → Environment

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] **Calculator loads** and accepts inputs
- [ ] **Chart displays** balance over time
- [ ] **CSV export** downloads correctly
- [ ] **PDF export** generates without errors
- [ ] **Privacy banner** displays with correct GitHub link
- [ ] **Mobile responsiveness** (test on phone)
- [ ] **SEO metadata** appears (check view-source)
- [ ] **SSL certificate** is active (https://)
- [ ] **Custom domain** resolves (if configured)

---

## Monitoring & Analytics

### Cloudflare Analytics (Recommended - Privacy-Friendly)

Cloudflare Pages includes built-in analytics:
- Dashboard → Your Project → Analytics
- Tracks: Page views, unique visitors, bandwidth
- **No JavaScript required** – server-side tracking
- **GDPR compliant** – no personal data stored

### Optional: Google Analytics

If you want detailed user behavior:

1. Get Google Analytics tracking ID
2. Add to `index.html`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```
3. Redeploy

⚠️ **Note:** Google Analytics requires cookie consent in EU/GDPR regions.

---

## Performance Optimization

### After Deployment, Monitor:

1. **Lighthouse Score** (aim for 90+):
   - Open Chrome DevTools → Lighthouse
   - Run audit on live site

2. **Bundle Size** (current: ~1MB):
   - Check build output for warnings
   - Consider code-splitting if needed

3. **Loading Speed** (aim for <2s):
   - Test on [WebPageTest](https://www.webpagetest.org/)
   - Cloudflare CDN should make this fast globally

### Tips to Improve:

- Enable Cloudflare **Auto Minify** (CSS, JS, HTML)
- Enable **Brotli compression** (automatic on Cloudflare)
- Use **lazy loading** for chart component (if needed)

---

## Troubleshooting

### Build Fails on Cloudflare

**Error:** `npm ERR! missing script: build`
- **Fix:** Ensure `package.json` has `"build": "tsc -b && vite build"`

**Error:** `Module not found: Can't resolve 'recharts'`
- **Fix:** Ensure all dependencies are in `package.json`, not `devDependencies`

### Chart Not Displaying

- **Fix:** Recharts requires a valid numeric dataset. Check browser console for errors.

### PDF Export Not Working

- **Fix:** jsPDF + html2canvas might have CORS issues. Ensure all assets are served from same domain.

---

## Rollback / Version Control

### Cloudflare Pages: Rollback

1. Go to Dashboard → Your Project → **Deployments**
2. Find previous successful deployment
3. Click **⋮** → **Rollback to this deployment**

### GitHub: Revert Changes

```bash
git revert <commit-hash>
git push origin main
```

Cloudflare will auto-deploy the reverted version.

---

## Next Steps After Deployment

1. ✅ **Share on social media**
   - Post to Reddit (r/financialindependence, r/personalfinance)
   - Tweet with #FIRE, #RetirementPlanning hashtags
   - Submit to Hacker News (Show HN)

2. ✅ **Apply for monetization programs**
   - Google AdSense
   - CJ Affiliate
   - Amazon Associates

3. ✅ **Write blog content**
   - SEO posts (see MONETIZATION.md)
   - Link back to calculator

4. ✅ **Monitor analytics**
   - Track visitor growth
   - Monitor conversion rates
   - A/B test features

---

## Support

**Questions?** Open an issue on [GitHub Issues](https://github.com/cloudgamble/retirement-calc/issues)

**Deployment help?** Check [Cloudflare Pages docs](https://developers.cloudflare.com/pages/)

---

**Congrats on shipping! 🎉**
