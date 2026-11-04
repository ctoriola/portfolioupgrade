/* Pixel ink: draw on any page with the pen, erase with the eraser.
   - The canvas covers the whole document and scrolls with the content.
   - It is drawn at 1/3 resolution and scaled up with nearest-neighbour,
     so every stroke is made of chunky 3px pixels.
   - Strokes are stored as points (x relative to the page centre, so they
     stay put when the window is resized) in localStorage, per page.
   - The eraser removes the points it touches and splits strokes there. */
(function () {
  "use strict";
  const PX = 3;              // CSS px per ink pixel
  const PEN = 2;             // pen size in ink pixels
  const ERASE_R = 16;        // eraser radius in CSS px
  const STEP = 2;            // densify strokes to a point every 2px
  const MAX_POINTS = 40000;  // keep storage well under quota
  const COLOR = "#2f5bff";
  const KEY = "ct-ink:" + (location.pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/");

  let strokes = [];          // [[ [cx, y], ... ], ...]
  try { strokes = JSON.parse(localStorage.getItem(KEY) || "[]") || []; } catch (e) { strokes = []; }

  const canvas = document.createElement("canvas");
  canvas.className = "ink";
  canvas.setAttribute("aria-hidden", "true");
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, cols = 0, rows = 0;

  // ---------- layout ----------
  function docSize() {
    const d = document.documentElement;
    return [d.clientWidth, Math.max(d.scrollHeight, document.body.scrollHeight, window.innerHeight)];
  }
  function resize() {
    const prev = canvas.style.height;
    canvas.style.height = "0px";           // measure the page without the canvas itself
    const s = docSize();
    canvas.style.height = prev;
    if (s[0] === W && Math.abs(s[1] - H) < 2) return;
    W = s[0]; H = s[1];
    cols = Math.ceil(W / PX); rows = Math.ceil(H / PX);
    canvas.width = cols; canvas.height = rows;
    canvas.style.width = cols * PX + "px";
    canvas.style.height = rows * PX + "px";
    redraw();
  }

  // ---------- rendering (Bresenham on the ink grid) ----------
  function dot(gx, gy) { ctx.fillRect(gx - (PEN >> 1), gy - (PEN >> 1), PEN, PEN); }
  function line(x0, y0, x1, y1) {
    let dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      dot(x0, y0);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }
  const gx = function (cx) { return Math.round((cx + W / 2) / PX); };
  const gy = function (y) { return Math.round(y / PX); };
  function drawStroke(st, from) {
    ctx.fillStyle = COLOR;
    if (st.length === 1) { dot(gx(st[0][0]), gy(st[0][1])); return; }
    for (let i = Math.max(1, from || 1); i < st.length; i++) {
      line(gx(st[i - 1][0]), gy(st[i - 1][1]), gx(st[i][0]), gy(st[i][1]));
    }
  }
  function redraw() {
    ctx.clearRect(0, 0, cols, rows);
    strokes.forEach(function (st) { drawStroke(st); });
  }

  // ---------- storage ----------
  let saveT = 0;
  function save() {
    clearTimeout(saveT);
    saveT = setTimeout(function () {
      let total = 0;
      for (let i = strokes.length - 1; i >= 0; i--) {     // drop oldest if huge
        total += strokes[i].length;
        if (total > MAX_POINTS) { strokes = strokes.slice(i + 1); break; }
      }
      const slim = strokes.map(function (st) { return st.map(function (p) { return [Math.round(p[0]), Math.round(p[1])]; }); });
      try { strokes.length ? localStorage.setItem(KEY, JSON.stringify(slim)) : localStorage.removeItem(KEY); } catch (e) {}
    }, 250);
  }

  // ---------- input ----------
  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return [e.clientX - r.left - W / 2, e.clientY - r.top];
  }
  function erase(p) {
    const r2 = ERASE_R * ERASE_R;
    let changed = false;
    const out = [];
    strokes.forEach(function (st) {
      let cur = [];
      let hit = false;
      st.forEach(function (q) {
        const dx = q[0] - p[0], dy = q[1] - p[1];
        if (dx * dx + dy * dy <= r2) { hit = true; if (cur.length) { out.push(cur); cur = []; } }
        else cur.push(q);
      });
      if (cur.length) out.push(cur);
      if (hit) changed = true;
    });
    if (changed) { strokes = out; redraw(); }
    return changed;
  }

  let active = null, last = null, erasing = false, dirty = false;
  // a pen/eraser button sitting under the ink (like the ones beside the
  // name) should still switch tools instead of being drawn over
  function toolUnder(e) {
    const els = document.elementsFromPoint ? document.elementsFromPoint(e.clientX, e.clientY) : [];
    for (let i = 0; i < els.length; i++) {
      if (els[i] === canvas) continue;
      const b = els[i].closest && els[i].closest("[data-cursor]");
      if (b) return b;
    }
    return null;
  }
  canvas.addEventListener("pointermove", function (e) {
    if (active || erasing) return;
    if (toolUnder(e)) canvas.style.setProperty("cursor", "pointer", "important");
    else canvas.style.removeProperty("cursor");
  });
  canvas.addEventListener("pointerdown", function (e) {
    const tool = window.CTTool && window.CTTool.get();
    if (!tool || (e.button !== undefined && e.button !== 0)) return;
    const btn = toolUnder(e);
    if (btn) { e.preventDefault(); window.CTTool.set(btn.getAttribute("data-cursor")); return; }
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    resize();
    const p = pos(e);
    if (tool === "pen") {
      active = [p]; strokes.push(active); last = p;
      drawStroke(active);
    } else {
      erasing = true; last = p;
      dirty = erase(p) || dirty;
    }
  });
  canvas.addEventListener("pointermove", function (e) {
    if (!active && !erasing) return;
    e.preventDefault();
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    (evs.length ? evs : [e]).forEach(function (ev) {
      const p = pos(ev);
      const d = Math.hypot(p[0] - last[0], p[1] - last[1]);
      if (d < STEP) return;
      // densify so the eraser always finds points under it
      const n = Math.floor(d / STEP);
      for (let k = 1; k <= n; k++) {
        const q = [last[0] + (p[0] - last[0]) * k / n, last[1] + (p[1] - last[1]) * k / n];
        if (active) active.push(q);
        else dirty = erase(q) || dirty;
      }
      if (active) drawStroke(active, active.length - n);
      last = p;
    });
  });
  function end() {
    if (active || dirty) save();
    active = null; erasing = false; dirty = false;
  }
  canvas.addEventListener("pointerup", end);
  canvas.addEventListener("pointercancel", end);

  // ---------- toolbar ----------
  const bar = document.createElement("div");
  bar.className = "ink-bar";
  bar.setAttribute("role", "toolbar");
  bar.setAttribute("aria-label", "Drawing tools");
  bar.innerHTML =
    '<button type="button" data-cursor="pen" aria-pressed="false"><span data-px="pen" data-scale="1.4" data-ink="#2f5bff"></span><span class="lbl">Pen</span></button>' +
    '<button type="button" data-cursor="eraser" aria-pressed="false"><span data-px="eraser" data-scale="1.4" data-ink="#2f5bff"></span><span class="lbl">Eraser</span></button>' +
    '<span class="sep"></span>' +
    '<button type="button" class="danger" data-clear><span data-px="trash" data-scale="1.4"></span><span class="lbl" data-clear-lbl>Clear page</span></button>' +
    '<button type="button" class="done" data-done><span data-px="close" data-scale="1.3" data-ink="#fff"></span>Done</button>';

  function mountBar() {
    document.body.appendChild(bar);
    if (window.PX) window.PX.renderIcons(bar);
    bar.querySelectorAll("[data-cursor]").forEach(function (b) {
      b.addEventListener("click", function () { window.CTTool.set(b.getAttribute("data-cursor")); });
    });
    bar.querySelector("[data-done]").addEventListener("click", function () { window.CTTool.set(window.CTTool.get()); });
    const clr = bar.querySelector("[data-clear]");
    const lbl = bar.querySelector("[data-clear-lbl]");
    let armT = 0;
    clr.addEventListener("click", function () {
      if (!clr.classList.contains("armed")) {
        clr.classList.add("armed"); lbl.textContent = "Sure?";
        clr.setAttribute("aria-label", "Click again to clear every drawing on this page");
        armT = setTimeout(function () { clr.classList.remove("armed"); lbl.textContent = "Clear page"; clr.removeAttribute("aria-label"); }, 2500);
        return;
      }
      clearTimeout(armT);
      clr.classList.remove("armed"); lbl.textContent = "Clear page"; clr.removeAttribute("aria-label");
      strokes = []; redraw(); save();
    });
  }
  document.addEventListener("ct-tool", function (e) {
    bar.querySelectorAll("[data-cursor]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-cursor") === e.detail));
    });
    if (e.detail) resize();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && window.CTTool && window.CTTool.get()) window.CTTool.set(window.CTTool.get());
  });

  // ---------- boot ----------
  function boot() {
    document.body.appendChild(canvas);
    mountBar();
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("load", resize);
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(document.body);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
