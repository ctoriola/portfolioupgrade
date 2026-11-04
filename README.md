# charlestoriola.com — portfolio

Static, dependency-free portfolio for Charles Toriola (full stack developer and creative lead, Abuja).

Pages

- `/` (work): cursor-swarm intro, hero with "click to use" pixel cursors, animated project cards
- `/fun`: posters, brand systems, event films, live production on horizontal shelves
- `/art`: a desktop of draggable folders that open into windows with a lightbox
- `/about`: polaroids, journey, contact details and a live Abuja clock

Run locally

```bash
python3 -m http.server 8080
```

Deploy: push to Vercel (static, `vercel.json` enables clean URLs like `/fun`).

Structure

- `assets/css/style.css`: all styles
- `assets/js/common.js`: pixel-art icon renderer, bottom dock, pen/eraser tool state, clock
- `assets/js/draw.js`: pixel ink layers (draw, erase, save)
- `assets/js/stickers.js`: draggable sticker photos on About

When you change a CSS or JS file, bump the `?v=` number on its `<link>`/`<script>` tags so browsers fetch the new copy.
- `assets/js/home.js`: intro animation and project card scenes
- `assets/js/art.js`: desktop folders, windows, lightbox
- `assets/img/`: portraits, posters, site screenshots, blue duotone hero cutout
