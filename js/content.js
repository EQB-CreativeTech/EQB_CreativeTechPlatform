// Renders shared chrome and homepage sections from the centralized data object.
(function () {
    function getSite() {
        return window.EQB_CONTENT_STATE?.site || window.EQB_DATA.site;
    }

    function getPageContent() {
        return window.EQB_CONTENT_STATE?.pageContent || window.EQB_DATA.pageContent;
    }

    function fillIfPresent(element, html) {
        if (element) {
            element.innerHTML = html;
        }
    }

    function scrollLinkAttributes(item) {
        return item.scrollTarget ? ` data-eqb-scroll="${item.scrollTarget}"` : "";
    }

    function renderActionControl(action) {
        if (action.href) {
            return `<a class="btn ${action.variant}" href="${action.href}">${action.label}</a>`;
        }

        return `<button class="btn ${action.variant}" type="button">${action.label}</button>`;
    }

    function renderNav(navLinks, activeNavId) {
        if (!navLinks) {
            return;
        }

        const navItems = window.EQB_DATA.getNavItems(activeNavId);

        navLinks.innerHTML = navItems.map((item) => `
        <li class="nav-item">
            <a class="nav-link${item.active ? " active" : ""}" href="${item.href}"${scrollLinkAttributes(item)}>
                ${item.label}
            </a>
        </li>`).join("");
    }

    function renderFooter({ footerQuickLinks, footerResourceLinks, footerContactInfo, socialIcons }) {
        const site = getSite();

        fillIfPresent(footerQuickLinks, site.footer.quickLinks.map((item) => `
        <li><a href="${item.href}">${item.label}</a></li>`).join(""));

        fillIfPresent(footerResourceLinks, site.footer.resources.map((item) => `
        <li><a href="${item.href}"${scrollLinkAttributes(item)}>${item.label}</a></li>`).join(""));

        fillIfPresent(footerContactInfo, site.footer.contact.map((item) => `
        <li>${item}</li>`).join(""));

        fillIfPresent(socialIcons, site.footer.social.map((item) => `
        <a href="${item.href}" aria-label="${item.label}" title="${item.label}" target="_blank" rel="noopener noreferrer">
            <i class="bi ${item.icon}"></i>
        </a>`).join(""));
    }

    function renderFooterCopyright() {
        const copyright = getSite().footer?.copyright;
        const footerCopyright = document.getElementById("footerCopyright");

        if (footerCopyright && copyright) {
            footerCopyright.textContent = copyright;
        }
    }

    function renderSharedChrome(elements) {
        const site = getSite();

        renderNav(elements.navLinks, elements.activeNavId);
        renderFooter(elements);
        renderFooterCopyright();

        const footerAbout = document.getElementById("footerAbout");
        if (footerAbout) {
            footerAbout.textContent = site.footer.about;
        }
    }

    function renderHomeHero(homeHero) {
        const hero = getPageContent().hero;
        if (!homeHero || !hero) {
            return;
        }

        const floatingIcons = (hero.card?.floatingIcons || []).map((item) => `
                        <div class="floating-icon ${item.className}">
                            <i class="bi ${item.icon}"></i>
                        </div>`).join("");

        homeHero.innerHTML = `
                <div class="col-lg-6">
                    <span class="badge hero-badge mb-3">
                        ${hero.badge}
                    </span>
                    <h1 class="hero-title">
                        ${hero.titleHtml}
                    </h1>
                    <p class="hero-description">
                        ${hero.description}
                    </p>
                    <div class="d-flex flex-wrap gap-3 mt-4">
                        ${(hero.actions || []).map((action) => renderActionControl(action)).join("")}
                    </div>
                    <div id="heroStats" class="hero-stats mt-5"></div>
                </div>
                <div class="col-lg-6">
                    <div class="hero-card">
                        ${floatingIcons}
                        <div class="hero-main-content">
                            <div class="main-circle">
                                <i class="bi ${hero.card?.centerIcon || "bi-stars"}"></i>
                            </div>
                            <h4 class="mt-4">
                                ${hero.card?.title || ""}
                            </h4>
                            <p>
                                ${hero.card?.subtitle || ""}
                            </p>
                        </div>
                    </div>
                </div>`;
    }

    function renderHomeSectionHeaders(elements) {
        const sections = getPageContent().sections || {};

        if (elements.domainsSectionHeader && sections.domains) {
            elements.domainsSectionHeader.innerHTML = `
                <span class="section-tag">
                    ${sections.domains.tag}
                </span>
                <h2 class="section-title mt-3">
                    ${sections.domains.titleHtml}
                </h2>
                <p class="section-subtitle">
                    ${sections.domains.subtitle}
                </p>`;
        }

        if (elements.howItWorksSectionHeader && sections.howItWorks) {
            elements.howItWorksSectionHeader.innerHTML = `
                <span class="section-tag">
                    ${sections.howItWorks.tag}
                </span>
                <h2 class="section-title mt-3">
                    ${sections.howItWorks.title}
                </h2>
                <p class="section-subtitle">
                    ${sections.howItWorks.subtitle}
                </p>`;
        }

        if (elements.contactCardHeader && sections.contact) {
            elements.contactCardHeader.innerHTML = `
                    <span class="section-tag">
                        ${sections.contact.tag}
                    </span>
                    <h2 class="mt-3 mb-4">
                        ${sections.contact.title}
                    </h2>`;
        }
    }

    function renderNewsletterBlock(newsletterHeader) {
        const newsletter = getPageContent().sections?.newsletter;
        if (!newsletterHeader || !newsletter) {
            return;
        }

        newsletterHeader.innerHTML = `
                <h2>
                    ${newsletter.title}
                </h2>
                <p>
                    ${newsletter.description}
                </p>`;
    }

    function renderHomeContent(elements) {
        const pageContent = getPageContent();
        const {
            homeHero,
            heroStats,
            domainGrid,
            statsGrid,
            stepsGrid,
            domainsSectionHeader,
            howItWorksSectionHeader,
            contactCardHeader,
            newsletterHeader
        } = elements;

        renderHomeHero(homeHero);
        renderHomeSectionHeaders({
            domainsSectionHeader,
            howItWorksSectionHeader,
            contactCardHeader
        });
        renderNewsletterBlock(newsletterHeader);

        const statsTarget = heroStats || document.getElementById("heroStats");

        fillIfPresent(statsTarget, pageContent.heroStats.map((stat) => `
        <div class="stat-box">
            <h3>${stat.value}</h3>
            <p>${stat.label}</p>
        </div>`).join(""));

        fillIfPresent(domainGrid, pageContent.domains.map((domain) => `
        <div class="domain-card ${domain.cardClass}">
            <div class="domain-icon">
                <i class="bi ${domain.icon}"></i>
            </div>
            <h3>
                ${domain.title}
            </h3>
            <p>
                ${domain.description}
            </p>
            <ul class="feature-list">
                ${domain.features.map((feature) => `
                    <li>
                        <i class="bi bi-check-circle-fill"></i>
                        ${feature}
                    </li>`).join("")}
            </ul>
            ${domain.href ? `
            <a class="btn btn-light w-100" href="${domain.href}">
                ${domain.buttonLabel}
            </a>` : `
            <button class="btn btn-light w-100" type="button">
                ${domain.buttonLabel}
            </button>`}
        </div>`).join(""));

        fillIfPresent(statsGrid, pageContent.stats.map((stat) => `
        <div class="stat-item">
            <h2>${stat.value}</h2>
            <p>${stat.label}</p>
        </div>`).join(""));

        fillIfPresent(stepsGrid, pageContent.steps.map((step) => `
        <div class="step-card">
            <div class="step-number">
                ${step.number}
            </div>
            <div class="step-icon">
                <i class="bi ${step.icon}"></i>
            </div>
            <h4>${step.title}</h4>
            <p>
                ${step.description}
            </p>
        </div>`).join(""));
    }

    function renderContactAside(contactAside) {
        const aside = getPageContent().contactAside;
        if (!contactAside || !aside) {
            return;
        }

        contactAside.innerHTML = `
        <span class="section-tag">${aside.tag}</span>
        <h2 class="contact-aside-title">${aside.title}</h2>
        <p class="contact-aside-text">${aside.description}</p>
        <ul class="contact-pillar-list">
            ${aside.pillars.map((item) => `
            <li class="contact-pillar">
                <span class="contact-pillar-icon"><i class="bi ${item.icon}"></i></span>
                <span>
                    <strong>${item.title}</strong>
                    <span>${item.text}</span>
                </span>
            </li>`).join("")}
        </ul>
        <div class="contact-aside-divider" aria-hidden="true"></div>
        <ul class="contact-channel-list">
            ${aside.channels.map((channel) => `
            <li>
                <span class="contact-channel-icon"><i class="bi ${channel.icon}"></i></span>
                <span>
                    <strong>${channel.label}</strong>
                    <span>${channel.value}</span>
                </span>
            </li>`).join("")}
        </ul>`;
    }

    window.EQB_CONTENT = {
        renderSharedChrome,
        renderHomeContent,
        renderContactAside,
        renderHomeHero,
        renderHomeSectionHeaders,
        renderNewsletterBlock
    };
})();
