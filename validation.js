document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("patient-enquiry-form");
    const statusBox = document.getElementById("form-status");
    const insuranceDetails = document.getElementById("insurance-details");
    const returningPatientDetails = document.getElementById("returning-patient-details");
    const concernCounter = document.getElementById("health_concern-counter");
    const clinicWarning = document.getElementById("clinic-warning");

    const fields = {
        first_name: document.getElementById("first_name"),
        last_name: document.getElementById("last_name"),
        date_of_birth: document.getElementById("date_of_birth"),
        email: document.getElementById("email"),
        phone: document.getElementById("phone"),
        preferred_language: document.getElementById("preferred_language"),
        preferred_clinic: document.getElementById("preferred_clinic"),
        preferred_date: document.getElementById("preferred_date"),
        preferred_time: document.getElementById("preferred_time"),
        service_type: document.getElementById("service_type"),
        insurance_provider: document.getElementById("insurance_provider"),
        insurance_member_id: document.getElementById("insurance_member_id"),
        patient_id: document.getElementById("patient_id"),
        health_concern: document.getElementById("health_concern"),
        contact_consent: document.getElementById("contact_consent")
    };

    const clinicEveningLikelyUnavailable = new Set([
        "HealthCore Austin North",
        "HealthCore San Antonio",
        "HealthCore Orlando"
    ]);

    function setFieldError(field, message) {
        const errorEl = document.getElementById(`${field.id}-error`);
        if (!errorEl) {
            return;
        }
        errorEl.textContent = message || "";
        field.setAttribute("aria-invalid", message ? "true" : "false");
        field.classList.toggle("border-red-500", Boolean(message));
    }

    function setRadioError(name, message) {
        const groupError = document.getElementById(`${name}-error`);
        const radios = form.querySelectorAll(`input[name="${name}"]`);
        if (groupError) {
            groupError.textContent = message || "";
        }
        radios.forEach((radio) => {
            radio.setAttribute("aria-invalid", message ? "true" : "false");
        });
    }

    function getRadioValue(name) {
        const checked = form.querySelector(`input[name="${name}"]:checked`);
        return checked ? checked.value : "";
    }

    function parseLocalDate(value) {
        if (!value) {
            return null;
        }
        const [year, month, day] = value.split("-").map(Number);
        return new Date(year, month - 1, day);
    }

    function getAge(dateOfBirth) {
        const today = new Date();
        let age = today.getFullYear() - dateOfBirth.getFullYear();
        const monthDiff = today.getMonth() - dateOfBirth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
            age -= 1;
        }
        return age;
    }

    function getNextBusinessDay(baseDate) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + 1);
        while (date.getDay() === 0 || date.getDay() === 6) {
            date.setDate(date.getDate() + 1);
        }
        return date;
    }

    function normalizeDate(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    function validateField(name) {
        const value = fields[name]?.value?.trim();
        const dateOfBirth = parseLocalDate(fields.date_of_birth.value);
        const newPatient = getRadioValue("new_patient");
        const hasInsurance = getRadioValue("has_insurance");

        if (name === "first_name") {
            const valid = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{2,50}$/.test(value);
            setFieldError(fields.first_name, valid ? "" : "First name must contain only letters and be at least 2 characters.");
            return valid;
        }

        if (name === "last_name") {
            const valid = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{2,50}$/.test(value);
            setFieldError(fields.last_name, valid ? "" : "Last name must contain only letters and be at least 2 characters.");
            return valid;
        }

        if (name === "date_of_birth") {
            let valid = Boolean(dateOfBirth);
            if (valid) {
                const age = getAge(dateOfBirth);
                const today = normalizeDate(new Date());
                valid = normalizeDate(dateOfBirth) <= today && age >= 0 && age <= 120;
            }
            setFieldError(fields.date_of_birth, valid ? "" : "Enter a valid date of birth. Patient must be between 0 and 120 years old.");
            return valid;
        }

        if (name === "email") {
            const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
            setFieldError(fields.email, valid ? "" : "Enter a valid email address (example: name@provider.com).");
            return valid;
        }

        if (name === "phone") {
            const valid = /^\+\d{1,3}[\s\-]?(?:\d[\s\-]?){6,14}\d$/.test(value);
            setFieldError(fields.phone, valid ? "" : "Phone must include a country code (example: +1 305 555 0191).");
            return valid;
        }

        if (name === "preferred_language") {
            const valid = Boolean(value);
            setFieldError(fields.preferred_language, valid ? "" : "Select your preferred language.");
            return valid;
        }

        if (name === "preferred_clinic") {
            const valid = Boolean(value);
            setFieldError(fields.preferred_clinic, valid ? "" : "Select the clinic you would like to visit.");
            updateClinicWarning();
            return valid;
        }

        if (name === "preferred_date") {
            const selected = parseLocalDate(fields.preferred_date.value);
            let valid = Boolean(selected);
            if (valid) {
                const today = normalizeDate(new Date());
                const minDate = normalizeDate(getNextBusinessDay(today));
                const maxDate = normalizeDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 60));
                const normalizedSelected = normalizeDate(selected);
                valid = normalizedSelected >= minDate && normalizedSelected <= maxDate;
            }
            setFieldError(fields.preferred_date, valid ? "" : "Select a date at least 1 business day from today and no more than 60 days ahead.");
            return valid;
        }

        if (name === "preferred_time") {
            const valid = Boolean(value);
            setFieldError(fields.preferred_time, valid ? "" : "Select your preferred time of day.");
            updateClinicWarning();
            return valid;
        }

        if (name === "service_type") {
            let valid = Boolean(value);
            if (valid && value === "Paediatric Care") {
                valid = Boolean(dateOfBirth) && getAge(dateOfBirth) < 18;
                if (!valid) {
                    setFieldError(fields.service_type, "Paediatric Care is available for patients under 18. Please check the date of birth or select a different service.");
                    return false;
                }
            }
            setFieldError(fields.service_type, valid ? "" : "Select the type of care you are looking for.");
            return valid;
        }

        if (name === "insurance_provider") {
            if (hasInsurance !== "Yes") {
                setFieldError(fields.insurance_provider, "");
                return true;
            }
            const valid = value.length > 0 && value.length <= 100;
            setFieldError(fields.insurance_provider, valid ? "" : "Please enter your insurance provider name.");
            return valid;
        }

        if (name === "insurance_member_id") {
            if (hasInsurance !== "Yes") {
                setFieldError(fields.insurance_member_id, "");
                return true;
            }
            const valid = /^[A-Za-z0-9]{6,20}$/.test(value);
            setFieldError(fields.insurance_member_id, valid ? "" : "Member ID must be between 6 and 20 alphanumeric characters.");
            return valid;
        }

        if (name === "patient_id") {
            if (newPatient !== "No") {
                setFieldError(fields.patient_id, "");
                return true;
            }
            const valid = /^HC-[A-Za-z0-9]{6}$/.test(value);
            setFieldError(fields.patient_id, valid ? "" : "Patient ID must follow this format: HC- plus 6 letters or numbers.");
            return valid;
        }

        if (name === "health_concern") {
            const length = value.length;
            const remaining = Math.max(0, 20 - length);
            concernCounter.textContent = remaining > 0
                ? `Please describe your health concern in at least 20 characters (${remaining} characters remaining).`
                : `${500 - length} characters remaining`;
            const valid = length >= 20 && length <= 500;
            setFieldError(fields.health_concern, valid ? "" : `Please describe your health concern in at least 20 characters (${remaining} characters remaining).`);
            return valid;
        }

        if (name === "contact_consent") {
            const valid = fields.contact_consent.checked;
            setFieldError(fields.contact_consent, valid ? "" : "You must consent to being contacted before submitting this form.");
            return valid;
        }

        return true;
    }

    function validateRadioGroup(name) {
        const value = getRadioValue(name);
        if (name === "new_patient") {
            const valid = Boolean(value);
            setRadioError("new_patient", valid ? "" : "Please indicate whether this is your first visit to HealthCore.");
            return valid;
        }
        if (name === "has_insurance") {
            const valid = Boolean(value);
            setRadioError("has_insurance", valid ? "" : "Please indicate whether you have health insurance.");
            return valid;
        }
        return true;
    }

    function updateClinicWarning() {
        const clinic = fields.preferred_clinic.value;
        const time = fields.preferred_time.value;
        if (time === "Evening" && clinicEveningLikelyUnavailable.has(clinic)) {
            clinicWarning.textContent = "Evening appointments may be limited at this clinic. Our team will confirm availability by phone.";
            clinicWarning.classList.remove("hidden");
        } else {
            clinicWarning.textContent = "";
            clinicWarning.classList.add("hidden");
        }
    }

    function updateConditionalFields() {
        const hasInsurance = getRadioValue("has_insurance");
        const newPatient = getRadioValue("new_patient");

        if (hasInsurance === "Yes") {
            insuranceDetails.classList.remove("hidden");
            fields.insurance_provider.required = true;
            fields.insurance_member_id.required = true;
        } else {
            insuranceDetails.classList.add("hidden");
            fields.insurance_provider.required = false;
            fields.insurance_member_id.required = false;
            fields.insurance_provider.value = "";
            fields.insurance_member_id.value = "";
            setFieldError(fields.insurance_provider, "");
            setFieldError(fields.insurance_member_id, "");
        }

        if (newPatient === "No") {
            returningPatientDetails.classList.remove("hidden");
            fields.patient_id.required = true;
        } else {
            returningPatientDetails.classList.add("hidden");
            fields.patient_id.required = false;
            fields.patient_id.value = "";
            setFieldError(fields.patient_id, "");
        }
    }

    function clearStatus() {
        statusBox.textContent = "";
        statusBox.className = "mt-4 hidden rounded-lg border px-3 py-2 text-sm";
    }

    function validateAll() {
        const textFields = [
            "first_name",
            "last_name",
            "date_of_birth",
            "email",
            "phone",
            "preferred_language",
            "preferred_clinic",
            "preferred_date",
            "preferred_time",
            "service_type",
            "insurance_provider",
            "insurance_member_id",
            "patient_id",
            "health_concern",
            "contact_consent"
        ];

        const validGroups = [validateRadioGroup("new_patient"), validateRadioGroup("has_insurance")];
        const validFields = textFields.map((name) => validateField(name));
        return validGroups.every(Boolean) && validFields.every(Boolean);
    }

    const onBlurFields = [
        "first_name",
        "last_name",
        "date_of_birth",
        "email",
        "phone",
        "preferred_language",
        "preferred_clinic",
        "preferred_date",
        "preferred_time",
        "service_type",
        "insurance_provider",
        "insurance_member_id",
        "patient_id",
        "health_concern",
        "contact_consent"
    ];

    onBlurFields.forEach((name) => {
        fields[name].addEventListener("blur", () => validateField(name));
    });

    [
        "first_name",
        "last_name",
        "email",
        "phone",
        "health_concern",
        "insurance_provider",
        "insurance_member_id",
        "patient_id"
    ].forEach((name) => {
        fields[name].addEventListener("input", () => validateField(name));
    });

    ["date_of_birth", "preferred_language", "preferred_clinic", "preferred_date", "preferred_time", "service_type"].forEach((name) => {
        fields[name].addEventListener("change", () => validateField(name));
    });

    fields.contact_consent.addEventListener("change", () => validateField("contact_consent"));

    form.querySelectorAll('input[name="new_patient"]').forEach((radio) => {
        radio.addEventListener("change", () => {
            updateConditionalFields();
            validateRadioGroup("new_patient");
            validateField("patient_id");
        });
    });

    form.querySelectorAll('input[name="has_insurance"]').forEach((radio) => {
        radio.addEventListener("change", () => {
            updateConditionalFields();
            validateRadioGroup("has_insurance");
            validateField("insurance_provider");
            validateField("insurance_member_id");
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        clearStatus();
        updateConditionalFields();

        const valid = validateAll();
        if (!valid) {
            statusBox.textContent = "Please correct the highlighted fields before submitting.";
            statusBox.className = "mt-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800";

            const firstInvalid = form.querySelector('[aria-invalid="true"]');
            if (firstInvalid) {
                firstInvalid.focus();
            }
            return;
        }

        statusBox.textContent = "Thank you. Your enquiry has been received. A HealthCore team member will contact you shortly to confirm your appointment details.";
        statusBox.className = "mt-4 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-800";
        form.reset();
        updateConditionalFields();
        concernCounter.textContent = "500 characters remaining";
        clinicWarning.classList.add("hidden");

        const invalidElements = form.querySelectorAll('[aria-invalid="true"]');
        invalidElements.forEach((el) => {
            el.setAttribute("aria-invalid", "false");
            el.classList.remove("border-red-500");
        });

        const errorMessages = form.querySelectorAll('[id$="-error"]');
        errorMessages.forEach((el) => {
            el.textContent = "";
        });
    });

    updateConditionalFields();
});