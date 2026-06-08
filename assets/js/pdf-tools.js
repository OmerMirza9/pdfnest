/* ==========================================================================
   PDFNest — pdf-tools.js
   Shared UI + helper layer for the tool pages. Everything runs client-side.
   Exposes a small global `PN` with reusable helpers.
   ========================================================================== */
(function () {
  "use strict";

  var PN = {};

  /* -- formatting ------------------------------------------------------ */
  PN.formatBytes = function (bytes) {
    if (bytes === 0) return "0 B";
    var k = 1024, units = ["B", "KB", "MB", "GB"];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(i ? 1 : 0) + " " + units[i];
  };

  PN.sanitizeName = function (name, fallback) {
    var base = (name || fallback || "file").replace(/\.[^.]+$/, "");
    return base.replace(/[^\w\-]+/g, "_").slice(0, 60) || fallback;
  };

  /* -- download -------------------------------------------------------- */
  PN.downloadBlob = function (blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  };

  PN.downloadBytes = function (bytes, filename, mime) {
    PN.downloadBlob(new Blob([bytes], { type: mime || "application/octet-stream" }), filename);
  };

  /* -- status / progress ---------------------------------------------- */
  PN.status = function (el, msg, isError) {
    if (!el) return;
    el.textContent = msg || "";
    el.classList.toggle("error", !!isError);
  };

  PN.progress = function (wrap, bar, pct) {
    if (!wrap || !bar) return;
    if (pct == null) { wrap.classList.remove("show"); bar.style.width = "0%"; return; }
    wrap.classList.add("show");
    bar.style.width = Math.max(0, Math.min(100, pct)) + "%";
  };

  /* -- file icon tag (e.g. "PDF" / "JPG") ----------------------------- */
  function extTag(name) {
    var m = /\.([a-z0-9]+)$/i.exec(name || "");
    return (m ? m[1] : "FILE").toUpperCase().slice(0, 4);
  }

  /* -- Dropzone + file manager ----------------------------------------
     opts: { zone, input, list, accept, multiple, color, onChange }
     Returns a controller with .files (live array) and .clear()
  --------------------------------------------------------------------- */
  PN.fileManager = function (opts) {
    var zone = opts.zone, input = opts.input, list = opts.list;
    var accept = opts.accept || "";            // e.g. "application/pdf" or "image/*"
    var multiple = !!opts.multiple;
    var color = opts.color || "var(--c-merge)";
    var files = [];

    function matches(file) {
      if (!accept) return true;
      if (accept === "application/pdf") return /\.pdf$/i.test(file.name) || file.type === "application/pdf";
      if (accept === "image/*") return /^image\//.test(file.type) || /\.(jpe?g|png|gif|bmp|webp)$/i.test(file.name);
      return true;
    }

    function add(fileList) {
      var added = 0;
      Array.prototype.forEach.call(fileList, function (f) {
        if (!matches(f)) return;
        if (!multiple) files = [];
        files.push(f);
        added++;
      });
      render();
      if (added && opts.onChange) opts.onChange(files);
    }

    function removeAt(i) {
      files.splice(i, 1); render();
      if (opts.onChange) opts.onChange(files);
    }

    function move(from, to) {
      if (to < 0 || to >= files.length) return;
      var x = files.splice(from, 1)[0];
      files.splice(to, 0, x); render();
      if (opts.onChange) opts.onChange(files);
    }

    function render() {
      if (!list) return;
      list.innerHTML = "";
      files.forEach(function (f, i) {
        var li = document.createElement("li");
        li.className = "file-item";
        li.innerHTML =
          '<span class="file-item__ico" style="background:' + color + '">' + extTag(f.name) + '</span>' +
          '<span class="file-item__meta"><span class="file-item__name"></span>' +
          '<span class="file-item__size">' + PN.formatBytes(f.size) + '</span></span>' +
          (multiple ? '<span class="file-item__handle" title="Drag to reorder">⠿</span>' : '') +
          '<button class="file-item__remove" aria-label="Remove" title="Remove">×</button>';
        li.querySelector(".file-item__name").textContent = f.name;
        li.querySelector(".file-item__remove").addEventListener("click", function () { removeAt(i); });

        if (multiple) {
          li.setAttribute("draggable", "true");
          li.addEventListener("dragstart", function (e) { e.dataTransfer.setData("text/plain", i); li.style.opacity = ".5"; });
          li.addEventListener("dragend", function () { li.style.opacity = "1"; });
          li.addEventListener("dragover", function (e) { e.preventDefault(); });
          li.addEventListener("drop", function (e) {
            e.preventDefault();
            var from = parseInt(e.dataTransfer.getData("text/plain"), 10);
            if (!isNaN(from)) move(from, i);
          });
        }
        list.appendChild(li);
      });
    }

    // events
    if (zone) {
      zone.addEventListener("click", function () { input && input.click(); });
      zone.addEventListener("dragover", function (e) { e.preventDefault(); zone.classList.add("drag"); });
      zone.addEventListener("dragleave", function () { zone.classList.remove("drag"); });
      zone.addEventListener("drop", function (e) {
        e.preventDefault(); zone.classList.remove("drag");
        if (e.dataTransfer.files && e.dataTransfer.files.length) add(e.dataTransfer.files);
      });
    }
    if (input) {
      input.addEventListener("change", function () { if (input.files.length) add(input.files); input.value = ""; });
    }

    return {
      get files() { return files; },
      clear: function () { files = []; render(); if (opts.onChange) opts.onChange(files); },
      render: render
    };
  };

  /* -- read a File into Uint8Array ------------------------------------ */
  PN.readBytes = function (file) {
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () { resolve(new Uint8Array(fr.result)); };
      fr.onerror = reject;
      fr.readAsArrayBuffer(file);
    });
  };

  /* -- parse page-range string like "1-3, 5, 8-10" -> [0-based] -------- */
  PN.parseRanges = function (str, total) {
    var out = [];
    (str || "").split(",").forEach(function (part) {
      part = part.trim(); if (!part) return;
      var m = /^(\d+)\s*-\s*(\d+)$/.exec(part);
      if (m) {
        var a = parseInt(m[1], 10), b = parseInt(m[2], 10);
        if (a > b) { var t = a; a = b; b = t; }
        for (var i = a; i <= b; i++) if (i >= 1 && i <= total) out.push(i - 1);
      } else if (/^\d+$/.test(part)) {
        var n = parseInt(part, 10);
        if (n >= 1 && n <= total) out.push(n - 1);
      }
    });
    return out;
  };

  /* -- toggle result panel -------------------------------------------- */
  PN.showResult = function (panel, html) {
    if (!panel) return;
    if (html) panel.innerHTML = html;
    panel.classList.add("show");
    panel.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  /* -- HTML -> PDF (preserves <style>, paginates, off-screen render) ---- */
  PN.renderHtmlToPdf = function (html, opts) {
    opts = opts || {};
    if (!window.html2pdf) return Promise.reject(new Error("PDF engine not loaded"));
    var width = opts.width || 760;
    // Parse as a full document so <style>/<link> in <head> are preserved.
    var parsed = new DOMParser().parseFromString(html, "text/html");
    var wrap = document.createElement("div");
    wrap.style.cssText = "position:absolute;left:-9999px;top:0;width:" + width + "px;background:#ffffff;color:#000;";
    if (parsed.head) {
      Array.prototype.forEach.call(parsed.head.querySelectorAll('style,link[rel="stylesheet"]'),
        function (n) { wrap.appendChild(n.cloneNode(true)); });
    }
    var bodyNode = (parsed.body && parsed.body.childNodes.length) ? parsed.body : parsed.documentElement;
    Array.prototype.forEach.call(bodyNode.childNodes, function (n) { wrap.appendChild(n.cloneNode(true)); });
    document.body.appendChild(wrap);

    var config = {
      margin: opts.margin != null ? opts.margin : 10,
      filename: opts.filename || "document-pdfnest.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff", scrollX: 0, scrollY: 0, windowWidth: width },
      jsPDF: { unit: "mm", format: opts.format || "a4", orientation: opts.orientation || "portrait" },
      pagebreak: { mode: ["css", "legacy"] }
    };
    function cleanup() { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }
    return html2pdf().set(config).from(wrap).save().then(cleanup, function (e) { cleanup(); throw e; });
  };

  /* -- HTML -> PDF via the browser's native print engine (rock solid) ---
     Opens the print dialog with the content rendered at full fidelity.
     The user chooses "Save as PDF". Never produces a blank page.        */
  PN.printHtmlAsPdf = function (html, opts) {
    opts = opts || {};
    var marginMm = (opts.margin != null ? opts.margin : 12);
    var fmt = (String(opts.format || "a4").toLowerCase() === "letter") ? "Letter" : "A4";
    var orient = opts.orientation === "landscape" ? " landscape" : "";
    var pageCss = "<style>@page{size:" + fmt + orient + ";margin:" + marginMm + "mm}" +
      "html,body{margin:0;padding:0;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}</style>";
    var isFull = /<html[\s>]/i.test(html);
    var fullDoc;
    if (isFull) {
      if (/<head[\s>]/i.test(html)) fullDoc = html.replace(/<head([^>]*)>/i, "<head$1>" + pageCss);
      else fullDoc = html.replace(/<html([^>]*)>/i, "<html$1><head>" + pageCss + "</head>");
    } else {
      fullDoc = "<!DOCTYPE html><html><head><meta charset='utf-8'>" + pageCss + "</head><body>" + html + "</body></html>";
    }
    var iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;left:-10000px;top:0;width:820px;height:1160px;border:0;";
    document.body.appendChild(iframe);
    return new Promise(function (resolve) {
      var win = iframe.contentWindow, started = false, cleaned = false;
      function cleanup() { if (cleaned) return; cleaned = true; setTimeout(function () { if (iframe.parentNode) iframe.parentNode.removeChild(iframe); }, 800); }
      function doPrint() {
        if (started) return; started = true;
        setTimeout(function () {
          try { win.focus(); win.onafterprint = cleanup; win.print(); resolve(true); setTimeout(cleanup, 120000); }
          catch (e) { cleanup(); resolve(false); }
        }, 450);
      }
      iframe.onload = doPrint;
      var doc = win.document; doc.open(); doc.write(fullDoc); doc.close();
      if (doc.readyState === "complete") doPrint();
    });
  };

  window.PN = PN;
})();
