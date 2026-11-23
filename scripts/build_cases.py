"""Generate the static case study pages in /work from one content table.
Edit the CASES table, then run from the repo root: python3 scripts/build_cases.py"""
import html, os, re, sys

ROOT = sys.argv[1] if len(sys.argv) > 1 else "."
V = "202611231200"
DRAW_V = "202611061439"
EXT = '<span data-px="ext" data-scale="1.2" data-ink="#2f5bff"></span>'

index = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()


def scene(name):
    """Lift a card scene's markup straight from the home page."""
    m = re.search(r'(<div class="scene scene-[a-z]+" data-scene="%s">.*?)\n      </a>' % name, index, re.S)
    assert m, name
    return m.group(1).strip()


def ext(url, label=None):
    label = label or re.sub(r"^https?://(www\.)?", "", url).rstrip("/")
    return '<a href="%s" target="_blank" rel="noopener">%s%s</a>' % (url, html.escape(label), EXT)


CASES = [
    # ---------------------------------------------------------------- brand
    dict(
        slug="fipco", kind="brand", name="FIPCO", short="FIPCO",
        title="FIPCO brand overhaul",
        kicker="Brand overhaul",
        lede='A complete brand overhaul for <span class="hl">First Interstate Petrochemicals</span>: an industrial, type-led identity that reads as big as the company it represents.',
        desc="Case study: a complete brand overhaul for First Interstate Petrochemicals Ltd. (FIPCO), by Charles Toriola.",
        hero=dict(img="fipco-1.webp", alt="FIPCO website hero: the FIPCO wordmark with an offshore oil rig breaking through the letters"),
        facts=[("Client", "First Interstate Petrochemicals Ltd."),
               ("Sector", "Petrochemicals, energy logistics, oil &amp; gas"),
               ("Scope", "Brand identity, visual system, website"),
               ("Live", ext("https://fipcoltd.com"))],
        sections=[
            ("The brief", """<p>FIPCO works across <span class="hl">petrochemical supply, energy logistics, industrial consulting and oil exploration</span>, from offices in Lagos, Abuja and Akwa Ibom. One brand had to speak to manufacturers, energy partners and government stakeholders at the same time.</p>
<p>It needed to feel like heavy industry: confident, solid and serious, not another corporate template with a stock photo of a handshake.</p>"""),
            ("The system", """<p>Type does the heavy lifting. The <span class="hl">FIPCO wordmark runs edge to edge</span> with an offshore rig breaking through the letters, so the name and the work arrive together.</p>
<p>Headlines are uppercase and split into two tones, a white statement and a grey follow-through: <span class="hl">“Energy solutions for a nation / on the move.”</span> A charcoal base, one signal red reserved for action, numbered sections (01 / About us) and a running ticker of service lines keep long pages in order.</p>"""),
            ("Palette &amp; type", "PALETTE"),
            ("Voice", """<blockquote>Energy. Industry. Progress.</blockquote>
<p>Short, declarative lines throughout: <span class="hl">“No shortcuts. Just commitment.”</span> and <span class="hl">“Power your next move.”</span> The three values, reliability, safety and partnership, each get one sentence and no padding.</p>"""),
            ("Where it lives", """<p>The website is where the whole system comes together: hero, services, standards, leadership, offices, FAQ, and a full-bleed red call to action to close.</p>"""),
        ],
        palette=[("Charcoal", "#1f1f1f"), ("Signal red", "#e51e31"), ("White", "#ffffff"), ("Mid grey", "#a5a5a5")],
        fonts=["Notch · display", "Grotesk · text"],
        gallery=[("fipco-2.webp", "“Reliable. Safe. Forward.”: the commitment card in signal red", False),
                 ("fipco-3.webp", "Services as a numbered accordion, one red headline at a time", False),
                 ("fipco-4.webp", "“No shortcuts. Just commitment.”: values and mission", False),
                 ("fipco-5.webp", "Three offices, one grid: Lagos, Abuja, Akwa Ibom", False),
                 ("fipco-6.webp", "The closing call to action: “Power your next move.”", True)],
    ),
    dict(
        slug="primetek-ssc", kind="brand", name="PrimeTEK SSC", short="PrimeTEK SSC",
        title="PrimeTEK SSC brand overhaul",
        kicker="Brand overhaul",
        lede='A complete brand overhaul for <span class="hl">PrimeTEK Safety &amp; Security Consultants</span>, a Nigerian defence consultancy: precise, discreet and mission-focused.',
        desc="Case study: a complete brand overhaul for PrimeTEK Safety & Security Consultants, by Charles Toriola.",
        hero=dict(img="primetekssc-1.webp", alt="PrimeTEK SSC website hero: outlined orange type reading Safety & Security Consultants beside a defence montage"),
        facts=[("Client", "PrimeTEK Safety &amp; Security Consultants"),
               ("Sector", "Defence and security consultancy"),
               ("Scope", "Brand identity, visual system, website"),
               ("Live", ext("https://primetekssc.com"))],
        sections=[
            ("The brief", """<p>PrimeTEK SSC works with national agencies and critical infrastructure on <span class="hl">military solutions, intelligence, cyber defence and risk</span>. The audience is senior, careful and short on time.</p>
<p>The brand had to signal capability and discipline in seconds, without falling back on the usual padlocks and glowing circuit boards.</p>"""),
            ("The system", """<p>A near-black canvas with <span class="hl">one safety-orange accent</span>. “Safety &amp; Security Consultants.” is set in outlined type, with a rotating <span class="hl">“Since 2012 · Defence Solutions”</span> seal and the years of experience front and centre.</p>
<p>Section labels sit in braces ({Core capabilities}, {Our standards}), and the standards panel reads like a mission console: <span class="hl">“PTK‑SSC // Operational standards · All systems nominal.”</span> A giant PRIMETEK wordmark anchors the footer.</p>"""),
            ("Palette &amp; type", "PALETTE"),
            ("Voice", """<blockquote>Mission-aligned solutions for complex threat environments.</blockquote>
<p>Measured and exact. Claims are backed by structure rather than adjectives: <span class="hl">“Uncompromising on every front. Every PrimeTEK engagement is held to the same bar, without exception.”</span></p>"""),
        ],
        palette=[("Black", "#0e0e0e"), ("Safety orange", "#ef5b00"), ("White", "#ffffff"), ("Steel", "#454545")],
        fonts=["Onest · display", "Inter Tight · text"],
        gallery=[("primetekssc-2.webp", "About: the years of defence expertise as one bold number", False),
                 ("primetekssc-3.webp", "Operational portfolio with a vertical project index", False),
                 ("primetekssc-4.webp", "Footer: contact up top, the PRIMETEK wordmark underneath", True)],
    ),
    dict(
        slug="hengtai-raytech", kind="brand", name="HengTai Raytech", short="HengTai Raytech",
        title="HengTai Raytech brand overhaul",
        kicker="Brand overhaul",
        lede='A complete brand overhaul for <span class="hl">HengTai Raytech</span>: a new identity and visual system, carried through to the website.',
        desc="Case study: a complete brand overhaul for HengTai Raytech, by Charles Toriola.",
        hero=dict(placeholder=True),
        facts=[("Client", "HengTai Raytech"),
               ("Scope", "Brand identity, visual system, website"),
               ("Role", "Creative lead"),
               ("Live", ext("https://hengtairaytech.com"))],
        sections=[
            ("The project", """<p>A full brand overhaul: identity, visual language and the website that carries them.</p>
<p>The full write-up for this one is on its way. Until then, <a class="link" href="https://hengtairaytech.com" target="_blank" rel="noopener">the live site%s</a> shows the new system in use.</p>""" % EXT),
        ],
    ),
    # ---------------------------------------------------------------- software
    dict(
        slug="pitchperfectai", kind="dev", name="PitchPerfectAI", short="PitchPerfectAI",
        title="PitchPerfectAI",
        kicker="Software · solo build",
        lede='Feed it a brief, documents or a GitHub repo; get back a <span class="hl">13-slide pitch deck</span>. Built solo, end to end.',
        desc="Case study: PitchPerfectAI turns a brief, documents or a GitHub repo into a 13-slide pitch deck. Built solo by Charles Toriola.",
        hero=dict(scene="ppa"),
        facts=[("Role", "Solo build, end to end"),
               ("Stack", "Python · Flask · Gemini"),
               ("Output", "13-slide pitch decks"),
               ("Project", ext("https://dev.charlestoriola.com/pitchperfectai.html", "dev.charlestoriola.com"))],
        sections=[
            ("The problem", """<p>Founders and teams usually have the material, a brief, a few documents, the code itself, but not the deck. Turning that into a pitch is days of work that has little to do with building the product.</p>"""),
            ("What it does", """<p>Give it a written brief, upload documents or point it at a GitHub repo. It returns a deck in the order investors expect:</p>
<ul><li>The problem, the solution and the market size</li><li>Product, how it works and traction</li><li>Business model, competition and go-to-market</li><li>Team, financials and the ask</li></ul>"""),
            ("How it's built", """<p>A <span class="hl">Flask</span> backend reads the inputs and has <span class="hl">Gemini</span> draft each slide. A deck builder then splits the content into slide-sized sections, the same approach I later reused in <a class="link" href="/work/pdf-to-slides">PDF → Slides</a>.</p>"""),
            ("Results", "STATS"),
        ],
        stats=[("40+", "decks generated so far"), ("13", "slides per deck"), ("1", "person, end to end")],
    ),
    dict(
        slug="pdf-to-slides", kind="dev", name="PDF → Slides", short="PDF → Slides",
        title="PDF to Slides",
        kicker="Software · open source",
        lede='A Flask app that turns <span class="hl">any PDF into an editable PowerPoint deck</span>, from a two-page report to a 2,000-page textbook, with every figure kept on the slide it belongs to.',
        desc="Case study: PDF to Slides turns reports, brochures and textbooks into PowerPoint decks. By Charles Toriola.",
        hero=dict(scene="pdf"),
        facts=[("Stack", "Python · Flask · PyMuPDF4LLM · python-pptx"),
               ("AI", "Groq free tier, any OpenAI-compatible model"),
               ("Hosting", "Vercel + Backblaze B2"),
               ("Code", ext("https://github.com/ctoriola/pdf.pptx", "github.com/ctoriola/pdf.pptx"))],
        sections=[
            ("The problem", """<p>Turning a PDF into a presentation is usually copy, paste, resize, repeat. Converters that exist tend to dump each page onto a slide, or lose the structure: chapter titles, numbered steps, tables and the pictures that go with them.</p>"""),
            ("How it works", """<p>The PDF is converted to Markdown with PyMuPDF4LLM, then a second pass reads the PDF's own font sizes to <span class="hl">recover chapter titles, the document title and heading levels</span> the converter gets wrong. Contents, copyright and cover pages are dropped; icons, rules and duplicate images are filtered out.</p>
<p>Each section is then recognised for what it is, a product with a photo and a price, a numbered process, a spec sheet, a table, and given a matching layout: product slide, process slide, stat cards, text and image, gallery. Long sections continue on “(cont.)” slides and chapters get divider slides.</p>"""),
            ("AI that arranges, not invents", """<p>Three slide types: <span class="hl">Standard</span> keeps the full text with no AI at all. <span class="hl">Condensed</span> and <span class="hl">Detailed</span> use an LLM to summarise or expand, with prompts that forbid adding facts, numbers or quotes that aren't in the source. Tables and images are taken out before the call and put back after, so data stays exact.</p>
<p>An optional planner shows the model only an outline and lets it rearrange sections. Every suggestion is checked against the real blocks, and the rule-based plan wins if the model is missing, rate-limited or wrong.</p>"""),
            ("Textbooks on serverless", """<p>Vercel functions stop at 300 seconds and 4.5 MB. So uploads go straight to a private B2 bucket, a textbook is read in 300-page parts four at a time, and the plan travels back to the browser so the server never re-reads the PDF. You tick the chapters you want; only those are built. Scanned pages are OCR'd first.</p>"""),
            ("Numbers", "STATS"),
        ],
        stats=[("3,000", "pages per book, read in parts"), ("&lt;1 s", "to build one chapter of a 500-page book"), ("200 MB", "uploads via Backblaze B2"), ("4", "deck themes")],
    ),
    dict(
        slug="vatclear", kind="dev", name="VATClear", short="VATClear",
        title="VATClear",
        kicker="Software · live app",
        lede='Invoices, expenses and VAT in one place for <span class="hl">Nigerian SMEs</span>. Know what you owe, when it\'s due, and what to do next.',
        desc="Case study: VATClear, invoices, expenses and VAT for Nigerian SMEs. By Charles Toriola.",
        hero=dict(scene="vat"),
        facts=[("Stack", "React · TypeScript · Firebase"),
               ("For", "Nigerian small businesses"),
               ("Status", "Free during early access"),
               ("Live", ext("https://thetaxapp.vercel.app"))],
        sections=[
            ("The problem", """<p>Small businesses track invoices in one place, expenses in another and VAT in a spreadsheet, and often only find out what they owe close to the deadline.</p>"""),
            ("Built around Nigerian rules", """<p>Not a generic accounting app with a currency switch. It's built on the rules SMEs actually file against:</p>
<ul><li><span class="hl">7.5% VAT</span>, worked out as each sale and cost is recorded, with VAT-free items flagged</li><li>Returns due on <span class="hl">the 21st</span>, with a countdown to the next one</li><li><span class="hl">TINs on invoices</span>, part payments, and expenses approved in one tap</li><li>Naira first, Lagos time</li></ul>"""),
            ("An assistant that doesn't make things up", """<p>Smart insights flag overdue invoices and unfiled returns, and an AI assistant explains the figures <span class="hl">without inventing any</span>. Monthly VAT reports export to CSV for the return itself.</p>
<p>The app is upfront that its figures are estimates to plan with, not tax advice.</p>"""),
        ],
        gallery=[("vatclear-1.webp", "Landing page: “See your VAT before the taxman does”", True),
                 ("vatclear-2.webp", "Features: spending, real-time VAT, invoices and AI", False),
                 ("vatclear-3.webp", "Three steps from sign-up to filing on time", False)],
    ),
    dict(
        slug="lyrics-to-easyworship", kind="dev", name="Lyrics → EasyWorship", short="Lyrics → EasyWorship",
        title="Lyrics to EasyWorship",
        kicker="Software · live app",
        lede='Drop in the week\'s lyrics document or search for a song by a line you remember. AI builds a schedule that <span class="hl">opens straight in EasyWorship 7</span>.',
        desc="Case study: Lyrics to EasyWorship turns a lyrics document into an EasyWorship 7 schedule. By Charles Toriola.",
        hero=dict(scene="ew"),
        facts=[("Stack", "JavaScript · Groq · Gemini"),
               ("Output", "EasyWorship 7 schedules (.ewsx)"),
               ("Sources", "Word .docx, LRCLIB, the web"),
               ("Live", ext("https://ewschedule.vercel.app"))],
        sections=[
            ("The problem", """<p>Every week a church media team gets the lyrics as a Word document and rebuilds them, slide by slide, in EasyWorship. It's slow, it's late on a Saturday, and one wrong paste shows up on the big screen.</p>"""),
            ("What it does", """<ul><li>Upload the week's <span class="hl">.docx</span>, search songs by title or a remembered line, or both</li><li>AI sorts any layout into songs and title slides and labels verses, choruses and bridges</li><li>Preview every slide: two lines per slide by default, long lines on their own, translations kept with their line</li><li>Download a real <span class="hl">.ewsx</span> and open it with File → Open Schedule</li></ul>"""),
            ("The lyrics stay yours", """<p>The AI only decides where songs start and end, the titles, and the labels. <span class="hl">It never rewrites the words.</span> Everything except the sorting and song search runs in the browser, and the app reminds teams to check their licence (e.g. CCLI) for the songs they project.</p>"""),
        ],
        gallery=[("lyrics-to-easyworship-1.webp", "Upload a lyrics document or search for a song", True),
                 ("lyrics-to-easyworship-2.webp", "“Built for Sunday mornings”: features", False),
                 ("lyrics-to-easyworship-3.webp", "How it works, in three steps", False)],
    ),
    dict(
        slug="ncrypt", kind="dev", name="NCrypt", short="NCrypt",
        title="NCrypt",
        kicker="Software",
        lede='File sharing where files are <span class="hl">AES-GCM encrypted in your browser</span> before they ever touch a server.',
        desc="Case study: NCrypt, file sharing with in-browser AES-GCM encryption. By Charles Toriola.",
        hero=dict(scene="ncrypt"),
        facts=[("Stack", "React · Web Crypto API"),
               ("Cipher", "AES-GCM, 256-bit"),
               ("Where", "In your browser"),
               ("Project", ext("https://dev.charlestoriola.com/ncrypt.html", "dev.charlestoriola.com"))],
        sections=[
            ("The idea", """<p>Most file sharing asks you to trust the server with your files. NCrypt doesn't: contracts, payroll sheets and brand assets are <span class="hl">encrypted on your own device first</span>, so what gets uploaded is ciphertext.</p>"""),
            ("How it's built", """<p>A React front end on the browser's built-in <span class="hl">Web Crypto API</span>, using AES-GCM with 256-bit keys. No crypto libraries to ship or trust, and the plaintext never leaves the page.</p>"""),
        ],
    ),
    dict(
        slug="school-management", kind="dev", name="School management", short="School management",
        title="School management system",
        kicker="Software · Wepluz",
        lede='A school management system running in <span class="hl">100+ schools</span>, some with over 500 students. My first taste of software people depend on every day.',
        desc="Case study: a PHP school management system running in 100+ schools, built at Wepluz. By Charles Toriola.",
        hero=dict(scene="school"),
        facts=[("Company", "Wepluz"),
               ("Role", "PHP developer"),
               ("Stack", "PHP · MySQL"),
               ("More", ext("https://dev.charlestoriola.com/work.html", "dev.charlestoriola.com"))],
        sections=[
            ("The work", """<p>School admin software where staff manage students, classes and results. It's the kind of system that has to be right every morning, because a whole school opens it to start the day.</p>"""),
            ("What it taught me", """<p>Building for schools meant building for real users with real deadlines: result days, new terms, a full intake. It's where I learned that <span class="hl">reliability is a feature</span>, and it's the reason I still build end to end.</p>"""),
            ("Scale", "STATS"),
        ],
        stats=[("100+", "schools running it"), ("500+", "students in the largest"), ("Daily", "used every school day")],
    ),
]

