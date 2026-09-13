// Shared login/register modal with toggle, required fields, and basic validation.
(function () {
    const authMarkup = `
<div class="modal fade" id="authModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg modal-fullscreen-sm-down">
        <div class="modal-content auth-modal">
            <div class="modal-header border-0 pb-0">
                <div>
                    <p class="auth-eyebrow mb-1">Welcome back</p>
                    <h2 class="modal-title fs-4 mb-0" id="authModalTitle">Sign in to EQB</h2>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body pt-3">
                <div class="auth-toggle" role="tablist" aria-label="Authentication mode">
                    <button type="button" class="auth-toggle-btn active" data-auth-mode="login" aria-pressed="true">Login</button>
                    <button type="button" class="auth-toggle-btn" data-auth-mode="register" aria-pressed="false">Register</button>
                </div>

                <div class="auth-panels">
                    <form id="loginForm" class="auth-panel active" novalidate>
                        <div class="mb-3">
                            <label for="loginEmail" class="form-label">Email address</label>
                            <input id="loginEmail" name="email" type="email" class="form-control" placeholder="name@example.com" required data-required-message="Enter your email address.">
                            <div class="invalid-feedback">Enter a valid email address.</div>
                        </div>
                        <div class="mb-3">
                            <label for="loginPassword" class="form-label">Password</label>
                            <input id="loginPassword" name="password" type="password" class="form-control" minlength="6" required data-required-message="Enter your password." data-minlength-message="Password must be at least 6 characters.">
                            <div class="invalid-feedback">Password must be at least 6 characters.</div>
                        </div>
                        <div class="d-flex align-items-center justify-content-between gap-3 mb-4">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="rememberMe" name="rememberMe">
                                <label class="form-check-label" for="rememberMe">Remember me</label>
                            </div>
                            <button type="button" class="btn btn-link p-0 auth-link" data-auth-mode="register">Create an account</button>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Login</button>
                    </form>

                    <form id="registerForm" class="auth-panel" novalidate>
                        <div class="mb-3">
                            <label for="registerName" class="form-label">Full name</label>
                            <input id="registerName" name="name" type="text" class="form-control" minlength="3" maxlength="60" required data-validate="name" data-required-message="Enter your full name.">
                            <div class="invalid-feedback">Enter a valid name using letters.</div>
                        </div>
                        <div class="mb-3">
                            <label for="registerEmail" class="form-label">Email address</label>
                            <input id="registerEmail" name="email" type="email" class="form-control" required data-required-message="Enter your email address.">
                            <div class="invalid-feedback">Enter a valid email address.</div>
                        </div>
                        <div class="mb-3">
                            <label for="registerPhone" class="form-label">Phone number</label>
                            <input id="registerPhone" name="phone" type="tel" class="form-control" required data-required-message="Enter your phone number." data-phone-message="Enter a valid phone number.">
                            <div class="invalid-feedback">Enter a valid phone number.</div>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-6 mb-3">
                                <label for="registerPassword" class="form-label">Password</label>
                                <input id="registerPassword" name="password" type="password" class="form-control" minlength="8" required data-required-message="Enter a password." data-minlength-message="Password must be at least 8 characters.">
                                <div class="invalid-feedback">Password must be at least 8 characters.</div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="registerConfirmPassword" class="form-label">Confirm password</label>
                                <input id="registerConfirmPassword" name="confirmPassword" type="password" class="form-control" minlength="8" required data-match="registerPassword" data-required-message="Confirm your password." data-match-message="Passwords must match.">
                                <div class="invalid-feedback">Passwords must match.</div>
                            </div>
                        </div>
                        <div class="form-check mb-4">
                            <input class="form-check-input" type="checkbox" id="termsCheck" required>
                            <label class="form-check-label" for="termsCheck">I agree to the terms and privacy policy.</label>
                            <div class="invalid-feedback">Please accept the terms to continue.</div>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Create Account</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>`;

    const ensureAuthModal = () => {
        if (!document.getElementById("authModal")) {
            document.body.insertAdjacentHTML("beforeend", authMarkup);
        }
    };

    const setMode = (mode) => {
        const modal = document.getElementById("authModal");
        if (!modal) {
            return;
        }

        const loginForm = modal.querySelector("#loginForm");
        const registerForm = modal.querySelector("#registerForm");
        const toggleButtons = modal.querySelectorAll("[data-auth-mode]");
        const title = modal.querySelector("#authModalTitle");
        const isRegister = mode === "register";

        loginForm.classList.toggle("active", !isRegister);
        registerForm.classList.toggle("active", isRegister);
        title.textContent = isRegister ? "Create your EQB account" : "Sign in to EQB";

        toggleButtons.forEach((button) => {
            const buttonMode = button.dataset.authMode;
            const isActive = buttonMode === mode;
            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
    };

    const openModal = (mode) => {
        ensureAuthModal();
        setMode(mode || "login");
        const modalElement = document.getElementById("authModal");
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.show();
    };

    const bindValidation = () => {
        const modal = document.getElementById("authModal");
        if (!modal || !window.EQB_FORMS) {
            return;
        }

        const loginForm = modal.querySelector("#loginForm");
        const registerForm = modal.querySelector("#registerForm");

        window.EQB_FORMS.bindValidatedForm(loginForm, {
            onValid(_formData, form) {
                form.reset();
                form.classList.remove("was-validated");
                form.querySelectorAll(".is-valid, .is-invalid").forEach((field) => {
                    field.classList.remove("is-valid", "is-invalid");
                });
                bootstrap.Modal.getInstance(modal).hide();
            }
        });

        window.EQB_FORMS.bindValidatedForm(registerForm, {
            onValid(_formData, form) {
                form.reset();
                form.classList.remove("was-validated");
                form.querySelectorAll(".is-valid, .is-invalid").forEach((field) => {
                    field.classList.remove("is-valid", "is-invalid");
                });
                bootstrap.Modal.getInstance(modal).hide();
            }
        });
    };

    const bindTriggers = () => {
        document.addEventListener("click", (event) => {
            const toggleButton = event.target.closest("[data-auth-open]");
            if (toggleButton) {
                event.preventDefault();
                openModal(toggleButton.dataset.authOpen);
                return;
            }

            const modeButton = event.target.closest("[data-auth-mode]");
            if (modeButton) {
                event.preventDefault();
                setMode(modeButton.dataset.authMode);
            }
        });
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            ensureAuthModal();
            bindValidation();
            bindTriggers();
        });
    } else {
        ensureAuthModal();
        bindValidation();
        bindTriggers();
    }

    window.EQB_AUTH = {
        openModal,
        setMode
    };
})();
