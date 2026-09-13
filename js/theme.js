// Handles theme rendering, mode switching, custom colors, and popup state.
(function () {
    const {
        themeStorageKey,
        themeModeStorageKey,
        customThemeStorageKey,
        baseThemeVars,
        modeVars,
        defaultCustomTheme,
        themeGroups
    } = window.EQB_DATA;

    const { hexToRgb, mixWithWhite, withAlpha } = window.EQB_UTILS;
    // Custom is treated as a special theme entry so it can live with the presets.
    const customThemeOption = {
        id: "custom",
        name: "Custom",
        vars: {}
    };
    const allThemes = themeGroups.flatMap((group) => group.themes);
    const themeMap = new Map([...allThemes, customThemeOption].map((theme) => [theme.id, theme]));
    const allowedThemes = [...allThemes.map((theme) => theme.id), customThemeOption.id];
    const allowedModes = Object.keys(modeVars);

    // Initializes theme state, renders the palette UI, and wires all theme actions.
    function initThemeController({ themePaletteToggle, themePalettePanel }) {
        const savedTheme = localStorage.getItem(themeStorageKey);
        const savedMode = localStorage.getItem(themeModeStorageKey);
        const savedCustomTheme = localStorage.getItem(customThemeStorageKey);
        let customTheme = { ...defaultCustomTheme };

        if (savedCustomTheme) {
            try {
                customTheme = { ...defaultCustomTheme, ...JSON.parse(savedCustomTheme) };
            } catch (error) {
                console.warn("EQB custom theme could not be restored. Using defaults.");
            }
        }

        const preferredTheme = allowedThemes.includes(savedTheme) ? savedTheme : "gradient-ocean";
        const preferredMode = allowedModes.includes(savedMode) ? savedMode : "light";
        let currentThemeId = preferredTheme;
        let currentMode = preferredMode;
        let currentOpenSection = "mode";

        // Maps a theme id back to the accordion group it belongs to.
        const getSectionForTheme = (themeId) => {
            if (themeId === "custom") {
                return "custom";
            }

            return themeGroups.some((group) => group.label === "Gradient Colors" && group.themes.some((theme) => theme.id === themeId))
                ? "gradient"
                : "single";
        };

        // Builds the live variable set for the custom theme editor.
        const getCustomThemeVars = () => {
            const primaryRgb = hexToRgb(customTheme.primary);
            const secondaryRgb = hexToRgb(customTheme.secondary);

            return {
                "--bg": customTheme.background,
                "--surface": currentMode === "dark" ? modeVars.dark["--surface"] : "#ffffff",
                "--surface-soft": currentMode === "dark" ? modeVars.dark["--surface-soft"] : mixWithWhite(customTheme.primary, 0.9),
                "--primary": customTheme.primary,
                "--primary-strong": mixWithWhite(customTheme.primary, 0.1),
                "--primary-soft": mixWithWhite(customTheme.primary, 0.82),
                "--secondary": customTheme.secondary,
                "--accent": customTheme.accent,
                "--gradient": `linear-gradient(135deg,${customTheme.primary},${customTheme.secondary})`,
                "--hero-tint": `radial-gradient(circle at top left, rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},.16), transparent 40%), radial-gradient(circle at bottom right, rgba(${secondaryRgb.r},${secondaryRgb.g},${secondaryRgb.b},.14), transparent 35%)`
            };
        };

        // Keeps the footer readable regardless of the selected mode or palette.
        const getFooterVars = (theme) => {
            const primaryColor = theme.id === "custom" ? customTheme.primary : (theme.vars["--primary"] || baseThemeVars["--primary"]);
            const secondaryColor = theme.id === "custom" ? customTheme.secondary : (theme.vars["--secondary"] || baseThemeVars["--secondary"]);

            return {
                "--footer-bg": currentMode === "dark"
                    ? `linear-gradient(135deg, ${withAlpha(primaryColor, 0.24)}, ${withAlpha(secondaryColor, 0.18)}), linear-gradient(135deg,#020617,#0f172a)`
                    : `linear-gradient(135deg, ${withAlpha(primaryColor, 0.96)}, ${withAlpha(secondaryColor, 0.88)})`,
                "--footer-text": "#f8fafc",
                "--footer-muted": currentMode === "dark" ? "#cbd5e1" : "rgba(248,250,252,.82)",
                "--footer-icon-bg": currentMode === "dark" ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.18)"
            };
        };

        // Generates the preview swatch for the custom option button.
        const getCustomSwatch = () => `linear-gradient(135deg,${customTheme.primary},${customTheme.secondary})`;

        // Shared accordion wrapper used for Mode, Single, Gradient, and Custom.
        const renderAccordionSection = (sectionId, label, content) => `
    <div class="theme-accordion-item${currentOpenSection === sectionId ? " open" : ""}" data-section="${sectionId}">
        <button class="theme-accordion-trigger" type="button" data-accordion-trigger="${sectionId}" aria-expanded="${currentOpenSection === sectionId}">
            ${label}
        </button>
        <div class="theme-accordion-content">
            ${content}
        </div>
    </div>`;

        // Rebuilds the full theme palette markup from the current state.
        const renderThemePalette = () => {
            const modeControls = renderAccordionSection("mode", "Mode", `
        <div class="theme-mode-toggle" role="group" aria-label="Theme mode selector">
            <button class="theme-mode-switch${currentMode === "dark" ? " active" : ""}" type="button" aria-label="Toggle light and night mode" aria-pressed="${currentMode === "dark"}">
            </button>
        </div>`);

            const presetSections = themeGroups.map((group) => {
                const options = group.themes.map((theme) => `
        <button class="theme-option" type="button" data-theme="${theme.id}">
            <span class="theme-swatch" style="background:${theme.swatch}"></span>
            ${theme.name}
        </button>`).join("");

                const sectionId = group.label === "Gradient Colors" ? "gradient" : "single";

                return renderAccordionSection(
                    sectionId,
                    group.label === "Gradient Colors" ? "Gradient" : "Single",
                    options
                );
            }).join("");

            const customOption = `
        <button class="theme-option${currentThemeId === "custom" ? " active" : ""}" type="button" data-theme="custom" id="customThemeOption">
            <span class="theme-swatch" id="customThemeSwatch" style="background:${getCustomSwatch()}"></span>
            Custom
        </button>`;

            const customPanel = renderAccordionSection("custom", "Custom", `
        ${customOption}
        <div class="theme-custom-panel${currentThemeId === "custom" ? " open" : ""}" id="themeCustomPanel">
            <div class="theme-custom-header">
                <span class="theme-custom-title">Custom Theme</span>
                <span class="theme-custom-note">Pick your own colors and preview them instantly.</span>
            </div>
            <div class="theme-custom-grid">
                <div class="theme-custom-field">
                    <label for="customPrimary">Primary</label>
                    <input id="customPrimary" data-custom-color="primary" type="color" value="${customTheme.primary}">
                </div>
                <div class="theme-custom-field">
                    <label for="customSecondary">Secondary</label>
                    <input id="customSecondary" data-custom-color="secondary" type="color" value="${customTheme.secondary}">
                </div>
                <div class="theme-custom-field">
                    <label for="customAccent">Accent</label>
                    <input id="customAccent" data-custom-color="accent" type="color" value="${customTheme.accent}">
                </div>
                <div class="theme-custom-field">
                    <label for="customBackground">Background</label>
                    <input id="customBackground" data-custom-color="background" type="color" value="${customTheme.background}">
                </div>
            </div>
            <div class="theme-custom-actions">
                <button class="theme-custom-apply" type="button">Apply Custom</button>
                <button class="theme-custom-reset" type="button">Reset</button>
            </div>
        </div>`);

            themePalettePanel.innerHTML = `${modeControls}${presetSections}${customPanel}`;
        };

        // Returns the live theme option buttons after rendering.
        const getThemeButtons = () => themePalettePanel.querySelectorAll(".theme-option");
        // Finds the mode toggle button inside the accordion.
        const getModeSwitch = () => themePalettePanel.querySelector(".theme-mode-switch");
        // Grabs the custom theme panel so it can be shown or hidden on demand.
        const getCustomPanel = () => themePalettePanel.querySelector("#themeCustomPanel");
        // Targets the custom swatch preview for instant visual feedback.
        const getCustomThemeSwatch = () => themePalettePanel.querySelector("#customThemeSwatch");
        // Collects the custom color inputs so their values can stay in sync.
        const getCustomThemeInputs = () => themePalettePanel.querySelectorAll("[data-custom-color]");
        // Returns every accordion item so the open state can be synchronized.
        const getAccordionItems = () => themePalettePanel.querySelectorAll(".theme-accordion-item");

        // Opens or closes the whole palette popup.
        const setPaletteOpen = (isOpen) => {
            themePalettePanel.classList.toggle("open", isOpen);
            themePaletteToggle.setAttribute("aria-expanded", String(isOpen));
            themePalettePanel.setAttribute("aria-hidden", String(!isOpen));
        };

        // Keeps the visible accordion section and ARIA state aligned with the current section.
        const syncAccordionState = () => {
            getAccordionItems().forEach((item) => {
                const isOpen = item.dataset.section === currentOpenSection;
                item.classList.toggle("open", isOpen);
                const trigger = item.querySelector(".theme-accordion-trigger");
                if (trigger) {
                    trigger.setAttribute("aria-expanded", String(isOpen));
                }
            });
        };

        const applyTheme = (themeName) => {
            const theme = themeMap.get(themeName) || themeMap.get("gradient-ocean");
            const resolvedVars = {
                ...baseThemeVars,
                ...(theme.id === "custom" ? getCustomThemeVars() : theme.vars),
                ...(modeVars[currentMode] || {}),
                ...getFooterVars(theme)
            };

            document.body.dataset.theme = theme.id;
            document.body.dataset.mode = currentMode;

            Object.entries(resolvedVars).forEach(([variableName, value]) => {
                document.body.style.setProperty(variableName, value);
            });

            document.body.style.colorScheme = currentMode;

            getThemeButtons().forEach((button) => {
                button.classList.toggle("active", button.dataset.theme === theme.id);
            });

            syncAccordionState();

            const customPanel = getCustomPanel();
            if (customPanel) {
                customPanel.classList.toggle("open", theme.id === "custom");
            }

            const customSwatch = getCustomThemeSwatch();
            if (customSwatch) {
                customSwatch.style.background = getCustomSwatch();
            }

            getCustomThemeInputs().forEach((input) => {
                input.value = customTheme[input.dataset.customColor];
            });

            const modeSwitch = getModeSwitch();
            if (modeSwitch) {
                modeSwitch.classList.toggle("active", currentMode === "dark");
                modeSwitch.setAttribute("aria-pressed", String(currentMode === "dark"));
            }

            localStorage.setItem(themeStorageKey, theme.id);
            localStorage.setItem(themeModeStorageKey, currentMode);
            localStorage.setItem(customThemeStorageKey, JSON.stringify(customTheme));
            currentThemeId = theme.id;
        };

        // Toggles which accordion section is expanded at a time.
        const toggleAccordionSection = (sectionId) => {
            currentOpenSection = currentOpenSection === sectionId ? "" : sectionId;
            syncAccordionState();
        };

        const applyMode = (modeName) => {
            currentMode = allowedModes.includes(modeName) ? modeName : "light";
            applyTheme(currentThemeId);
        };

        renderThemePalette();
        applyTheme(preferredTheme);

        setPaletteOpen(false);

        window.EQB_THEME.applyTheme = applyTheme;
        window.EQB_THEME.applyMode = applyMode;
        window.EQB_THEME.openPalette = () => setPaletteOpen(true);
        window.EQB_THEME.closePalette = () => setPaletteOpen(false);

        themePaletteToggle.addEventListener("click", () => {
            setPaletteOpen(!themePalettePanel.classList.contains("open"));
        });

        document.addEventListener("click", (event) => {
            const clickedInsidePalette =
                themePalettePanel.contains(event.target) ||
                themePaletteToggle.contains(event.target);

            if (!clickedInsidePalette) {
                setPaletteOpen(false);
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                setPaletteOpen(false);
            }
        });

        themePalettePanel.addEventListener("click", (event) => {
            const accordionTrigger = event.target.closest(".theme-accordion-trigger");

            if (accordionTrigger) {
                toggleAccordionSection(accordionTrigger.dataset.accordionTrigger);
                return;
            }

            const modeButton = event.target.closest(".theme-mode-switch");

            if (modeButton) {
                currentOpenSection = "mode";
                applyMode(currentMode === "dark" ? "light" : "dark");
                return;
            }

            const button = event.target.closest(".theme-option");

            if (event.target.closest(".theme-custom-apply")) {
                currentOpenSection = "custom";
                applyTheme("custom");
                setPaletteOpen(false);
                return;
            }

            if (event.target.closest(".theme-custom-reset")) {
                Object.assign(customTheme, defaultCustomTheme);
                currentOpenSection = currentThemeId === "custom" ? "custom" : currentOpenSection;
                applyTheme(currentThemeId === "custom" ? "custom" : currentThemeId);
                return;
            }

            if (!button) {
                return;
            }

            currentOpenSection = button.dataset.theme === "custom"
                ? "custom"
                : themeGroups.some((group) => group.label === "Gradient Colors" && group.themes.some((theme) => theme.id === button.dataset.theme))
                    ? "gradient"
                    : "single";
            applyTheme(button.dataset.theme);
            setPaletteOpen(false);
        });

        themePalettePanel.addEventListener("input", (event) => {
            const colorInput = event.target.closest("[data-custom-color]");

            if (!colorInput) {
                return;
            }

            customTheme[colorInput.dataset.customColor] = colorInput.value;

            const customSwatch = getCustomThemeSwatch();
            if (customSwatch) {
                customSwatch.style.background = getCustomSwatch();
            }

            if (currentThemeId === "custom") {
                currentOpenSection = "custom";
                applyTheme("custom");
            }
        });

        return {
            applyTheme,
            applyMode
        };
    }

    window.EQB_THEME = { initThemeController };
})();
