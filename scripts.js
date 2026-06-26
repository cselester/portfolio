// ── PRELOADER ────────────────────────────────────────────
(function () {
  // Inject preloader into <body> immediately
  const preloader = document.createElement("div");
  preloader.id = "preloader";
  preloader.setAttribute("aria-hidden", "true");
  preloader.innerHTML = `
    <div class="pre-inner">
      <div class="pre-logo">
        <span class="pre-bracket">&lt;</span>cselester<span class="pre-bracket">/&gt;</span>
      </div>
      <div class="pre-bar-wrap">
        <div class="pre-bar" id="pre-bar"></div>
      </div>
      <div class="pre-label" id="pre-label">Loading...</div>
    </div>
  `;
  document.body.prepend(preloader);

  // Simulate progress: fast to 80%, then wait for window.load to finish
  const bar   = document.getElementById("pre-bar");
  const label = document.getElementById("pre-label");
  let progress = 0;

  const messages = ["Initialising...", "Loading assets...", "Almost there..."];
  let msgIdx = 0;

  const tick = setInterval(() => {
    if (progress < 80) {
      progress += Math.random() * 12;
      progress = Math.min(progress, 80);
      bar.style.width = progress + "%";
      if (progress > 30 && msgIdx === 0) { label.textContent = messages[1]; msgIdx = 1; }
      if (progress > 60 && msgIdx === 1) { label.textContent = messages[2]; msgIdx = 2; }
    }
  }, 120);

  function finish() {
    clearInterval(tick);
    progress = 100;
    bar.style.width = "100%";
    label.textContent = "Done.";

    setTimeout(() => {
      preloader.classList.add("pre-hide");
      // Remove from DOM after transition ends
      preloader.addEventListener("transitionend", () => preloader.remove(), { once: true });
    }, 300);
  }

  if (document.readyState === "complete") {
    finish();
  } else {
    window.addEventListener("load", finish, { once: true });
    // Safety fallback — never hang longer than 4s
    setTimeout(finish, 4000);
  }
})();

// ── CONTACT FORM ─────────────────────────────────────────
const scriptURL =
  "https://script.google.com/macros/s/AKfycbyPBaaywpPbprHdL3Ms9rRZ7nc1-dLYvzTaArTiBKNC6ikDjzjl1frtSz2dIvU71hcK/exec";

const sidebar   = document.getElementById("sidebar");
const overlay   = document.getElementById("overlay");
const menuBtn   = document.querySelector(".menu-btn");
const form      = document.forms["contact-form"];
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
      if (!response.ok) throw new Error("Request failed");
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

// ── SIDEBAR ───────────────────────────────────────────────
function toggleSidebar(forceState) {
  if (!sidebar || !overlay || !menuBtn) return;
  const shouldOpen =
    typeof forceState === "boolean" ? forceState : !sidebar.classList.contains("active");
  sidebar.classList.toggle("active", shouldOpen);
  overlay.classList.toggle("active", shouldOpen);
  menuBtn.classList.toggle("active", shouldOpen);
  menuBtn.setAttribute("aria-expanded", String(shouldOpen));
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") toggleSidebar(false);
});

if (sidebar) {
  sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 1200) toggleSidebar(false);
    });
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 1200) toggleSidebar(false);
});

// ── SCROLL REVEAL ─────────────────────────────────────────
function setupRevealAnimations() {
  if (!animatedElements.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    animatedElements.forEach((el) => el.classList.add("in-view"));
    return;
  }

  animatedElements.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 70, 420)}ms`;
  });

  if (!("IntersectionObserver" in window)) {
    animatedElements.forEach((el) => el.classList.add("in-view"));
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
    { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
  );

  animatedElements.forEach((el) => observer.observe(el));
}

setupRevealAnimations();