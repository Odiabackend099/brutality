import asyncio
from playwright import async_api

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # Scroll and inspect the homepage for any direct links or buttons initiating Flutterwave payment flows outside of the upgrade process, especially in pricing cards and other CTAs.
        await page.mouse.wheel(0, 1000)
        

        # Assert no direct Flutterwave payment links or buttons outside upgrade process
        flutterwave_payment_selectors = ['a[href*="flutterwave"], button[data-payment="flutterwave"]']
        for selector in flutterwave_payment_selectors:
            elements = await page.query_selector_all(selector)
            assert len(elements) == 0, f"Found direct Flutterwave payment element with selector: {selector}"
          
        # Assert pricing cards show 'FREE TRIAL FIRST' badges and no payment triggers
        pricing_cards = await page.query_selector_all('.pricing-card')
        for card in pricing_cards:
            badge = await card.query_selector('text=FREE TRIAL FIRST')
            assert badge is not None, "Pricing card missing 'FREE TRIAL FIRST' badge"
            # Check no payment action triggers inside pricing card
            payment_buttons = await card.query_selector_all('a[href*="flutterwave"], button[data-payment="flutterwave"]')
            assert len(payment_buttons) == 0, "Pricing card contains direct payment triggers"
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    