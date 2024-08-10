export function addClickListenerToButton(selector, handler) {
    const button = document.querySelector(selector);
    if (button) {
        button.addEventListener("click", handler);
    } else {
        console.error(`Button with selector ${selector} not found`);
    }
}

export function addChangeListenerToRadios(selector, options) {
    const radios = document.querySelectorAll(selector);
    if (!radios.length) {
        console.error(`No radio buttons found with selector: ${selector}`);
        return;
    }
    radios.forEach((radio) => {
        radio.addEventListener("change", () => {
            options.forEach((option) => {
                if (radio.value === option.value) {
                    option.element.classList.remove("hidden");
                } else {
                    option.element.classList.add("hidden");
                }
            });
        });
    });
}

export function toggleForms(showForm, hideForms) {
    showForm.classList.remove("hidden");
    hideForms.forEach((form) => form.classList.add("hidden"));
}

export function removeExistingPopup(popupId) {
    const existingPopup = document.getElementById(popupId);
    if (existingPopup) {
        existingPopup.remove();
    }
}

export function toggleVisibility(selector, condition) {
    const element = document.querySelector(selector);
    if (element) {
        if (condition) {
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }
    }
}