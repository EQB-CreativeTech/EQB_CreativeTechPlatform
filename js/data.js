// Central data store for the landing page.
// Keep content, theme values, and storage keys here so the other modules stay small.
window.EQB_DATA = {
    scrollTargetStorageKey: "eqb-scroll-target",
    themeStorageKey: "eqb-theme",
    themeModeStorageKey: "eqb-theme-mode",
    customThemeStorageKey: "eqb-custom-theme",
    newsletterStorageKey: "eqb-newsletter-emails",
    contactStorageKey: "eqb-contact-messages",
    // Temporary contact delivery. Change `to` when the platform email is ready.
    contact: {
        to: "s.mohanamanjula@gmail.com",
        endpoint: "https://formsubmit.co/ajax/s.mohanamanjula@gmail.com"
    },
    // Newsletter: run `cd server && npm install && npm start` and set SMTP in server/.env
    newsletter: {
        endpoint: "http://localhost:3847/api/newsletter/subscribe"
    },
    // Leave baseUrl empty to use bundled content only. Set when the content API is live.
    api: {
        baseUrl: "",
        timeoutMs: 8000,
        cacheKey: "eqb-content-cache",
        endpoints: {
            bundle: "/api/v1/content",
            site: "/api/v1/site",
            home: "/api/v1/pages/home",
            page: "/api/v1/pages/:slug"
        }
    },
        // Base colors used when no theme override is active.
    baseThemeVars: {
        "--bg": "#f8fafc",
        "--surface": "#ffffff",
        "--surface-strong": "#0f172a",
        "--surface-soft": "#f1f5f9",
        "--text": "#0f172a",
        "--text-muted": "#64748b",
        "--border": "rgba(15,23,42,.08)",
        "--shadow": "0 15px 40px rgba(15,23,42,.08)",
        "--primary": "#2563eb",
        "--primary-strong": "#1d4ed8",
        "--primary-soft": "#dbeafe",
        "--secondary": "#7c3aed",
        "--accent": "#ec4899",
        "--gradient": "linear-gradient(135deg,var(--primary),var(--secondary))",
        "--hero-tint": "radial-gradient(circle at top left, rgba(37,99,235,.14), transparent 40%), radial-gradient(circle at bottom right, rgba(124,58,237,.12), transparent 35%)",
        "--footer-bg": "linear-gradient(135deg,#0f172a,#1e293b)",
        "--footer-text": "#f8fafc",
        "--footer-muted": "#cbd5e1",
        "--footer-icon-bg": "rgba(255,255,255,.12)"
    },
        // Mode overrides are layered on top of the active theme.
    modeVars: {
        light: {},
        dark: {
            "--bg": "#020617",
            "--surface": "#0f172a",
            "--surface-strong": "#e2e8f0",
            "--surface-soft": "#1e293b",
            "--text": "#e2e8f0",
            "--text-muted": "#94a3b8",
            "--border": "rgba(148,163,184,.16)",
            "--shadow": "0 18px 42px rgba(2,6,23,.45)",
            "--footer-bg": "linear-gradient(135deg,#020617,#0f172a)",
            "--footer-text": "#f8fafc",
            "--footer-muted": "#cbd5e1",
            "--footer-icon-bg": "rgba(255,255,255,.12)"
        }
    },
        // Default custom colors used when the user has not saved a custom palette yet.
    defaultCustomTheme: {
        primary: "#2563eb",
        secondary: "#7c3aed",
        accent: "#ec4899",
        background: "#f4f8ff"
    },
    // Branded page URLs: eqbcreativetech.<pageName>
    pages: {
        home: "./eqbcreativetech.home.html",
        "it-academy": "./eqbcreativetech.it-academy.html",
        "tnpsc-academy": "./eqbcreativetech.tnpsc-academy.html",
        "art-studio": "./eqbcreativetech.art-studio.html"
    },
    site: {
        nav: [
            { id: "home", label: "Home", href: "./eqbcreativetech.home.html", homeHref: "./eqbcreativetech.home.html" },
            { id: "it-academy", label: "IT Academy", href: "./eqbcreativetech.it-academy.html" },
            { id: "tnpsc-academy", label: "TNPSC Academy", href: "./eqbcreativetech.tnpsc-academy.html" },
            { id: "art-studio", label: "Art Studio", href: "./eqbcreativetech.art-studio.html" },
            { id: "contact", label: "Contact", href: "./eqbcreativetech.home.html", scrollTarget: "contact" }
        ],
        footer: {
            about: "Empowering learners, aspirants and creators through technology, education and innovation.",
            quickLinks: [
                { label: "Home", href: "./eqbcreativetech.home.html" },
                { label: "IT Academy", href: "./eqbcreativetech.it-academy.html" },
                { label: "TNPSC Academy", href: "./eqbcreativetech.tnpsc-academy.html" },
                { label: "Art Studio", href: "./eqbcreativetech.art-studio.html" }
            ],
            resources: [
                { label: "Courses", href: "./eqbcreativetech.it-academy.html" },
                { label: "Mock Tests", href: "./eqbcreativetech.tnpsc-academy.html" },
                { label: "Marketplace", href: "./eqbcreativetech.art-studio.html" },
                { label: "Support", href: "./eqbcreativetech.home.html", scrollTarget: "contact" }
            ],
            contact: [
                "📧 info@eqb.com",
                "📞 +91 9876543210",
                "📍 Chennai, Tamil Nadu"
            ],
            social: [
                { label: "Facebook", icon: "bi-facebook", href: "https://www.facebook.com/" },
                { label: "Instagram", icon: "bi-instagram", href: "https://www.instagram.com/" },
                { label: "LinkedIn", icon: "bi-linkedin", href: "https://www.linkedin.com/" },
                { label: "YouTube", icon: "bi-youtube", href: "https://www.youtube.com/" }
            ],
            copyright: "© 2026 EQB Creative Tech. All Rights Reserved."
        }
    },
    // Homepage-only sections rendered into the HTML placeholders.
    pageContent: {
        hero: {
            badge: "🚀 Multi-Domain Learning Platform",
            titleHtml: "One Platform.<br><span class=\"text-primary\">Endless Possibilities.</span>",
            description: "Empower your future with IT skills, TNPSC preparation and creative art opportunities—all in one place.",
            actions: [
                { label: "Explore Platform", variant: "btn-primary btn-lg", href: null },
                { label: "Learn More", variant: "btn-outline-dark btn-lg", href: null }
            ],
            card: {
                floatingIcons: [
                    { className: "icon1", icon: "bi-laptop" },
                    { className: "icon2", icon: "bi-book" },
                    { className: "icon3", icon: "bi-palette" }
                ],
                centerIcon: "bi-stars",
                title: "Learn • Prepare • Create",
                subtitle: "IT Academy | TNPSC Academy | Art Studio"
            }
        },
        sections: {
            domains: {
                tag: "Our Ecosystem",
                titleHtml: "Three Powerful Domains.<br>One Unified Platform.",
                subtitle: "Choose your learning path and unlock opportunities across technology, government careers and creative arts."
            },
            howItWorks: {
                tag: "Simple Process",
                title: "How It Works",
                subtitle: "Get started in just a few simple steps."
            },
            contact: {
                tag: "Contact Us",
                title: "Let's Connect"
            },
            newsletter: {
                title: "Stay Updated",
                description: "Subscribe for latest courses, TNPSC updates, events and creative opportunities."
            }
        },
        heroStats: [
            { value: "5000+", label: "Students" },
            { value: "150+", label: "Courses" },
            { value: "95%", label: "Success Rate" }
        ],
        domains: [
            {
                cardClass: "it-card",
                icon: "bi-laptop",
                title: "IT Academy",
                description: "Industry-focused technology courses with hands-on projects and career guidance.",
                features: ["Web Development", "Angular & React", "UI/UX Design", "Placement Support"],
                buttonLabel: "Explore Courses",
                href: "./eqbcreativetech.it-academy.html"
            },
            {
                cardClass: "tnpsc-card",
                icon: "bi-book",
                title: "TNPSC Academy",
                description: "Structured preparation programs with mock tests, materials and expert guidance.",
                features: ["Group 2 & 2A", "Group 4", "Daily Tests", "Current Affairs"],
                buttonLabel: "Start Preparation",
                href: "./eqbcreativetech.tnpsc-academy.html"
            },
            {
                cardClass: "art-card",
                icon: "bi-palette",
                title: "Art Studio",
                description: "Showcase and sell your creative work through our growing digital marketplace.",
                features: ["Paintings", "Digital Art", "Artist Profiles", "Marketplace"],
                buttonLabel: "Visit Gallery",
                href: "./eqbcreativetech.art-studio.html"
            }
        ],
        stats: [
            { value: "5000+", label: "Active Students" },
            { value: "150+", label: "Courses" },
            { value: "50+", label: "Expert Mentors" },
            { value: "95%", label: "Success Rate" }
        ],
        steps: [
            { number: "01", icon: "bi-person-plus", title: "Create Account", description: "Register and create your profile in a few minutes." },
            { number: "02", icon: "bi-compass", title: "Choose Domain", description: "Select IT Academy, TNPSC Academy or Art Studio." },
            { number: "03", icon: "bi-mortarboard", title: "Start Learning", description: "Access resources, training and mentorship instantly." },
            { number: "04", icon: "bi-trophy", title: "Achieve Success", description: "Reach your goals and unlock new opportunities." }
        ],
        contactAside: {
            tag: "About EQB",
            title: "EQB Creative Tech",
            description: "One platform for learning, preparation and creativity — helping students, aspirants and artists grow with guidance, resources and community support.",
            pillars: [
                { icon: "bi-mortarboard", title: "Learn with purpose", text: "Structured programs designed for real progress." },
                { icon: "bi-compass", title: "Choose your path", text: "IT Academy, TNPSC Academy or Art Studio — all in one place." },
                { icon: "bi-stars", title: "Grow with confidence", text: "Mentorship, practice and tools to help you move forward." }
            ],
            channels: [
                { icon: "bi-envelope", label: "Email", value: "info@eqb.com" },
                { icon: "bi-telephone", label: "Phone", value: "+91 9876543210" },
                { icon: "bi-geo-alt", label: "Location", value: "Chennai, Tamil Nadu" }
            ]
        }
    },
    // Theme groups shown in the popup. Add new palette options here.
    themeGroups: [
        {
            label: "Single Colors",
            themes: [
                {
                    id: "solid-blue",
                    name: "Royal Blue",
                    swatch: "#2563eb",
                    vars: {
                        "--bg": "#f4f8ff",
                        "--surface": "#ffffff",
                        "--surface-soft": "#edf4ff",
                        "--primary": "#2563eb",
                        "--primary-strong": "#1d4ed8",
                        "--primary-soft": "#dbeafe",
                        "--secondary": "#2563eb",
                        "--accent": "#2563eb",
                        "--gradient": "linear-gradient(135deg,#2563eb,#2563eb)",
                        "--hero-tint": "radial-gradient(circle at top left, rgba(37,99,235,.14), transparent 40%), radial-gradient(circle at bottom right, rgba(37,99,235,.10), transparent 35%)"
                    }
                },
                {
                    id: "solid-green",
                    name: "Aqua Teal",
                    swatch: "#0f766e",
                    vars: {
                        "--bg": "#f2fbfa",
                        "--surface": "#ffffff",
                        "--surface-soft": "#e6f8f6",
                        "--primary": "#0f766e",
                        "--primary-strong": "#115e59",
                        "--primary-soft": "#ccfbf1",
                        "--secondary": "#14b8a6",
                        "--accent": "#2dd4bf",
                        "--gradient": "linear-gradient(135deg,#0f766e,#0f766e)",
                        "--hero-tint": "radial-gradient(circle at top left, rgba(15,118,110,.14), transparent 40%), radial-gradient(circle at bottom right, rgba(45,212,191,.10), transparent 35%)"
                    }
                },
                {
                    id: "solid-orange",
                    name: "Ice Cyan",
                    swatch: "#0891b2",
                    vars: {
                        "--bg": "#f2fbfd",
                        "--surface": "#ffffff",
                        "--surface-soft": "#e8f8fc",
                        "--primary": "#0891b2",
                        "--primary-strong": "#0e7490",
                        "--primary-soft": "#cffafe",
                        "--secondary": "#06b6d4",
                        "--accent": "#67e8f9",
                        "--gradient": "linear-gradient(135deg,#0891b2,#0891b2)",
                        "--hero-tint": "radial-gradient(circle at top left, rgba(8,145,178,.16), transparent 40%), radial-gradient(circle at bottom right, rgba(103,232,249,.10), transparent 35%)"
                    }
                },
                {
                    id: "solid-rose",
                    name: "Cool Indigo",
                    swatch: "#4f46e5",
                    vars: {
                        "--bg": "#f5f6ff",
                        "--surface": "#ffffff",
                        "--surface-soft": "#ecefff",
                        "--primary": "#4f46e5",
                        "--primary-strong": "#4338ca",
                        "--primary-soft": "#e0e7ff",
                        "--secondary": "#6366f1",
                        "--accent": "#818cf8",
                        "--gradient": "linear-gradient(135deg,#4f46e5,#4f46e5)",
                        "--hero-tint": "radial-gradient(circle at top left, rgba(79,70,229,.16), transparent 40%), radial-gradient(circle at bottom right, rgba(129,140,248,.10), transparent 35%)"
                    }
                },
                {
                    id: "solid-violet",
                    name: "Soft Violet",
                    swatch: "#6d28d9",
                    vars: {
                        "--bg": "#f7f4ff",
                        "--surface": "#ffffff",
                        "--surface-soft": "#f1ebff",
                        "--primary": "#6d28d9",
                        "--primary-strong": "#5b21b6",
                        "--primary-soft": "#ede9fe",
                        "--secondary": "#8b5cf6",
                        "--accent": "#c4b5fd",
                        "--gradient": "linear-gradient(135deg,#6d28d9,#6d28d9)",
                        "--hero-tint": "radial-gradient(circle at top left, rgba(109,40,217,.16), transparent 40%), radial-gradient(circle at bottom right, rgba(196,181,253,.10), transparent 35%)"
                    }
                }
            ]
        },
        {
            label: "Gradient Colors",
            themes: [
                {
                    id: "gradient-ocean",
                    name: "Ocean Flow",
                    swatch: "linear-gradient(135deg,#0ea5e9,#14b8a6)",
                    vars: {
                        "--bg": "#f1fbfd",
                        "--surface": "#ffffff",
                        "--surface-soft": "#e5f8fb",
                        "--primary": "#0ea5e9",
                        "--primary-strong": "#0284c7",
                        "--primary-soft": "#e0f2fe",
                        "--secondary": "#14b8a6",
                        "--accent": "#06b6d4",
                        "--gradient": "linear-gradient(135deg,#0ea5e9,#14b8a6)",
                        "--hero-tint": "radial-gradient(circle at top left, rgba(14,165,233,.16), transparent 40%), radial-gradient(circle at bottom right, rgba(20,184,166,.14), transparent 35%)"
                    }
                },
                {
                    id: "gradient-sunset",
                    name: "Polar Sky",
                    swatch: "linear-gradient(135deg,#0ea5e9,#6366f1)",
                    vars: {
                        "--bg": "#f3f7ff",
                        "--surface": "#ffffff",
                        "--surface-soft": "#eaf1ff",
                        "--primary": "#0ea5e9",
                        "--primary-strong": "#0284c7",
                        "--primary-soft": "#e0f2fe",
                        "--secondary": "#6366f1",
                        "--accent": "#93c5fd",
                        "--gradient": "linear-gradient(135deg,#0ea5e9,#6366f1)",
                        "--hero-tint": "radial-gradient(circle at top left, rgba(14,165,233,.16), transparent 40%), radial-gradient(circle at bottom right, rgba(99,102,241,.14), transparent 35%)"
                    }
                },
                {
                    id: "gradient-forest",
                    name: "Forest Blend",
                    swatch: "linear-gradient(135deg,#16a34a,#84cc16)",
                    vars: {
                        "--bg": "#f4fbf5",
                        "--surface": "#ffffff",
                        "--surface-soft": "#ebf8ed",
                        "--primary": "#16a34a",
                        "--primary-strong": "#15803d",
                        "--primary-soft": "#dcfce7",
                        "--secondary": "#84cc16",
                        "--accent": "#22c55e",
                        "--gradient": "linear-gradient(135deg,#16a34a,#84cc16)",
                        "--hero-tint": "radial-gradient(circle at top left, rgba(22,163,74,.16), transparent 40%), radial-gradient(circle at bottom right, rgba(132,204,22,.14), transparent 35%)"
                    }
                },
                {
                    id: "gradient-berry",
                    name: "Midnight Bloom",
                    swatch: "linear-gradient(135deg,#a855f7,#3b82f6)",
                    vars: {
                        "--bg": "#f6f5ff",
                        "--surface": "#ffffff",
                        "--surface-soft": "#efeeff",
                        "--primary": "#a855f7",
                        "--primary-strong": "#9333ea",
                        "--primary-soft": "#f3e8ff",
                        "--secondary": "#3b82f6",
                        "--accent": "#c4b5fd",
                        "--gradient": "linear-gradient(135deg,#a855f7,#3b82f6)",
                        "--hero-tint": "radial-gradient(circle at top left, rgba(168,85,247,.16), transparent 40%), radial-gradient(circle at bottom right, rgba(59,130,246,.14), transparent 35%)"
                    }
                },
                {
                    id: "gradient-gold",
                    name: "Arctic Glow",
                    swatch: "linear-gradient(135deg,#06b6d4,#8b5cf6)",
                    vars: {
                        "--bg": "#f3fbfd",
                        "--surface": "#ffffff",
                        "--surface-soft": "#e8f8fc",
                        "--primary": "#06b6d4",
                        "--primary-strong": "#0891b2",
                        "--primary-soft": "#cffafe",
                        "--secondary": "#8b5cf6",
                        "--accent": "#67e8f9",
                        "--gradient": "linear-gradient(135deg,#06b6d4,#8b5cf6)",
                        "--hero-tint": "radial-gradient(circle at top left, rgba(6,182,212,.16), transparent 40%), radial-gradient(circle at bottom right, rgba(139,92,246,.14), transparent 35%)"
                    }
                }
            ]
        }
    ]
};

window.EQB_DATA.getNavItems = function (activeId) {
    const onHome = activeId === "home";

    return this.site.nav.map((item) => ({
        label: item.label,
        href: onHome && item.homeHref != null ? item.homeHref : item.href,
        scrollTarget: item.scrollTarget || null,
        active: item.id === activeId
    }));
};
