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
        '<a class="dock-home" href="/" aria-label="Home"><span data-px="folderOpen" data-scale="2"></span></a>' +
        '<div class="dock-links">' +
          links.map(function (l) {
            return '<a href="' + l[1] + '"' + (l[0] === page ? ' aria-current="page"' : "") + ">" + l[0] + "</a>";
          }).join("") +
        "</div>" +
      "</div>" +
      '<a class="dock-right" href="mailto:toriola333@gmail.com" aria-label="Email Charles">' +
        '<span class="tip">toriola333@gmail.com</span>' +
        '<span data-px="windowOut" data-scale="2"></span>' +
      "</a>";
    const fade = document.createElement("div");
    fade.className = "dock-fade";
    document.body.appendChild(fade);
    document.body.appendChild(nav);
  }

  // ---------- custom cursors ("click to use") ----------
  function setupCursors() {
    const root = document.documentElement;
    root.style.setProperty("--cursor-hand", 'url("' + iconToDataURL("hand", 2, { w: "#fff" }) + '") 10 2');
    root.style.setProperty("--cursor-pen", 'url("' + iconToDataURL("pen", 2, { w: "#fff" }) + '") 2 26');
    let saved = null;
    try { saved = localStorage.getItem("ct-cursor"); } catch (e) {}
    if (saved === "hand" || saved === "pen") document.body.classList.add("cursor-" + saved);
    document.querySelectorAll("[data-cursor]").forEach(function (btn) {
      const kind = btn.getAttribute("data-cursor");
      if (document.body.classList.contains("cursor-" + kind)) btn.classList.add("on");
      btn.addEventListener("click", function () {
        const on = document.body.classList.contains("cursor-" + kind);
        document.body.classList.remove("cursor-hand", "cursor-pen");
        document.querySelectorAll("[data-cursor]").forEach(function (b) { b.classList.remove("on"); });
        let next = null;
        if (!on) { document.body.classList.add("cursor-" + kind); btn.classList.add("on"); next = kind; }
        btn.setAttribute("aria-pressed", String(!on));
        try { next ? localStorage.setItem("ct-cursor", next) : localStorage.removeItem("ct-cursor"); } catch (e) {}
      });
    });
  }

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
