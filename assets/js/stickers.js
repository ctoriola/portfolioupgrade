/* About: polaroids behave like stickers. Pick one up, drag it, throw it;
   it tilts with the motion, glides with friction, bounces off the screen
   edges and settles back to its resting angle. */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hint = document.getElementById("sticker-hint");
  const REST = { a: -3, b: -4, c: 5 };
  const STORE = "ct-stickers-v1";
  let z = 3;

  // positions survive reloads, per visitor (this browser only)
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORE) || "{}") || {}; } catch (e) { saved = {}; }
  const sticks = {};
  function save() {
    const out = {};
    Object.keys(sticks).forEach(function (k) {
      const st = sticks[k];
      out[k] = { x: Math.round(st.s.x), y: Math.round(st.s.y), z: +st.el.style.zIndex || 0 };
    });
    try { localStorage.setItem(STORE, JSON.stringify(out)); } catch (e) {}
    reset.hidden = !Object.keys(out).some(function (k) { return out[k].x || out[k].y; });
  }

  // "put them back" link, shown once anything has moved
  const reset = document.createElement("button");
  reset.type = "button";
  reset.className = "sticker-reset";
  reset.textContent = "put them back";
  reset.hidden = true;
  if (hint) hint.insertAdjacentElement("afterend", reset);

  document.querySelectorAll(".polaroid").forEach(function (el) {
    const key = ["a", "b", "c"].find(function (k) { return el.classList.contains(k); });
    const s = {
      x: 0, y: 0, vx: 0, vy: 0,
      r: REST[key] || 0, rv: 0, rest: REST[key] || 0,
      sc: 1, held: false, px: 0, py: 0, pt: 0, raf: 0,
    };
    el.querySelectorAll("img").forEach(function (i) { i.draggable = false; });
    sticks[key] = { s: s, el: el, kick: function () { kick(); } };
    if (saved[key]) {
      s.x = saved[key].x || 0; s.y = saved[key].y || 0;
      if (saved[key].z) { el.style.zIndex = saved[key].z; z = Math.max(z, saved[key].z); }
      if (hint && (s.x || s.y)) hint.classList.add("gone");
    }

    function paint() {
      el.style.setProperty("--x", s.x.toFixed(1) + "px");
      el.style.setProperty("--y", s.y.toFixed(1) + "px");
      el.style.setProperty("--r", s.r.toFixed(2) + "deg");
      el.style.setProperty("--s", s.sc.toFixed(3));
    }

    // keep at least part of the sticker on screen
    function bounce() {
      const r = el.getBoundingClientRect();
      const W = window.innerWidth, margin = 40;
      if (r.right < margin) { s.x += margin - r.right; s.vx = Math.abs(s.vx) * 0.5; }
      if (r.left > W - margin) { s.x -= r.left - (W - margin); s.vx = -Math.abs(s.vx) * 0.5; }
      if (r.bottom < margin + 60) { s.y += margin + 60 - r.bottom; s.vy = Math.abs(s.vy) * 0.5; }
    }

    function loop() {
      if (!s.held) {
        s.vx *= 0.92; s.vy *= 0.92;               // friction
        s.x += s.vx; s.y += s.vy;
        bounce();
      }
      // rotation: a spring toward rest, nudged by horizontal speed
      const tilt = s.held ? s.rest + Math.max(-14, Math.min(14, s.vx * 0.9)) : s.rest;
      s.rv = (s.rv + (tilt - s.r) * 0.12) * 0.78;
      s.r += s.rv;
      s.sc += ((s.held ? 1.07 : 1) - s.sc) * 0.2;
      paint();
      const still = !s.held && Math.abs(s.vx) < 0.05 && Math.abs(s.vy) < 0.05 &&
        Math.abs(s.r - s.rest) < 0.05 && Math.abs(s.sc - 1) < 0.002;
      if (still) { s.raf = 0; save(); return; }
      s.raf = requestAnimationFrame(loop);
    }
    function kick() { if (!s.raf) s.raf = requestAnimationFrame(loop); }

    el.addEventListener("pointerdown", function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      s.held = true; s.vx = s.vy = 0;
      s.px = e.clientX; s.py = e.clientY; s.pt = performance.now();
      el.style.zIndex = ++z;
      el.classList.add("held");
      if (hint) hint.classList.add("gone");
      kick();
    });
    el.addEventListener("pointermove", function (e) {
      if (!s.held) return;
      const now = performance.now(), dt = Math.max(8, now - s.pt);
      const dx = e.clientX - s.px, dy = e.clientY - s.py;
      s.x += dx; s.y += dy;
      // velocity in px per 16ms frame, smoothed
      s.vx = s.vx * 0.5 + (dx / dt) * 16 * 0.5;
      s.vy = s.vy * 0.5 + (dy / dt) * 16 * 0.5;
      s.px = e.clientX; s.py = e.clientY; s.pt = now;
    });
    function drop() {
      if (!s.held) return;
      s.held = false;
      el.classList.remove("held");
      if (performance.now() - s.pt > 80) { s.vx = s.vy = 0; } // released while still
      if (reduce) { s.vx = s.vy = 0; }
      kick();
    }
    el.addEventListener("pointerup", drop);
    el.addEventListener("pointercancel", drop);

    // keyboard: arrows nudge the focused sticker
    el.tabIndex = 0;
    el.setAttribute("aria-label", (el.querySelector("img").alt || "Photo") + ". Draggable sticker; use arrow keys to move.");
    el.addEventListener("keydown", function (e) {
      const step = e.shiftKey ? 40 : 12;
      const m = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
      if (!m) return;
      e.preventDefault();
      s.x += m[0]; s.y += m[1];
      el.style.zIndex = ++z;
      kick();
    });

    paint();
    // a saved spot may be off screen on a narrower window: pull it back in
    requestAnimationFrame(function () { if (s.x || s.y) { bounce(); paint(); } });
  });

  reset.hidden = !Object.keys(saved).some(function (k) { return saved[k].x || saved[k].y; });
  reset.addEventListener("click", function () {
    Object.keys(sticks).forEach(function (k) {
      const st = sticks[k];
      st.s.vx = -st.s.x * 0.08; st.s.vy = -st.s.y * 0.08;   // fling home (friction 0.92 → lands near 0)
      st.el.style.zIndex = "";
      st.kick();
    });
    // snap exactly home once the fling has settled
    setTimeout(function () {
      Object.keys(sticks).forEach(function (k) { const st = sticks[k]; st.s.x = 0; st.s.y = 0; st.s.vx = st.s.vy = 0; st.kick(); });
      try { localStorage.removeItem(STORE); } catch (e) {}
      if (hint) hint.classList.remove("gone");
    }, 700);
  });
})();
