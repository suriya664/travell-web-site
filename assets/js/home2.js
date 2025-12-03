document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation and dropdown functionality is handled by main.js
  // This file only handles Home 2 specific features (carousel, animations, etc.)

  if (typeof Swiper !== "undefined") {
    // Initialize home2 destination carousel
    new Swiper(".home2-carousel", {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
      delay: 4200,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        780: {
          slidesPerView: 2,
        },
        1180: {
          slidesPerView: 3,
        },
      },
    });

    // Initialize home2 testimonials carousel - one card at a time
    const home2TestimonialCarousel = document.querySelector(".home2 .testimonial-carousel");
    if (home2TestimonialCarousel) {
      new Swiper(".home2 .testimonial-carousel", {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".home2 .testimonial-carousel .swiper-pagination",
          clickable: true,
        },
        // Force single slide view at all breakpoints
        breakpoints: {
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 1,
          },
          1024: {
            slidesPerView: 1,
          },
        },
      });
    }
  }

  if (window.AOS) {
    AOS.init({
      duration: 900,
      once: true,
      offset: 120,
    });
  }

  // Perfect grid alignment for home2-steps based on item count
  const stepsContainer = document.querySelector(".home2-steps");
  if (stepsContainer) {
    const stepCount = stepsContainer.querySelectorAll(".home2-step").length;
    // Remove any existing grid class
    stepsContainer.classList.remove("steps-2-col", "steps-3-col");
    
    // Set grid columns based on item count
    if (stepCount <= 4) {
      // 1-4 items: 2 columns (perfect for 2x2, 2 and 1, etc.)
      stepsContainer.classList.add("steps-2-col");
      stepsContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
    } else if (stepCount <= 6) {
      // 5-6 items: 3 columns (perfect for 3 and 2, 3x2)
      stepsContainer.classList.add("steps-3-col");
      stepsContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
    } else {
      // 7+ items: 3 columns
      stepsContainer.classList.add("steps-3-col");
      stepsContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
    }
  }

  if (window.jQuery) {
    const $ = window.jQuery;
    $(".home2-step").each(function (index) {
      $(this).attr("data-aos", "fade-up").attr("data-aos-delay", index * 120);
    });

    $(".home2-destination-card").hover(
      function () {
        $(this).addClass("is-hovered");
      },
      function () {
        $(this).removeClass("is-hovered");
      }
    );
  }
});

