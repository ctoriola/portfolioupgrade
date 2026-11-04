/* Shared: pixel icons, bottom dock, custom cursors, small helpers. */
(function () {
  "use strict";

  // ---------- pixel art ----------
  // '#' = ink, 'o' = paper, 'b' = blue, 'w' = white, '.' = transparent
  const ICONS = {
    folder: [
      ".######...............",
      "#oooooo#..............",
      "#ooooooo##############",
      "#oooooooooooooooooooo#",
      "#oooooooooooooooooooo#",
      "#oooooooooooooooooooo#",
      "#oooooooooooooooooooo#",
      "#oooooooooooooooooooo#",
      "#oooooooooooooooooooo#",
      "#oooooooooooooooooooo#",
      "#oooooooooooooooooooo#",
      "#oooooooooooooooooooo#",
      "#oooooooooooooooooooo#",
      ".####################.",
    ],
    folderFull: [
      "........###########...",
      "........#ooooooooo#...",
      "........#oo###########",
      ".######.#oo#ooooooooo#",
      "#oooooo##oo#ooooooooo#",
      "######################",
      "#oooooooooooooooooooo#",
      "#oooooooooooooooooooo#",
      "#oooooooooooooooooooo#",
      "#oooooooooooooooooooo#",
      "#oooooooooooooooooooo#",
      "#oooooooooooooooooooo#",
      "#oooooooooooooooooooo#",
      "#oooooooooooooooooooo#",
      "#oooooooooooooooooooo#",
      ".####################.",
    ],
    folderOpen: [
      ".######...............",
      "#oooooo#..............",
      "#ooooooo###########...",
      "#ooooooooooooooooo#...",
      "#oooo###################",
      "#ooo#oooooooooooooooooo#",
      "#ooo#ooooooooooooooooo#.",
      "#oo#oooooooooooooooooo#.",
      "#oo#ooooooooooooooooo#..",
      "#o#oooooooooooooooooo#..",
      "#o#ooooooooooooooooo#...",
      "##oooooooooooooooooo#...",
      "#oooooooooooooooooo#....",
      ".##################.....",
    ],
    arrowCursor: [
      "#...........",
      "##..........",
      "#o#.........",
      "#oo#........",
      "#ooo#.......",
      "#oooo#......",
      "#ooooo#.....",
      "#oooooo#....",
      "#ooooooo#...",
      "#oooooooo#..",
      "#ooooo#####.",
      "#oo#oo#.....",
      "#o#.#oo#....",
      "##..#oo#....",
      "#....#oo#...",
      ".....#oo#...",
      "......##....",
    ],
    hand: [
      ".....##.........",
      "....#ww#........",
      "....#ww#........",
      "....#ww#........",
      "....#ww###......",
      "....#ww#ww###...",
      "....#ww#ww#ww##.",
      ".##.#ww#ww#ww#w#",
      "#ww##wwwwwwwwww#",
      "#www#wwwwwwwwww#",
      ".#wwwwwwwwwwwww#",
      "..#wwwwwwwwwwww#",
      "..#wwwwwwwwwww#.",
      "...#wwwwwwwwww#.",
      "...#wwwwwwwww#..",
      "....#wwwwwwww#..",
      "....##########..",
    ],
    pen: [
      "............##..",
      "...........#ww#.",
      "..........#www#.",
      ".........#www#..",
      "........#www#...",
      ".......#www#....",
      "......#www#.....",
      ".....#www#......",
      "....#www#.......",
      "...#www#........",
      "..#www#.........",
      "..#ww#..........",
      ".#w##...........",
      ".##.............",
    ],
    eraser: [
      ".......######...",
      "......#bbbbbb#..",
      ".....#bbbbbbbb#.",
      "....#bbbbbbbb#..",
      "...#wwwwbbbb#...",
      "..#wwwwwwbb#....",
      ".#wwwwwwww#.....",
      "#wwwwwwww#......",
      "#wwwwwww#.......",
      ".#wwwww#........",
      "..#####.........",
    ],
    trash: [
      "....####....",
      "############",
      ".#oooooooo#.",
      ".#o#oo#o#o#.",
      ".#o#oo#o#o#.",
      ".#o#oo#o#o#.",
      ".#o#oo#o#o#.",
      ".#oooooooo#.",
      "..########..",
    ],
    close: [
      "##.....##",
      ".##...##.",
      "..##.##..",
      "...###...",
      "..##.##..",
      ".##...##.",
      "##.....##",
    ],
    mail: [
      "##################",
      "#oooooooooooooooo#",
      "##oooooooooooooo##",
      "#o#oooooooooooo#o#",
      "#oo##oooooooo##oo#",
      "#oooo##oooo##oooo#",
      "#oooooo####oooooo#",
      "#oooooooooooooooo#",
      "#oooooooooooooooo#",
      "#oooooooooooooooo#",
      "##################",
    ],
    github: [
      ".##..........##.",
      ".#o#........#o#.",
      ".#oo########oo#.",
      ".#oooooooooooo#.",
      "#oooooooooooooo#",
      "#ooo##oooo##ooo#",
      "#ooo##oooo##ooo#",
      "#oooooooooooooo#",
      "#oooooo##oooooo#",
      ".#oooooooooooo#.",
      "..############..",
      "...#o#....#o#...",
      "...###....###...",
    ],
    linkedin: [
      "##############",
      "#oooooooooooo#",
      "#o##ooooooooo#",
      "#o##ooooooooo#",
      "#oooooooooooo#",
      "#o##o##o###oo#",
      "#o##o###oo##o#",
      "#o##o##oooo#o#",
      "#o##o##oooo#o#",
      "#o##o##oooo#o#",
      "#oooooooooooo#",
      "##############",
    ],
    ext: [
      "..#####",
      ".....##",
      "....#.#",
      "...#..#",
      "..#....",
      ".#.....",
      "#......",
    ],
    arrowRight: [
      "......#....",
      ".......#...",
      "........#..",
      "#.#.#####.#",
      "........#..",
      ".......#...",
      "......#....",
    ],
    windowOut: [
      "....##########..",
      "...#oooooooooo#.",
      "..#oooooooooooo#",
      "##################",
      "#oooooooooooooooo#",
      "#oooooooooooooooo#",
      "#oooooo#####ooooo#",
      "#oooooooo###ooooo#",
      "#ooooooo#o##ooooo#",
      "#oooooo#oo#oooooo#",
      "#ooooo#ooooooooo#.",
      "#oooooooooooooooo#",
      "##################",
    ],
    peace: [
      "..##..##....",
      ".#oo##oo#...",
      ".#oo##oo#...",
      ".#oo##oo#...",
      ".#oo##oo#...",
      ".#oo##oo###.",
      "##ooooooooo#",
      "#oooooooooo#",
      "#oooooooooo#",
      ".#ooooooooo#",
      "..#ooooooo#.",
      "...#######..",
    ],
    film: [
      "################",
      "#o#oooooooooo#o#",
      "###oooooooooo###",
      "#o#oooooooooo#o#",
      "###oooooooooo###",
      "#o#oooooooooo#o#",
      "###oooooooooo###",
      "#o#oooooooooo#o#",
      "################",
    ],
    camera: [
      "....######......",
      "...#oooooo#.....",
      "################",
      "#oooooo##ooooo##",
      "#ooooo#oo#oooo##",
      "#oooo#oooo#oooo#",
      "#oooo#oooo#oooo#",
      "#ooooo#oo#ooooo#",
      "#oooooo##oooooo#",
      "################",
    ],
    brush: [
      "..........####",
      ".........#oo#.",
      "........#oo#..",
      ".......#oo#...",
      "......#oo#....",
      "....####......",
      "...#bbb#......",
      "..#bbbb#......",
      ".#bbbb#.......",
      "#bbb##........",
    ],
    grid: [
      "###...###",
      "#o#...#o#",
      "###...###",
      ".........",
      ".........",
      "###...###",
      "#o#...#o#",
      "###...###",
    ],
  };

  const PALETTE = { "#": "currentColor", o: "#fff", w: "#fff", b: "#2f5bff" };

  function pixelSVG(rows, scale, opts) {
    opts = opts || {};
    const w = Math.max.apply(null, rows.map(function (r) { return r.length; }));
    const h = rows.length;
    const pal = Object.assign({}, PALETTE, opts.palette || {});
    let rects = "";
    rows.forEach(function (row, y) {
      let x = 0;
      while (x < row.length) {
        const c = row[x];
        if (c === "." || c === " ") { x++; continue; }
        let run = 1;
        while (row[x + run] === c) run++;
        rects += '<rect x="' + x + '" y="' + y + '" width="' + run + '" height="1" fill="' + pal[c] + '"/>';
        x += run;
      }
    });
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + " " + h + '" width="' + w * scale + '" height="' + h * scale + '" aria-hidden="true" focusable="false">' + rects + "</svg>";
  }

  function iconToDataURL(name, scale, palette) {
    const svg = pixelSVG(ICONS[name], scale, { palette: Object.assign({ "#": "#111" }, palette || {}) });
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }

  function renderIcons(root) {
    (root || document).querySelectorAll("[data-px]").forEach(function (el) {
      const name = el.getAttribute("data-px");
      if (!ICONS[name]) return;
      const scale = parseFloat(el.getAttribute("data-scale") || "2");
      const pal = {};
      if (el.hasAttribute("data-ink")) pal["#"] = el.getAttribute("data-ink");
      if (el.hasAttribute("data-fill")) { pal.o = el.getAttribute("data-fill"); pal.w = el.getAttribute("data-fill"); }
      el.classList.add("px");
      el.innerHTML = pixelSVG(ICONS[name], scale, { palette: pal });
    });
  }

  // ---------- bottom dock ----------
  function buildDock() {
    const page = document.body.getAttribute("data-page") || "work";
    const links = [["work", "/"], ["fun", "/fun"], ["art", "/art"], ["about", "/about"]];
    const nav = document.createElement("nav");
    nav.className = "dock";
    nav.setAttribute("aria-label", "Primary");
    nav.innerHTML =
      '<div class="dock-left">' +
        '<button class="dock-home" type="button" aria-expanded="true" aria-controls="dock-links" aria-label="Hide menu">' +
          '<span class="f-open" data-px="folderOpen" data-scale="2"></span>' +
          '<span class="f-closed" data-px="folderFull" data-scale="2"></span>' +
        "</button>" +
        '<div class="dock-links" id="dock-links">' +
          links.map(function (l) {
            return '<a href="' + l[1] + '"' + (l[0] === page ? ' aria-current="page"' : "") + ">" + l[0] + "</a>";
          }).join("") +
        "</div>" +
      "</div>" +
      '<div class="dock-right">' +
        '<button class="dock-tool" type="button" data-cursor="pen" aria-pressed="false" aria-label="Pen: draw on the page"><span class="tip">draw</span><span data-px="pen" data-scale="1.6" data-ink="#2f5bff"></span></button>' +
        '<button class="dock-tool" type="button" data-cursor="eraser" aria-pressed="false" aria-label="Eraser: erase drawings"><span class="tip">erase</span><span data-px="eraser" data-scale="1.6" data-ink="#2f5bff"></span></button>' +
        '<a class="dock-mail" href="mailto:toriola333@gmail.com" aria-label="Email Charles">' +
          '<span class="tip">toriola333@gmail.com</span>' +
          '<span data-px="windowOut" data-scale="2"></span>' +
        "</a>" +
      "</div>";
    const fade = document.createElement("div");
    fade.className = "dock-fade";
    document.body.appendChild(fade);
    document.body.appendChild(nav);
    setupFolder(nav);
  }

  // The open folder collapses the nav links into itself (and becomes a
  // closed folder); clicking it again lets them back out. Remembered.
  function setupFolder(nav) {
    const btn = nav.querySelector(".dock-home");
    const wrap = nav.querySelector(".dock-links");
    const items = Array.prototype.slice.call(wrap.querySelectorAll("a"));
    function aim() {
      // distance from each link back to the folder's mouth
      const f = btn.getBoundingClientRect();
      const fx = f.left + f.width * 0.55;
      items.forEach(function (a, i) {
        const r = a.getBoundingClientRect();
        a.style.setProperty("--dx", (fx - (r.left + r.width / 2)).toFixed(1) + "px");
        a.style.setProperty("--d-in", ((items.length - 1 - i) * 45) + "ms");
        a.style.setProperty("--d-out", (i * 55) + "ms");
      });
    }
    function set(closed, animate) {
      if (closed) aim();
      nav.classList.toggle("no-anim", !animate);
      nav.classList.toggle("collapsed", closed);
      btn.setAttribute("aria-expanded", String(!closed));
      btn.setAttribute("aria-label", closed ? "Show menu" : "Hide menu");
      items.forEach(function (a) { a.tabIndex = closed ? -1 : 0; });
      if (animate) {
        btn.classList.remove("gulp"); void btn.offsetWidth; btn.classList.add("gulp");
      }
      try { localStorage.setItem("ct-nav", closed ? "closed" : "open"); } catch (e) {}
    }
    let start = false;
    try { start = localStorage.getItem("ct-nav") === "closed"; } catch (e) {}
    // apply the saved state straight away (no animation, no flash), then
    // re-aim once fonts have settled
    set(start, false);
    requestAnimationFrame(function () { requestAnimationFrame(function () { nav.classList.remove("no-anim"); }); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (nav.classList.contains("collapsed")) aim(); });
    btn.addEventListener("click", function () { set(!nav.classList.contains("collapsed"), true); });
    window.addEventListener("resize", function () { if (nav.classList.contains("collapsed")) aim(); });
  }

  // ---------- pen / eraser tools ("click to use") ----------
  // The chosen tool follows the visitor from page to page (localStorage,
  // forgotten after two hours idle so a later visit starts fresh). The bottom dock and the drawing toolbar sit
  // above the ink, so navigation and "Done" always stay clickable.
  const TOOLS = ["pen", "eraser"];
  let tool = null;
  function setTool(next) {
    if (next === tool) next = null;
    tool = next;
    TOOLS.forEach(function (t) { document.body.classList.toggle("cursor-" + t, tool === t); });
    document.body.classList.toggle("drawing", !!tool);
    document.querySelectorAll("[data-cursor]").forEach(function (b) {
      const on = b.getAttribute("data-cursor") === tool;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", String(on));
    });
    try {
      tool ? localStorage.setItem("ct-tool", JSON.stringify({ tool: tool, t: Date.now() }))
           : localStorage.removeItem("ct-tool");
    } catch (e) {}
    document.dispatchEvent(new CustomEvent("ct-tool", { detail: tool }));
  }
  function setupCursors() {
    const root = document.documentElement;
    root.style.setProperty("--cursor-eraser", 'url("' + iconToDataURL("eraser", 2, { w: "#fff" }) + '") 2 20');
    root.style.setProperty("--cursor-pen", 'url("' + iconToDataURL("pen", 2, { w: "#fff" }) + '") 2 26');
    try { localStorage.removeItem("ct-cursor"); } catch (e) {}   // old setting
    document.querySelectorAll("[data-cursor]").forEach(function (btn) {
      btn.addEventListener("click", function (e) { e.stopPropagation(); setTool(btn.getAttribute("data-cursor")); });
    });
    let keep = null;
    try {
      const raw = JSON.parse(localStorage.getItem("ct-tool") || "null");
      if (raw && Date.now() - raw.t < 2 * 60 * 60 * 1000) keep = raw.tool;
      sessionStorage.removeItem("ct-tool");           // older builds kept it here
    } catch (e) {}
    if (TOOLS.indexOf(keep) !== -1) setTool(keep);
  }
  window.CTTool = { set: setTool, get: function () { return tool; } };

  // ---------- Abuja clock ----------
  function setupClock() {
    const els = document.querySelectorAll("[data-abuja-time]");
    if (!els.length) return;
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos" });
    const tick = function () { const t = fmt.format(new Date()); els.forEach(function (e) { e.textContent = t; }); };
    tick(); setInterval(tick, 15000);
  }

  window.PX = { ICONS: ICONS, pixelSVG: pixelSVG, iconToDataURL: iconToDataURL, renderIcons: renderIcons };

  document.addEventListener("DOMContentLoaded", function () {
    buildDock();
    renderIcons();
    setupCursors();
    setupClock();
  });
})();
