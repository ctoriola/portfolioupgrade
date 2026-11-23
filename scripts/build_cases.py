"""Generate the static case study pages in /work from one content table.
Edit the CASES table, then run from the repo root: python3 scripts/build_cases.py"""
import html, os, re, sys

ROOT = sys.argv[1] if len(sys.argv) > 1 else "."
V = "202611231700"
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
        gallery=[("primetekssc-2.webp", "About: 14 years of defence expertise as one bold number", False),
                 ("primetekssc-3.webp", "Operational portfolio with a vertical project index", False),
                 ("primetekssc-4.webp", "Footer: contact up top, the PRIMETEK wordmark underneath", True)],
    ),
    dict(
        slug="hengtai-raytech", kind="brand", name="Hengtai Raytech", short="Hengtai Raytech",
        title="Hengtai Raytech brand overhaul",
        kicker="Brand overhaul",
        lede='A complete brand overhaul for <span class="hl">Hengtai Raytech</span>, a Nigerian defence technology maker: one blue, orbital visual system for a company moving from supplier to manufacturer.',
        desc="Case study: a complete brand overhaul for Hengtai Raytech, a Nigerian defence technology company, by Charles Toriola.",
        hero=dict(img="hengtai-raytech-1.webp", alt="Hengtai Raytech website hero: Capability, owned. over a blue duotone Earth with a satellite in orbit"),
        facts=[("Client", "Hengtai Raytech"),
               ("Sector", "Defence technology: SAR surveillance, satellites, robotics"),
               ("Scope", "Brand identity, visual system, website"),
               ("Live", ext("https://hengtairaytech.com"))],
        sections=[
            ("The brief", """<p>Hengtai Raytech began as an equipment supplier and has <span class="hl">repositioned as an original manufacturer</span>, building inside Nigeria's defence industrial ecosystem. It makes MiniSAR radar payloads for drones, the SmartSat-X satellite payload, and the X30 and M20 ground robots.</p>
<p>The brand had to carry that shift, from supplier to sovereign manufacturer: technology designed, built and kept in Nigeria.</p>"""),
            ("The system", """<p>One colour world. Every image, from Earth seen from orbit to ground station antennas, SAR imagery and the robots themselves, is <span class="hl">washed in a single blue duotone</span>, so space, air and ground read as one capability.</p>
<p>A tight grotesk sets short, heavy headlines, and the whole site runs on one three-part idea: <span class="hl">See. Know. Act.</span> Specs are given the weight of headlines (0.1 m imaging, 30 km+ links, IP67), and a giant Hengtai Raytech wordmark closes every page.</p>"""),
            ("Palette &amp; type", "PALETTE"),
            ("Voice", """<blockquote>Capability, owned.</blockquote>
<p>Short and certain, built around ownership: <span class="hl">“Build here. Keep it here.”</span>, <span class="hl">“Built for the terrain. Built to stay.”</span> and <span class="hl">“Intelligence that survives the weather.”</span></p>"""),
        ],
        palette=[("Ink navy", "#051230"), ("Signal blue", "#0368c8"), ("Sky", "#4ea3f0"), ("Mist", "#b7cce4"), ("Blush", "#eef4fb")],
        fonts=["Stack Sans Notch · display", "Outfit · text"],
        gallery=[("hengtai-raytech-2.webp", "About: “Build here. Keep it here.”", False),
                 ("hengtai-raytech-3.webp", "Technology: “See. Know. Act.” over a duotone video", False),
                 ("hengtai-raytech-4.webp", "The See / Know / Act framework that structures the site", False),
                 ("hengtai-raytech-5.webp", "Specs set as headlines: 0.1 m, 30 km+, -20°, IP67", False),
                 ("hengtai-raytech-6.webp", "“One mission. Four precise steps.” from orbit to ground", False),
                 ("hengtai-raytech-7.webp", "Footer: the Hengtai Raytech wordmark at full width", False)],
    ),
    # ---------------------------------------------------------------- software
    dict(
        slug="pitchperfectai", kind="dev", name="PitchPerfectAI", short="PitchPerfectAI",
        title="PitchPerfectAI",
        kicker="Software · solo build",
        lede='From one line of an idea, or a GitHub repo, to an <span class="hl">investor-ready pitch deck</span> in minutes. Built solo, end to end.',
        desc="Case study: PitchPerfectAI turns an idea or a GitHub repo into an investor pitch deck, with an AI coach. Built solo by Charles Toriola.",
        hero=dict(scene="ppa"),
        facts=[("Role", "Solo build, end to end"),
               ("Stack", "Python · Flask · Gemini"),
               ("Output", "Styled PowerPoint decks, 4, 6 or 10 slides"),
               ("Live", ext("https://getpitchperfect.vercel.app"))],
        sections=[
            ("The problem", """<ul><li>Great products get lost in weak, unstructured pitches.</li><li>Writing and designing a deck takes days founders don't have.</li><li>Technical teams struggle to turn code into a business story.</li></ul>"""),
            ("What it does", """<p>Describe your startup in a sentence or two, or paste a <span class="hl">GitHub repository</span>, public or private. It reads the README, topics and languages, and turns those code signals into business value. With no repo, it builds the story from your description plus market context from a quick web search.</p>
<p>You choose the length, <span class="hl">4, 6 or 10 slides</span>, and it writes one slide per section, grounding product claims in what you gave it. Then you download a styled PowerPoint.</p>"""),
            ("Pitchy, the coach", """<p>Pitchy scores every section out of five, tells you what investors will find weak, starting with the weakest, and <span class="hl">rewrites it with one click</span>. Keep the change or undo it.</p>"""),
            ("How it's built", """<p>A <span class="hl">Flask</span> backend with <span class="hl">Gemini</span> drafting each slide. The deck builder splits content into slide-sized sections, the same approach I later reused in <a class="link" href="/work/pdf-to-slides">PDF → Slides</a>.</p>"""),
            ("Results", "STATS"),
        ],
        stats=[("40+", "decks generated so far"), ("4 · 6 · 10", "slides, your choice"), ("1", "person, end to end")],
        gallery=[("pitchperfectai-1.webp", "Landing page: an idea or a repo in, a deck out, with Pitchy alongside", True),
                 ("pitchperfectai-2.webp", "The problem, the solution and three steps", False),
                 ("pitchperfectai-3.webp", "Key features: GitHub pitches, exact deck length, PowerPoint export", False),
                 ("pitchperfectai-4.webp", "“Ready to pitch?”: the closing call to action", True)],
    ),
    dict(
        slug="pdf-to-slides", kind="dev", name="PDF → Slides", short="PDF → Slides",
        title="PDF to Slides",
        kicker="Software · live app",
        lede='Upload a PDF, get a <span class="hl">ready-to-present PowerPoint deck</span>, from a two-page report to a 2,000-page textbook, with every figure kept on the slide it belongs to.',
        desc="Case study: PDF to Slides turns reports, brochures and textbooks into PowerPoint decks. By Charles Toriola.",
        hero=dict(scene="pdf"),
        facts=[("Stack", "Python · Flask · PyMuPDF4LLM · python-pptx"),
               ("AI", "Groq free tier, any OpenAI-compatible model"),
               ("Hosting", "Vercel + Backblaze B2"),
               ("Live", ext("https://pdf-pptx-olive.vercel.app") + '<br>' + ext("https://github.com/ctoriola/pdf.pptx", "Source on GitHub"))],
        sections=[
            ("The problem", """<p>Turning a PDF into a presentation is usually copy, paste, resize, repeat. Converters that exist tend to dump each page onto a slide, or lose the structure: chapter titles, numbered steps, tables and the pictures that go with them.</p>"""),
            ("How it works", """<p>It <span class="hl">reads the document first</span>. A brochure becomes product slides with prices and specs; a handbook becomes chapters, steps and quizzes; a report keeps its tables.</p>
<p>Under the hood the PDF becomes Markdown with PyMuPDF4LLM, then a second pass reads the PDF's own font sizes to recover chapter titles and heading levels the converter gets wrong. Each section is recognised for what it is, a product, a price, a process, a spec sheet, and given a matching layout. Photos, charts and diagrams land on the slide they belong to.</p>"""),
            ("AI that arranges, not invents", """<p>Three slide types: <span class="hl">Standard</span> keeps the full text with no AI at all. <span class="hl">Condensed</span> and <span class="hl">Detailed</span> use an LLM to summarise or expand, with prompts that forbid adding facts, numbers or quotes that aren't in the source. Tables and images are taken out before the call and put back after, so data stays exact.</p>
<p>An AI planner reviews the slide structure from an outline only. Every suggestion is checked against the real content, and the rules win if the model is missing, rate-limited or wrong.</p>"""),
            ("Textbooks on serverless", """<p>Vercel functions stop at 300 seconds and 4.5 MB. So uploads go straight to a private B2 bucket, a textbook is read in 300-page parts four at a time, and the plan travels back to the browser so the server never re-reads the PDF. You tick the chapters you want; only those are built. Scanned pages are OCR'd first, and the PDF is deleted as soon as the deck is built.</p>"""),
            ("Numbers", "STATS"),
        ],
        stats=[("3,000", "pages per book, read in parts"), ("&lt;1 s", "to build one chapter of a 500-page book"), ("200 MB", "uploads"), ("4", "deck themes")],
        gallery=[("pdf-to-slides-1.webp", "The app: drop a PDF, pick a slide type and theme", True),
                 ("pdf-to-slides-2.webp", "Read, plan, build: the three steps", True)],
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
        kicker="Software · live app",
        lede='Share files only the right people can open. NCrypt <span class="hl">encrypts files in your browser</span> with a passphrase you choose, then stores only the ciphertext.',
        desc="Case study: NCrypt, file sharing with in-browser AES-256-GCM encryption. By Charles Toriola.",
        hero=dict(scene="ncrypt"),
        facts=[("Stack", "React · Web Crypto API"),
               ("Crypto", "AES-256-GCM · PBKDF2 (SHA-256, 100,000 rounds)"),
               ("Limits", "100 MB per file, no account needed"),
               ("Live", ext("https://n-crypt.vercel.app"))],
        sections=[
            ("The idea", """<p>Most file sharing asks you to trust the server with your files. NCrypt doesn't: contracts, payroll sheets and brand assets are <span class="hl">encrypted on your own device first</span>, so what gets uploaded is ciphertext the server can't read.</p>"""),
            ("How it works", """<ul><li><span class="hl">Encrypted on your device.</span> AES-256-GCM with a key derived from your passphrase (PBKDF2, 100,000 rounds). Nothing readable leaves the browser.</li><li><span class="hl">Ciphertext goes to storage.</span> The encrypted bytes go straight to the storage bucket. The server never sees the file or the passphrase.</li><li><span class="hl">Share the ID, not the key.</span> You get an 8-character share ID. Send it and the passphrase separately; the recipient decrypts in their own browser.</li></ul>"""),
            ("How it's built", """<p>A React front end on the browser's built-in <span class="hl">Web Crypto API</span>. No crypto libraries to ship or trust, and the plaintext never leaves the page.</p>"""),
        ],
        gallery=[("ncrypt-1.webp", "“Share files only the right people can open.”", True),
                 ("ncrypt-2.webp", "Encrypt and share, and why your key never leaves you", False),
                 ("ncrypt-3.webp", "How it works, and recent guest uploads (still locked)", False)],
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
