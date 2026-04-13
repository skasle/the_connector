# The Connector — Eight by Zero

Content hub for EightbyZero's commercial prospects.

## Quick Start (local dev)

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Deploy to Vercel (recommended — free tier is fine)

### One-time setup (~10 minutes)

**1. Push to GitHub**

```bash
# In this directory:
git init
git add .
git commit -m "The Connector v1"

# Create a repo at github.com/eightbyzero/the-connector (private is fine)
# Then:
git remote add origin git@github.com:eightbyzero/the-connector.git
git branch -M main
git push -u origin main
```

**2. Connect to Vercel**

- Go to [vercel.com](https://vercel.com) and sign in with GitHub
- Click "Add New → Project"
- Import the `the-connector` repo
- Framework preset: **Vite** (auto-detected)
- Click **Deploy**
- Live in ~60 seconds

**3. Custom domain**

In Vercel dashboard → Settings → Domains:
- Add `connector.eightbyzero.com`
- Vercel gives you a CNAME record
- Add that CNAME in your DNS provider
- SSL is automatic

### After that

Every `git push` to `main` auto-deploys. Edit content, push, live in 30 seconds.

## Editing Content

All content lives in `src/App.jsx`:

- **Newsletter articles**: `ARTICLE_BLOCKS` array near the top
- **Pain point stats**: `PAIN` array
- **Customer quotes**: `PROOF` array  
- **Product capabilities**: `CAPS` array
- **Impact stats**: Inline in the `Impact` component

## Email Capture

The subscribe forms are UI-only right now. To make them functional:

**Option A: Formspree (easiest, 5 min)**
1. Sign up at formspree.io
2. Create a form, get your endpoint URL
3. Replace the `onClick` handlers with a fetch to your Formspree endpoint

**Option B: Mailchimp / Beehiiv / ConvertKit**
- Each has embed code or API endpoints
- Replace the subscribe button handler with their API call

**Option C: Google Sheets (scrappy but works)**
- Use a Google Apps Script webhook to pipe form submissions to a Sheet

## Analytics

Add to `index.html` before `</head>`:

**Plausible (privacy-friendly, recommended):**
```html
<script defer data-domain="connector.eightbyzero.com" src="https://plausible.io/js/script.js"></script>
```

**Google Analytics:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## Future Enhancements

- [ ] Email capture backend (Formspree / Beehiiv)
- [ ] Analytics (Plausible)
- [ ] OG image for social sharing
- [ ] Blog-style routing (each issue gets its own URL)
- [ ] RSS feed
- [ ] Mobile nav hamburger menu
