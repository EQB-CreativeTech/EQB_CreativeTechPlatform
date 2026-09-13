// Shared floating chrome: chat, theme palette, and back-to-top.
// Mount once per page so every HTML shell gets the same controls and APIs.
(function () {
    const chromeMarkup = `
<div class="chat-fab" aria-label="Chatbot assistant">
    <button id="chatToggle" class="chat-fab-button" type="button" aria-label="Open chatbot" aria-expanded="false" aria-controls="chatWidget">
        <i class="bi bi-chat-dots"></i>
    </button>
    <div id="chatWidget" class="chat-widget" aria-hidden="true">
        <div class="chat-widget-header">
            <div>
                <h6 class="mb-1">EQB Chatbot</h6>
                <small>Ask about courses, support or themes</small>
            </div>
            <button id="chatClose" class="chat-widget-close" type="button" aria-label="Close chatbot">
                <i class="bi bi-x-lg"></i>
            </button>
        </div>
        <div id="chatMessages" class="chat-widget-body" aria-live="polite">
                <div class="chat-bubble bot">
                    Hi! Ask about IT Academy, TNPSC Academy, Art Studio, registration, contact, or themes.
                </div>
        </div>
        <form id="chatForm" class="chat-widget-footer" novalidate>
            <input id="chatInput" type="text" class="chat-widget-input" name="message" placeholder="Type your message..." autocomplete="off" minlength="2" maxlength="400" required data-required-message="Enter a message.">
            <button class="chat-widget-send" type="submit">Send</button>
        </form>
    </div>
</div>
<div class="theme-fab" aria-label="Theme palette">
    <button id="themePaletteToggle" class="theme-fab-button" type="button" aria-label="Open theme palette" aria-expanded="false" aria-controls="themePalettePanel">
        <i class="bi bi-palette"></i>
    </button>
    <div id="themePalettePanel" class="theme-palette-panel" aria-hidden="true"></div>
</div>
<button id="backToTop" type="button" aria-label="Back to top">
    <i class="bi bi-arrow-up"></i>
</button>`;

    function getElements() {
        return {
            themePaletteToggle: document.getElementById("themePaletteToggle"),
            themePalettePanel: document.getElementById("themePalettePanel"),
            chatToggle: document.getElementById("chatToggle"),
            chatWidget: document.getElementById("chatWidget"),
            chatClose: document.getElementById("chatClose"),
            chatForm: document.getElementById("chatForm"),
            chatInput: document.getElementById("chatInput"),
            chatMessages: document.getElementById("chatMessages"),
            backToTop: document.getElementById("backToTop")
        };
    }

    function mount() {
        if (!document.getElementById("chatToggle")) {
            document.body.insertAdjacentHTML("beforeend", chromeMarkup);
        }

        return getElements();
    }

    window.EQB_CHROME = { mount, getElements };
})();
