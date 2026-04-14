const scriptURL =
  "https://script.google.com/macros/s/AKfycbyPBaaywpPbprHdL3Ms9rRZ7nc1-dLYvzTaArTiBKNC6ikDjzjl1frtSz2dIvU71hcK/exec";

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuBtn = document.querySelector(".menu-btn");
const form = document.forms["contact-form"];
const submitButton = form ? form.querySelector('button[type="submit"]') : null;
const animatedElements = document.querySelectorAll(
  ".hero-copy, .hero-visual, .section-shell, .highlight, .skill-card, .project, .service-card, .contact-card, .contactform, .callout"
);

if (form && submitButton) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        body: new FormData(form),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      alert("Thank you! Your message has been submitted.");
      form.reset();
    } catch (error) {
      console.error("Error!", error.message);
      alert("Something went wrong while submitting the form. Please try again.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit";
    }
  });
}

function toggleSidebar(forceState) {
  if (!sidebar || !overlay || !menuBtn) {
    return;
  }

  const shouldOpen =
    typeof forceState === "boolean" ? forceState : !sidebar.classList.contains("active");

  sidebar.classList.toggle("active", shouldOpen);
  overlay.classList.toggle("active", shouldOpen);
  menuBtn.classList.toggle("active", shouldOpen);
  menuBtn.setAttribute("aria-expanded", String(shouldOpen));
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    toggleSidebar(false);
  }
});

if (sidebar) {
  sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 1200) {
        toggleSidebar(false);
      }
    });
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 1200) {
    toggleSidebar(false);
  }
});

function setupRevealAnimations() {
  if (!animatedElements.length) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    animatedElements.forEach((element) => {
      element.classList.add("in-view");
    });
    return;
  }

  animatedElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
  });

  if (!("IntersectionObserver" in window)) {
    animatedElements.forEach((element) => {
      element.classList.add("in-view");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}

setupRevealAnimations();
