// Shared academy-page renderer. Reads window.EQB_PAGE_DATA from the current page file.
(function () {
    function renderPage() {
        const pageData = window.EQB_CONTENT_STATE?.pageData || window.EQB_PAGE_DATA;

        if (!pageData) {
            return;
        }

        document.title = pageData.pageTitle;

        const navCta = document.getElementById("navCta");
        if (navCta && pageData.navbarCta) {
            navCta.textContent = pageData.navbarCta.label;
            navCta.setAttribute("href", pageData.navbarCta.href);
        }

        const buildMetricCards = () => pageData.hero.metrics.map((metric) => `
            <div class="metric-card">
                <strong>${metric.value}</strong>
                <span>${metric.label}</span>
            </div>`).join("");

        const buildShowcaseCards = () => pageData.hero.showcase.cards.map((card) => `
                            <div class="showcase-card ${card.className}">
                                <i class="bi ${card.icon}"></i>
                                <span>${card.label}</span>
                            </div>`).join("");

        const buildTrackCards = () => pageData.tracks.items.map((item) => `
                    <div class="col-md-6 col-lg-3">
                        <article class="academy-card">
                            <i class="bi ${item.icon}"></i>
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                        </article>
                    </div>`).join("");

        const buildOutcomeItems = () => pageData.outcomes.items.map((item) => `
                                <div><i class="bi bi-check2-circle"></i> ${item}</div>`).join("");

        const buildProgramTiles = () => pageData.outcomes.steps.map((step) => `
                            <div class="program-tile">
                                <span>${step.number}</span>
                                <h3>${step.title}</h3>
                                <p>${step.description}</p>
                            </div>`).join("");

        const buildActionButtons = (actions) => actions.map((action) => {
            const scrollAttr = action.scrollTarget ? ` data-eqb-scroll="${action.scrollTarget}"` : "";
            return `
                            <a class="btn ${action.variant}" href="${action.href}"${scrollAttr}>${action.label}</a>`;
        }).join("");

        const heroContainer = document.getElementById("academyHero");
        if (heroContainer) {
            heroContainer.innerHTML = `
                <div class="row align-items-center g-5">
                    <div class="col-lg-7">
                        <span class="academy-badge">${pageData.hero.badge}</span>
                        <h1>${pageData.hero.title}</h1>
                        <p class="academy-lead">${pageData.hero.lead}</p>
                        <div class="d-flex flex-wrap gap-3 mt-4">
                            ${buildActionButtons(pageData.hero.actions)}
                        </div>
                        <div class="academy-metrics mt-5">
                            ${buildMetricCards()}
                        </div>
                    </div>
                    <div class="col-lg-5">
                        <div class="academy-showcase">
                            ${buildShowcaseCards()}
                            <div class="showcase-panel">
                                <p class="mb-1 text-uppercase">${pageData.hero.showcase.eyebrow}</p>
                                <h3>${pageData.hero.showcase.title}</h3>
                                <ul>
                                    ${pageData.hero.showcase.points.map((point) => `<li>${point}</li>`).join("")}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>`;
        }

        const tracksSection = document.getElementById("tracks");
        const tracksContainer = document.getElementById("academyTracks");
        if (tracksSection && pageData.tracks.id) {
            tracksSection.id = pageData.tracks.id;
        }
        if (tracksContainer) {
            tracksContainer.innerHTML = `
                <div class="section-heading text-center">
                    <span class="section-tag">${pageData.tracks.tag}</span>
                    <h2>${pageData.tracks.title}</h2>
                    <p>${pageData.tracks.description}</p>
                </div>
                <div class="row g-4 mt-3">
                    ${buildTrackCards()}
                </div>`;
        }

        const outcomesContainer = document.getElementById("academyOutcomes");
        if (outcomesContainer) {
            outcomesContainer.innerHTML = `
                <div class="row align-items-center g-4">
                    <div class="col-lg-6">
                        <div class="outcome-panel">
                            <span class="section-tag">${pageData.outcomes.tag}</span>
                            <h2 class="mt-3">${pageData.outcomes.title}</h2>
                            <p>${pageData.outcomes.description}</p>
                            <div class="outcome-list">
                                ${buildOutcomeItems()}
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="program-grid">
                            ${buildProgramTiles()}
                        </div>
                    </div>
                </div>`;
        }

        const ctaContainer = document.getElementById("academyCta");
        if (ctaContainer) {
            ctaContainer.innerHTML = `
                <div class="cta-banner">
                    <div>
                        <span class="section-tag">${pageData.cta.tag}</span>
                        <h2 class="mt-3">${pageData.cta.title}</h2>
                        <p>${pageData.cta.description}</p>
                    </div>
                    <div class="d-flex flex-wrap gap-3">
                        ${buildActionButtons(pageData.cta.actions)}
                    </div>
                </div>`;
        }
    }

    window.EQB_ACADEMY_CONTENT = { renderPage };
})();
