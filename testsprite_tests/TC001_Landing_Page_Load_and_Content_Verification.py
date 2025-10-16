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
        # Scroll down to check if content loads further down or try to reload or check for errors.
        await page.mouse.wheel(0, window.innerHeight)
        

        # Extract content of pricing cards and FAQ to verify details, then check mobile sticky CTA visibility and functionality.
        await page.mouse.wheel(0, window.innerHeight)
        

        # Switch to mobile viewport and check for sticky CTA button visibility and functionality.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert hero section elements visibility
        await expect(page.locator('h1')).to_be_visible()  # Assuming main heading is h1
        await expect(page.locator('h2')).to_be_visible()  # Assuming subheading is h2
        await expect(page.locator('img.hero-image')).to_be_visible()  # Assuming hero image has class 'hero-image'
          
        # Assert pricing cards are displayed with correct pricing details
        starter_card = page.locator('div.pricing-card.starter')
        await expect(starter_card).to_be_visible()
        await expect(starter_card.locator('text=$300 one-time setup')).to_be_visible()
        await expect(starter_card.locator('text=Voice AI setup + 1 channel')).to_be_visible()
        pro_card = page.locator('div.pricing-card.pro')
        await expect(pro_card).to_be_visible()
        await expect(pro_card.locator('text=$500 one-time setup')).to_be_visible()
        await expect(pro_card.locator('text=Multi-channel support')).to_be_visible()
          
        # Assert FAQ section questions and answers are rendered properly
        faq_section = page.locator('section.faq')
        await expect(faq_section).to_be_visible()
        await expect(faq_section.locator('text=Handles real conversations in a natural voice')).to_be_visible()
        await expect(faq_section.locator('text=Works with TikTok Shop and Shopify')).to_be_visible()
        await expect(faq_section.locator('text=Yes, free trial available')).to_be_visible()
        await expect(faq_section.locator('text=No coding skills needed')).to_be_visible()
        await expect(faq_section.locator('text=Typically completed within 48 hours')).to_be_visible()
          
        # Assert mobile sticky CTA button is visible and clickable
        await context.set_viewport_size({'width': 375, 'height': 667})  # iPhone 6/7/8 size
        sticky_cta = page.locator('button.sticky-cta')
        await expect(sticky_cta).to_be_visible()
        await sticky_cta.click()
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    