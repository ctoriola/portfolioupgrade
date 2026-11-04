/* Art: a desktop of draggable folders that open into windows. */
(function () {
  "use strict";
  const DRIVE = "https://drive.google.com/drive/folders/1dR0bheCgAM76rYGLXpDpPbsf07zTeTqo?usp=share_link";
  const FOLDERS = [
    { id: "posters", name: "Posters", pos: [0.06, 0.05], items: [
      ["/assets/img/posters/poster-1.webp", "Limitless", "Typographic poster"],
      ["/assets/img/posters/poster-2.webp", "Eid al-Maulud", "PrimeTEK Group"],
      ["/assets/img/posters/poster-3.webp", "Independence Day", "El-Panthomath Park"],
      ["/assets/img/posters/poster-4.webp", "Eid Mubarak", "Campaign poster"],
      ["/assets/img/posters/poster-5.webp", "Speak Up", "Granny Murray Schools"],
    ] },
    { id: "portraits", name: "Portraits", pos: [0.14, 0.05], items: [
      ["/assets/img/photos/charles-studio.webp", "Studio", "Portrait"],
      ["/assets/img/photos/charles-park.webp", "Abuja", "Portrait"],
      ["/assets/img/photos/charles-palms.webp", "Palms", "Portrait"],
    ] },
    { id: "sites", name: "Sites", pos: [0.22, 0.05], items: [
      ["/assets/img/sites/design-site.webp", "design.charlestoriola.com", "The canvas", "https://design.charlestoriola.com"],
      ["/assets/img/sites/dev-site.webp", "dev.charlestoriola.com", "The terminal", "https://dev.charlestoriola.com"],
    ] },
    { id: "brand", name: "Brand systems", pos: [0.30, 0.05], note:
      'Two group rebrands for PrimeTEK Group: logos, brochures, decks and ID cards across five companies. Brochure turnaround went from weeks to days. See the case studies on <a href="https://design.charlestoriola.com" target="_blank" rel="noopener">design.charlestoriola.com</a>.' },
    { id: "archive", name: "Archive", pos: [0.48, 0.24], note:
      'Event films, livestream clips, decks and the rest of the creative archive live in Google Drive. <a href="' + DRIVE + '" target="_blank" rel="noopener">Open the archive ↗</a>' },
  ];

  const desk = document.getElementById("desktop");
  const els = {};
  let z = 30;

  function placeScattered() {
    const W = window.innerWidth, H = window.innerHeight;
    const mobile = W < 760;
    FOLDERS.forEach(function (f, i) {
      const el = els[f.id];
      if (mobile) {
        el.style.left = (16 + (i % 3) * 100) + "px";
        el.style.top = (80 + Math.floor(i / 3) * 110 + (i === 4 ? 60 : 0)) + "px";
      } else {
        el.style.left = Math.round(f.pos[0] * W) + "px";
        el.style.top = Math.round(f.pos[1] * H + 40) + "px";
      }
    });
  }
  function organize() {
    const W = window.innerWidth;
    const step = W < 760 ? 100 : 118;
    FOLDERS.forEach(function (f, i) {
      els[f.id].style.left = (W < 760 ? 16 : 60) + i * step + "px";
      els[f.id].style.top = (W < 760 ? 80 : 46) + "px";
      if (W < 760 && i >= 3) { els[f.id].style.left = 16 + (i - 3) * step + "px"; els[f.id].style.top = "190px"; }
    });
    document.getElementById("hint").classList.add("gone");
  }

  // ---------- windows ----------
  function openWindow(f) {
    const existing = document.querySelector('.window[data-id="' + f.id + '"]');
    if (existing) { existing.style.zIndex = ++z; return; }
    const win = document.createElement("section");
    win.className = "window";
    win.dataset.id = f.id;
    win.setAttribute("role", "dialog");
    win.setAttribute("aria-label", f.name);
    const count = f.items ? f.items.length + " items" : "";
    let body = "";
    if (f.note) body += '<p class="note">' + f.note + "</p>";
    (f.items || []).forEach(function (it, i) {
      body += '<figure><button type="button" data-i="' + i + '" aria-label="View ' + it[1] + '"><img src="' + it[0] + '" alt="' + it[1] + '" loading="lazy"></button>' +
        "<figcaption>" + (it[3] ? '<a class="link" href="' + it[3] + '" target="_blank" rel="noopener">' + it[1] + "</a>" : it[1]) + "<span>" + it[2] + "</span></figcaption></figure>";
    });
    win.innerHTML = '<div class="window-bar"><button class="close" type="button" aria-label="Close ' + f.name + '"></button><span data-px="folderOpen" data-scale="1"></span>' + f.name + '<span class="count">' + count + '</span></div><div class="window-body">' + body + "</div>";
    document.body.appendChild(win);
    window.PX.renderIcons(win);
    const W = window.innerWidth, H = window.innerHeight;
    const n = document.querySelectorAll(".window").length - 1;
    win.style.left = Math.max(16, (W - win.offsetWidth) / 2 + n * 24) + "px";
    win.style.top = Math.max(70, (H - win.offsetHeight) / 2 - 30 + n * 24) + "px";
    win.style.zIndex = ++z;
    win.addEventListener("pointerdown", function () { win.style.zIndex = ++z; });
    win.querySelector(".close").addEventListener("click", function () { win.remove(); });
    win.querySelectorAll("figure button").forEach(function (b) {
      b.addEventListener("click", function () { lightbox(f.items[+b.dataset.i]); });
    });
    dragWindow(win, win.querySelector(".window-bar"));
    win.querySelector(".close").focus();
  }

  function dragWindow(win, handle) {
    handle.addEventListener("pointerdown", function (e) {
      if (e.target.closest("button") || window.innerWidth < 760) return;
      const sx = e.clientX - win.offsetLeft, sy = e.clientY - win.offsetTop;
      handle.setPointerCapture(e.pointerId);
      function move(ev) { win.style.left = ev.clientX - sx + "px"; win.style.top = Math.max(0, ev.clientY - sy) + "px"; }
      function up() { handle.removeEventListener("pointermove", move); handle.removeEventListener("pointerup", up); }
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", up);
    });
  }

  function lightbox(it) {
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-label", it[1]);
    lb.innerHTML = '<div><img src="' + it[0] + '" alt="' + it[1] + '"><p>' + it[1] + " · " + it[2] + " — click anywhere to close</p></div>";
    lb.addEventListener("click", function () { lb.remove(); });
    document.body.appendChild(lb);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    const lb = document.querySelector(".lightbox");
    if (lb) { lb.remove(); return; }
    const wins = Array.prototype.slice.call(document.querySelectorAll(".window"));
    if (wins.length) wins.sort(function (a, b) { return +b.style.zIndex - +a.style.zIndex; })[0].remove();
  });

  // ---------- desktop icons ----------
  FOLDERS.forEach(function (f) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "desk-item";
    el.setAttribute("role", "listitem");
    el.setAttribute("aria-label", "Open " + f.name);
    el.innerHTML = '<span data-px="folder" data-scale="2"></span><span>' + f.name + "</span>";
    desk.appendChild(el);
    els[f.id] = el;

    let sx = 0, sy = 0, ox = 0, oy = 0, moved = false, down = false;
    el.addEventListener("pointerdown", function (e) {
      down = true; moved = false;
      sx = e.clientX; sy = e.clientY; ox = el.offsetLeft; oy = el.offsetTop;
      el.setPointerCapture(e.pointerId);
      document.querySelectorAll(".desk-item.selected").forEach(function (d) { d.classList.remove("selected"); });
      el.classList.add("selected");
    });
    el.addEventListener("pointermove", function (e) {
      if (!down) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < 5) return;
      moved = true;
      el.classList.add("dragging");
      el.style.left = Math.min(window.innerWidth - 100, Math.max(0, ox + dx)) + "px";
      el.style.top = Math.min(window.innerHeight - 160, Math.max(0, oy + dy)) + "px";
    });
    el.addEventListener("pointerup", function () {
      down = false;
      el.classList.remove("dragging");
      if (!moved) openWindow(f);
    });
    el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openWindow(f); } });
  });

  document.getElementById("organize").addEventListener("click", organize);
  document.addEventListener("DOMContentLoaded", placeScattered);
  if (document.readyState !== "loading") placeScattered();
})();
