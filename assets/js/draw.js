/* Pixel ink: draw on any page with the pen, erase with the eraser.
   - Ink is drawn at 1/3 resolution and scaled up with nearest-neighbour,
     so every stroke is made of chunky 3px pixels.
   - The page layer covers the whole document and scrolls with it. Its x is
     stored relative to the page centre so drawings hold up on resize.
   - Any element marked [data-ink-layer] (the fun page's sideways track)
     gets a layer of its own inside it, so ink drawn there moves with it.
   - One input canvas on top takes every stroke and routes it to the layer
     under the pointer. Strokes are saved per page and per layer.
   - The eraser removes the points it touches and splits strokes there. */
(function () {
  "use strict";
  const PX = 3;              // CSS px per ink pixel
  const PEN = 2;             // pen size in ink pixels
  const ERASE_R = 16;        // eraser radius in CSS px
  const STEP = 2;            // densify strokes to a point every 2px
  const MAX_POINTS = 40000;  // per layer, keeps storage well under quota
  const COLOR = "#2f5bff";
  const PAGE = location.pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/";

  // ---------- layers ----------
  function makeLayer(opts) {
    const L = {
      key: "ct-ink:" + PAGE + (opts.id ? "#" + opts.id : ""),
      canvas: document.createElement("canvas"),
      strokes: [],
      W: 0, H: 0, cols: 0, rows: 0,
      host: opts.host || null,     // null = whole document
      centred: !opts.host,         // page layer stores x from the centre
      saveT: 0,
    };
    L.canvas.className = "ink ink-view";
    L.canvas.setAttribute("aria-hidden", "true");
    L.ctx = L.canvas.getContext("2d");
    try { L.strokes = JSON.parse(localStorage.getItem(L.key) || "[]") || []; } catch (e) { L.strokes = []; }
    return L;
  }

  function layerSize(L) {
    if (!L.host) {
      const d = document.documentElement;
      return [d.clientWidth, Math.max(d.scrollHeight, document.body.scrollHeight, window.innerHeight)];
    }
    return [Math.max(L.host.scrollWidth, L.host.offsetWidth), Math.max(L.host.scrollHeight, L.host.offsetHeight)];
  }
  function resizeLayer(L) {
    const prev = L.canvas.style.height, prevW = L.canvas.style.width;
    L.canvas.style.height = "0px"; L.canvas.style.width = "0px";   // measure without the canvas itself
    const s = layerSize(L);
    L.canvas.style.height = prev; L.canvas.style.width = prevW;
    if (s[0] === L.W && Math.abs(s[1] - L.H) < 2) return;
    L.W = s[0]; L.H = s[1];
    L.cols = Math.ceil(L.W / PX); L.rows = Math.ceil(L.H / PX);
    L.canvas.width = L.cols; L.canvas.height = L.rows;
    L.canvas.style.width = L.cols * PX + "px";
    L.canvas.style.height = L.rows * PX + "px";
    redraw(L);
  }

  // stored point -> ink grid cell
  function gx(L, x) { return Math.round((L.centred ? x + L.W / 2 : x) / PX); }
  function gy(L, y) { return Math.round(y / PX); }

  // pointer event -> stored point for a layer
  function toLayer(L, e) {
    const r = (L.host ? L.canvas : L.canvas).getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    return [L.centred ? x - L.W / 2 : x, y];
  }

  // ---------- rendering (Bresenham on the ink grid) ----------
  function dot(ctx, x, y) { ctx.fillRect(x - (PEN >> 1), y - (PEN >> 1), PEN, PEN); }
  function line(ctx, x0, y0, x1, y1) {
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      dot(ctx, x0, y0);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }
  function drawStroke(L, st, from) {
    const c = L.ctx;
    c.fillStyle = COLOR;
    if (st.length === 1) { dot(c, gx(L, st[0][0]), gy(L, st[0][1])); return; }
    for (let i = Math.max(1, from || 1); i < st.length; i++) {
      line(c, gx(L, st[i - 1][0]), gy(L, st[i - 1][1]), gx(L, st[i][0]), gy(L, st[i][1]));
    }
  }
  function redraw(L) {
    L.ctx.clearRect(0, 0, L.cols, L.rows);
    L.strokes.forEach(function (st) { drawStroke(L, st); });
  }

  // ---------- storage ----------
  function save(L) {
    clearTimeout(L.saveT);
    L.saveT = setTimeout(function () {
      let total = 0;
      for (let i = L.strokes.length - 1; i >= 0; i--) {   // drop the oldest if huge
        total += L.strokes[i].length;
        if (total > MAX_POINTS) { L.strokes = L.strokes.slice(i + 1); break; }
      }
      const slim = L.strokes.map(function (st) { return st.map(function (p) { return [Math.round(p[0]), Math.round(p[1])]; }); });
      try { slim.length ? localStorage.setItem(L.key, JSON.stringify(slim)) : localStorage.removeItem(L.key); } catch (e) {}
    }, 250);
  }

  function erase(L, p) {
    const r2 = ERASE_R * ERASE_R;
    let changed = false;
    const out = [];
    L.strokes.forEach(function (st) {
      let cur = [];
      st.forEach(function (q) {
        const dx = q[0] - p[0], dy = q[1] - p[1];
        if (dx * dx + dy * dy <= r2) { changed = true; if (cur.length) { out.push(cur); cur = []; } }
        else cur.push(q);
      });
      if (cur.length) out.push(cur);
    });
    if (changed) { L.strokes = out; redraw(L); }
    return changed;
  }

  // ---------- setup ----------
  const pageLayer = makeLayer({});
  const layers = [pageLayer];
  const input = document.createElement("canvas");   // transparent, takes pointer input
  input.className = "ink ink-input";
  input.width = 1; input.height = 1;
  input.setAttribute("aria-hidden", "true");

  function sizeInput() {
    input.style.width = pageLayer.W + "px";
    input.style.height = pageLayer.H + "px";
  }
  function resizeAll() {
    input.style.height = "0px";
    layers.forEach(resizeLayer);
    sizeInput();
  }

  // which layer is under this point? Nested layers come later in document
  // order, so check from the end: the innermost layer under the pointer wins.
  function layerAt(e) {
    for (let i = layers.length - 1; i >= 1; i--) {
      const v = layers[i].viewport.getBoundingClientRect();
      if (e.clientX >= v.left && e.clientX <= v.right && e.clientY >= v.top && e.clientY <= v.bottom) return layers[i];
    }
    return pageLayer;
  }

  // Icons, links and buttons stay clickable while a tool is active.
  // Small interactive things under the pointer win over the ink; big ones
  // (a whole project card or a large tile) stay drawable.
  const CLICKABLE = 'a[href], button, [role="button"], input, select, textarea, label, summary, [data-cursor]';
  const MAX_AREA = 40000;   // px²; roughly a 200×200 box
  function clickableAt(x, y) {
    const els = document.elementsFromPoint ? document.elementsFromPoint(x, y) : [];
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      if (el.classList && el.classList.contains("ink")) continue;
      const c = el.closest && el.closest(CLICKABLE);
      if (!c) return null;
      const r = c.getBoundingClientRect();
      return (r.width * r.height <= MAX_AREA || c.hasAttribute("data-cursor")) ? c : null;
    }
    return null;
  }

  // mouse / stylus: when hovering something clickable, let the pointer fall
  // through the ink so the real element gets the hover and the click
  let passThrough = false;
  function setPass(on) {
    if (on === passThrough) return;
    passThrough = on;
    if (on) input.style.pointerEvents = "none"; else input.style.removeProperty("pointer-events");
  }
  window.addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch" || active || erasing) return;
    if (!(window.CTTool && window.CTTool.get())) { setPass(false); return; }
    setPass(!!clickableAt(e.clientX, e.clientY));
  }, { passive: true, capture: true });
  document.addEventListener("ct-tool", function (e) { if (!e.detail) setPass(false); });

  // ---------- input ----------
  let active = null, layer = null, last = null, erasing = false, dirty = false;
  let tap = null;   // touch: a tap on something clickable is forwarded to it
  input.addEventListener("pointerdown", function (e) {
    const tool = window.CTTool && window.CTTool.get();
    if (!tool || (e.button !== undefined && e.button !== 0)) return;
    e.preventDefault();
    const c = clickableAt(e.clientX, e.clientY);
    if (c) { tap = { el: c, x: e.clientX, y: e.clientY }; return; }
    input.setPointerCapture(e.pointerId);
    resizeAll();
    layer = layerAt(e);
    const p = toLayer(layer, e);
    last = p;
    if (tool === "pen") {
      active = [p]; layer.strokes.push(active);
      drawStroke(layer, active);
    } else {
      erasing = true;
      dirty = erase(layer, p) || dirty;
    }
  });
  input.addEventListener("pointermove", function (e) {
    if (!active && !erasing) return;
    e.preventDefault();
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
    (evs.length ? evs : [e]).forEach(function (ev) {
      const p = toLayer(layer, ev);
      const d = Math.hypot(p[0] - last[0], p[1] - last[1]);
      if (d < STEP) return;
      const n = Math.floor(d / STEP);         // densify so the eraser finds points
      for (let k = 1; k <= n; k++) {
        const q = [last[0] + (p[0] - last[0]) * k / n, last[1] + (p[1] - last[1]) * k / n];
        if (active) active.push(q);
        else dirty = erase(layer, q) || dirty;
      }
      if (active) drawStroke(layer, active, active.length - n);
      last = p;
    });
  });
  function end(e) {
    if (tap && e && e.type === "pointerup" && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) < 10) {
      const el = tap.el;
      tap = null;
      if (el.focus) el.focus({ preventScroll: true });
      el.click();
      return;
    }
    tap = null;
    if (layer && (active || dirty)) save(layer);
    active = null; erasing = false; dirty = false;
  }
  input.addEventListener("pointerup", end);
  input.addEventListener("pointercancel", end);

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

  function syncBar(tool) {
    bar.querySelectorAll("[data-cursor]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-cursor") === tool));
    });
  }
  function mountBar() {
    document.body.appendChild(bar);
    if (window.PX) window.PX.renderIcons(bar);
    bar.querySelectorAll("[data-cursor]").forEach(function (b) {
      b.addEventListener("click", function () { window.CTTool.set(b.getAttribute("data-cursor")); });
    });
    bar.querySelector("[data-done]").addEventListener("click", function () { window.CTTool.set(null); });
    const clr = bar.querySelector("[data-clear]");
    const lbl = bar.querySelector("[data-clear-lbl]");
    let armT = 0;
    function disarm() { clr.classList.remove("armed"); lbl.textContent = "Clear page"; clr.removeAttribute("aria-label"); }
    clr.addEventListener("click", function () {
      if (!clr.classList.contains("armed")) {
        clr.classList.add("armed"); lbl.textContent = "Sure?";
        clr.setAttribute("aria-label", "Click again to clear every drawing on this page");
        armT = setTimeout(disarm, 2500);
        return;
      }
      clearTimeout(armT); disarm();
      layers.forEach(function (L) { L.strokes = []; redraw(L); save(L); });
    });
    syncBar(window.CTTool && window.CTTool.get());
  }
  document.addEventListener("ct-tool", function (e) {
    syncBar(e.detail);
    if (e.detail) resizeAll();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && window.CTTool && window.CTTool.get()) window.CTTool.set(null);
  });

  // ---------- boot ----------
  function boot() {
    document.body.appendChild(pageLayer.canvas);
    document.querySelectorAll("[data-ink-layer]").forEach(function (host, i) {
      const L = makeLayer({ host: host, id: host.getAttribute("data-ink-layer") || "layer" + i });
      L.viewport = host.closest("[data-ink-viewport]") || host;
      L.canvas.classList.add("ink-inner");
      if (getComputedStyle(host).position === "static") host.style.position = "relative";
      host.appendChild(L.canvas);
      layers.push(L);
    });
    document.body.appendChild(input);
    mountBar();
    resizeAll();
    window.addEventListener("resize", resizeAll);
    window.addEventListener("load", resizeAll);
    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(function () { resizeAll(); });
      ro.observe(document.body);
      layers.forEach(function (L) { if (L.host) ro.observe(L.host); });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
