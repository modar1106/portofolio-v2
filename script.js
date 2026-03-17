// ===================================
// MetaLab-Inspired Portfolio JavaScript
// ===================================

document.addEventListener("DOMContentLoaded", function () {
  
  // ===================================
  // 1. Hamburger Menu Logic (Mobile)
  // ===================================
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-links"); // Ubah nama variabel dari 'navLinks' jadi 'navMenu'
  const navMenuItems = document.querySelectorAll(".nav-links li a");

  // Toggle Menu saat Burger diklik
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
      document.body.classList.toggle("no-scroll");
    });
  }

  // Tutup menu saat salah satu link diklik
  navMenuItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (hamburger && navMenu) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.classList.remove("no-scroll");
      }
    });
  });

  // ===================================
  // 2. Smooth Scroll for Navigation Links
  // ===================================
  // Gunakan nama variabel berbeda agar tidak bentrok
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const headerOffset = 80;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ===================================
  // 3. Project Rendering Logic (NEW)
  // ===================================
  const projectsContainer = document.getElementById("projects-container");

  function createProjectCard(project) {
    const card = document.createElement("article");
    card.className = "project-card";
    card.setAttribute("data-category", project.category);
    
    // Create tags HTML
    const tagsHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join("");

    card.innerHTML = `
      <div class="project-image-wrapper">
        <a href="${project.link}" target="_blank">
          <img
            src="${project.image}"
            alt="${project.title}"
            class="project-image"
          />
          <div class="project-overlay">View Project</div>
        </a>
      </div>
      <div class="project-info">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tags">
          ${tagsHTML}
        </div>
      </div>
    `;
    return card;
  }

  async function loadProjects() {
    try {
      // Kita coba ambil projects.json (untuk data lama) 
      // dan jika gagal/kosong kita bisa kembangkan ke sistem folder.
      // Namun untuk sistem statis murni tanpa backend, paling stabil adalah 
      // menyimpan semua proyek dalam SATU file JSON.
      const response = await fetch("content/projects.json");
      const data = await response.json();
      const projects = data.projects || [];
      
      if (projectsContainer) {
        projectsContainer.innerHTML = ""; 
        projects.forEach(project => {
          const card = createProjectCard(project);
          projectsContainer.appendChild(card);
          observer.observe(card);
        });
        
        updateProjectFilterLogic();
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      // Fallback message
      if (projectsContainer) {
        projectsContainer.innerHTML = "<p>Gagal memuat proyek. Pastikan file content/projects.json tersedia.</p>";
      }
    }
  }

  // ===================================
  // 4. Project Navigation Filter (UPDATED)
  // ===================================
  function updateProjectFilterLogic() {
    const projectCards = document.querySelectorAll(".project-card");
    const projectNavLinks = document.querySelectorAll(".project-nav-link");

    projectNavLinks.forEach((link) => {
      // Remove previous listeners to avoid duplicates
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
      
      newLink.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelectorAll(".project-nav-link").forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
        const category = this.getAttribute("data-category");

        projectCards.forEach((card) => {
          const cardCategories = card.getAttribute("data-category");
          if (cardCategories && (category === "all" || cardCategories.includes(category))) {
            card.style.display = "block";
            card.style.animation = "none";
            card.offsetHeight;
            card.style.animation = "fadeInUp 0.6s ease forwards";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // ===================================
  // 5. Horizontal Scroll for Project Nav
  // ===================================
  const projectsList = document.querySelector(".projects-list");
  const prevBtn = document.querySelector(".nav-arrow.prev");
  const nextBtn = document.querySelector(".nav-arrow.next");

  const updateArrowVisibility = () => {
    if (!projectsList) return;
    const scrollLeft = projectsList.scrollLeft;
    const maxScrollLeft = projectsList.scrollWidth - projectsList.clientWidth;
    if (prevBtn) {
      if (scrollLeft > 5) prevBtn.classList.add("visible");
      else prevBtn.classList.remove("visible");
    }
    if (nextBtn) {
      if (scrollLeft < maxScrollLeft - 5) nextBtn.classList.add("visible");
      else nextBtn.classList.remove("visible");
    }
  };

  if (prevBtn && nextBtn && projectsList) {
    prevBtn.addEventListener("click", () => projectsList.scrollBy({ left: -200, behavior: "smooth" }));
    nextBtn.addEventListener("click", () => projectsList.scrollBy({ left: 200, behavior: "smooth" }));
    projectsList.addEventListener("scroll", updateArrowVisibility);
    window.addEventListener("resize", updateArrowVisibility);
    updateArrowVisibility();
  }

  // ===================================
  // 6. Intersection Observer for Animations
  // ===================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains("project-card")) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.add("fade-in");
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const slideUpElements = document.querySelectorAll(".slide-up");
  slideUpElements.forEach((element) => observer.observe(element));

  // Initialize
  loadProjects();

  // ===================================
  // 7. Header Scroll Effect
  // ===================================
  const header = document.querySelector(".header");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll <= 0) header.style.boxShadow = "none";
    else header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.5)";

    if (currentScroll > lastScroll && currentScroll > 100) header.style.transform = "translateY(-100%)";
    else header.style.transform = "translateY(0)";
    lastScroll = currentScroll;
  });

  // ===================================
  // 8. Parallax Effect for Hero
  // ===================================
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector(".hero");
    if (hero && window.innerWidth > 768 && scrolled < window.innerHeight) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
      hero.style.opacity = 1 - scrolled / window.innerHeight;
    }
  });

  // ===================================
  // 9. Custom Cursor
  // ===================================
  if (window.matchMedia("(pointer: fine)").matches) {
    const cursor = document.createElement("div");
    cursor.classList.add("custom-cursor");
    document.body.appendChild(cursor);

    const cursorFollower = document.createElement("div");
    cursorFollower.classList.add("cursor-follower");
    document.body.appendChild(cursorFollower);

    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0, followerX = 0, followerY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.3;
      cursorY += (mouseY - cursorY) * 0.3;
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const updateInteractiveCursors = () => {
      const interactiveElements = document.querySelectorAll("a, button, .project-card, .hamburger");
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          cursor.classList.add("cursor-hover");
          cursorFollower.classList.add("cursor-hover");
        });
        el.addEventListener("mouseleave", () => {
          cursor.classList.remove("cursor-hover");
          cursorFollower.classList.remove("cursor-hover");
        });
      });
    };
    // Call this after projects load
    setTimeout(updateInteractiveCursors, 2000);
  }

  // ===================================
  // 10. Loading Animation
  // ===================================
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");
  });

  // ===================================
  // 11. Lightbox Logic
  // ===================================
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".lightbox-close");
  const certificateImages = document.querySelectorAll(".cert-image");

  certificateImages.forEach((img) => {
    img.addEventListener("click", () => {
      lightbox.style.display = "flex";
      setTimeout(() => lightbox.classList.add("show"), 10);
      lightboxImg.src = img.src;
      document.body.style.overflow = "hidden";
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("show");
    setTimeout(() => lightbox.style.display = "none", 300);
    document.body.style.overflow = "auto";
  }

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && lightbox.classList.contains("show")) closeLightbox(); });
});
