import asyncio
from playwright import async_api
from playwright.async_api import expect

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
        # -> Click the floating chat bubble to expand the chat window.
        frame = context.pages[-1]
        # Click the floating chat bubble to toggle the chat window open
        elem = frame.locator('xpath=html/body/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the floating chat bubble again to collapse the chat window.
        frame = context.pages[-1]
        # Click the floating chat bubble again to toggle the chat window closed
        elem = frame.locator('xpath=html/body/div[3]/div/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Perform a final visual check to confirm the smoothness of the toggle animations and then conclude the task.
        frame = context.pages[-1]
        # Click the floating chat bubble to expand the chat window again for final visual check of animation smoothness
        elem = frame.locator('xpath=html/body/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=CallWaiting').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=AI').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Log In').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Sign Up Free').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Real voice • Instant replies').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Never Miss Another Call').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Your 24/7 AI Receptionist').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Powered by ODIADEV AI TTS — featuring voices Marcus, Marcy, Austyn & Joslyn.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Start Free Trial').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Try Live Demo (+14156876510)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=No credit card required • Setup in 48 hours • Human-like voice').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=See How It Works').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Watch AI answer a real customer call in seconds').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Live Demo: +1 (218) 400-3410').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=This is a real demonstration of CallWaiting AI answering a customer call. The AI responds instantly with natural, human-like speech powered by ODIADEV technology.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Try it yourself - Call our demo AI now').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Call +14156876510').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Free demo • No signup required • Available 24/7').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Always-On Answering').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=AI responds instantly—even outside work hours or when you\'re in a meeting.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Talks Like a Human').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Realistic voice. Understands intent. No IVR menu nonsense.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Captures Leads, Not Just Calls').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Collects key info and passes it straight to your WhatsApp or CRM.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Live Demo Available').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Hear It For Yourself').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Call Ada, our AI receptionist. She\'ll answer your questions about CallWaiting AI in real-time. No appointment needed.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Example Conversation:').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Hi, I\'m interested in your AI service. How does it work?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Thanks for calling! CallWaiting AI is a voice assistant that answers calls when you can\'t. It speaks naturally, captures lead information, and integrates with your existing tools. Would you like to know about pricing or setup time?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Call +14156876510').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Get Your AI Now').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Available 24/7 • Average wait time: 0 seconds').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=TRUSTED BY').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Logo 1').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Logo 2').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Logo 3').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Logo 4').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Ready to Never Miss Another Call?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Join hundreds of businesses already using CallWaiting AI. Start your free trial today and experience the future of call handling.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=5 Minutes Free').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Test our AI with no commitment. See how it works with your actual calls.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=48-Hour Setup').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=We configure everything for you. Just provide your phone number and preferences.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Start Free Trial Now').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=No credit card required • 5 minutes free • Setup in 48 hours').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Pay Only for What You Use').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Simple pricing that grows with you').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Let AI answer your calls — only pay for what you use. Starter plans begin at just $20.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Starter').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Small creators / trial users').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=$20').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=/month').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=$0.17/min').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=120 voice minutes included').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Up to 120 AI call minutes').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=1 business line').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=AI voice demo + webhook setup').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Basic analytics').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Email support').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=24/7 AI availability').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Start Free Trial').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Try free • Pay only when you\'re ready').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=MOST POPULAR').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Pro').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Growing e-commerce stores').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=$80').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=/month').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=$0.14/min').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=600 voice minutes included').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Up to 600 AI call minutes').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Multi-channel support (TikTok, WhatsApp)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Custom voice tone & personality').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Email reports + real-time dashboard').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Priority support').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Advanced analytics').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Start Free Trial').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Try free • Pay only when you\'re ready').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Enterprise').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Agencies / large call volumes').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=$180').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=/month').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=$0.11/min').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=2,000 voice minutes included').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=2,000+ AI call minutes').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Priority support').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Custom integrations & branding').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Dedicated voice model').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=API access').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Volume discounts available').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Start Free Trial').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Try free • Pay only when you\'re ready').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Custom').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Integrators & enterprises').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Contact us').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Custom AI receptionist').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Bulk deployment').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Dedicated account manager').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=White-label options').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=SLA guarantees').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Custom development').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Schedule Call').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=How it works: Sign up → Test your AI for free → Choose a plan → Pay for minutes → Your AI goes live 24/7').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Unused minutes roll over monthly • Cancel anytime • No hidden fees').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Need help deciding? Contact our team or ').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=call Ada at +1 (415) 687-6510').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Frequently Asked Questions').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=What happens when someone calls?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Your AI picks up instantly, speaks naturally, answers questions, and captures important details like name, callback number, and what they need. You get a summary via WhatsApp or email.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Does it really sound human?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Yes. Try calling our demo line at +1 (415) 687-6510 to hear it yourself. Most people can\'t tell it\'s AI.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=What if the AI doesn\'t know the answer?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=It takes a message and lets the caller know you\'ll follow up. You can customize responses for common questions during setup.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=How long does setup take?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Most businesses are live within 48 hours. We handle the technical setup—you just provide your FAQs and business info.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Can it schedule appointments?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Yes. It integrates with calendar tools and can book appointments based on your availability.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=What about privacy and security?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=All conversations are encrypted. We\'re GDPR compliant and don\'t share your data with third parties.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=CallWaiting').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=AI').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Pricing').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=FAQ').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Contact').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=© 2025 CallWaiting AI. All rights reserved.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Powered by ODIADEV AI TTS').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Start Free Trial').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=ODIADEV Assistant').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Always here to help').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Hi! I\'m your CallWaitingAI assistant. How can I help you today? 😊').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Test Admin Panel').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=TEST MODE').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Admin Password').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Create Test Account').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    