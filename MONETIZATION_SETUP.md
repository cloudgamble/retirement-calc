# 💰 Monetization Setup Guide

> **Note:** This is a public template. Store your actual API keys and affiliate codes in `affiliate-config.json` (gitignored).

## Quick Start

1. **Copy the template:**
   ```bash
   cp affiliate-config.template.json affiliate-config.json
   ```

2. **Fill in your actual codes** in `affiliate-config.json`

3. **Never commit** `affiliate-config.json` to git (already in .gitignore)

---

## 🔑 API Keys & Codes You'll Need

### 1. Google AdSense
- **Sign up:** https://www.google.com/adsense/
- **Get your Publisher ID:** Format: `ca-pub-XXXXXXXXXXXXXXXX`
- **Create ad units** and get slot IDs for:
  - Sidebar ad
  - Footer ad
  - Results page ad

### 2. CJ Affiliate (Commission Junction)
- **Sign up:** https://www.cj.com/
- **Apply to these advertisers:**
  - Empower (formerly Personal Capital)
  - Betterment
  - Wealthfront
  - M1 Finance
  - Fidelity
- **Get your deep links** for each advertiser

### 3. Amazon Associates
- **Sign up:** https://affiliate-program.amazon.com/
- **Get your Associate Tag:** Format: `yourname-20`
- **Create affiliate links** for recommended FIRE books:
  - The Simple Path to Wealth (JL Collins)
  - Early Retirement Extreme (Jacob Lund Fisker)
  - Your Money or Your Life (Vicki Robin)
  - Die With Zero (Bill Perkins)

### 4. Analytics (Optional)
- **Google Analytics:** https://analytics.google.com/
- **Cloudflare Analytics:** Built-in to Cloudflare Pages (no setup needed)

---

## 📊 Revenue Tracking

Create a private `revenue-tracking.md` file (gitignored) to track:

```markdown
# Revenue Tracking

## Monthly Metrics

### January 2025
- Visitors: X
- AdSense Revenue: $X
- CJ Affiliate Clicks: X
- CJ Conversions: X ($X revenue)
- Amazon Clicks: X
- Amazon Orders: X ($X revenue)
- **Total: $X**

### February 2025
...
```

---

## 🎯 Implementation Checklist

When you're ready to add monetization to the live site:

### Phase 1: Analytics
- [ ] Add Cloudflare Analytics (Settings → Web Analytics)
- [ ] (Optional) Add Google Analytics to `index.html`

### Phase 2: AdSense
- [ ] Get AdSense approval (need traffic first: 1k+ visitors)
- [ ] Add AdSense script to `index.html`
- [ ] Create 3 ad units (sidebar, footer, results)
- [ ] Update `affiliate-config.json` with ad unit IDs
- [ ] Add ad placement components to `Calculator.tsx`

### Phase 3: Affiliate Links
- [ ] Get approved by CJ advertisers
- [ ] Get Amazon Associates approval
- [ ] Update `affiliate-config.json` with your links
- [ ] Add contextual recommendations to calculator results
- [ ] Add book recommendations to footer/sidebar

### Phase 4: Disclosure
- [ ] Add affiliate disclosure to footer
- [ ] Update privacy policy (if you add one)
- [ ] Comply with FTC guidelines

---

## 🛡️ Best Practices

### FTC Compliance
Always disclose affiliate relationships:
```
"This site contains affiliate links. If you click through and make a 
purchase, we may earn a commission at no additional cost to you."
```

### User Experience
- **Don't overwhelm with ads** (max 3-4 per page)
- **Make recommendations contextual** (based on their results)
- **Keep core calculator free** forever
- **Never sell user data** (you don't collect any anyway!)

### Privacy
- AdSense requires cookie consent in EU (GDPR)
- Use privacy-friendly analytics (Cloudflare Analytics is perfect)
- No tracking pixels or third-party scripts beyond essentials

---

## 📈 Expected Timeline

| Milestone | Traffic Needed | Revenue Potential |
|-----------|----------------|-------------------|
| **AdSense Approval** | 1,000+ visitors | Setup only |
| **First Commission** | 5,000+ visitors | $50-100/mo |
| **Sustainable Revenue** | 20,000+ visitors | $300-500/mo |
| **Good Income** | 50,000+ visitors | $800-1,500/mo |

---

## 🔒 Security Reminders

**Never commit to git:**
- ❌ `affiliate-config.json`
- ❌ `revenue-tracking.md`
- ❌ API keys or secrets
- ❌ Your monetization strategy (keep competitive advantage!)

**Always keep private:**
- Your specific affiliate codes
- Revenue numbers
- Conversion rates
- Partner relationships

---

## 📞 Questions?

Refer to your private `MONETIZATION.md` (gitignored) for detailed strategy.

**Monetization resources:**
- AdSense Help: https://support.google.com/adsense
- CJ University: https://www.cj.com/cj-university
- Amazon Associates: https://affiliate-program.amazon.com/help

---

**Made with ❤️ for sustainable, ethical monetization**
