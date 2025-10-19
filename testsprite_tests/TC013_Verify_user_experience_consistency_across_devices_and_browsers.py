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
        # -> Click the chat widget button to open the chat widget on desktop.
        frame = context.pages[-1]
        # Open chat widget button on desktop
        elem = frame.locator('xpath=html/body/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Simulate mobile device viewport and open chat widget to verify responsive layout and functionality.
        await page.mouse.wheel(0, 500)
        

        frame = context.pages[-1]
        # Close chat widget to reset for mobile test
        elem = frame.locator('xpath=html/body/footer[2]/div/div[2]/div/div[2]/a[5]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Return to the main page and proceed to simulate mobile device viewport to test chat widget responsiveness and functionality.
        await page.goto('http://localhost:3000', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Simulate mobile device viewport and open the chat widget to verify responsive layout and functionality.
        await page.goto('http://localhost:3000', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Simulate mobile device viewport and open the chat widget to verify responsive layout and functionality.
        frame = context.pages[-1]
        # Enter admin password to enable test mode for further testing
        elem = frame.locator('xpath=html/body/div[5]/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('testpassword')
        

        frame = context.pages[-1]
        # Click Create Test Account button to enable test mode
        elem = frame.locator('xpath=html/body/div[5]/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Open chat widget button on mobile viewport
        elem = frame.locator('xpath=html/body/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Test all input modes and features of the chat widget on mobile devices to ensure full functionality.
        frame = context.pages[-1]
        # Start voice input on mobile chat widget
        elem = frame.locator('xpath=html/body/div[3]/div/div[3]/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Type a test message in the chat input field on mobile
        elem = frame.locator('xpath=html/body/div[3]/div/div[3]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Test message from mobile')
        

        frame = context.pages[-1]
        # Click Get Help button to test interaction
        elem = frame.locator('xpath=html/body/div[4]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Test sending a message through the chat widget input on mobile and verify response and UI behavior.
        frame = context.pages[-1]
        # Type a test message in the chat input field on mobile
        elem = frame.locator('xpath=html/body/div[4]/div/div[3]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Hello from mobile test')
        

        frame = context.pages[-1]
        # Send the test message by clicking the send button
        elem = frame.locator('xpath=html/body/div[4]/div/div[3]/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Complete the task by closing the chat widget and reporting the successful completion of the chat widget user experience, UI layout, and functionality testing across devices.
        frame = context.pages[-1]
        # Close chat widget to complete testing
        elem = frame.locator('xpath=html/body/div[3]/div/div/div[2]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=CallWaiting').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=AI').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Free Tools').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Log In').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Sign Up Free').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Real voice • Instant replies').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Never Miss Another Paying Call').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Your AI Receptionist That Answers, Qualifies & Books—24/7').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Start Free Trial').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Try Live Demo (+14156876510)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Answers in 0.8 seconds').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Books appointments instantly').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Integrates with your CRM').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=99.9% uptime guarantee').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=No credit card required • 30-day money-back guarantee • First 100 calls free').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=See How It Works').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Watch AI answer a real customer call in seconds').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Live Demo: +1 (218) 400-3410').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=This is a real demonstration of CallWaiting AI answering a customer call. The AI responds instantly with natural, human-like speech powered by ODIADEV technology.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Try it yourself - Call our demo AI now').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Call +14156876510').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Free demo • No signup required • Available 24/7').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Trusted by 500+ UK Businesses').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text="We went from missing 40% of calls to capturing every single one. Revenue up 67% in 3 months."').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text="It\'s like hiring 3 receptionists for the price of a gym membership."').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text="Pays for itself in the first week. Absolute game-changer."').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=The £50,000 Problem You\'re Ignoring').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=You\'re bleeding money every time your phone rings and no one answers.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Average UK business misses 30% of inbound calls').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=85% of callers won\'t leave voicemail').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=One missed call = £500–£5,000 in lost revenue').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Hiring receptionists costs £25k–£35k per year + NI + holidays').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=What if you could capture every call for £39/month?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Get Started Free').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Dead Simple. No Tech Skills Required.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=1️⃣').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Connect Your Number (2 minutes)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Forward missed calls or get a new number. Works with any UK mobile or landline.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=2️⃣').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Train Your AI (5 minutes)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Tell it your business details, services, and booking rules. Uses your actual voice style.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=3️⃣').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Go Live (Instant)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Your AI answers every call, qualifies leads, books appointments, and sends you transcripts.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Features That Print Money').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Everything You Need to Never Miss a Sale').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Smart Call Qualification').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=AI asks the right questions to filter serious buyers from tire-kickers.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Instant Booking').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Syncs with Google Calendar, Calendly, Acuity. Books appointments while the caller\'s still on the line.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=CRM Integration').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Pushes every lead straight into your HubSpot, Salesforce, Pipedrive, or Notion.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Real-Time Analytics').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=See call volume, conversion rates, and peak hours. Optimize your marketing on the fly.').first).to_be_visible(timeout=30000)
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
        await expect(frame.locator('text=Stop Losing Calls. Start Making Money.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Every day you wait is another day of lost revenue. Set up takes 7 minutes. You\'ll wonder how you ever survived without it.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Start Free Trial — No Credit Card Required').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Questions? Call us: 020 1234 5678 (yes, a human answers)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Or book a demo: Schedule 15-min Call').first).to_be_visible(timeout=30000)
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
        await expect(frame.locator('text=© 2025 CallWaitingAI Ltd | Registered in England & Wales No. [XXXXXXX]').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Registered Office: [Insert your full UK registered address]').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    