ORDER = [c["slug"] for c in CASES]
BY = {c["slug"]: c for c in CASES}


def hero_html(c):
    h = c["hero"]
    if h.get("scene"):
        return '<div class="case-hero">%s</div>' % scene(h["scene"]).replace("\n          ", "\n      ")
    if h.get("placeholder"):
        return '<div class="case-hero placeholder"><div><b>%s</b><span>Brand overhaul · screenshots coming soon</span></div></div>' % c["name"]
    return '<figure class="case-hero" style="margin:0"><img src="/assets/img/cases/%s" width="1200" height="750" alt="%s"></figure>' % (h["img"], html.escape(h["alt"]))


def section_body(c, body):
    if body == "PALETTE":
        sw = "".join('<div class="swatch"><i style="--c:%s"></i><span>%s<code>%s</code></span></div>' % (hx, n, hx) for n, hx in c["palette"])
        ty = "".join("<span>%s</span>" % f for f in c["fonts"])
        return '<div class="swatches">%s</div>\n<div class="type-specimen">%s</div>' % (sw, ty)
    if body == "STATS":
        return '<div class="case-stats">%s</div>' % "".join("<div><b>%s</b><span>%s</span></div>" % s for s in c["stats"])
    return body


def page(c):
    i = ORDER.index(c["slug"])
    nxt = BY[ORDER[(i + 1) % len(ORDER)]]
    facts = "\n".join('      <div><dt>%s</dt><dd>%s</dd></div>' % f for f in c["facts"])
    secs = []
    for k, (h2, body) in enumerate(c["sections"]):
        secs.append('    <section class="case-sec">\n      <h2><small>%02d</small>%s</h2>\n      <div>\n%s\n      </div>\n    </section>' % (k + 1, h2, section_body(c, body)))
    gal = ""
    if c.get("gallery"):
        figs = "\n".join('      <figure%s><img src="/assets/img/cases/%s" width="1200" height="750" alt="%s" loading="lazy"><figcaption>%s</figcaption></figure>' % (
            ' class="full"' if full else "", img, html.escape(cap.replace("“", "").replace("”", "")), html.escape(cap)) for img, cap, full in c["gallery"])
        gal = '\n    <div class="case-gallery">\n%s\n    </div>' % figs
    icon = "peace" if c["kind"] == "brand" else "windowOut"
    scale = "1.2" if c["kind"] == "brand" else "1"
    scenes_js = '\n<script src="/assets/js/scenes.js?v=%s"></script>' % V if c["hero"].get("scene") else ""
    title = "%s — Charles Toriola" % c["title"]
    return """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%(title)s</title>
<meta name="description" content="%(desc)s">
<meta name="theme-color" content="#f1f1f1">
<link rel="canonical" href="https://charlestoriola.com/work/%(slug)s">
<link rel="icon" href="/favicon.ico" sizes="any">
<meta property="og:type" content="article">
<meta property="og:title" content="%(ogtitle)s">
<meta property="og:description" content="%(desc)s">
<meta property="og:image" content="%(ogimg)s">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Silkscreen&family=Young+Serif&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/style.css?v=%(v)s">
</head>
<body data-page="fun" class="case-page">

<main class="case-wrap">
  <a class="case-back" href="/fun"><span data-px="arrowLeft" data-scale="1.6"></span>back to fun</a>

  <header class="case-head">
    <div>
      <p class="case-kicker"><span data-px="%(icon)s" data-scale="%(scale)s"></span>Case study · %(kicker)s</p>
      <h1>%(name)s</h1>
    </div>
    <p class="case-lede">%(lede)s</p>
  </header>

  %(hero)s

  <dl class="case-facts">
%(facts)s
  </dl>

  <div class="case-body">
%(secs)s%(gal)s
  </div>

  <nav class="case-next" aria-label="Next case study">
    <div><small>Next case study</small><a class="next" href="/work/%(nslug)s">%(nname)s<span data-px="arrowRight" data-scale="2.4"></span></a></div>
    <a class="mail link" href="mailto:toriola333@gmail.com">toriola333@gmail.com<span data-px="ext" data-scale="1.4" data-ink="#2f5bff"></span></a>
  </nav>
</main>

<script src="/assets/js/common.js?v=%(v)s"></script>
<script src="/assets/js/draw.js?v=%(dv)s"></script>%(scenes_js)s
</body>
</html>
""" % dict(title=html.escape(title, quote=False).replace("&amp;", "&amp;"), desc=html.escape(c["desc"]), slug=c["slug"],
           ogtitle=html.escape(c["title"] + " · Charles Toriola"),
           ogimg="https://charlestoriola.com/assets/img/cases/%s" % c["hero"]["img"] if c["hero"].get("img") else "https://charlestoriola.com/assets/img/og.jpg",
           v=V, dv=DRAW_V, icon=icon, scale=scale, kicker=c["kicker"], name=c["name"], lede=c["lede"],
           hero=hero_html(c), facts=facts, secs="\n\n".join(secs), gal=gal,
           nslug=nxt["slug"], nname=nxt["name"], scenes_js=scenes_js)


os.makedirs(os.path.join(ROOT, "work"), exist_ok=True)
for c in CASES:
    with open(os.path.join(ROOT, "work", c["slug"] + ".html"), "w", encoding="utf-8") as f:
        f.write(page(c))
    print("work/%s.html" % c["slug"])
