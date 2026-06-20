# PDFNest — Free Online PDF Tools

A fast, privacy-first suite of online PDF tools. **Everything runs in the
browser** — files are never uploaded to a server. Built as a plain static
site (HTML + CSS + vanilla JS), so it costs **$0 to host** and deploys
anywhere.

> 🔗 **Live site: [getpdfnest.com](https://getpdfnest.com)** — free online PDF tools (merge, split, compress, convert, OCR), 100% in your browser.

## ✨ Tools included

| Tool | What it does | Library |
|------|--------------|---------|
| Merge PDF | Combine multiple PDFs, drag to reorder | pdf-lib |
| Split PDF | Extract page ranges, or split every page into a ZIP | pdf-lib + JSZip |
| Compress PDF | Shrink scanned/image-heavy PDFs | pdf.js + pdf-lib |
| Rotate PDF | Rotate all or selected pages, saved permanently | pdf-lib |
| JPG to PDF | Turn JPG/PNG images into one PDF | pdf-lib |
| PDF to JPG | Render each page to JPG/PNG, download or ZIP | pdf.js + JSZip |
| Watermark PDF | Stamp custom text on every page | pdf-lib |
| Page Numbers | Add page numbers in any position/format | pdf-lib |

Third-party libraries are loaded from a CDN (cdnjs) — no build step required.

## 📁 Structure

```
pdfnest/
├── index.html            # Homepage with tool grid
├── tools/                # One landing page per tool (great for SEO)
├── assets/
│   ├── css/style.css     # All styles
│   └── js/
│       ├── site.js       # Shared header/footer/nav (single source of truth)
│       └── pdf-tools.js  # Shared helpers (dropzone, downloads, ranges…)
├── about/privacy/terms/contact/404 .html
├── sitemap.xml, robots.txt, site.webmanifest, _headers
```

## 🚀 Run locally

No build needed. From this folder:

```bash
# Python (any OS with Python 3)
python -m http.server 8080

# or Node
npx serve .
```

Then open <http://localhost:8080>. (Open via a server, not `file://`, so the
CDN scripts and shared JS load correctly.)

## 🌐 Deploy (free hosting + your domain)

Recommended: **Cloudflare Pages** (free, fast, global CDN).

1. Push this repo to GitHub (see below).
2. Go to Cloudflare Pages → *Create project* → connect the GitHub repo.
3. Framework preset: **None**. Build command: *(leave empty)*. Output dir: `/`.
4. Deploy. You'll get a `*.pages.dev` URL instantly.
5. In *Custom domains*, add `getpdfnest.com` and follow the DNS steps.

Alternatives that also work with zero config: **Netlify**, **Vercel**,
**GitHub Pages**, or Hostinger static hosting.

## 💰 Monetisation (AdSense) — wire up later

1. Apply at <https://adsense.google.com> using your live domain (the site
   must be live with real content first — it already is).
2. Once approved, paste your AdSense script into the `<head>` of each page
   (or add it to a shared include).
3. Drop `<ins class="adsbygoogle">` units into the `.ad-slot` placeholders.
   A reusable `.ad-placeholder` style already exists in `style.css`.

The privacy policy already contains the Google AdSense disclosures AdSense
requires for approval.

## 📈 SEO foundation already in place

- A unique, keyword-targeted landing page per tool with H1, how-to steps and FAQ
- `sitemap.xml`, `robots.txt`, canonical tags on every page
- Open Graph / Twitter cards
- Structured data: `WebSite`, `ItemList`, and `FAQPage` schema
- Fast, mobile-first, no render-blocking framework

### After you deploy
- Submit `sitemap.xml` in [Google Search Console](https://search.google.com/search-console)
- Add an OG share image at `assets/img/og-image.png` (1200×630)
- Add favicons `icon-192.png` / `icon-512.png` in `assets/img/`

## 📝 License

Your project. Third-party libraries (pdf-lib, pdf.js, JSZip) retain their own
MIT/Apache licenses.
