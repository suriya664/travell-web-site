document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const mobileToggle = document.querySelector(".mobile-toggle");
  const nav = document.querySelector(".main-nav");
  const yearSpan = document.querySelector("[data-year]");
  const searchPanels = document.querySelectorAll("[data-search-panel]");
  const scrollTopBtn = document.querySelector("[data-scroll-top]");

  // Initialize Swiper for testimonial carousel (skip on home2 page - handled by home2.js)
  if (typeof Swiper !== "undefined" && !body.classList.contains("home2")) {
    const testimonialCarousel = document.querySelector(".testimonial-carousel");
    if (testimonialCarousel) {
      new Swiper(".testimonial-carousel", {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".testimonial-carousel .swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        },
      });
    }
  }

  if (mobileToggle && nav) {
    // Simple and reliable mobile toggle handler
    let touchMoved = false;
    
    const handleMobileToggle = (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      body.classList.toggle("mobile-nav-open");
      // Close any open dropdowns when toggling menu
      const dropdownToggles = document.querySelectorAll("[data-dropdown-toggle]");
      dropdownToggles.forEach((toggle) => {
        const parent = toggle.closest(".dropdown");
        if (parent && parent.classList.contains("open")) {
          parent.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    };
    
    mobileToggle.addEventListener("touchstart", (evt) => {
      touchMoved = false;
    }, { passive: true });
    
    mobileToggle.addEventListener("touchmove", () => {
      touchMoved = true;
    }, { passive: true });
    
    mobileToggle.addEventListener("touchend", (evt) => {
      if (!touchMoved) {
        handleMobileToggle(evt);
      }
    }, { passive: false });
    
    mobileToggle.addEventListener("click", handleMobileToggle);

    // Close menu when clicking/touching navigation links
    // Handle all navigation links (including dropdown links) to ensure they work
    nav.addEventListener("click", (evt) => {
      const link = evt.target.closest("a");
      // Handle both regular nav links and dropdown menu links
      if (link && (link.classList.contains("nav-link") || link.classList.contains("dropdown-link"))) {
        // Close mobile menu but allow navigation to proceed
        if (body.classList.contains("mobile-nav-open")) {
          body.classList.remove("mobile-nav-open");
        }
        // Navigation will proceed naturally - don't prevent default
      }
    });

    // Close menu when clicking/touching outside
    const closeMobileNav = (evt) => {
      if (body.classList.contains("mobile-nav-open")) {
        const target = evt.target;
        // Don't close if clicking on mobile toggle or inside nav
        if (!nav.contains(target) && !mobileToggle.contains(target)) {
          body.classList.remove("mobile-nav-open");
        }
      }
    };

    // Close menu when clicking outside (but not on mobile toggle)
    document.addEventListener("click", closeMobileNav);
    document.addEventListener("touchend", closeMobileNav);
  }

  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("is-scrolled", window.scrollY > 48);
    });
  }

  document.querySelectorAll("img").forEach((img) => {
    if (img.closest(".brand") || img.dataset.lazy === "false") {
      return;
    }
    if (!img.hasAttribute("loading")) {
      img.setAttribute("loading", "lazy");
    }
    if (!img.hasAttribute("decoding")) {
      img.setAttribute("decoding", "async");
    }
  });

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  if (searchPanels.length) {
    searchPanels.forEach((panel) => {
      const form = panel.querySelector("form");
      const submitButton = panel.querySelector("[data-search-submit]");

      if (!form || !submitButton) return;

      const handleSubmit = (evt) => {
        evt.preventDefault();
        
        // Validate form before submission
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        submitButton.disabled = true;
        submitButton.dataset.loading = "true";

        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.dataset.loading = "false";
          const toast = document.createElement("div");
          toast.className = "search-toast";
          toast.textContent = "Search updated with the latest offers!";
          document.body.appendChild(toast);
          setTimeout(() => toast.remove(), 3200);
        }, 1100);
      };

      form.addEventListener("submit", handleSubmit);
      submitButton.addEventListener("click", handleSubmit);
    });
  }

  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      scrollTopBtn.hidden = window.scrollY < 480;
    });

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const dropdownToggles = document.querySelectorAll("[data-dropdown-toggle]");

  const closeDropdown = (toggle) => {
    const parent = toggle.closest(".dropdown");
    if (!parent) return;
    parent.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  dropdownToggles.forEach((toggle) => {
    const parent = toggle.closest(".dropdown");
    if (!parent) return;
    const menu = document.getElementById(toggle.dataset.dropdownToggle);

    if (menu) {
      menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          closeDropdown(toggle);
          // Close mobile menu when clicking dropdown links
          if (body.classList.contains("mobile-nav-open")) {
            body.classList.remove("mobile-nav-open");
          }
        });
      });
    }

    toggle.addEventListener("click", (evt) => {
      evt.preventDefault();
      const isOpen = parent.classList.contains("open");
      dropdownToggles.forEach((otherToggle) => {
        if (otherToggle !== toggle) {
          closeDropdown(otherToggle);
        }
      });
      if (!isOpen) {
        parent.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
      } else {
        closeDropdown(toggle);
      }
    });
  });

  document.addEventListener("click", (evt) => {
    // Don't close dropdowns if clicking on mobile toggle (handled separately)
    if (mobileToggle && mobileToggle.contains(evt.target)) {
      return;
    }
    dropdownToggles.forEach((toggle) => {
      const parent = toggle.closest(".dropdown");
      if (!parent) return;
      if (!parent.contains(evt.target)) {
        closeDropdown(toggle);
      }
    });
  });

  // FAQ Toggle Functionality (Vanilla JS - works without jQuery)
  const faqContainers = document.querySelectorAll("[data-faq]");
  faqContainers.forEach((container) => {
    const faqQuestions = container.querySelectorAll(".faq-question");
    faqQuestions.forEach((question) => {
      question.addEventListener("click", function () {
        const item = this.closest(".faq-item");
        const isActive = item.classList.contains("active");
        
        // Close all FAQ items
        container.querySelectorAll(".faq-item").forEach((faqItem) => {
          faqItem.classList.remove("active");
        });
        
        // Toggle the clicked item
        if (!isActive) {
          item.classList.add("active");
        }
      });
    });
  });

  if (window.jQuery) {
    const $ = window.jQuery;

    // Keep jQuery version as fallback
    $("[data-faq]").on("click", ".faq-question", function () {
      const $item = $(this).closest(".faq-item");
      const isActive = $item.hasClass("active");
      $item.siblings().removeClass("active");
      if (!isActive) {
        $item.addClass("active");
      } else {
        $item.removeClass("active");
      }
    });

    $("[data-tabs]").each(function () {
      const $tabs = $(this);
      $tabs.on("click", ".tab", function () {
        const target = $(this).data("target");
        $(this).addClass("active").siblings().removeClass("active");
        $tabs.find(".tab-panel").removeClass("active");
        $tabs.find(`.tab-panel[data-panel='${target}']`).addClass("active");
      });
    });

    $("[data-newsletter]").on("submit", function (evt) {
      evt.preventDefault();
      const $form = $(this);
      const $button = $form.find("button[type='submit']");
      const email = $form.find("input[type='email']").val();

      if (!email) {
        $button.text("Enter an email");
        setTimeout(() => $button.text("Subscribe"), 1800);
        return;
      }

      $button.prop("disabled", true).text("Subscribing…");

      $.ajax({
        url: "https://httpbin.org/post",
        method: "POST",
        data: { email },
      })
        .done(() => {
          $form[0].reset();
          $button.text("Welcome aboard!");
          setTimeout(() => $button.text("Subscribe"), 2200);
        })
        .fail(() => {
          $button.text("Try again");
        })
        .always(() => {
          setTimeout(() => $button.prop("disabled", false), 1500);
        });
    });
  }

  // Auth Tabs Functionality
  const authTabs = document.querySelectorAll(".auth-tab");
  authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabName = tab.dataset.tab;
      const authCard = tab.closest(".auth-card");
      if (!authCard) return;

      // Remove active class from all tabs and content
      authCard.querySelectorAll(".auth-tab").forEach((t) => t.classList.remove("active"));
      authCard.querySelectorAll(".auth-tab-content").forEach((content) => content.classList.remove("active"));

      // Add active class to clicked tab and corresponding content
      tab.classList.add("active");
      const targetContent = authCard.querySelector(`[data-tab-content="${tabName}"]`);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });

  // Theme Toggle Functionality
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const html = document.documentElement;
  
  // Check for saved theme preference or default to light mode
  const currentTheme = localStorage.getItem("theme") || "light";
  if (currentTheme === "dark") {
    html.setAttribute("data-theme", "dark");
    updateThemeIcons(true);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = html.getAttribute("data-theme") === "dark";
      
      if (isDark) {
        html.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        updateThemeIcons(false);
      } else {
        html.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        updateThemeIcons(true);
      }
    });
  }

  function updateThemeIcons(isDark) {
    const lightIcons = document.querySelectorAll(".theme-icon-light");
    const darkIcons = document.querySelectorAll(".theme-icon-dark");
    const toggleTexts = document.querySelectorAll(".theme-toggle-text");
    
    lightIcons.forEach(icon => {
      icon.style.display = isDark ? "none" : "block";
    });
    
    darkIcons.forEach(icon => {
      icon.style.display = isDark ? "block" : "none";
    });
    
    toggleTexts.forEach(text => {
      text.textContent = isDark ? "Light mode" : "Dark mode";
    });
  }
});

