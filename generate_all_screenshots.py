import os
import time
from playwright.sync_api import sync_playwright

sites = [
    {
        "slug": "uaiso-travel",
        "url": "https://uaisotravel.com",
        "internal_url": "https://uaisotravel.com/sobre/index.html"
    },
    {
        "slug": "advogados-lco",
        "url": "https://advogadoslco.com.br",
        "internal_url": "https://advogadoslco.com.br/sobre.html"
    },
    {
        "slug": "sevalho-controladoria",
        "url": "https://sevalhocontroladoria.com.br",
        "internal_url": "https://sevalhocontroladoria.com.br/#page-servicos",
        "scroll_selector": "#page-servicos"
    },
    {
        "slug": "vaf-global",
        "url": "https://vafglobal.com.br",
        "internal_url": "https://vafglobal.com.br/pages/sobre.html"
    }
]

BASE_DIR = "/app/conversations/69d13ac16e1663b653537e91/mf_site/public/work"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    for site in sites:
        slug = site["slug"]
        url = site["url"]
        out_dir = os.path.join(BASE_DIR, slug)
        os.makedirs(out_dir, exist_ok=True)

        print(f"\n--- Processing Screenshots for {slug} ---")

        # 1. Desktop Home (1440x800) -> 01.png
        ctx_desktop = browser.new_context(
            viewport={"width": 1440, "height": 800},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page_d = ctx_desktop.new_page()
        page_d.goto(url, wait_until="networkidle", timeout=60000)
        time.sleep(1) # ensure full render
        p01 = os.path.join(out_dir, "01.png")
        page_d.screenshot(path=p01, full_page=False)
        print(f"Captured {p01}")

        # 2. Desktop Internal Section (1440x800) -> 02.png
        if "scroll_selector" in site:
            page_d.goto(url, wait_until="networkidle", timeout=60000)
            page_d.evaluate(f"document.querySelector('{site['scroll_selector']}').scrollIntoView()")
            time.sleep(1)
        else:
            page_d.goto(site["internal_url"], wait_until="networkidle", timeout=60000)
            time.sleep(1)
        
        p02 = os.path.join(out_dir, "02.png")
        page_d.screenshot(path=p02, full_page=False)
        print(f"Captured {p02}")
        ctx_desktop.close()

        # 3. Mobile Home (390x844) -> 03.png
        ctx_mobile = browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
        )
        page_m = ctx_mobile.new_page()
        page_m.goto(url, wait_until="networkidle", timeout=60000)
        time.sleep(1)
        p03 = os.path.join(out_dir, "03.png")
        page_m.screenshot(path=p03, full_page=False)
        print(f"Captured {p03}")
        ctx_mobile.close()

    browser.close()

print("\nAll initial PNG screenshots captured successfully!")
