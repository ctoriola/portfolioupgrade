"""Shared SEO data: who Charles is, in a form search engines and AI tools read.

Used by scripts/build_cases.py and scripts/build_seo.py. Edit the facts here,
then run both scripts from the repo root.
"""
import json

BASE = "https://www.charlestoriola.com"
PERSON_ID = BASE + "/#person"
SERVICE_ID = BASE + "/#service"
WEBSITE_ID = BASE + "/#website"

ROLES = [
    "Full Stack Developer",
    "Freelance Developer",
    "Creative Lead",
    "Graphic Designer",
    "Videographer",
    "Multimedia Specialist",
]

KNOWS = [
    "Full stack web development", "Web app development", "Graphic design", "Brand identity design",
    "Poster design", "Videography", "Event films", "Video editing", "Colour grading", "Motion graphics",
    "Multimedia production", "Livestream production",
    "PHP", "MySQL", "Python", "Flask", "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
    "Tailwind CSS", "Firebase", "Supabase", "Vercel",
    "Photoshop", "Affinity", "Figma", "Canva",
    "After Effects", "DaVinci Resolve", "CapCut",
    "OBS", "vMix", "ATEM switcher", "EasyWorship",
]

SERVICES = [
    "Full stack web and app development",
    "Freelance software development",
    "Graphic design",
    "Brand identity and rebrands",
    "Videography and event films",
    "Motion graphics",
    "Multimedia and livestream production",
]

ABUJA = {"@type": "City", "name": "Abuja", "containedInPlace": {"@type": "Country", "name": "Nigeria"}}
ADDRESS = {"@type": "PostalAddress", "addressLocality": "Abuja", "addressRegion": "FCT", "addressCountry": "NG"}

PERSON = {
    "@type": "Person",
    "@id": PERSON_ID,
    "name": "Charles Toriola",
    "givenName": "Charles",
    "familyName": "Toriola",
    "url": BASE + "/",
    "image": BASE + "/assets/img/photos/charles-studio.webp",
    "jobTitle": "Full Stack Developer & Creative Lead",
    "description": "Abuja-based full stack developer, creative lead, graphic designer, videographer and multimedia specialist, available for freelance work.",
    "hasOccupation": [{"@type": "Occupation", "name": r, "occupationLocation": ABUJA} for r in ROLES],
    "worksFor": {"@type": "Organization", "name": "PrimeTEK Group"},
    "homeLocation": ABUJA,
    "address": ADDRESS,
    "email": "mailto:toriola333@gmail.com",
    "telephone": "+2348166295770",
    "knowsAbout": KNOWS,
    "sameAs": ["https://github.com/ctoriola", "https://www.linkedin.com/in/charles-toriola-36b64b283"],
}

SERVICE = {
    "@type": "ProfessionalService",
    "@id": SERVICE_ID,
    "name": "Charles Toriola: development, design and video in Abuja",
    "url": BASE + "/",
    "image": BASE + "/assets/img/og.jpg",
    "description": "Full stack development, graphic design and brand identity, videography and event films, and multimedia and livestream production, from one person in Abuja, Nigeria.",
    "email": "mailto:toriola333@gmail.com",
    "telephone": "+2348166295770",
    "address": ADDRESS,
    "areaServed": [ABUJA, {"@type": "Country", "name": "Nigeria"}],
    "founder": {"@id": PERSON_ID},
    "serviceType": SERVICES,
    "knowsAbout": KNOWS,
}

WEBSITE = {"@type": "WebSite", "@id": WEBSITE_ID, "url": BASE + "/", "name": "Charles Toriola",
           "publisher": {"@id": PERSON_ID}, "inLanguage": "en"}


def jsonld(*nodes):
    data = {"@context": "https://schema.org", "@graph": list(nodes)}
    return '<script type="application/ld+json">\n' + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n</script>"
