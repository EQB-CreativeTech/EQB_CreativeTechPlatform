// Platform-only chatbot replies for EQB Creative Tech.
(function () {
    const FALLBACK_REPLY = "Please mail our team at info@eqb.com — we will get back to you.";

    function getContactDetails() {
        const contact = window.EQB_DATA?.site?.footer?.contact || [];
        const email = contact.find((item) => item.includes("@"))?.replace("📧 ", "") || "info@eqb.com";
        const phone = contact.find((item) => item.includes("+"))?.replace("📞 ", "") || "+91 9876543210";
        const location = contact.find((item) => item.includes("Chennai"))?.replace("📍 ", "") || "Chennai, Tamil Nadu";
        return { email, phone, location };
    }

    function buildIntents() {
        const { email, phone, location } = getContactDetails();
        const domains = window.EQB_DATA?.pageContent?.domains || [];

        const itDomain = domains.find((item) => item.title === "IT Academy");
        const tnpscDomain = domains.find((item) => item.title === "TNPSC Academy");
        const artDomain = domains.find((item) => item.title === "Art Studio");

        return [
            {
                keywords: ["hello", "hi", "hey", "good morning", "good evening", "namaste"],
                reply: "Hello! I am the EQB assistant. Ask me about IT Academy, TNPSC Academy, Art Studio, registration, contact details, or themes."
            },
            {
                keywords: ["thank", "thanks"],
                reply: "You are welcome. If you need more help with EQB Creative Tech, feel free to ask."
            },
            {
                keywords: ["eqb", "platform", "what is this", "about eqb", "creative tech", "what do you offer"],
                reply: "EQB Creative Tech is a multi-domain learning platform with IT Academy, TNPSC Academy, and Art Studio — technology training, government exam preparation, and a creative marketplace in one place."
            },
            {
                keywords: ["it academy", "it course", "web development", "web dev", "coding", "programming", "software"],
                reply: itDomain
                    ? `IT Academy offers ${itDomain.features.join(", ")} with hands-on projects and career guidance. Explore tracks like Web Basics, JavaScript, Angular and React, plus Placement Prep on the IT Academy page.`
                    : "IT Academy covers web development, JavaScript, Angular, React, UI/UX, and placement support."
            },
            {
                keywords: ["angular"],
                reply: "Angular training is part of IT Academy, from beginner to advanced levels with real project workflows and placement support. Visit the IT Academy page to see course tracks."
            },
            {
                keywords: ["react"],
                reply: "React is taught in IT Academy alongside modern UI workflows, component patterns, and portfolio-focused projects. Check IT Academy for full course details."
            },
            {
                keywords: ["javascript", "java script", "js course"],
                reply: "JavaScript fundamentals and interactive application logic are covered in IT Academy, including DOM handling, forms, and project-based practice."
            },
            {
                keywords: ["placement", "job", "internship", "career", "interview", "resume"],
                reply: "IT Academy includes placement preparation with portfolio reviews, interview practice, resume guidance, and mentor support to help you move toward internships and jobs."
            },
            {
                keywords: ["tnpsc", "group 2", "group 4", "group2", "group4", "government exam", "competitive exam"],
                reply: tnpscDomain
                    ? `TNPSC Academy provides ${tnpscDomain.features.join(", ")} with structured syllabus coverage, daily practice, current affairs, and mock tests.`
                    : "TNPSC Academy supports Group 2, Group 2A, Group 4, daily tests, current affairs, and mock exams."
            },
            {
                keywords: ["mock test", "mock exam", "test series", "current affairs", "aptitude", "general studies"],
                reply: "TNPSC Academy includes General Studies, Current Affairs, Aptitude, and Mock Exams with revision notes, mentor guidance, and performance tracking."
            },
            {
                keywords: ["art studio", "art", "gallery", "painting", "digital art", "artist", "marketplace", "creative"],
                reply: artDomain
                    ? `Art Studio is EQB's creative space for ${artDomain.features.join(", ").toLowerCase()}. Artists can showcase portfolios and reach a wider audience.`
                    : "Art Studio lets creators showcase paintings, digital art, artist profiles, and marketplace listings."
            },
            {
                keywords: ["course", "courses", "learning path", "tracks", "programs"],
                reply: "EQB offers three domains: IT Academy (technology courses), TNPSC Academy (exam preparation), and Art Studio (creative marketplace). Which one would you like to know about?"
            },
            {
                keywords: ["register", "registration", "sign up", "signup", "create account", "login", "log in", "account"],
                reply: "Use the Login or Register buttons in the top navigation to create your EQB account and choose IT Academy, TNPSC Academy, or Art Studio."
            },
            {
                keywords: ["how it works", "get started", "start learning", "steps", "process"],
                reply: "Getting started is simple: create an account, choose your domain (IT, TNPSC, or Art Studio), start learning with resources and mentorship, then achieve your goals with guided support."
            },
            {
                keywords: ["student", "students", "mentor", "mentors", "success rate", "stats"],
                reply: "EQB Creative Tech supports 5000+ active students, 150+ courses, 50+ expert mentors, and a 95% success rate across its learning domains."
            },
            {
                keywords: ["newsletter", "subscribe", "updates", "stay updated"],
                reply: "Scroll to the Stay Updated section on the home page and subscribe with your email for course launches, TNPSC updates, events, and creative opportunities."
            },
            {
                keywords: ["theme", "color", "palette", "dark mode", "night mode", "light mode"],
                reply: "Tap the palette icon at the bottom right to switch Light or Night mode and choose from preset or custom color themes."
            },
            {
                keywords: ["contact", "email", "phone", "call", "reach", "support", "location", "address", "chennai"],
                reply: `You can reach EQB at ${email}, ${phone}, or visit us in ${location}. You can also use the Let's Connect form on the home page.`
            },
            {
                keywords: ["price", "pricing", "fee", "fees", "cost", "charges"],
                reply: "For course fees and program pricing, please mail our team at info@eqb.com with the program you are interested in."
            }
        ];
    }

    function normalizeText(messageText) {
        return messageText
            .toLowerCase()
            .replace(/[^\w\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function scoreIntent(text, keywords) {
        return keywords.reduce((score, keyword) => (text.includes(keyword) ? score + (keyword.includes(" ") ? 2 : 1) : score), 0);
    }

    function getReply(messageText) {
        const text = normalizeText(messageText);

        if (!text) {
            return FALLBACK_REPLY;
        }

        const intents = buildIntents();
        let bestIntent = null;
        let bestScore = 0;

        intents.forEach((intent) => {
            const score = scoreIntent(text, intent.keywords);
            if (score > bestScore) {
                bestScore = score;
                bestIntent = intent;
            }
        });

        if (!bestIntent || bestScore === 0) {
            return FALLBACK_REPLY;
        }

        return bestIntent.reply;
    }

    window.EQB_CHATBOT = {
        getReply,
        fallbackReply: FALLBACK_REPLY
    };
})();
