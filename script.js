
// Raheem Hammed Ishola — Website interactions

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const header = document.querySelector(".site-header");

  // Mobile navigation
  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  // Automatic footer year
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Dark / light theme
  const nav = document.querySelector(".nav");

  if (nav) {
    const themeToggle = document.createElement("button");

    themeToggle.type = "button";
    themeToggle.className = "theme-toggle";
    themeToggle.setAttribute("aria-label", "Switch to dark mode");
    themeToggle.setAttribute("title", "Change colour theme");
    themeToggle.innerHTML = "☾";

    nav.appendChild(themeToggle);

    let savedTheme = null;

    try {
      savedTheme = localStorage.getItem("rh-theme");
    } catch (error) {
      savedTheme = null;
    }

    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    }

    function updateThemeButton() {
      const isDark = document.body.classList.contains("dark-mode");

      themeToggle.innerHTML = isDark ? "☀" : "☾";
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );
    }

    updateThemeButton();

    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");

      const isDark = document.body.classList.contains("dark-mode");

      try {
        localStorage.setItem("rh-theme", isDark ? "dark" : "light");
      } catch (error) {
        // Theme still works for this page session.
      }

      updateThemeButton();
    });
  }

  // Header shadow and back-to-top button
  const backToTop = document.createElement("button");

  backToTop.type = "button";
  backToTop.className = "back-to-top";
  backToTop.innerHTML = "↑";
  backToTop.setAttribute("aria-label", "Back to top");
  backToTop.title = "Back to top";

  document.body.appendChild(backToTop);

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  function handleScroll() {
    const scrollPosition = window.scrollY;

    if (header) {
      header.classList.toggle("scrolled", scrollPosition > 20);
    }

    backToTop.classList.toggle("visible", scrollPosition > 450);
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Scroll reveal animations
  const revealElements = document.querySelectorAll(
    ".section-heading, .about-lead, .detail-item, " +
    ".skill-card, .project-card, .process-inner > div, .contact-card"
  );

  revealElements.forEach((element, index) => {
    element.classList.add("reveal");

    if (index % 3 === 1) {
      element.classList.add("reveal-delay-1");
    } else if (index % 3 === 2) {
      element.classList.add("reveal-delay-2");
    }
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  // Highlight the navigation link for the current section
  const sections = document.querySelectorAll(
    "main section[id]"
  );

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.id;

          navLinks?.querySelectorAll("a[href^='#']").forEach((link) => {
            const isActive = link.getAttribute("href") === `#${currentId}`;

            link.classList.toggle("active", isActive);
          });
        }
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px"
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // Subtle pointer interaction on project and skill cards
  document.querySelectorAll(".project-card, .skill-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      card.style.setProperty("--pointer-x", `${x}px`);
      card.style.setProperty("--pointer-y", `${y}px`);
    });
  });
});
