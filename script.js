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
  // 3. Project Navigation Filter
  // ===================================
  const projectNavLinks = document.querySelectorAll(".project-nav-link");
  const projectCards = document.querySelectorAll(".project-card");

  projectNavLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove active class from all links
      projectNavLinks.forEach((l) => l.classList.remove("active"));

      // Add active class to clicked link
      this.classList.add("active");

      // Get category
      const category = this.getAttribute("data-category");

      // Filter projects
      projectCards.forEach((card) => {
        const cardCategories = card.getAttribute("data-category");

        // Perbaikan logika: Cek apakah cardCategories ada sebelum method includes
        if (cardCategories && (category === "all" || cardCategories.includes(category))) {
          card.style.display = "block";
          // Reset animation trick
          card.style.animation = "none";
          card.offsetHeight; /* trigger reflow */
          card.style.animation = "fadeInUp 0.6s ease forwards";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // ... existing code ...
  // ===================================
  // 4. Horizontal Scroll for Project Nav (UPDATED WITH ARROWS)
  // ===================================
  const projectsList = document.querySelector(".projects-list");
  const prevBtn = document.querySelector(".nav-arrow.prev");
  const nextBtn = document.querySelector(".nav-arrow.next");

  // Fungsi untuk update visibilitas panah
  const updateArrowVisibility = () => {
    if (!projectsList) return;

    const scrollLeft = projectsList.scrollLeft;
    const maxScrollLeft = projectsList.scrollWidth - projectsList.clientWidth;

    // Tampilkan panah kiri jika tidak di posisi awal (0)
    // Gunakan toleransi 5px untuk presisi
    if (prevBtn) {
      if (scrollLeft > 5) {
        prevBtn.classList.add("visible");
      } else {
        prevBtn.classList.remove("visible");
      }
    }

    // Tampilkan panah kanan jika belum mentok di ujung
    if (nextBtn) {
      if (scrollLeft < maxScrollLeft - 5) {
        nextBtn.classList.add("visible");
      } else {
        nextBtn.classList.remove("visible");
      }
    }
  };

  // Event Listener untuk Tombol Panah
  if (prevBtn && nextBtn && projectsList) {
    prevBtn.addEventListener("click", () => {
      projectsList.scrollBy({ left: -200, behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      projectsList.scrollBy({ left: 200, behavior: "smooth" });
    });

    // Cek visibility saat discroll
    projectsList.addEventListener("scroll", updateArrowVisibility);
    
    // Cek visibility saat load dan resize window
    window.addEventListener("resize", updateArrowVisibility);
    
    // Panggil sekali saat inisialisasi
    updateArrowVisibility();
  }

  // Drag Scroll Logic (Existing)
  let isDown = false;
  let startX;
  let scrollLeft;

  if (projectsList) {
    projectsList.addEventListener("mousedown", (e) => {
      isDown = true;
      projectsList.style.cursor = "grabbing";
      startX = e.pageX - projectsList.offsetLeft;
      scrollLeft = projectsList.scrollLeft;
    });

    projectsList.addEventListener("mouseleave", () => {
      isDown = false;
      projectsList.style.cursor = "grab";
    });

    projectsList.addEventListener("mouseup", () => {
      isDown = false;
      projectsList.style.cursor = "grab";
    });

    projectsList.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - projectsList.offsetLeft;
      const walk = (x - startX) * 2;
      projectsList.scrollLeft = scrollLeft - walk;
    });
  }

  // ===================================
  // 5. Intersection Observer for Animations
  // ===================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px", // Sedikit disesuaikan agar animasi lebih cepat muncul
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  projectCards.forEach((card) => {
    observer.observe(card);
  });

  const slideUpElements = document.querySelectorAll(".slide-up");
  slideUpElements.forEach((element) => {
    observer.observe(element);
  });

  // ===================================
  // 6. Header Scroll Effect
  // ===================================
  const header = document.querySelector(".header");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      header.style.boxShadow = "none";
    } else {
      header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.5)";
    }

    if (currentScroll > lastScroll && currentScroll > 100) {
      header.style.transform = "translateY(-100%)";
    } else {
      header.style.transform = "translateY(0)";
    }

    lastScroll = currentScroll;
  });

  // ===================================
  // 7. Parallax Effect for Hero
  // ===================================
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector(".hero");

    // Hanya jalankan jika hero ada dan window tidak di mobile (opsional, untuk performa)
    if (hero && window.innerWidth > 768 && scrolled < window.innerHeight) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
      hero.style.opacity = 1 - scrolled / window.innerHeight;
    }
  });

  // ===================================
  // 8. Custom Cursor (Optional)
  // ===================================
  // Cek apakah device punya mouse (bukan touch screen)
  if (window.matchMedia("(pointer: fine)").matches) {
    const cursor = document.createElement("div");
    cursor.classList.add("custom-cursor");
    document.body.appendChild(cursor);

    const cursorFollower = document.createElement("div");
    cursorFollower.classList.add("cursor-follower");
    document.body.appendChild(cursorFollower);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;

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

    const interactiveElements = document.querySelectorAll(
      "a, button, .project-card, .hamburger"
    );

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
  }

  // ===================================
  // 9. Loading Animation
  // ===================================
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");
  });
  // ===================================
  // 10. Lightbox Logic
  // ===================================
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const closeBtn = document.querySelector(".lightbox-close");
  const certificateImages = document.querySelectorAll(".cert-image");

  certificateImages.forEach((img) => {
    img.addEventListener("click", () => {
      lightbox.style.display = "flex";
      // Gunakan setTimeout agar transisi opacity berjalan
      setTimeout(() => {
        lightbox.classList.add("show");
      }, 10);
      lightboxImg.src = img.src;
      // lightboxCaption.innerHTML = img.alt;
      document.body.style.overflow = "hidden"; // Disable scroll
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("show");
    setTimeout(() => {
      lightbox.style.display = "none";
    }, 300); // Sesuaikan dengan durasi transisi CSS
    document.body.style.overflow = "auto"; // Enable scroll
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeLightbox);
  }

  // Close lightbox when clicking outside the image
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close lightbox with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("show")) {
      closeLightbox();
    }
  });
});
