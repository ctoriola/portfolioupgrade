/* Animated project card scenes, shared by the home page and the case
   study pages. Any element with [data-scene="…"] gets its animation, and
   each one only runs while it is on screen. */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Card scenes (only animate while on screen)
  function whenVisible(el, start, stop) {
    if (!("IntersectionObserver" in window)) { start(); return; }
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.isIntersecting ? start() : stop(); });
    }, { threshold: 0.15 }).observe(el);
  }
  const pad = function (n, l) { return String(n).padStart(l || 2, "0"); };

  // 01 · PitchPerfectAI — slides dealt one after another
  function scenePPA(el) {
    const stack = el.querySelector(".ppa-stack");
    const counter = el.querySelector("[data-slide]");
    const briefEl = el.querySelector("[data-brief]");
    const titles = ["The problem", "Our solution", "Market size", "Product", "How it works", "Traction", "Business model", "Competition", "Go-to-market", "Team", "Financials", "The ask", "Thank you"];
    const briefs = ["brief: queue app for clinics in Abuja", "repo: github.com/ctoriola/taxapp", "docs: school_admin_overview.pdf"];
    let i = 0, timer = 0, typer = 0, bi = 0;

    function deal() {
      const s = document.createElement("div");
      s.className = "ppa-slide show";
      s.innerHTML = "<b>" + pad(i + 1) + " · " + titles[i] + "</b><u></u><u></u><u></u>";
      stack.appendChild(s);
      counter.textContent = pad(i + 1);
      setTimeout(function () { s.remove(); }, 2500);
      i = (i + 1) % titles.length;
      if (i === 0) typeBrief();
    }
    function typeBrief() {
      clearInterval(typer);
      const text = briefs[bi++ % briefs.length];
      let k = 0;
      typer = setInterval(function () {
        briefEl.textContent = text.slice(0, ++k);
        if (k >= text.length) clearInterval(typer);
      }, 45);
    }
    if (reduce) { deal(); typeBrief(); return; }
    whenVisible(el, function () {
      if (timer) return;
      typeBrief(); deal();
      timer = setInterval(deal, 1500);
    }, function () { clearInterval(timer); timer = 0; });
  }

  // 02 · NCrypt — plaintext scrambles into ciphertext
  function sceneNcrypt(el) {
    const bytes = el.querySelector("[data-bytes]");
    const tag = el.querySelector("[data-tag]");
    const state = el.querySelector("[data-state]");
    const fileEl = el.querySelector("[data-file]");
    const files = [
      ["contract_final.pdf", "This agreement is made between the parties named below. Payment terms: fifty percent upfront, balance on delivery. Confidential, do not distribute. "],
      ["brand_assets.zip", "logo_primary.svg logo_mono.svg palette.ase type_specimen.pdf brand_guidelines_v3.pdf social_kit/ "],
      ["payroll_oct.xlsx", "employee_id, department, gross, deductions, net, bank, account_no, approved_by, approved_on "],
    ];
    const ALPHA = "abcdef0123456789ABCDEF+/=";
    let fi = 0, running = false, to = 0, iv = 0;

    function cycle() {
      if (!running) return;
      const f = files[fi++ % files.length];
      const plain = (f[1] + f[1] + f[1]).slice(0, 300);
      fileEl.textContent = f[0];
      tag.textContent = "PLAINTEXT"; tag.classList.add("plain");
      state.textContent = "reading…";
      bytes.innerHTML = '<span class="p">' + plain + "</span>";
      let n = 0;
      to = setTimeout(function () {
        state.textContent = "encrypting…";
        iv = setInterval(function () {
          n += 9;
          let out = "";
          for (let k = 0; k < Math.min(n, plain.length); k++) out += ALPHA[(Math.random() * ALPHA.length) | 0];
          bytes.innerHTML = out + '<span class="p">' + plain.slice(n) + "</span>";
          if (n >= plain.length) {
            clearInterval(iv);
            tag.textContent = "ENCRYPTED"; tag.classList.remove("plain");
            state.textContent = "uploaded ✓";
            to = setTimeout(cycle, 2200);
          }
        }, 40);
      }, 1500);
    }
    if (reduce) { running = true; cycle(); running = false; return; }
    whenVisible(el, function () { if (running) return; running = true; cycle(); },
      function () { running = false; clearTimeout(to); clearInterval(iv); });
  }

  // 02 · VATClear — VAT due counts up, monthly bars grow, activity feed ticks
  function sceneVat(el) {
    const amtEl = el.querySelector("[data-amt]");
    const bars = el.querySelector("[data-bars]");
    const feed = el.querySelector("[data-feed]");
    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
    const vals = [52, 64, 47, 78, 70, 92];
    bars.innerHTML = months.map(function (m, i) {
      return '<div class="vat-bar"><i style="--h:' + vals[i] + '%"></i><span>' + m + "</span></div>";
    }).join("");
    const events = [
      ["Invoice INV-0142 paid", "+₦430,000.00"],
      ["Expense · Diesel", "−₦85,000.00"],
      ["Invoice INV-0143 sent", "₦1,250,000.00"],
      ["Expense · Internet", "−₦32,250.00"],
      ["Payment received", "+₦612,500.00"],
    ];
    const target = 86250, fmt = new Intl.NumberFormat("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    let ei = 0, timer = 0, raf = 0;
    function count() {
      const t0 = performance.now();
      cancelAnimationFrame(raf);
      (function step(now) {
        const k = Math.min(1, (now - t0) / 1400), e = 1 - Math.pow(1 - k, 3);
        amtEl.textContent = "₦" + fmt.format(target * e);
        if (k < 1) raf = requestAnimationFrame(step);
      })(t0);
    }
    function push() {
      const ev = events[ei++ % events.length];
      const row = document.createElement("div");
      row.className = "vat-row";
      row.innerHTML = "<span>" + ev[0] + "</span><b class='" + (ev[1][0] === "−" ? "neg" : "") + "'>" + ev[1] + "</b>";
      feed.prepend(row);
      while (feed.children.length > 2) feed.lastChild.remove();
    }
    push(); push();
    if (reduce) { amtEl.textContent = "₦" + fmt.format(target); el.classList.add("on"); return; }
    whenVisible(el, function () {
      if (timer) return;
      el.classList.remove("on"); void el.offsetWidth; el.classList.add("on");
      count();
      timer = setInterval(push, 2400);
    }, function () { clearInterval(timer); timer = 0; });
  }

  // 03 · Lyrics → EasyWorship — doc lines become labelled slides
  function sceneEw(el) {
    const doc = el.querySelector("[data-doc]");
    const label = el.querySelector("[data-label]");
    const lines = el.querySelector("[data-lines]");
    const step = el.querySelector("[data-step]");
    // "Amazing Grace" (John Newton, 1779) is in the public domain.
    const slides = [
      ["Title", "Praise &amp; Worship"],
      ["Verse 1", "Amazing grace, how sweet the sound<br>That saved a wretch like me"],
      ["Verse 1", "I once was lost, but now am found<br>Was blind, but now I see"],
      ["Verse 2", "'Twas grace that taught my heart to fear<br>And grace my fears relieved"],
      ["Verse 2", "How precious did that grace appear<br>The hour I first believed"],
    ];
    const steps = ["AI clean-up", "labelling", "AI check", "building .ewsx"];
    doc.innerHTML = ["PRAISE &amp; WORSHIP", "amazing grace", "Amazing grace how sweet the sound that saved a wretch like me", "I once was lost but now am found, was blind but now I see", "verse 2 — 'twas grace that taught...", "how precious did that grace appear"]
      .map(function (t, i) { return '<div class="ew-line" data-i="' + i + '">' + t + "</div>"; }).join("");
    const docLines = doc.querySelectorAll(".ew-line");
    let i = 0, timer = 0;
    function show() {
      const s = slides[i];
      label.textContent = s[0];
      lines.innerHTML = s[1];
      lines.classList.remove("in"); void lines.offsetWidth; lines.classList.add("in");
      step.textContent = steps[i % steps.length];
      docLines.forEach(function (d, k) { d.classList.toggle("hot", k === Math.min(i + 1, docLines.length - 1) || (i === 0 && k === 0)); });
      i = (i + 1) % slides.length;
    }
    show();
    if (reduce) return;
    whenVisible(el, function () { if (!timer) timer = setInterval(show, 1900); },
      function () { clearInterval(timer); timer = 0; });
  }

  // 04 · School management — rolling result sheet
  function sceneSchool(el) {
    const track = el.querySelector("[data-rows]");
    const names = ["A. Bello", "C. Okafor", "F. Musa", "T. Adeyemi", "I. Eze", "Z. Abubakar", "K. Olawale", "N. Danjuma", "R. Nwosu", "H. Sani"];
    const classes = ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"];
    let html = "";
    names.forEach(function (nm, i) {
      html += '<div class="sc-row"><b>GMS-' + pad(412 + i * 7, 4) + "</b><span>" + nm + "</span><span>" + classes[i % classes.length] + "</span><em>" + (58 + ((i * 37) % 41)) + "%</em></div>";
    });
    track.innerHTML = html + html; // doubled for a seamless loop
  }

  // 06 · PDF → Slides — a PDF page is read section by section and each
  // section comes out as a different kind of slide
  function scenePdf(el) {
    const page = el.querySelector("[data-page]");
    const slide = el.querySelector("[data-slide]");
    const step = el.querySelector("[data-step]");
    const count = el.querySelector("[data-count]");
    const blocks = ["h", "p", "p s", "img", "p", "li", "li", "li", "p s"];
    page.innerHTML = blocks.map(function (c) { return '<i class="' + c + '"></i>'; }).join("");
    const parts = page.querySelectorAll("i");
    const L = function (w) { return '<u style="width:' + w + '%"></u>'; };
    const slides = [
      { hot: [0], step: "reading", n: 1, html: '<div class="ps-div"><small>Chapter 02</small><b>Getting started</b></div>' },
      { hot: [1, 2], step: "sections", n: 4, html: '<small class="ps-k">Overview</small><b class="ps-t">Lead + body</b><div class="ps-lead">' + L(92) + L(84) + L(60) + '</div>' },
      { hot: [3, 4], step: "layout", n: 7, html: '<small class="ps-k">Product</small><b class="ps-t">Text + image</b><div class="ps-split"><div>' + L(90) + L(76) + L(82) + L(50) + '</div><span class="ps-img"></span></div>' },
      { hot: [5, 6, 7], step: "layout", n: 9, html: '<small class="ps-k">Process</small><b class="ps-t">Numbered steps</b><div class="ps-cards"><span><em>1</em>' + L(80) + '</span><span><em>2</em>' + L(70) + '</span><span><em>3</em>' + L(86) + '</span></div>' },
      { hot: [8], step: "building .pptx", n: 12, html: '<small class="ps-k">Key figures</small><b class="ps-t">Stat cards</b><div class="ps-cards stat"><span><em>3,000</em>pages</span><span><em>4</em>themes</span><span><em>&lt;1s</em>a chapter</span></div>' },
    ];
    let i = 0, timer = 0;
    function show() {
      const s = slides[i];
      slide.innerHTML = s.html;
      slide.classList.remove("in"); void slide.offsetWidth; slide.classList.add("in");
      step.textContent = s.step;
      count.textContent = pad(s.n);
      parts.forEach(function (p, k) { p.classList.toggle("hot", s.hot.indexOf(k) !== -1); });
      i = (i + 1) % slides.length;
    }
    show();
    if (reduce) return;
    whenVisible(el, function () { if (!timer) timer = setInterval(show, 2000); },
      function () { clearInterval(timer); timer = 0; });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const map = { ppa: scenePPA, ncrypt: sceneNcrypt, vat: sceneVat, ew: sceneEw, school: sceneSchool, pdf: scenePdf };
    document.querySelectorAll("[data-scene]").forEach(function (el) {
      const fn = map[el.getAttribute("data-scene")];
      if (fn) fn(el);
    });
  });
})();
