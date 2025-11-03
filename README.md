# 💰 Retirement Calculator

> **Free, private, open-source retirement calculator** with no data tracking, no cookies, no BS.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?logo=vite)](https://vitejs.dev/)
[![Deployed on Cloudflare](https://img.shields.io/badge/Deployed%20on-Cloudflare-F38020?logo=cloudflare)](https://pages.cloudflare.com/)

## 🎯 Features

- **100% Client-Side Privacy** – All calculations happen in your browser. Zero data sent to servers.
- **Safe Withdrawal Rate Calculator** – Instant 4% rule analysis
- **FIRE Number Estimation** – Calculate your Financial Independence Retire Early target
- **Reality Check Mode** – Conservative assumptions (5% returns, 3.5% inflation, +10% buffer)
- **Social Security & Pension Support** – Factor in guaranteed income streams
- **Export to CSV & PDF** – Download your complete retirement plan
- **Mobile-Responsive** – Works beautifully on any device
- **Open Source** – Full transparency, inspect the code yourself

## 🚀 Live Demo

Visit: **[https://retirement-calc.pages.dev](https://retirement-calc.pages.dev)** *(or your custom domain)*

## 📸 Screenshot

![Retirement Calculator Screenshot](https://via.placeholder.com/800x600?text=Retirement+Calculator+Screenshot)

## 🛠️ Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS 4** for styling
- **Recharts** for interactive charts
- **jsPDF** for PDF export
- **Vitest** for testing
- **Cloudflare Pages** for hosting

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/cloudgamble/retirement-calc.git
cd retirement-calc

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:5173
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 📦 Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

## 🚢 Deployment

### Deploy to Cloudflare Pages

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Cloudflare Pages
npm run deploy
```

Or connect your GitHub repo to Cloudflare Pages for automatic deployments:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Pages → Create a project → Connect to Git
3. Select your repository
4. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Deploy!

### Deploy to Other Platforms

**Vercel / Netlify:**
- Build command: `npm run build`
- Output directory: `dist`

## 📖 How It Works

### Calculation Logic

The calculator projects your retirement savings year by year:

1. **Accumulation Phase** (working years):
   - Starting balance + annual contributions
   - Apply investment returns (default: 7%)
   
2. **Withdrawal Phase** (retirement):
   - Withdraw inflation-adjusted expenses
   - Subtract Social Security / pension income
   - Apply investment returns on remaining balance

3. **Safe Withdrawal Rate**:
   - Compares first-year withdrawal to retirement balance
   - 4% or less = typically safe for 30+ year retirement

### Privacy Guarantee

- **No backend** – Static site only
- **No analytics trackers** – Optional: Cloudflare Analytics (privacy-friendly)
- **No cookies** – Not a single one
- **No data storage** – Everything stays in your browser
- **Open source** – Audit the code yourself

## 🎓 Understanding the Results

### Success Indicators

| Metric | Safe | Caution | Risky |
|--------|------|---------|-------|
| **Safe Withdrawal Rate** | ≤4% | 4-5% | >5% |
| **Success Rate** | ≥90% | 70-89% | <70% |

### Reality Check Mode

Applies more conservative assumptions:
- **Returns:** 5% instead of 7-10%
- **Inflation:** 3.5% instead of 3%
- **Spending:** +10% buffer for unexpected costs
- **Longevity:** Plan to age 95

## 💡 Use Cases

- **FIRE Planning** – Calculate when you can retire early
- **Traditional Retirement** – Standard 65+ retirement planning
- **Catch-Up Analysis** – See if you're on track
- **Scenario Testing** – Compare different savings rates
- **Financial Advisor Tool** – White-label for client presentations

## 🤝 Contributing

Contributions are welcome! Ideas for improvements:

- [ ] Monte Carlo simulation (probability distribution)
- [ ] Multiple portfolio allocation strategies
- [ ] Tax-advantaged account modeling (Roth vs Traditional)
- [ ] Healthcare cost estimator
- [ ] Inflation-adjusted input sliders
- [ ] Social sharing (shareable result cards)

## 📄 License

MIT License - feel free to use, modify, and distribute!

## 🙏 Acknowledgments

- Inspired by [FireCalc](https://firecalc.com/) and [Personal Capital](https://www.personalcapital.com/)
- Built for the [r/financialindependence](https://reddit.com/r/financialindependence) community

## ⚠️ Disclaimer

**This tool is for educational and planning purposes only. It is not financial advice.**

Retirement planning involves many variables and assumptions. Results are projections, not guarantees. Consult a certified financial planner (CFP) for personalized advice.

---

**Made with ❤️ for the FIRE community** | [Report an Issue](https://github.com/cloudgamble/retirement-calc/issues) | [Star on GitHub](https://github.com/cloudgamble/retirement-calc)
