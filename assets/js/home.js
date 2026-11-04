/* Home: cursor-swarm intro + animated project cards. */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // =========================================================
  // Intro: a flock of pixel cursors streams in and dives into
  // the phone in Charles's hands.
  // =========================================================
  function intro() {
    const body = document.body;
    const canvas = document.getElementById("swarm");
    const skip = document.getElementById("skip");
    const figure = document.getElementById("figure");
    let done = false;
    let raf = 0;

    function finish() {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      body.classList.remove("intro-running");
      body.classList.add("intro-done");
      const wrap = document.getElementById("intro");
      wrap.style.transition = "opacity .6s ease";
      wrap.style.opacity = "0";
      setTimeout(function () { wrap.remove(); skip.remove(); }, 700);
      try { sessionStorage.setItem("ct-intro", "1"); } catch (e) {}
    }

    let seen = false;
    try { seen = sessionStorage.getItem("ct-intro") === "1"; } catch (e) {}
    if (reduce || seen || !canvas.getContext) { finish(); return; }

    skip.addEventListener("click", finish);
    window.addEventListener("keydown", function (e) { if (e.key === "Escape") finish(); }, { once: true });

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    function size() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    }
    size();
    window.addEventListener("resize", size);

    // sprite from the shared pixel icon
    const rows = window.PX.ICONS.arrowCursor;
    const S = 2;
    const sprite = document.createElement("canvas");
    sprite.width = rows[0].length * S; sprite.height = rows.length * S;
    const sctx = sprite.getContext("2d");
    rows.forEach(function (r, y) {
      for (let x = 0; x < r.length; x++) {
        const c = r[x];
        if (c === ".") continue;
        sctx.fillStyle = c === "#" ? "#111" : "#fff";
        sctx.fillRect(x * S, y * S, S, S);
      }
    });

    function target() {
      const r = figure.getBoundingClientRect();
      return { x: r.left + r.width * 0.075, y: r.top + r.height * 0.625 };
    }

    const mobile = W < 760;
    const N = mobile ? 70 : 120;
    const birds = [];
    for (let i = 0; i < N; i++) {
      birds.push({
        x: -Math.random() * W * 0.9 - 30,
        y: H * (0.08 + Math.random() * (mobile ? 0.45 : 0.42)),
        vx: (mobile ? 2.6 : 4.2) + Math.random() * 2.2,
        vy: (Math.random() - 0.5) * 0.6,
        ph: Math.random() * Math.PI * 2,
        delay: 0.9 + Math.random() * 1.3,
        s: 0.85 + Math.random() * 0.35,
        dead: false,
      });
    }

    const t0 = performance.now();
    let last = t0;
    function frame(now) {
      const t = (now - t0) / 1000;
      const dt = Math.min(2.5, (now - last) / 16.67);
      last = now;
      ctx.clearRect(0, 0, W, H);
      const T = target();
      let alive = 0;
      for (let i = 0; i < N; i++) {
        const b = birds[i];
        if (b.dead) continue;
        alive++;
        if (t < b.delay) {
          // cruise right in a loose, wavy flock
          b.vy += Math.sin(t * 2.2 + b.ph) * 0.03 * dt;
          b.x += b.vx * dt; b.y += b.vy * dt;
        } else {
          // home in on the phone screen
          const dx = T.x - b.x, dy = T.y - b.y;
          const d = Math.hypot(dx, dy) || 1;
          const speed = Math.min(14, 5 + (t - b.delay) * 9);
          b.vx += ((dx / d) * speed - b.vx) * 0.09 * dt;
          b.vy += ((dy / d) * speed - b.vy) * 0.09 * dt;
          b.x += b.vx * dt; b.y += b.vy * dt;
          if (d < 50) b.s *= Math.pow(0.86, dt);
          if (d < 10 || b.s < 0.12) { b.dead = true; continue; }
        }
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.scale(b.s, b.s);
        ctx.drawImage(sprite, 0, 0);
        ctx.restore();
      }
      if ((alive === 0 && t > 1.5) || t > 5.2) { finish(); return; }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
  }

  // =========================================================
  // Card scenes (only animate while on screen)
  // =========================================================
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

  // =========================================================
  // Stacked work sheets: each sticky sheet slides over the last;
  // covered sheets shrink and dim a little.
  // =========================================================
  function stack() {
    const sheets = Array.prototype.slice.call(document.querySelectorAll("#stack .project"));
    sheets.forEach(function (el, i) {
      el.style.setProperty("--i", i);
      const sh = document.createElement("span");
      sh.className = "shade";
      el.appendChild(sh);
    });
    if (reduce) return;
    let ticking = false;
    function update() {
      ticking = false;
      for (let i = 0; i < sheets.length - 1; i++) {
        const me = sheets[i], next = sheets[i + 1];
        const h = me.offsetHeight;
        const myTop = me.getBoundingClientRect().top;
        const gap = next.getBoundingClientRect().top - myTop;   // shrinks as next slides up
        const p = Math.min(1, Math.max(0, 1 - gap / h));
        const covered = sheets.length - 1 - i;                  // deeper sheets shrink a touch more
        me.style.transform = "scale(" + (1 - p * Math.min(0.06, 0.025 * covered)) + ")";
        me.lastChild.style.opacity = (p * 0.12).toFixed(3);
      }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  document.addEventListener("DOMContentLoaded", function () {
    intro();
    stack();
    const map = { ppa: scenePPA, ncrypt: sceneNcrypt, vat: sceneVat, ew: sceneEw, school: sceneSchool };
    document.querySelectorAll("[data-scene]").forEach(function (el) {
      const fn = map[el.getAttribute("data-scene")];
      if (fn) fn(el);
    });
  });
})();
