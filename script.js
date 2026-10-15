/**
 * Haidar Portfolio — Main Script
 * Handles dynamic content loading, scroll animations, lightbox, and navigation.
 */

document.addEventListener("DOMContentLoaded", function () {

  // ===================================
  // 1. Intersection Observer for Scroll Animations
  // ===================================
  const observerOptions = {
    threshold: 0.08,
    rootMargin: "0px 0px -40px 0px",
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe existing animate-on-scroll elements
  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    scrollObserver.observe(el);
  });

  // ===================================
  // 2. Smooth Scroll for Navigation Links
  // ===================================
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();
        const offset = 20;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ===================================
  // 3. Project Rendering & Filtering
  // ===================================
  const projectsContainer = document.getElementById("projects-container");
  const projectFilterBtns = document.querySelectorAll(".filter-btn");
  const projectsActions = document.getElementById("projects-actions");
  const toggleProjectsBtn = document.getElementById("toggle-projects-btn");
  const showMoreText = document.getElementById("show-more-text");
  const showMoreCount = document.getElementById("show-more-count");
  let allProjects = [];
  let currentProjectFilter = "all";
  let isProjectsExpanded = false;
  const PROJECT_LIMIT = 4;

  function createProjectCard(project) {
    const card = document.createElement("a");
    card.className = "project-card animate-on-scroll";
    card.href = project.link;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.setAttribute("aria-label", `View ${project.title}`);
    card.setAttribute("data-category", project.category || "web");

    const tagsHTML = project.tags
      .map((tag) => `<span class="project-tag">${tag}</span>`)
      .join("");

    // Determine GitHub link for source-code projects
    let linksHTML = "";
    if (project.link && project.link.includes("github.com")) {
      linksHTML = `
        <div class="project-links">
          <span class="project-link-badge" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            Source
          </span>
        </div>
      `;
    } else if (project.link && project.link.includes("figma.com")) {
      linksHTML = `
        <div class="project-links">
          <span class="project-link-badge" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/></svg>
            Figma
          </span>
        </div>
      `;
    } else if (project.link && (project.link.includes("drive.google.com") || project.link.toLowerCase().includes("apk"))) {
      linksHTML = `
        <div class="project-links">
          <span class="project-link-badge" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            APK
          </span>
        </div>
      `;
    } else if (project.link) {
      linksHTML = `
        <div class="project-links">
          <span class="project-link-badge" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
            Live
          </span>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="project-image-wrapper">
        <img
          src="${project.image}"
          alt="Screenshot of ${project.title}"
          class="project-image"
          loading="lazy"
          decoding="async"
          width="480"
          height="300"
        />
        ${linksHTML}
      </div>
      <div class="project-info">
        <div class="project-info-header">
          <h3 class="project-title">${project.title}</h3>
        </div>
        <p class="project-description">${project.description}</p>
        <div class="project-tags">
          ${tagsHTML}
        </div>
      </div>
    `;
    return card;
  }

  function renderProjects(filter = "all") {
    if (!projectsContainer) return;
    projectsContainer.innerHTML = "";

    const filtered = allProjects.filter((p) => {
      if (filter === "all") return true;
      return p.category === filter;
    });

    if (filtered.length === 0) {
      projectsContainer.innerHTML =
        '<p style="color: var(--color-text-muted); grid-column: 1 / -1; padding: var(--space-4) 0;">No projects found in this category.</p>';
      if (projectsActions) projectsActions.style.display = "none";
      return;
    }

    const visibleProjects = isProjectsExpanded
      ? filtered
      : filtered.slice(0, PROJECT_LIMIT);

    visibleProjects.forEach((project) => {
      const card = createProjectCard(project);
      projectsContainer.appendChild(card);
      scrollObserver.observe(card);
    });

    // Update toggle button state
    if (projectsActions && toggleProjectsBtn) {
      if (filtered.length <= PROJECT_LIMIT) {
        projectsActions.style.display = "none";
      } else {
        projectsActions.style.display = "flex";
        toggleProjectsBtn.classList.toggle("is-expanded", isProjectsExpanded);
        toggleProjectsBtn.setAttribute("aria-expanded", isProjectsExpanded ? "true" : "false");

        if (isProjectsExpanded) {
          if (showMoreText) showMoreText.textContent = "Show fewer projects";
          if (showMoreCount) showMoreCount.textContent = "";
        } else {
          if (showMoreText) showMoreText.textContent = "Show all projects";
          if (showMoreCount) showMoreCount.textContent = `(${filtered.length})`;
        }
      }
    }
  }

  function initProjectFilters() {
    projectFilterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter") || "all";
        if (filter === currentProjectFilter) return;

        currentProjectFilter = filter;
        isProjectsExpanded = false; // Reset to compact view on tab change
        projectFilterBtns.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle("active", isActive);
          b.setAttribute("aria-selected", isActive ? "true" : "false");
        });

        renderProjects(currentProjectFilter);
      });
    });

    if (toggleProjectsBtn) {
      toggleProjectsBtn.addEventListener("click", () => {
        isProjectsExpanded = !isProjectsExpanded;
        renderProjects(currentProjectFilter);

        // If collapsing, smoothly scroll back to top of projects section
        if (!isProjectsExpanded) {
          const projectsSection = document.getElementById("projects");
          if (projectsSection) {
            const offset = 20;
            const top = projectsSection.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }
      });
    }
  }

  async function loadProjects() {
    try {
      const response = await fetch("content/projects.json");
      const data = await response.json();
      allProjects = data.projects || [];
      initProjectFilters();
      renderProjects(currentProjectFilter);
    } catch (error) {
      console.error("Error loading projects:", error);
      if (projectsContainer) {
        projectsContainer.innerHTML =
          '<p style="color: var(--color-text-muted);">Failed to load projects.</p>';
      }
    }
  }

  // ===================================
  // 4. Experience Rendering
  // ===================================
  const experienceContainer = document.getElementById("experience-container");

  function getExperienceIcon(title) {
    if (title.toLowerCase().includes("intern") || title.toLowerCase().includes("developer")) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;
    }
    if (title.toLowerCase().includes("ambassador")) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`;
    }
    if (title.toLowerCase().includes("chairman") || title.toLowerCase().includes("member") || title.toLowerCase().includes("mpk")) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
  }

  function createExperienceItem(exp) {
    // Split title into org and role
    const parts = exp.title.split(" - ");
    const role = parts[0] || exp.title;
    const org = parts[1] || "";

    const item = document.createElement("div");
    item.className = "resume-item animate-on-scroll";

    item.innerHTML = `
      <div class="resume-icon">
        ${getExperienceIcon(exp.title)}
      </div>
      <div class="resume-body">
        <div class="resume-header">
          <div>
            <div class="resume-title">${org || role}</div>
            ${org ? `<div class="resume-subtitle">${role}</div>` : ""}
          </div>
          <div class="resume-date">${exp.period}</div>
        </div>
        <div class="resume-desc">${exp.description}</div>
      </div>
    `;
    return item;
  }

  async function loadExperience() {
    try {
      if (!experienceContainer) return;
      const response = await fetch("content/experience.json");
      const data = await response.json();
      const experiences = data.experiences || [];

      experienceContainer.innerHTML = "";
      experiences.forEach((exp) => {
        const item = createExperienceItem(exp);
        experienceContainer.appendChild(item);
        scrollObserver.observe(item);
      });
    } catch (error) {
      console.error("Error loading experiences:", error);
      if (experienceContainer) {
        experienceContainer.innerHTML =
          '<p style="color: var(--color-text-muted);">Failed to load experience data.</p>';
      }
    }
  }

  // ===================================
  // 5. Certificates Rendering
  // ===================================
  const certificatesContainer = document.getElementById(
    "certificates-container"
  );

  function createCertificateCard(cert) {
    const card = document.createElement("div");
    card.className = "certificate-card animate-on-scroll";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View certificate: ${cert.title}`);

    card.innerHTML = `
      <div class="certificate-image-wrapper">
        <img
          src="${cert.image}"
          alt="${cert.title}"
          class="certificate-image"
          loading="lazy"
          decoding="async"
          width="400"
          height="280"
        />
      </div>
      <div class="certificate-title">${cert.title}</div>
    `;
    return card;
  }

  async function loadCertificates() {
    try {
      if (!certificatesContainer) return;
      const response = await fetch("content/certificates.json");
      const data = await response.json();
      const certificates = data.certificates || [];

      certificatesContainer.innerHTML = "";
      certificates.forEach((cert) => {
        const card = createCertificateCard(cert);
        certificatesContainer.appendChild(card);
        scrollObserver.observe(card);

        // Click to open lightbox
        card.addEventListener("click", () => openLightbox(cert.image));
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openLightbox(cert.image);
          }
        });
      });
    } catch (error) {
      console.error("Error loading certificates:", error);
      if (certificatesContainer) {
        certificatesContainer.innerHTML =
          '<p style="color: var(--color-text-muted);">Failed to load certificates.</p>';
      }
    }
  }

  // ===================================
  // 6. Lightbox
  // ===================================
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.querySelector(".lightbox-close");

  function openLightbox(imageSrc) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = imageSrc;
    lightbox.style.display = "flex";
    requestAnimationFrame(() => {
      lightbox.classList.add("show");
    });
    document.body.classList.add("no-scroll");
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("show");
    setTimeout(() => {
      lightbox.style.display = "none";
    }, 300);
    document.body.classList.remove("no-scroll");
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox && lightbox.classList.contains("show")) {
      closeLightbox();
    }
  });

  // ===================================
  // 7. Theme Toggle (Light / Dark)
  // ===================================
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark");
      try {
        localStorage.setItem("theme", isDark ? "dark" : "light");
      } catch (e) {}
    });
  }

  // ===================================
  // 8. Toast & Copy to Clipboard
  // ===================================
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  let toastTimeout = null;

  function showToast(message, duration = 3000) {
    if (!toast) return;
    if (toastMessage) {
      toastMessage.textContent = message;
    }
    toast.classList.add("show");

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, duration);
  }

  function initCopyEmail() {
    document.querySelectorAll("[data-copy-email]").forEach((el) => {
      el.addEventListener("click", async (e) => {
        const email = el.getAttribute("data-copy-email") || "mohamadhaidar0604@gmail.com";
        if (el.tagName === "BUTTON") {
          e.preventDefault();
        }

        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(email);
          } else {
            const tempInput = document.createElement("input");
            tempInput.value = email;
            tempInput.style.position = "fixed";
            tempInput.style.opacity = "0";
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            tempInput.remove();
          }
          showToast("Email address copied to clipboard!");
        } catch (err) {
          console.warn("Could not copy to clipboard:", err);
          showToast("Email: " + email);
        }
      });
    });
  }

  // ===================================
  // 9. Navbar Scrollspy
  // ===================================
  function initScrollspy() {
    const navLinks = Array.from(document.querySelectorAll(".navbar a[href^='#']"));
    if (navLinks.length === 0) return;

    const sections = navLinks
      .map((link) => {
        const id = link.getAttribute("href");
        const element = document.querySelector(id);
        return { id, link, element };
      })
      .filter((item) => item.element !== null);

    function onScroll() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // If at top of page
      if (scrollY < 120 && sections.length > 0) {
        navLinks.forEach((l) => l.classList.remove("active"));
        sections[0].link.classList.add("active");
        return;
      }

      // If scrolled to very bottom
      if (scrollY + windowHeight >= docHeight - 40 && sections.length > 0) {
        navLinks.forEach((l) => l.classList.remove("active"));
        sections[sections.length - 1].link.classList.add("active");
        return;
      }

      // Focus point at 35% viewport height
      const focusPoint = scrollY + windowHeight * 0.35;
      let currentSection = sections[0];

      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        const top = sec.element.offsetTop;
        const bottom = top + sec.element.offsetHeight;

        if (focusPoint >= top && focusPoint <= bottom) {
          currentSection = sec;
          break;
        } else if (focusPoint >= top) {
          currentSection = sec;
        }
      }

      navLinks.forEach((l) => l.classList.remove("active"));
      if (currentSection && currentSection.link) {
        currentSection.link.classList.add("active");
      }
    }

    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            onScroll();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );

    // Initial check
    onScroll();
  }

  // ===================================
  // 10. Initialize Dynamic Content & Micro-UX
  // ===================================
  loadProjects();
  loadExperience();
  loadCertificates();
  initCopyEmail();
  initScrollspy();
});
