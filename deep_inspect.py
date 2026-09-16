import time
from playwright.sync_api import sync_playwright

sites = [
    {"slug": "uaiso-travel", "url": "https://uaisotravel.com"},
    {"slug": "advogados-lco", "url": "https://advogadoslco.com.br"},
    {"slug": "sevalho-controladoria", "url": "https://sevalhocontroladoria.com.br"},
    {"slug": "vaf-global", "url": "https://vafglobal.com.br"}
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for s in sites:
        print(f"\n=================== {s['slug']} ===================")
        context = browser.new_context(viewport={"width": 1440, "height": 800})
        page = context.new_page()
        
        req_4xx = []
        page.on("response", lambda r: req_4xx.append(f"{r.status} {r.url}") if 400 <= r.status < 500 else None)

        page.goto(s['url'], wait_until="networkidle", timeout=60000)
        
        # Internal links
        links = page.evaluate("""
            Array.from(document.querySelectorAll('a[href]')).map(a => ({
                text: a.innerText.trim().replace(/\\n/g, ' '),
                href: a.getAttribute('href'),
                full: a.href
            }))
        """)
        print("Internal links:")
        for l in links[:15]:
            print(f"  [{l['text']}] -> {l['href']} ({l['full']})")

        # Login / Dashboard / Area logada check
        login_keywords = ["login", "entrar", "área do cliente", "area do cliente", "painel", "cadastr", "portal", "dashboard", "acessar"]
        has_login = False
        login_elements = []
        for l in links:
            t = l['text'].lower()
            h = l['href'].lower()
            if any(k in t or k in h for k in login_keywords):
                has_login = True
                login_elements.append(f"Link: {l['text']} -> {l['href']}")

        # Search forms / buttons
        inputs = page.evaluate("""
            Array.from(document.querySelectorAll('input, button, form')).map(e => e.outerHTML.slice(0, 100))
        """)
        print(f"Has login keywords: {has_login} -> {login_elements}")
        print(f"4xx resources during main load: {req_4xx}")

        # Image check
        imgs = page.evaluate("""
            Array.from(document.images).map(img => ({
                src: img.src,
                complete: img.complete,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                visible: img.offsetWidth > 0 && img.offsetHeight > 0
            }))
        """)
        broken = [i for i in imgs if not i['complete'] or i['naturalWidth'] == 0]
        print(f"Total images: {len(imgs)}, Broken: {len(broken)}")
        if broken:
            for b in broken:
                print(f"  BROKEN IMG: {b['src']} (complete: {b['complete']}, naturalWidth: {b['naturalWidth']})")

        context.close()
    browser.close()
