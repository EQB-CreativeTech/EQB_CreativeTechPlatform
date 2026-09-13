// Shared form validation used by contact, newsletter, auth, and chat.
(function () {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phonePattern = /^[0-9+()\-\s]{7,20}$/;
    const namePattern = /^[A-Za-z][A-Za-z .'-]{2,59}$/;

    function digitCount(value) {
        return (value.match(/\d/g) || []).length;
    }

    function isEmail(value) {
        return emailPattern.test(value.trim());
    }

    function isPhone(value) {
        const trimmed = value.trim();
        return phonePattern.test(trimmed) && digitCount(trimmed) >= 7;
    }

    function isName(value) {
        return namePattern.test(value.trim());
    }

    function applyFieldRules(field) {
        const value = field.value.trim();
        const confirmTargetId = field.dataset.match;

        if (field.validity.valueMissing || (field.required && !value)) {
            field.setCustomValidity(field.dataset.requiredMessage || "This field is required.");
            return false;
        }

        if (field.type === "email" && value && !isEmail(value)) {
            field.setCustomValidity(field.dataset.emailMessage || "Enter a valid email address.");
            return false;
        }

        if (field.type === "tel" && value && !isPhone(value)) {
            field.setCustomValidity(field.dataset.phoneMessage || "Enter a valid phone number.");
            return false;
        }

        if (field.dataset.validate === "name" && value && !isName(value)) {
            field.setCustomValidity(field.dataset.nameMessage || "Enter a valid name using letters.");
            return false;
        }

        if (field.minLength > 0 && value.length < field.minLength) {
            field.setCustomValidity(field.dataset.minlengthMessage || `Enter at least ${field.minLength} characters.`);
            return false;
        }

        if (confirmTargetId) {
            const otherField = document.getElementById(confirmTargetId);
            if (otherField && value !== otherField.value) {
                field.setCustomValidity(field.dataset.matchMessage || "Values do not match.");
                return false;
            }
        }

        field.setCustomValidity("");
        return field.checkValidity();
    }

    function syncFieldState(field) {
        const isValid = applyFieldRules(field);
        field.classList.toggle("is-invalid", !isValid);
        field.classList.toggle("is-valid", isValid && field.value.trim() !== "");
        return isValid;
    }

    function validateForm(form) {
        const fields = [...form.querySelectorAll("input, textarea, select")].filter((field) => field.type !== "hidden");
        const allValid = fields.every((field) => syncFieldState(field));
        form.classList.toggle("was-validated", !allValid || form.classList.contains("was-validated"));
        return allValid;
    }

    function bindValidatedForm(form, { onValid, onInvalid, live = false } = {}) {
        if (!form) {
            return;
        }

        const fields = [...form.querySelectorAll("input, textarea, select")];

        fields.forEach((field) => {
            field.addEventListener("input", () => {
                if (live || field.dataset.match || field.classList.contains("is-invalid") || form.classList.contains("was-validated")) {
                    syncFieldState(field);
                } else {
                    field.setCustomValidity("");
                }

                form.querySelectorAll(`[data-match="${field.id}"]`).forEach((matchedField) => {
                    if (matchedField.value || form.classList.contains("was-validated")) {
                        syncFieldState(matchedField);
                    }
                });
            });

            field.addEventListener("blur", () => {
                if (live || field.value.trim() || form.classList.contains("was-validated")) {
                    syncFieldState(field);
                }
            });
        });

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            event.stopPropagation();

            const isValid = validateForm(form);
            form.classList.add("was-validated");

            if (!isValid) {
                const firstInvalid = form.querySelector(":invalid, .is-invalid");
                if (firstInvalid) {
                    firstInvalid.focus();
                }
                if (typeof onInvalid === "function") {
                    onInvalid(form);
                }
                return;
            }

            if (typeof onValid === "function") {
                onValid(new FormData(form), form);
            }
        });
    }

    window.EQB_FORMS = {
        isEmail,
        isPhone,
        isName,
        applyFieldRules,
        syncFieldState,
        validateForm,
        bindValidatedForm
    };
})();
