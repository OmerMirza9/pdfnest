/* ==========================================================================
   PDFNest — site.js
   Injects shared header + footer on every page, handles mobile nav.
   Single source of truth for navigation = great for maintenance + SEO.
   ========================================================================== */
(function () {
  "use strict";

  // Absolute root paths so the injected header/footer work at any depth
  // (/, /tools/x.html, /blog/, /blog/slug/). Site is served from the domain root.
  var ROOT = "/";

  // ---------------------------------------------------------------------
  // MONETIZATION & ANALYTICS — paste your IDs here once, applies to EVERY
  // page automatically. Leave blank to disable. See SETUP-MONETIZATION.md.
  // ---------------------------------------------------------------------
  var CONFIG = {
    ADSENSE_PUB_ID: "ca-pub-4015370906333",  // from Google AdSense (VERIFY exact digits against AdSense)
    GA4_ID: "",                         // from Google Analytics, e.g. "G-XXXXXXXXXX"
    GADS_ID: "AW-16669053935"           // from Google Ads, e.g. "AW-XXXXXXXXXX"
  };

  function injectThirdParty() {
    var head = document.head || document.getElementsByTagName("head")[0];
    // Google AdSense loader (enables Auto Ads + serves as site verification)
    if (CONFIG.ADSENSE_PUB_ID) {
      var ad = document.createElement("script");
      ad.async = true;
      ad.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + CONFIG.ADSENSE_PUB_ID;
      ad.crossOrigin = "anonymous";
      head.appendChild(ad);
    }
    // Google tag (gtag.js) — shared loader for Google Analytics 4 and/or Google Ads.
    // Loads the gtag.js library once, then registers each configured ID.
    if (CONFIG.GA4_ID || CONFIG.GADS_ID) {
      if (!window.gtag) {
        var gt = document.createElement("script");
        gt.async = true;
        gt.src = "https://www.googletagmanager.com/gtag/js?id=" + (CONFIG.GA4_ID || CONFIG.GADS_ID);
        head.appendChild(gt);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag("js", new Date());
      }
      if (CONFIG.GA4_ID) window.gtag("config", CONFIG.GA4_ID);
      if (CONFIG.GADS_ID) window.gtag("config", CONFIG.GADS_ID);
    }
  }

  // -- Tool registry (shared everywhere) ---------------------------------
  var TOOLS = [
    { slug: "merge-pdf",     name: "Merge PDF",     color: "var(--c-merge)",    short: "Combine PDFs into one", tag: "M" },
    { slug: "split-pdf",     name: "Split PDF",     color: "var(--c-split)",    short: "Extract or split pages", tag: "S" },
    { slug: "compress-pdf",  name: "Compress PDF",  color: "var(--c-compress)", short: "Shrink PDF file size",   tag: "C" },
    { slug: "rotate-pdf",    name: "Rotate PDF",    color: "var(--c-rotate)",   short: "Rotate pages permanently", tag: "R" },
    { slug: "jpg-to-pdf",    name: "JPG to PDF",    color: "var(--c-jpg2pdf)",  short: "Images into a PDF",      tag: "J" },
    { slug: "pdf-to-jpg",    name: "PDF to JPG",    color: "var(--c-pdf2jpg)",  short: "Pages into images",      tag: "P" },
    { slug: "watermark-pdf", name: "Watermark PDF", color: "var(--c-water)",    short: "Stamp text on pages",    tag: "W" },
    { slug: "page-numbers",  name: "Page Numbers",  color: "var(--c-pages)",    short: "Add page numbers",       tag: "#" },
    { slug: "pdf-to-text",     name: "PDF to Text",     color: "var(--c-pdf2txt)",  short: "Extract text from a PDF",   tag: "TX" },
    { slug: "pdf-to-png",      name: "PDF to PNG",      color: "var(--c-pdf2png)",  short: "Pages to PNG images",       tag: "PN" },
    { slug: "remove-pdf-pages",name: "Remove Pages",    color: "var(--c-rmpages)",  short: "Delete pages from a PDF",   tag: "✕"  },
    { slug: "pdf-to-html",     name: "PDF to HTML",     color: "var(--c-pdf2html)", short: "Convert a PDF to HTML",     tag: "PH" },
    { slug: "html-to-pdf",     name: "HTML to PDF",     color: "var(--c-html2pdf)", short: "Convert HTML to a PDF",     tag: "HP" },
    { slug: "markdown-to-pdf", name: "Markdown to PDF", color: "var(--c-md2pdf)",   short: "Markdown into a PDF",       tag: "MD" },
    { slug: "html-editor",     name: "HTML Editor",     color: "var(--c-htmledit)", short: "Live HTML editor & preview",tag: "ED" },
    { slug: "protect-pdf",     name: "Protect PDF",     color: "var(--c-protect)",  short: "Add a password to a PDF",   tag: "LK" },
    { slug: "unlock-pdf",      name: "Unlock PDF",      color: "var(--c-unlock)",   short: "Remove a PDF password",     tag: "UL" },
    { slug: "pdf-to-image",    name: "PDF to Image",    color: "var(--c-pdf2jpg)",  short: "PDF pages to JPG/PNG",      tag: "IMG" },
    { slug: "image-to-pdf",    name: "Image to PDF",    color: "var(--c-jpg2pdf)",  short: "JPG/PNG/WebP to PDF",       tag: "IP" },
    { slug: "png-to-pdf",      name: "PNG to PDF",      color: "var(--c-pdf2png)",  short: "PNG images into a PDF",     tag: "NP" },
    { slug: "image-to-text",   name: "Image to Text",   color: "var(--c-pdf2txt)",  short: "OCR images & scans to text",tag: "OCR" }
  ];
  window.PDFNEST_TOOLS = TOOLS;
  window.PDFNEST_ROOT = ROOT;

  function toolUrl(slug) { return ROOT + "tools/" + slug + ".html"; }

  // -- Header ------------------------------------------------------------
  var dropdownItems = TOOLS.map(function (t) {
    return '<a href="' + toolUrl(t.slug) + '"><span class="dot" style="background:' + t.color + '">' + t.tag + '</span>' + t.name + '</a>';
  }).join("");

  var logo =
    '<svg class="brand__logo" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<rect x="3" y="3" width="34" height="34" rx="9" fill="#6c5ce7"/>' +
    '<path d="M13 11h9l6 6v12a2 2 0 0 1-2 2H13a2 2 0 0 1-2-2V13a2 2 0 0 1 2-2z" fill="#fff"/>' +
    '<path d="M22 11v6h6" fill="#d8d3fb"/>' +
    '<text x="19.5" y="28" font-size="8.5" font-family="Arial" font-weight="700" fill="#6c5ce7" text-anchor="middle">PDF</text>' +
    '</svg>';

  var header =
    '<header class="site-header"><div class="container"><nav class="nav" aria-label="Main">' +
      '<a class="brand" href="' + ROOT + 'index.html">' + logo +
        '<span class="brand__name">PDF<b>Nest</b></span></a>' +
      '<button class="nav__toggle" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '<ul class="nav__links">' +
        '<li class="has-dropdown"><a href="' + ROOT + 'index.html#tools">All Tools ▾</a>' +
          '<div class="dropdown">' + dropdownItems + '</div></li>' +
        '<li><a href="' + toolUrl("merge-pdf") + '">Merge</a></li>' +
        '<li><a href="' + toolUrl("split-pdf") + '">Split</a></li>' +
        '<li><a href="' + toolUrl("compress-pdf") + '">Compress</a></li>' +
        '<li><a href="' + ROOT + 'blog/">Blog</a></li>' +
        '<li><a href="' + ROOT + 'about.html">About</a></li>' +
      '</ul>' +
    '</nav></div></header>';

  // -- Footer ------------------------------------------------------------
  var colA = TOOLS.slice(0, 8), colB = TOOLS.slice(8);
  function footCol(list) {
    return list.map(function (t) { return '<li><a href="' + toolUrl(t.slug) + '">' + t.name + '</a></li>'; }).join("");
  }

  var footer =
    '<footer class="site-footer"><div class="container">' +
      '<div class="footer-grid">' +
        '<div class="footer-about">' +
          '<a class="brand" href="' + ROOT + 'index.html">' + logo + '<span class="brand__name">PDF<b>Nest</b></span></a>' +
          '<p>Free online PDF tools that work right in your browser. Your files never leave your device — 100% private and secure.</p>' +
        '</div>' +
        '<div><h4>Tools</h4><ul>' + footCol(colA) + '</ul></div>' +
        '<div><h4>More tools</h4><ul>' + footCol(colB) + '</ul></div>' +
        '<div><h4>Company</h4><ul>' +
          '<li><a href="' + ROOT + 'blog/">Blog</a></li>' +
          '<li><a href="' + ROOT + 'about.html">About</a></li>' +
          '<li><a href="' + ROOT + 'contact.html">Contact</a></li>' +
          '<li><a href="' + ROOT + 'privacy.html">Privacy Policy</a></li>' +
          '<li><a href="' + ROOT + 'terms.html">Terms of Use</a></li>' +
        '</ul></div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>© ' + new Date().getFullYear() + ' PDFNest. All rights reserved.</span>' +
        '<span>Made with care • Files processed locally in your browser.</span>' +
      '</div>' +
    '</div></footer>';

  // -- Per-tool-page enrichment ------------------------------------------
  // Older tool pages shipped with only FAQ schema and no breadcrumb. This
  // brings every tool page up to the standard of the pages Google already
  // indexed: a visible breadcrumb + BreadcrumbList + SoftwareApplication
  // structured data. Generated from the TOOLS registry so each is distinct.
  function enrichToolPage() {
    var m = location.pathname.match(/\/tools\/([a-z0-9-]+)\.html$/i);
    if (!m) return;
    var slug = m[1], tool = null;
    for (var i = 0; i < TOOLS.length; i++) { if (TOOLS[i].slug === slug) { tool = TOOLS[i]; break; } }
    if (!tool) return;
    var absUrl = "https://getpdfnest.com/tools/" + slug + ".html";

    // Visible breadcrumb — only if the page doesn't already have one.
    if (!document.querySelector(".breadcrumb")) {
      var hdr = document.querySelector(".site-header");
      if (hdr && hdr.parentNode) {
        var wrap = document.createElement("div");
        wrap.className = "container";
        wrap.innerHTML = '<nav class="breadcrumb"><a href="/">Home</a><span>›</span>' + tool.name + '</nav>';
        hdr.parentNode.insertBefore(wrap, hdr.nextSibling);
      }
    }

    // Structured data — add only the types not already present on the page.
    var existing = "";
    var blocks = document.querySelectorAll('script[type="application/ld+json"]');
    for (var j = 0; j < blocks.length; j++) existing += blocks[j].textContent;
    var add = [];
    if (existing.indexOf("BreadcrumbList") === -1) {
      add.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://getpdfnest.com/" },
        { "@type": "ListItem", "position": 2, "name": tool.name, "item": absUrl }
      ]});
    }
    if (existing.indexOf("SoftwareApplication") === -1) {
      add.push({ "@context": "https://schema.org", "@type": "SoftwareApplication", "name": "PDFNest " + tool.name,
        "applicationCategory": "UtilitiesApplication", "operatingSystem": "Any (web browser)", "url": absUrl,
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "featureList": [tool.short, "No watermark", "No upload — runs in your browser"] });
    }
    for (var k = 0; k < add.length; k++) {
      var s = document.createElement("script");
      s.type = "application/ld+json";
      s.textContent = JSON.stringify(add[k]);
      document.head.appendChild(s);
    }
  }

  // -- Inject ------------------------------------------------------------
  function inject() {
    injectThirdParty();
    var h = document.getElementById("site-header");
    var f = document.getElementById("site-footer");
    if (h) h.outerHTML = header; else document.body.insertAdjacentHTML("afterbegin", header);
    if (f) f.outerHTML = footer; else document.body.insertAdjacentHTML("beforeend", footer);

    var toggle = document.querySelector(".nav__toggle");
    var links = document.querySelector(".nav__links");
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    enrichToolPage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
