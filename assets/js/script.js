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
   Portfolio filter
========================================= */

const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");   // typo fixed
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

// Show or hide project cards for the chosen category
const filterFunc = function (selectedValue) {
  filterItems.forEach(function (item) {
    if (selectedValue === "all" || selectedValue === item.dataset.category) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
};

// Keep desktop buttons and the mobile dropdown label in sync
const syncFilterUI = function (selectedValue, label) {
  if (selectValue) {
    selectValue.innerText = label;
  }

  filterBtn.forEach(function (btn) {
    btn.classList.toggle(
      "active",
      btn.innerText.trim().toLowerCase() === selectedValue
    );
  });
};

// Mobile dropdown open/close
if (select) {
  select.addEventListener("click", function () {
    elementToggleFunc(this);
  });
}

// Mobile dropdown options
selectItems.forEach(function (item) {
  item.addEventListener("click", function () {
    const label = this.innerText.trim();
    const selectedValue = label.toLowerCase();

    syncFilterUI(selectedValue, label);
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
});

// Desktop filter buttons
filterBtn.forEach(function (button) {
  button.addEventListener("click", function () {
    const label = this.innerText.trim();
    const selectedValue = label.toLowerCase();

    syncFilterUI(selectedValue, label);
    filterFunc(selectedValue);
  });
});

// Close the mobile dropdown when clicking outside it
document.addEventListener("click", function (e) {
  if (select && !select.parentElement.contains(e.target)) {
    select.classList.remove("active");
  }
});


/* =========================================
   Contact form
========================================= */

const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
const formStatus = document.querySelector("[data-form-status]");

const setStatus = function (message, type) {
  if (!formStatus) return;
  formStatus.className = "form-status" + (type ? " " + type : "");
  formStatus.textContent = message;
};

if (form && formBtn) {

  // Enable the button only when the form is valid
  formInputs.forEach(function (input) {
    input.addEventListener("input", function () {
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  });

  // Send without leaving the page
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Placeholder ID still in the HTML
    if (form.action.includes("YOUR_FORM_ID")) {
      setStatus("The contact form is not set up yet. Please email me directly.", "error");
      return;
    }

    formBtn.setAttribute("disabled", "");
    setStatus("Sending...", "");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        form.reset();
        setStatus("Thanks! Your message has been sent.", "success");
      } else {
        throw new Error("Request failed");
      }
    } catch (err) {
      formBtn.removeAttribute("disabled");
      setStatus("Something went wrong. Please email me directly.", "error");
    }
  });

}


/* =========================================
   Page navigation
========================================= */

const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

navigationLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    // Uses data-target if you add one, otherwise the button text
    const selectedPage = (this.dataset.target || this.innerText).trim().toLowerCase();

    pages.forEach(function (page) {
      page.classList.toggle("active", selectedPage === page.dataset.page);
    });

    navigationLinks.forEach(function (navLink) {
      navLink.classList.remove("active");
    });

    this.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
