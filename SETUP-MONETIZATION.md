# PDFNest — Monetization & SEO Setup

Your site is **live at https://getpdfnest.com**. This guide covers the three
things that turn traffic into money and rankings. Two of them require **your**
Google login (Google only lets the account owner do these) — but I've made the
site-side work a one-line paste, and I can finish the wiring for you the moment
you send me an ID or token.

---

## 1. Google AdSense (earn money from ads)

**What only you can do** (needs your Google account):

1. Go to <https://adsense.google.com> and sign in with your Google account.
2. Click **Get started**, enter your site: `getpdfnest.com`.
3. Fill in your country and payment/payee name. Accept the terms.
4. AdSense shows you a **publisher ID** that looks like `ca-pub-1234567890123456`.
   **Copy it and send it to me** — or paste it yourself (see below).
5. AdSense then reviews the site (a few days to ~2 weeks). New sites are
   sometimes asked to wait until they have a little traffic — this is normal.

**The site-side wiring (I do this, or you paste in one place):**

- Open `assets/js/site.js`, find the `CONFIG` block near the top, and set:
  ```js
  ADSENSE_PUB_ID: "ca-pub-1234567890123456",  // your real ID
  ```
- Open `ads.txt` and replace `pub-0000000000000000` with your ID's digits
  (the part after `pub-`).
- Re-deploy (`git push`). That's it — the AdSense script now loads on every
  page. Turn on **Auto Ads** in your AdSense dashboard and Google places ads
  automatically; no per-page code needed.

> Tip: send me the `ca-pub-…` ID and I'll do both edits + deploy in one go.

---

## 2. Google Search Console (get found on Google)

This tells Google to index your tool pages so people can find them.

**What only you can do** (needs your Google account):

1. Go to <https://search.google.com/search-console>.
2. Choose **Domain** property and type `getpdfnest.com`.
3. Google shows a **TXT verification record** — a line like
   `google-site-verification=AbCdEf...`. **Copy that value and send it to me.**

**What I do for you:**

- I add that TXT record to your Hostinger DNS instantly (I manage your DNS).
- You click **Verify** in Search Console.
- Then I (or you) submit the sitemap: in Search Console → **Sitemaps** → enter
  `sitemap.xml` → Submit. Your `sitemap.xml` is already live and ready.

---

## 3. Google Analytics (see your traffic) — optional but recommended

1. Go to <https://analytics.google.com>, create a property for `getpdfnest.com`.
2. It gives you a **Measurement ID** like `G-XXXXXXXXXX`. Send it to me, or set
   it yourself in `assets/js/site.js`:
   ```js
   GA4_ID: "G-XXXXXXXXXX",
   ```
3. Re-deploy. Analytics now tracks every page automatically.

---

## What I need from you to finish

Just send me any of these as you get them and I'll wire + deploy:

| Item | Looks like | Where you get it |
|------|-----------|------------------|
| AdSense publisher ID | `ca-pub-1234567890123456` | adsense.google.com |
| Search Console token | `google-site-verification=…` | search.google.com/search-console |
| Analytics ID | `G-XXXXXXXXXX` | analytics.google.com |

Everything else is already done and live.
