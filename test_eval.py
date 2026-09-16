import sys
import time
import json
import os
from playwright.sync_api import sync_playwright

sites = [
    {"url": "https://uaisotravel.com", "slug": "uaiso-travel"},
    {"url": "https://advogadoslco.com.br", "slug": "advogados-lco"},
    {"url": "https://sevalhocontroladoria.com.br", "slug": "sevalho-controladoria"},
    {"url": "https://vafglobal.com.br", "slug": "vaf-global"}
]

os.makedirs("/app/conversations/69d13ac16e1663b653537e91/mf_site/public/work", exist_ok=True)

for site in sites:
    slug = site["slug"]
    url = site["url"]
    out_dir = f"/app/conversations/69d13ac16e1663b653537e91/mf_site/public/work/{slug}"
    os.makedirs(out_dir, exist_ok=True)
    print(f"\n==========================================")
    print(f"Testing {url} ({slug})")
    print(f"==========================================")

    js_errors = []
    res_4xx = []
    ssl_error = None

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 800})
        page = context.new_page()

        page.on("pageerror", lambda err: js_errors.append(str(err)))
        
        def handle_response(response):
            if 400 <= response.status < 500:
                res_4xx.append(f"{response.status}: {response.url}")

        page.on("response", handle_response)

        start_time = time.time()
        dom_content_loaded_time = None
        http_status = None

        try:
            response = page.goto(url, wait_until="domcontentloaded", timeout=60000)
            dom_time = time.time() - start_time
            if response:
                http_status = response.status()
            
            # wait network idle if possible
            try:
                page.wait_for_load_state("networkidle", timeout=15000)
            except Exception as e:
                print(f"Networkidle timeout/warning: {e}")

        except Exception as e:
            print(f"Navigation error for {url}: {e}")
            if "CERT" in str(e) or "SSL" in str(e) or "ERR_CERT" in str(e):
                ssl_error = str(e)

        print(f"HTTP Status: {http_status}")
        print(f"DOMContentLoaded time: {dom_time if 'dom_time' in locals() else 'N/A':.2f}s")
        print(f"SSL Error: {ssl_error}")
        print(f"JS Errors count: {len(js_errors)}")
        if js_errors:
            print(f"JS Errors: {js_errors[:5]}")
        print(f"4xx Resources count: {len(res_4xx)}")
        if res_4xx:
            print(f"4xx Resources: {res_4xx[:5]}")

        # Basic page info
        try:
            title = page.title()
            lang = page.evaluate("document.documentElement.lang") or "unknown"
            body_text = page.inner_text("body")
            print(f"Title: {title}")
            print(f"Lang attr: {lang}")
            print(f"Body text length: {len(body_text)}")
            
            # Check lorem ipsum
            lorem_found = "lorem ipsum" in body_text.lower()
            print(f"Lorem ipsum found: {lorem_found}")

            # Check broken images
            broken_imgs = page.evaluate("""
                Array.from(document.images).filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src)
            """)
            print(f"Broken images count: {len(broken_imgs)}")
            if broken_imgs:
                print(f"Broken images: {broken_imgs[:5]}")

            # Internal links
            links = page.evaluate("""
                Array.from(document.querySelectorAll('a[href]')).map(a => ({href: a.getAttribute('href'), text: a.innerText.trim()}))
            """)
            print(f"Links count: {len(links)}")
            internal_links = [l for l in links if l['href'] and not l['href'].startswith('javascript') and not l['href'].startswith('#') and not l['href'].startswith('mailto:') and not l['href'].startswith('tel:')]
            print(f"Sample links: {internal_links[:8]}")

        except Exception as e:
            print(f"Error inspecting page content: {e}")

        browser.close()

