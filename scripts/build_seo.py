"""Write the SEO head (title, description, canonical, social cards, JSON-LD) into
the main pages, and regenerate sitemap.xml, robots.txt and llms.txt.

Run from the repo root after changing pages or scripts/seo_meta.py:
    python3 scripts/build_seo.py
It is safe to run repeatedly: it replaces what it wrote last time.
"""
import datetime, html, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from seo_meta import BASE, PERSON, SERVICE, WEBSITE, PERSON_ID, SERVICE_ID, WEBSITE_ID, ROLES, jsonld

OG = BASE + "/assets/img/og.jpg"

PAGES = {
    "index.html": dict(
        path="/", og_type="profile",
        title="Charles Toriola — Full Stack Developer & Designer in Abuja",
        desc="Charles Toriola is a full stack developer, creative lead, graphic designer and videographer in Abuja, Nigeria. Web apps, brand identity, event films and live production, from one person.",
        graph=[WEBSITE, PERSON, SERVICE]),
    "studio.html": dict(
        path="/studio", og_type="website",
        title="Studio — Graphic Design & Video in Abuja | Charles Toriola",
        desc="Brand overhauls, posters, event films and livestream production by Charles Toriola, a graphic designer, videographer and multimedia specialist in Abuja, Nigeria.",
        graph=[{"@type": "CollectionPage", "@id": BASE + "/studio#page", "url": BASE + "/studio",
                "name": "Studio: graphic design, branding, video and live production in Abuja",
                "isPartOf": {"@id": WEBSITE_ID}, "about": {"@id": SERVICE_ID}, "author": {"@id": PERSON_ID}},
               SERVICE, PERSON]),
    "about.html": dict(
        path="/about", og_type="profile",
        title="About Charles Toriola — Freelance Developer & Creative Lead in Abuja",
        desc="Charles Toriola is a full stack developer and creative lead in Abuja: Computer Science grad, former PHP developer, now Creative Lead at PrimeTEK Group, and available for freelance development, design, video and multimedia work.",
        graph=[{"@type": "ProfilePage", "@id": BASE + "/about#page", "url": BASE + "/about",
                "name": "About Charles Toriola", "isPartOf": {"@id": WEBSITE_ID}, "mainEntity": {"@id": PERSON_ID}},
               PERSON]),
    "art.html": dict(
        path="/art", og_type="website",
        title="Art — Posters, Brand Sites and Project Sites | Charles Toriola, Abuja",
        desc="Posters, brand sites and project sites by Charles Toriola, a graphic designer and developer in Abuja, laid out like a desktop.",
        graph=[{"@type": "CollectionPage", "@id": BASE + "/art#page", "url": BASE + "/art",
                "name": "Art by Charles Toriola", "isPartOf": {"@id": WEBSITE_ID}, "author": {"@id": PERSON_ID}},
               PERSON]),
}

# tags this script owns; any existing copies are removed before writing
OWNED = re.compile(r'^(<title>.*</title>|<meta name="description"[^>]*>|<link rel="canonical"[^>]*>|'
                   r'<meta property="og:[^"]+"[^>]*>|<meta name="twitter:[^"]+"[^>]*>)\n', re.M)
LDJSON = re.compile(r'<script type="application/ld\+json">.*?</script>\n', re.S)


def head_block(p):
    e = lambda s: html.escape(s, quote=True)
    url = BASE + p["path"]
    return "\n".join([
        "<title>%s</title>" % html.escape(p["title"], quote=False),
        '<meta name="description" content="%s">' % e(p["desc"]),
        '<link rel="canonical" href="%s">' % url,
        '<meta property="og:type" content="%s">' % p["og_type"],
        '<meta property="og:title" content="%s">' % e(p["title"]),
        '<meta property="og:description" content="%s">' % e(p["desc"]),
        '<meta property="og:url" content="%s">' % url,
        '<meta property="og:image" content="%s">' % OG,
        '<meta property="og:locale" content="en_NG">',
        '<meta name="twitter:card" content="summary_large_image">',
    ]) + "\n"


for name, p in PAGES.items():
    assert len(p["title"]) < 70, "%s title is %d characters; keep it under 70" % (name, len(p["title"]))
    s = open(name, encoding="utf-8").read()
    s = OWNED.sub("", s)
    s = LDJSON.sub("", s)
    vp = '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
    assert vp in s, name
    s = s.replace(vp, vp + head_block(p), 1)
    s = s.replace("</head>", jsonld(*p["graph"]) + "\n</head>", 1)
    open(name, "w", encoding="utf-8").write(s)
    print("head:", name)

# ---------------------------------------------------------------- sitemap
today = datetime.date.today().isoformat()
cases = sorted(f[:-5] for f in os.listdir("work") if f.endswith(".html"))
urls = [("/", "1.0"), ("/studio", "0.9"), ("/about", "0.8"), ("/art", "0.6")] + [("/work/" + c, "0.7") for c in cases]
with open("sitemap.xml", "w", encoding="utf-8") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for u, pr in urls:
        f.write("  <url><loc>%s%s</loc><lastmod>%s</lastmod><priority>%s</priority></url>\n" % (BASE, u, today, pr))
    f.write("</urlset>\n")
print("sitemap.xml:", len(urls), "urls")

# ---------------------------------------------------------------- robots
with open("robots.txt", "w", encoding="utf-8") as f:
    f.write("# Search engines and AI assistants (Google, Bing, ChatGPT, Claude, Perplexity and others) are welcome.\n"
            "User-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n" % BASE)
print("robots.txt")

# ---------------------------------------------------------------- llms.txt
case_lines = []
for c in cases:
    t = open(os.path.join("work", c + ".html"), encoding="utf-8").read()
    title = html.unescape(re.search(r"<title>(.*?) — Charles Toriola</title>", t).group(1))
    desc = html.unescape(re.search(r'<meta name="description" content="([^"]*)"', t).group(1))
    case_lines.append("- [%s](%s/work/%s): %s" % (title, BASE, c, desc.replace("Case study: ", "")))
llms = """# Charles Toriola

> Charles Toriola is a full stack developer, creative lead, graphic designer, videographer and multimedia specialist based in Abuja, Nigeria. He builds web apps end to end, designs brand identities and posters, shoots and grades event films, and runs multi-camera livestream production. He is Creative Lead at PrimeTEK Group and takes on freelance work in Abuja and remotely.

Roles: %(roles)s.
Location: Abuja, FCT, Nigeria.
Contact: toriola333@gmail.com · +234 816 629 5770 · %(base)s/about

## What he does

- Full stack web and app development: PHP, MySQL, Python, Flask, JavaScript, TypeScript, React, Next.js, Node.js, Tailwind CSS, Firebase, Supabase, Vercel.
- Graphic design and brand identity: complete brand overhauls (identity, visual system and website), posters, brochures, decks. Photoshop, Affinity, Figma, Canva.
- Videography and motion: event films, colour grading, motion graphics. After Effects, DaVinci Resolve, CapCut.
- Multimedia and live production: twice-weekly multi-camera livestreams with OBS, vMix, an ATEM switcher, EasyWorship, video processors and LED screens.

## Pages

- [Builds (home)](%(base)s/): six software projects, shipped end to end.
- [Studio](%(base)s/studio): brand overhauls, posters, event films, livestreams and software, with case studies.
- [About](%(base)s/about): background, stack by medium, contact.
- [Art](%(base)s/art): posters, brand sites and project sites.

## Case studies

%(cases)s
""" % dict(roles=", ".join(ROLES), base=BASE, cases="\n".join(case_lines))
open("llms.txt", "w", encoding="utf-8").write(llms)
print("llms.txt")
