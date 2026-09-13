// Bootstrap the app once the shared modules and page DOM are ready.
(async function () {
    if (window.location.hash === "#") {
        const cleanUrl = `${window.location.pathname}${window.location.search}`;
        window.history.replaceState(null, document.title, cleanUrl);
    }

    const requiredModules = [
        "EQB_DATA",
        "EQB_UTILS",
        "EQB_CONTENT_LOADER",
        "EQB_CONTENT",
        "EQB_THEME",
        "EQB_UI",
        "EQB_CHROME",
        "EQB_FORMS"
    ];
    const missingModules = requiredModules.filter((moduleName) => !window[moduleName]);

    if (missingModules.length) {
        console.error(`EQB app bootstrap failed. Missing modules: ${missingModules.join(", ")}`);
        return;
    }

    const pageId = document.body.dataset.page || "home";
    const chrome = window.EQB_CHROME.mount();
    let interactionsInitialized = false;

    const elements = {
        ...chrome,
        navLinks: document.getElementById("navLinks"),
        homeHero: document.getElementById("homeHero"),
        heroStats: document.getElementById("heroStats"),
        domainGrid: document.getElementById("domainGrid"),
        statsGrid: document.getElementById("statsGrid"),
        stepsGrid: document.getElementById("stepsGrid"),
        domainsSectionHeader: document.getElementById("domainsSectionHeader"),
        howItWorksSectionHeader: document.getElementById("howItWorksSectionHeader"),
        contactCardHeader: document.getElementById("contactCardHeader"),
        newsletterHeader: document.getElementById("newsletterHeader"),
        footerQuickLinks: document.getElementById("footerQuickLinks"),
        footerResourceLinks: document.getElementById("footerResourceLinks"),
        footerContactInfo: document.getElementById("footerContactInfo"),
        socialIcons: document.getElementById("socialIcons"),
        newsletterForm: document.getElementById("newsletterForm"),
        newsletterEmail: document.getElementById("newsletterEmail"),
        newsletterStatus: document.getElementById("newsletterStatus"),
        contactForm: document.getElementById("contactForm"),
        contactStatus: document.getElementById("contactStatus"),
        contactAside: document.getElementById("contactAside")
    };

    function renderPageContent() {
        window.EQB_CONTENT.renderSharedChrome({
            activeNavId: pageId,
            navLinks: elements.navLinks,
            footerQuickLinks: elements.footerQuickLinks,
            footerResourceLinks: elements.footerResourceLinks,
            footerContactInfo: elements.footerContactInfo,
            socialIcons: elements.socialIcons
        });

        if (pageId === "home") {
            window.EQB_CONTENT.renderHomeContent({
                homeHero: elements.homeHero,
                heroStats: elements.heroStats,
                domainGrid: elements.domainGrid,
                statsGrid: elements.statsGrid,
                stepsGrid: elements.stepsGrid,
                domainsSectionHeader: elements.domainsSectionHeader,
                howItWorksSectionHeader: elements.howItWorksSectionHeader,
                contactCardHeader: elements.contactCardHeader,
                newsletterHeader: elements.newsletterHeader
            });
            window.EQB_CONTENT.renderContactAside(elements.contactAside);
        }

        if (window.EQB_ACADEMY_CONTENT) {
            window.EQB_ACADEMY_CONTENT.renderPage();
        }
    }

    function initInteractionsOnce() {
        if (interactionsInitialized) {
            return;
        }

        interactionsInitialized = true;

        window.EQB_THEME.initThemeController({
            themePaletteToggle: elements.themePaletteToggle,
            themePalettePanel: elements.themePalettePanel
        });

        window.EQB_UI.initUiInteractions({
            chatToggle: elements.chatToggle,
            chatWidget: elements.chatWidget,
            chatClose: elements.chatClose,
            chatForm: elements.chatForm,
            chatInput: elements.chatInput,
            chatMessages: elements.chatMessages,
            backToTop: elements.backToTop
        });

        window.EQB_UI.initNewsletterForm({
            newsletterForm: elements.newsletterForm,
            newsletterEmail: elements.newsletterEmail,
            newsletterStatus: elements.newsletterStatus
        });

        window.EQB_UI.initContactForm({
            contactForm: elements.contactForm,
            contactStatus: elements.contactStatus
        });
    }

    await window.EQB_CONTENT_LOADER.load(pageId, {
        onUpdated: () => {
            renderPageContent();
            initInteractionsOnce();
        }
    });

    if (pageId === "home") {
        const scrollTargetStorageKey = window.EQB_DATA.scrollTargetStorageKey || "eqb-scroll-target";
        const pendingScroll = sessionStorage.getItem(scrollTargetStorageKey);

        if (pendingScroll === "contact") {
            sessionStorage.removeItem(scrollTargetStorageKey);
            window.requestAnimationFrame(() => {
                window.EQB_UI.scrollToContact({ behavior: "auto" });
            });
        } else if (window.location.hash === "#contact") {
            window.requestAnimationFrame(() => {
                window.EQB_UI.scrollToContact({ behavior: "auto" });
                window.history.replaceState(
                    null,
                    document.title,
                    `${window.location.pathname}${window.location.search}`
                );
            });
        }
    }
})();
