// Loads marketing content from bundled seed data, optionally merged with a remote API.
(function () {
    function isPlainObject(value) {
        return value !== null && typeof value === "object" && !Array.isArray(value);
    }

    function deepMerge(target, source) {
        if (!source) {
            return target;
        }

        const result = Array.isArray(target) ? target.slice() : { ...target };

        Object.keys(source).forEach((key) => {
            const sourceValue = source[key];
            const targetValue = result[key];

            if (Array.isArray(sourceValue)) {
                result[key] = sourceValue.slice();
                return;
            }

            if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
                result[key] = deepMerge(targetValue, sourceValue);
                return;
            }

            result[key] = sourceValue;
        });

        return result;
    }

    function cloneDeep(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function validateSite(site) {
        return Boolean(site && Array.isArray(site.nav) && site.nav.length && site.footer);
    }

    function validatePageContent(pageContent) {
        return Boolean(pageContent && Array.isArray(pageContent.domains) && pageContent.domains.length);
    }

    function validatePageData(pageData) {
        return Boolean(pageData && pageData.hero && Array.isArray(pageData.hero.metrics));
    }

    function buildSeedState(pageId) {
        const site = cloneDeep(window.EQB_DATA.site);
        const pageContent = cloneDeep(window.EQB_DATA.pageContent);
        const pageData = window.EQB_PAGE_DATA ? cloneDeep(window.EQB_PAGE_DATA) : null;

        return { site, pageContent, pageData, pageId };
    }

    function applyState(state) {
        window.EQB_DATA.site = state.site;
        window.EQB_DATA.pageContent = state.pageContent;

        if (state.pageData) {
            window.EQB_PAGE_DATA = state.pageData;
        }

        window.EQB_CONTENT_STATE = {
            site: state.site,
            pageContent: state.pageContent,
            pageData: state.pageData
        };
    }

    function mergeApiPayload(seedState, payload, pageId) {
        let nextState = { ...seedState };

        if (payload.site && validateSite(deepMerge(seedState.site, payload.site))) {
            nextState.site = deepMerge(seedState.site, payload.site);
        }

        const homeContent = payload.pageContent || payload.pages?.home?.pageContent;
        if (pageId === "home" && homeContent) {
            const mergedPageContent = deepMerge(seedState.pageContent, homeContent);
            if (validatePageContent(mergedPageContent)) {
                nextState.pageContent = mergedPageContent;
            }
        }

        const academyPayload = payload.pageData || payload.pages?.[pageId];
        if (pageId !== "home" && academyPayload) {
            const mergedPageData = deepMerge(seedState.pageData || {}, academyPayload);
            if (validatePageData(mergedPageData)) {
                nextState.pageData = mergedPageData;
            }
        }

        return nextState;
    }

    async function fetchJson(url, timeoutMs) {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

        try {
            const response = await fetch(url, {
                signal: controller.signal,
                headers: { Accept: "application/json" }
            });

            if (!response.ok) {
                throw new Error(`Content API responded with ${response.status}`);
            }

            return await response.json();
        } finally {
            window.clearTimeout(timeoutId);
        }
    }

    function resolveEndpoint(baseUrl, endpointPath) {
        const normalizedBase = baseUrl.replace(/\/$/, "");
        const normalizedPath = endpointPath.startsWith("/") ? endpointPath : `/${endpointPath}`;
        return `${normalizedBase}${normalizedPath}`;
    }

    async function fetchRemoteContent(pageId, apiConfig, seedState) {
        const timeoutMs = apiConfig.timeoutMs || 8000;
        const endpoints = apiConfig.endpoints || {};
        const baseUrl = apiConfig.baseUrl;

        if (endpoints.bundle) {
            const payload = await fetchJson(resolveEndpoint(baseUrl, endpoints.bundle), timeoutMs);
            return mergeApiPayload(seedState, payload, pageId);
        }

        let nextState = { ...seedState };

        if (endpoints.site) {
            const sitePayload = await fetchJson(resolveEndpoint(baseUrl, endpoints.site), timeoutMs);
            if (validateSite(deepMerge(seedState.site, sitePayload))) {
                nextState.site = deepMerge(seedState.site, sitePayload);
            }
        }

        const pageEndpoint = pageId === "home"
            ? endpoints.home
            : (endpoints.page || "").replace(":slug", pageId);

        if (pageEndpoint) {
            const pagePayload = await fetchJson(resolveEndpoint(baseUrl, pageEndpoint), timeoutMs);
            nextState = mergeApiPayload(nextState, pagePayload, pageId);
        }

        return nextState;
    }

    async function load(pageId, options = {}) {
        const { onUpdated } = options;
        const apiConfig = window.EQB_DATA.api || {};
        const seedState = buildSeedState(pageId);

        applyState(seedState);
        onUpdated?.();

        if (!apiConfig.baseUrl) {
            return window.EQB_CONTENT_STATE;
        }

        try {
            const mergedState = await fetchRemoteContent(pageId, apiConfig, seedState);
            applyState(mergedState);
            onUpdated?.();
        } catch (error) {
            console.warn("EQB content API unavailable, using bundled seed.", error);
        }

        return window.EQB_CONTENT_STATE;
    }

    window.EQB_CONTENT_LOADER = { load, deepMerge };
})();
