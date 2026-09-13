// Handles the non-theme interactions: chat widget, smooth scroll, and back-to-top.
(function () {
    function getPageFileName(pathname) {
        const segments = pathname.split("/");
        return segments[segments.length - 1] || "";
    }

    function resolveInPageHash(href) {
        if (!href || !href.includes("#")) {
            return null;
        }

        const url = new URL(href, window.location.href);
        const hash = url.hash;

        if (!hash || hash === "#") {
            return null;
        }

        if (getPageFileName(url.pathname) !== getPageFileName(window.location.pathname)) {
            return null;
        }

        return hash;
    }

    function isHomePage() {
        return (document.body.dataset.page || "home") === "home";
    }

    function scrollToContact({ behavior = "smooth" } = {}) {
        return scrollToHash("#contact", { behavior, updateUrl: false });
    }

    function scrollToHash(hash, { behavior = "smooth", updateUrl = false } = {}) {
        if (!hash || hash === "#") {
            return false;
        }

        const target = document.querySelector(hash);

        if (!target) {
            return false;
        }

        target.scrollIntoView({ behavior, block: "start" });

        if (updateUrl) {
            window.history.pushState(null, document.title, hash);
        }

        return true;
    }

    // Sets the open or closed state for the chat drawer and keeps ARIA in sync.
    function initUiInteractions({ chatToggle, chatWidget, chatClose, chatForm, chatInput, chatMessages, backToTop }) {
        // Shared state helper used by the chat toggle and close button.
        const setChatOpen = (isOpen) => {
            chatWidget.classList.toggle("open", isOpen);
            chatToggle.setAttribute("aria-expanded", String(isOpen));
            chatWidget.setAttribute("aria-hidden", String(!isOpen));

            if (isOpen) {
                chatInput.focus();
            }
        };

        // Appends a new message bubble to the chat history.
        const appendChatMessage = (messageText, type) => {
            const messageElement = document.createElement("div");
            messageElement.className = `chat-bubble ${type}`;
            messageElement.textContent = messageText;
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        // Platform-aware chatbot replies.
        const getBotReply = (messageText) => {
            if (window.EQB_CHATBOT) {
                return window.EQB_CHATBOT.getReply(messageText);
            }

            return "Please mail our team at info@eqb.com — we will get back to you.";
        };

        // Opens and closes the chat widget from the floating launcher.
        chatToggle.addEventListener("click", () => {
            setChatOpen(!chatWidget.classList.contains("open"));
        });

        // Gives the user a direct way to dismiss the chat panel.
        chatClose.addEventListener("click", () => {
            setChatOpen(false);
        });

        // Handles message submission, adds the user bubble, then schedules the bot reply.
        chatForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const messageText = chatInput.value.trim();

            if (!window.EQB_FORMS.validateForm(chatForm)) {
                chatInput.focus();
                return;
            }

            appendChatMessage(messageText, "user");
            chatForm.reset();
            chatForm.classList.remove("was-validated");
            chatInput.classList.remove("is-valid", "is-invalid");

            window.setTimeout(() => {
                appendChatMessage(getBotReply(messageText), "bot");
            }, 450);
        });

        const scrollTargetStorageKey = window.EQB_DATA?.scrollTargetStorageKey || "eqb-scroll-target";

        document.addEventListener("click", (event) => {
            const link = event.target.closest("a[href]");

            if (!link) {
                return;
            }

            const href = link.getAttribute("href");

            if (href === "#" || href === "") {
                event.preventDefault();
                return;
            }

            const scrollTarget = link.dataset.eqbScroll;

            if (scrollTarget === "contact") {
                if (isHomePage()) {
                    event.preventDefault();
                    scrollToContact({ behavior: "smooth" });
                } else {
                    sessionStorage.setItem(scrollTargetStorageKey, "contact");
                }

                return;
            }

            const hash = href.startsWith("#") ? href : resolveInPageHash(href);

            if (!hash) {
                return;
            }

            event.preventDefault();
            scrollToHash(hash, { behavior: "smooth", updateUrl: true });
        });

        // Small startup marker that helps confirm the page script is alive.
        console.log("EQB Creative Tech Loaded");

        // Shows or hides the back-to-top button as the user scrolls down the page.
        window.addEventListener("scroll", () => {
            backToTop.style.display = window.scrollY > 400 ? "block" : "none";
        });

        // Scrolls back to the top with a smooth motion.
        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });

        window.EQB_UI.openChat = () => setChatOpen(true);
        window.EQB_UI.closeChat = () => setChatOpen(false);
        window.EQB_UI.scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        };
    }

    function showNotice({ title, message, icon = "bi-check-circle-fill" }) {
        let modalElement = document.getElementById("eqbNoticeModal");

        if (!modalElement) {
            document.body.insertAdjacentHTML("beforeend", `
<div class="modal fade" id="eqbNoticeModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content notice-modal">
            <div class="modal-body text-center p-4">
                <div class="notice-icon" aria-hidden="true">
                    <i class="bi ${icon}"></i>
                </div>
                <h3 id="eqbNoticeTitle" class="notice-title mt-3 mb-2"></h3>
                <p id="eqbNoticeMessage" class="notice-message mb-4"></p>
                <button type="button" class="btn btn-primary px-4" data-bs-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>`);
            modalElement = document.getElementById("eqbNoticeModal");
        }

        const iconElement = modalElement.querySelector(".notice-icon i");
        if (iconElement) {
            iconElement.className = `bi ${icon}`;
        }

        modalElement.querySelector("#eqbNoticeTitle").textContent = title;
        modalElement.querySelector("#eqbNoticeMessage").textContent = message;
        bootstrap.Modal.getOrCreateInstance(modalElement).show();
    }

    function getStoredList(storageKey) {
        try {
            const storedValue = localStorage.getItem(storageKey);
            return storedValue ? JSON.parse(storedValue) : [];
        } catch (error) {
            return [];
        }
    }

    function setStatus(statusElement, message, type) {
        if (!statusElement) {
            return;
        }

        statusElement.textContent = message;
        statusElement.classList.toggle("is-success", type === "success");
        statusElement.classList.toggle("is-error", type === "error");
    }

    function resetFormState(form) {
        form.reset();
        form.classList.remove("was-validated");
        form.querySelectorAll(".is-valid, .is-invalid").forEach((field) => {
            field.classList.remove("is-valid", "is-invalid");
        });
    }

    function initNewsletterForm({ newsletterForm, newsletterEmail, newsletterStatus }) {
        if (!newsletterForm || !window.EQB_FORMS) {
            return;
        }

        const submitButton = newsletterForm.querySelector(".newsletter-submit");
        const defaultSubmitLabel = submitButton
            ? submitButton.textContent.replace(/\s+/g, " ").trim()
            : "Subscribe";
        const newsletterEndpoint = window.EQB_DATA.newsletter?.endpoint;

        const setSubmitting = (isSubmitting) => {
            if (!submitButton) {
                return;
            }

            submitButton.disabled = isSubmitting;
            if (isSubmitting) {
                submitButton.innerHTML = 'Subscribing... <i class="bi bi-hourglass-split" aria-hidden="true"></i>';
            } else {
                submitButton.innerHTML = `${defaultSubmitLabel} <i class="bi bi-send-fill" aria-hidden="true"></i>`;
            }
        };

        const rememberLocalSubscription = (email) => {
            const emails = getStoredList(window.EQB_DATA.newsletterStorageKey);
            if (!emails.includes(email)) {
                emails.push(email);
                localStorage.setItem(window.EQB_DATA.newsletterStorageKey, JSON.stringify(emails));
            }
        };

        window.EQB_FORMS.bindValidatedForm(newsletterForm, {
            onValid: async (formData, form) => {
                const email = String(formData.get("email") || "").trim().toLowerCase();
                const cachedEmails = getStoredList(window.EQB_DATA.newsletterStorageKey);

                if (cachedEmails.includes(email)) {
                    setStatus(newsletterStatus, "This email is already subscribed.", "error");
                    newsletterEmail.classList.add("is-invalid");
                    newsletterEmail.classList.remove("is-valid");
                    return;
                }

                if (!newsletterEndpoint) {
                    setStatus(
                        newsletterStatus,
                        "Newsletter signup is not configured yet. Please try again later.",
                        "error"
                    );
                    return;
                }

                setSubmitting(true);
                setStatus(newsletterStatus, "", "");

                try {
                    const response = await fetch(newsletterEndpoint, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json"
                        },
                        body: JSON.stringify({ email })
                    });

                    const result = await response.json().catch(() => ({}));

                    if (response.status === 409 || result.code === "already_subscribed") {
                        rememberLocalSubscription(email);
                        setStatus(
                            newsletterStatus,
                            result.message || "This email is already subscribed.",
                            "error"
                        );
                        newsletterEmail.classList.add("is-invalid");
                        newsletterEmail.classList.remove("is-valid");
                        return;
                    }

                    if (!response.ok) {
                        throw new Error(result.message || "Subscription could not be completed.");
                    }

                    rememberLocalSubscription(email);
                    resetFormState(form);
                    setStatus(
                        newsletterStatus,
                        result.message || "Thanks for subscribing. Check your inbox for a confirmation email.",
                        "success"
                    );
                } catch (error) {
                    setStatus(
                        newsletterStatus,
                        error.message || "Please try again in a moment.",
                        "error"
                    );
                } finally {
                    setSubmitting(false);
                }
            }
        });
    }

    function initContactForm({ contactForm, contactStatus }) {
        if (!contactForm) {
            return;
        }

        const submitButton = contactForm.querySelector("#contactSubmit");
        const defaultSubmitLabel = submitButton ? submitButton.textContent.trim() : "Send Message";
        const contactEndpoint = window.EQB_DATA.contact?.endpoint;

        const fields = {
            name: contactForm.querySelector("#contactName"),
            email: contactForm.querySelector("#contactEmail"),
            subject: contactForm.querySelector("#contactSubject"),
            message: contactForm.querySelector("#contactMessage")
        };

        const rules = {
            name: (value) => {
                if (!value) {
                    return "Enter your name.";
                }
                if (value.length < 3) {
                    return "Name must be at least 3 characters.";
                }
                return "";
            },
            email: (value) => {
                if (!value) {
                    return "Enter your email address.";
                }
                const emailIsValid = window.EQB_FORMS
                    ? window.EQB_FORMS.isEmail(value)
                    : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

                if (!emailIsValid) {
                    return "Enter a valid email address.";
                }
                return "";
            },
            subject: (value) => {
                if (!value) {
                    return "Enter a subject.";
                }
                if (value.length < 3) {
                    return "Subject must be at least 3 characters.";
                }
                return "";
            },
            message: (value) => {
                if (!value) {
                    return "Enter your message.";
                }
                if (value.length < 10) {
                    return "Message must be at least 10 characters.";
                }
                return "";
            }
        };

        const setFieldError = (field, message) => {
            const feedback = field.nextElementSibling;
            field.classList.toggle("is-invalid", Boolean(message));
            field.classList.toggle("is-valid", !message && field.value.trim() !== "");
            field.setAttribute("aria-invalid", String(Boolean(message)));
            if (feedback && feedback.classList.contains("invalid-feedback")) {
                feedback.textContent = message;
                feedback.classList.toggle("show-error", Boolean(message));
            }
        };

        const validateField = (field, key) => {
            const message = rules[key](field.value.trim());
            setFieldError(field, message);
            return !message;
        };

        const validateAll = () => Object.entries(fields).every(([key, field]) => validateField(field, key));

        Object.entries(fields).forEach(([key, field]) => {
            field.addEventListener("input", () => validateField(field, key));
            field.addEventListener("blur", () => validateField(field, key));
        });

        const resetContactFields = () => {
            contactForm.reset();
            Object.values(fields).forEach((field) => {
                field.classList.remove("is-valid", "is-invalid");
                field.removeAttribute("aria-invalid");
                const feedback = field.nextElementSibling;
                if (feedback && feedback.classList.contains("invalid-feedback")) {
                    feedback.classList.remove("show-error");
                }
            });
        };

        const setSubmitting = (isSubmitting) => {
            if (!submitButton) {
                return;
            }

            submitButton.disabled = isSubmitting;
            submitButton.textContent = isSubmitting ? "Sending..." : defaultSubmitLabel;
        };

        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (!validateAll()) {
                const firstInvalid = contactForm.querySelector(".is-invalid");
                if (firstInvalid) {
                    firstInvalid.focus();
                }
                setStatus(contactStatus, "Please fix the highlighted fields and try again.", "error");
                return;
            }

            const payload = {
                name: fields.name.value.trim(),
                email: fields.email.value.trim().toLowerCase(),
                subject: fields.subject.value.trim(),
                message: fields.message.value.trim()
            };

            if (!contactEndpoint) {
                showNotice({
                    title: "Unable to send",
                    message: "Contact email is not configured yet.",
                    icon: "bi-exclamation-triangle-fill"
                });
                return;
            }

            setSubmitting(true);
            setStatus(contactStatus, "", "");

            try {
                const response = await fetch(contactEndpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },
                    body: JSON.stringify({
                        ...payload,
                        _subject: `EQB Contact: ${payload.subject}`,
                        _template: "table",
                        _captcha: "false"
                    })
                });

                const result = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(result.message || "Message could not be sent.");
                }

                resetContactFields();
                showNotice({
                    title: "Message sent",
                    message: "We will get back to you soon."
                });
            } catch (error) {
                showNotice({
                    title: "Message not sent",
                    message: "Please try again in a moment or email us directly.",
                    icon: "bi-exclamation-triangle-fill"
                });
            } finally {
                setSubmitting(false);
            }
        });
    }

    window.EQB_UI = {
        initUiInteractions,
        initNewsletterForm,
        initContactForm,
        showNotice,
        scrollToHash,
        scrollToContact,
        resolveInPageHash
    };
})();
