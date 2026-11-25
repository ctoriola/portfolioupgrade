/* Home: cursor-swarm intro, stacked project sheets, weighted scroll.
   The card animations live in scenes.js. */
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
      const vx0 = (mobile ? 2.6 : 4.2) + Math.random() * 2.2;
      birds.push({
        v0: vx0,
        x: -Math.random() * W * 0.9 - 30,
        y: H * (0.08 + Math.random() * (mobile ? 0.45 : 0.42)),
        vx: vx0,
        vy: (Math.random() - 0.5) * 0.6,
        ph: Math.random() * Math.PI * 2,
        delay: 0.9 + Math.random() * 1.3,
        s: 0.85 + Math.random() * 0.35,
        dead: false,
      });
    }

    // The real cursor is a rock in the stream: pointers part around it and
    // close up again behind it. On touch screens the rock sits wherever the
    // visitor taps (and follows a dragging finger), staying put after lift.
    const mouse = { x: -9999, y: -9999, on: false };
    const R = W < 760 ? 140 : 180;                      // radius of influence
    function onMove(e) {
      if (e.pointerType === "touch" && e.buttons === 0 && e.type === "pointermove") return;
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = true;
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", function () { mouse.on = false; });
    function avoid(b, dt) {
      if (!mouse.on) return;
      const cx = b.x + 8 * b.s, cy = b.y + 10 * b.s;    // sprite centre
      const dx = cx - mouse.x, dy = cy - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 > R * R) return;
      const d = Math.sqrt(d2) || 1;
      const f = 1 - d / R, f2 = f * f;
      // shoved straight out from the rock...
      b.x += (dx / d) * (f2 * 34 + f * 6) * dt;
      b.y += (dy / d) * (f2 * 34 + f * 6) * dt;
      // ...and swept hard around it, on whichever side it is already on
      const v = Math.hypot(b.vx, b.vy) || 1;
      const nx = -b.vy / v, ny = b.vx / v;
      const side = (dx * nx + dy * ny) >= 0 ? 1 : -1;
      b.vx += nx * side * f * 2.6 * dt;
      b.vy += ny * side * f * 2.6 * dt;
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
          avoid(b, dt);
          b.vy *= Math.pow(0.97, dt);                   // settle back into the flow
          b.vx += (b.v0 - b.vx) * 0.05 * dt;
          b.x += b.vx * dt; b.y += b.vy * dt;
        } else {
          // home in on the phone screen
          const dx = T.x - b.x, dy = T.y - b.y;
          const d = Math.hypot(dx, dy) || 1;
          const speed = Math.min(14, 5 + (t - b.delay) * 9);
          b.vx += ((dx / d) * speed - b.vx) * 0.09 * dt;
          b.vy += ((dy / d) * speed - b.vy) * 0.09 * dt;
          if (d > 70) avoid(b, dt);                     // never block the last dive in
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
      if ((alive === 0 && t > 1.5) || t > 5.2) {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onMove);
        finish(); return;
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
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

  // =========================================================
  // Weighted scrolling. Wheel input moves a target; the page eases
  // toward it (inertia). Scroll velocity then drives a damped spring
  // that lets the hero and the work heading lag and settle, so the
  // move from hero to work feels like it has mass.
  // =========================================================
  function physics() {
    if (reduce) return;
    const hero = document.querySelector(".hero");
    const copy = document.querySelector(".hero-copy");
    const figImg = document.querySelector(".hero-figure img");
    const head = document.querySelector(".work-head");
    const maxY = function () { return document.documentElement.scrollHeight - window.innerHeight; };

    let target = window.scrollY, current = window.scrollY, lastY = window.scrollY;
    let wheeling = false;
    // spring state (offset in px and its velocity)
    let off = 0, offV = 0;

    let ease = 0.075;                                   // lower = heavier
    const busy = function () { return document.body.classList.contains("intro-running"); };
    const clampY = function (v) { return Math.min(maxY(), Math.max(0, v)); };

    // mouse wheel / trackpad
    window.addEventListener("wheel", function (e) {
      if (e.ctrlKey || busy()) return;
      e.preventDefault();
      const d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      if (!wheeling) { target = current = window.scrollY; }
      target = clampY(target + d);
      ease = 0.075;
      wheeling = true;
    }, { passive: false });

    // touch: the page follows the finger with a little lag, then a
    // flick carries on as momentum and glides to a stop
    let touchY = 0, touchT = 0, flick = 0, tracking = false;
    window.addEventListener("touchstart", function (e) {
      if (busy() || e.touches.length > 1 || document.body.classList.contains("drawing")) { tracking = false; return; }
      // sideways-scrolling rows (the client logos) keep their native swipe
      if (e.target.closest && e.target.closest("[data-scroll-x]")) { tracking = false; return; }
      tracking = true;
      touchY = e.touches[0].clientY; touchT = performance.now(); flick = 0;
      target = current = window.scrollY;
    }, { passive: true });
    window.addEventListener("touchmove", function (e) {
      if (!tracking || e.touches.length > 1) return;
      e.preventDefault();
      const y = e.touches[0].clientY, now = performance.now();
      const dy = touchY - y, dt = Math.max(1, now - touchT);
      touchY = y; touchT = now;
      flick = flick * 0.6 + (dy / dt) * 0.4;           // smoothed px per ms
      target = clampY(target + dy);
      ease = 0.2;
      wheeling = true;
    }, { passive: false });
    window.addEventListener("touchend", function () {
      if (!tracking) return;
      tracking = false;
      if (performance.now() - touchT > 90) flick = 0;   // finger rested before lifting
      target = clampY(target + flick * 520);
      ease = 0.06;
      wheeling = true;
    }, { passive: true });

    // keyboard, scrollbar or anchor jumps: hand control back to native scroll
    ["keydown", "mousedown"].forEach(function (ev) {
      window.addEventListener(ev, function () { wheeling = false; }, { passive: true });
    });

    function tick() {
      if (wheeling) {
        current += (target - current) * ease;
        if (Math.abs(target - current) < 0.4) { current = target; wheeling = false; }
        window.scrollTo(0, current);
      }
      const y = window.scrollY;
      const vel = y - lastY;                            // px per frame
      lastY = y;

      // damped spring: pushed by scroll velocity, pulled back to 0
      const k = 0.07, damp = 0.88;
      offV = (offV + (vel * 1.6 - off) * k) * damp;
      off += offV;
      const o = Math.max(-90, Math.min(90, off));

      // hero: content drifts slower than the page and sinks back
      const h = hero.offsetHeight;
      if (y < h * 1.2) {
        const p = Math.min(1, y / h);
        copy.style.transform = "translate3d(0," + (y * 0.32 + o * 0.35).toFixed(1) + "px,0)";
        copy.style.opacity = (1 - p * 1.1).toFixed(3);
        figImg.style.transform = "translate3d(0," + (y * 0.12 + o * 0.2).toFixed(1) + "px,0) scale(" + (1 - p * 0.06).toFixed(4) + ")";
      }
      // work heading: rises in with a lag, overshoots slightly, settles
      head.style.transform = "translate3d(0," + (o * 0.9).toFixed(1) + "px,0)";
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  document.addEventListener("DOMContentLoaded", function () {
    intro();
    stack();
    physics();
  });
})();
