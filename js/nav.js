document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initNavLinks();
  initNavResize();
  initLightModeToggle();
});

// nav - mobile menu toggle
function initNavToggle() {
  const nav = document.querySelector("nav");
  const navHeader = document.querySelector(".nav-mobile-header");
  if (!nav || !navHeader) return;

  function toggleMenu(e) {
    if (e.target.closest('#light-mode-toggle')) {
      return;
    }
    if (window.innerWidth <= 1000) {
      e.stopPropagation();
      nav.classList.toggle("nav-open");
    }
  }

  navHeader.addEventListener("click", toggleMenu);
}

// nav - close menu on link click
function initNavLinks() {
  const nav = document.querySelector("nav");
  const navLinks = document.querySelectorAll(".nav-item a");
  if (!nav || !navLinks.length) return;

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (window.innerWidth <= 1000) {
        e.stopPropagation();
        setTimeout(() => {
          nav.classList.remove("nav-open");
        }, 300);
      }
    });
  });
}

// nav - close menu on resize
function initNavResize() {
  const nav = document.querySelector("nav");
  if (!nav) return;

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1000) {
      nav.classList.remove("nav-open");
    }
  });
}

// nav - light mode toggle
function initLightModeToggle() {
  // Always check local storage for preference first and apply it
  const isLightMode = localStorage.getItem("light-mode") === "true";
  if (isLightMode) {
    document.body.classList.add("light-mode");
  }

  const toggleBtn = document.getElementById("light-mode-toggle");
  if (!toggleBtn) return;

  // Move toggle to mobile header next to hamburger
  if (window.innerWidth <= 1000) {
    const navMenuToggle = document.querySelector(".nav-menu-toggle");
    if (navMenuToggle) {
      navMenuToggle.insertBefore(toggleBtn, navMenuToggle.firstChild);
      // Give it some specific mobile styles directly or let CSS handle it
      toggleBtn.style.padding = "0";
      toggleBtn.style.margin = "0";
      toggleBtn.style.marginRight = "0.75rem";
      toggleBtn.style.transform = "none";
      toggleBtn.style.opacity = "1";
    }
  }

  const modeIcon = toggleBtn.querySelector(".mode-icon");
  if (isLightMode && modeIcon) {
    modeIcon.innerText = "☾";
  }

  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation(); // prevent opening the mobile menu!
    document.body.classList.toggle("light-mode");
    
    const isActive = document.body.classList.contains("light-mode");
    localStorage.setItem("light-mode", isActive);
    
    if (modeIcon) {
      modeIcon.innerText = isActive ? "☾" : "☼";
      
      modeIcon.style.transform = "rotate(360deg)";
      setTimeout(() => {
        modeIcon.style.transition = "none";
        modeIcon.style.transform = "rotate(0deg)";
        setTimeout(() => {
          modeIcon.style.transition = "transform 0.3s ease";
        }, 50);
      }, 300);
    }
  });
}
