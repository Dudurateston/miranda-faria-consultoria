import sys
import time
import json
import os
import urllib.parse
from playwright.sync_api import sync_playwright

sites = [
    {
        "slug": "uaiso-travel",
        "url": "https://uaisotravel.com",
        "internal_path": "/sobre/index.html"
    },
    {
        "slug": "advogados-lco",
        "url": "https://advogadoslco.com.br",
        "internal_path": "/sobre.html"
    },
    {
        "slug": "sevalho-controladoria",
        "url": "https://sevalhocontroladoria.com.br",
        "internal_path": "/sobre.html" # will check if exists or alternative
    },
    {
        "slug": "vaf-global",
        "url": "https://vafglobal.com.br",
        "internal_path": "/pages/sobre.html"
    }
]

BASE_DIR = "/app/conversations/69d13ac16e1663b653537e91/mf_site/public/work"

results = {}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    for site in sites:
        slug = site["slug"]
        url = site["url"]
        out_dir = os.path.join(BASE_DIR, slug)
        os.makedirs(out_dir, exist_ok=True)

        print(f"\n==========================================")
        print(f"AUDITING: {slug} ({url})")
        print(f"==========================================")

        js_errors = []
        res_4xx = []
        ssl_error = None
        http_status = None

        # 1. DESKTOP HOME (1440x800)
        context_desktop = browser.new_context(
            viewport={"width": 1440, "height": 800},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context_desktop.new_page()

        page.on("pageerror", lambda err: js_errors.append(str(err)))
        
        def handle_response(response):
            if 400 <= response.status < 500:
                res_4xx.append(f"{response.status}: {response.url}")

        page.on("response", handle_response)

        start_time = time.time()
        dom_time = None
        
        try:
            response = page.goto(url, wait_until="domcontentloaded", timeout=60000)
            dom_time = time.time() - start_time
            if response:
                http_status = response.status
            try:
                page.wait_for_load_state("networkidle", timeout=15000)
            except Exception as e:
                print(f"Networkidle timeout (desktop home): {e}")

        except Exception as e:
            err_msg = str(e)
            print(f"Navigation error: {err_msg}")
            if "CERT" in err_msg or "SSL" in err_msg or "ERR_CERT" in err_msg:
                ssl_error = err_msg

        # Evaluate home desktop facts
        title = page.title()
        lang = page.evaluate("document.documentElement.lang") or "pt"
        body_text = page.inner_text("body")
        lorem_found = "lorem ipsum" in body_text.lower()
        empty_page = len(body_text.strip()) < 50

        # Check broken images
        broken_imgs = page.evaluate("""
            Array.from(document.images).map(img => {
                return {
                    src: img.src,
                    complete: img.complete,
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight
                };
            }).filter(img => !img.complete || img.naturalWidth === 0)
        """)

        # Take 01.png (Desktop Home, sem rolagem, i.e. viewport screenshot)
        png_01 = os.path.join(out_dir, "01.png")
        page.screenshot(path=png_01, full_page=False)
        print(f"Saved {png_01}")

        # Discover internal links to choose best internal section
        links = page.evaluate("""
            Array.from(document.querySelectorAll('a[href]')).map(a => ({
                href: a.getAttribute('href'),
                text: a.innerText.trim(),
                fullUrl: a.href
            }))
        """)

        # Navigate to internal section/page for 02.png
        # Try site['internal_path'], or pick first good internal link
        internal_target = None
        for l in links:
            h = l['href']
            if not h: continue
            if h.startswith('#') or h.startswith('javascript:') or h.startswith('mailto:') or h.startswith('tel:'):
                continue
            if 'wa.me' in h or 'whatsapp' in h or 'instagram.com' in h or 'linkedin.com' in h or 'facebook.com' in h:
                continue
            # If internal link or relative path
            if url in l['fullUrl'] and l['fullUrl'].rstrip('/') != url.rstrip('/'):
                internal_target = l['fullUrl']
                break
            elif not h.startswith('http') and h != '/' and h != './':
                internal_target = urllib.parse.urljoin(url, h)
                break

        if not internal_target:
            internal_target = urllib.parse.urljoin(url, site["internal_path"])

        print(f"Internal section URL chosen: {internal_target}")
        
        # Go to internal page
        try:
            page.goto(internal_target, wait_until="domcontentloaded", timeout=60000)
            try:
                page.wait_for_load_state("networkidle", timeout=10000)
            except:
                pass
            png_02 = os.path.join(out_dir, "02.png")
            page.screenshot(path=png_02, full_page=False)
            print(f"Saved {png_02}")
        except Exception as e:
            print(f"Error navigating to internal section {internal_target}: {e}")
            # Fallback: screenshot current page or a scrolled section
            png_02 = os.path.join(out_dir, "02.png")
            page.screenshot(path=png_02, full_page=False)

        context_desktop.close()

        # 3. MOBILE HOME (390x844)
        context_mobile = browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
        )
        page_m = context_mobile.new_page()
        page_m.goto(url, wait_until="domcontentloaded", timeout=60000)
        try:
            page_m.wait_for_load_state("networkidle", timeout=10000)
        except:
            pass

        # Check horizontal overflow
        overflow_info = page_m.evaluate("""
            () => {
                const docEl = document.documentElement;
                const bodyEl = document.body;
                const scrollWidth = Math.max(docEl.scrollWidth, bodyEl ? bodyEl.scrollWidth : 0);
                const clientWidth = docEl.clientWidth;
                return {
                    scrollWidth,
                    clientWidth,
                    hasOverflow: scrollWidth > clientWidth
                };
            }
        """)

        png_03 = os.path.join(out_dir, "03.png")
        page_m.screenshot(path=png_03, full_page=False)
        print(f"Saved {png_03}")
        context_mobile.close()

        results[slug] = {
            "url": url,
            "http_status": http_status,
            "dom_time": dom_time,
            "ssl_error": ssl_error,
            "js_errors": js_errors,
            "res_4xx": res_4xx,
            "title": title,
            "lang": lang,
            "lorem_found": lorem_found,
            "empty_page": empty_page,
            "broken_imgs": broken_imgs,
            "internal_target": internal_target,
            "overflow_info": overflow_info,
            "body_snippet": body_text[:300].replace('\n', ' ')
        }

    browser.close()

print("\n\n================ Summary Results ================")
print(json.dumps(results, indent=2, ensure_ascii=False))

with open("/app/conversations/69d13ac16e1663b653537e91/mf_site/audit_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

