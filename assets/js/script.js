
'use strict';

/* =========================================
   Helpers
========================================= */

const elementToggleFunc = function (elem) {
  if (elem) {
    elem.classList.toggle("active");
  }
};


/* =========================================
   Sidebar (Show Contacts button on mobile)
========================================= */

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

if (sidebar && sidebarBtn) {
  sidebarBtn.setAttribute("aria-expanded", "false");

  sidebarBtn.addEventListener("click", function () {
    elementToggleFunc(sidebar);

    sidebarBtn.setAttribute(
      "aria-expanded",
      sidebar.classList.contains("active") ? "true" : "false"
    );
  });
}


/* =========================================
   Portfolio Filter
========================================= */

const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");


/* Filter project cards */

const filterFunc = function (selectedValue) {
  filterItems.forEach(function (item) {
    const itemCategory = (item.dataset.category || "")
      .trim()
      .toLowerCase();

    if (selectedValue === "all" || itemCategory === selectedValue) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");

      // Close expanded project details when filtered out
      const details = item.querySelector("details");

      if (details) {
        details.open = false;
      }
    }
  });
};


/* Synchronize desktop buttons and mobile dropdown */

const syncFilterUI = function (selectedValue, label) {
  if (selectValue) {
    selectValue.innerText = label;
  }

  filterBtn.forEach(function (btn) {
    const buttonValue = btn.innerText.trim().toLowerCase();

    btn.classList.toggle(
      "active",
      buttonValue === selectedValue
    );
  });
};


/* Mobile dropdown open / close */

if (select) {
  select.addEventListener("click", function (event) {
    event.stopPropagation();
    elementToggleFunc(this);
  });
}


/* Mobile dropdown options */

selectItems.forEach(function (item) {
  item.addEventListener("click", function (event) {
    event.stopPropagation();

    const label = this.innerText.trim();
    const selectedValue = label.toLowerCase();

    syncFilterUI(selectedValue, label);
    filterFunc(selectedValue);

    if (select) {
      select.classList.remove("active");
    }
  });
});


/* Desktop filter buttons */

filterBtn.forEach(function (button) {
  button.addEventListener("click", function () {
    const label = this.innerText.trim();
    const selectedValue = label.toLowerCase();

    syncFilterUI(selectedValue, label);
    filterFunc(selectedValue);
  });
});


/* Close mobile dropdown when clicking outside */

document.addEventListener("click", function (event) {
  if (select && !select.contains(event.target)) {
    select.classList.remove("active");
  }
});


/* Show all projects on initial page load */

filterFunc("all");

syncFilterUI("all", "All");


/* =========================================
   Contact Form
========================================= */

const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
const formStatus = document.querySelector("[data-form-status]");


/* Display form status */

const setStatus = function (message, type) {
  if (!formStatus) return;

  formStatus.className = "form-status";

  if (type) {
    formStatus.classList.add(type);
  }

  formStatus.textContent = message;
};


/* Enable or disable submit button based on validity */

const updateFormButton = function () {
  if (!form || !formBtn) return;

  formBtn.disabled = !form.checkValidity();
};


/* Contact form functionality */

if (form && formBtn) {

  // Initial button state
  updateFormButton();

  // Validate inputs while typing
  formInputs.forEach(function (input) {
    input.addEventListener("input", function () {
      updateFormButton();

      // Clear old status message while editing
      setStatus("", "");
    });
  });


  // Submit contact form
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Check form validity
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Check Formspree endpoint
    if (form.action.includes("YOUR_FORM_ID")) {
      setStatus(
        "Contact form is not configured. Please add your Formspree ID.",
        "error"
      );
      return;
    }

    // Disable button during submission
    formBtn.disabled = true;

    const buttonText = formBtn.querySelector("span");

    if (buttonText) {
      buttonText.textContent = "Sending...";
    }

    setStatus("Sending your message...", "");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        form.reset();

        setStatus(
          "Thank you! Your message has been sent successfully.",
          "success"
        );
      } else {
        const result = await response.json().catch(function () {
          return {};
        });

        const errorMessage =
          result.errors?.map(function (error) {
            return error.message;
          }).join(", ") ||
          "Something went wrong. Please try again.";

        throw new Error(errorMessage);
      }

    } catch (error) {
      setStatus(
        error.message || "Unable to send your message. Please try again.",
        "error"
      );

    } finally {
      // Restore button text
      if (buttonText) {
        buttonText.textContent = "Send Message";
      }

      // Update button state after submission
      updateFormButton();
    }
  });
}


/* =========================================
   Page Navigation
========================================= */

const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");


navigationLinks.forEach(function (link) {
  link.addEventListener("click", function () {

    // Read target page
    const selectedPage = (
      this.dataset.target || this.innerText
    ).trim().toLowerCase();


    // Show selected page
    pages.forEach(function (page) {
      const pageName = (page.dataset.page || "").toLowerCase();

      page.classList.toggle(
        "active",
        selectedPage === pageName
      );
    });


    // Update navigation active state
    navigationLinks.forEach(function (navLink) {
      navLink.classList.remove("active");
    });

    this.classList.add("active");


    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});
