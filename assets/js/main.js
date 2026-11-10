/**
 * SteelCraft - Main JavaScript Application
 * Handles Theme Engine, RTL Switching, Navigation, Counters, and UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. THEME SWITCHER (LIGHT / DARK MODE)
     ========================================================================== */
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('steelcraft_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Determine initial theme
  const initialTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('steelcraft_theme', theme);

    themeToggleBtns.forEach(btn => {
      if (theme === 'dark') {
        btn.innerHTML = '<i class="fa-solid fa-sun text-warning"></i>';
        btn.setAttribute('title', 'Switch to Light Mode');
        btn.setAttribute('aria-label', 'Switch to Light Mode');
      } else {
        btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        btn.setAttribute('title', 'Switch to Dark Mode');
        btn.setAttribute('aria-label', 'Switch to Dark Mode');
      }
    });
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  });

  /* ==========================================================================
     2. LTR / RTL LAYOUT SWITCHER
     ========================================================================== */
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const savedDir = localStorage.getItem('steelcraft_dir') || 'ltr';
  applyDirection(savedDir);

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem('steelcraft_dir', dir);

    rtlToggleBtns.forEach(btn => {
      btn.innerHTML = '<span>LTR</span> <i class="fa-solid fa-right-left"></i> <span>RTL</span>';
      if (dir === 'rtl') {
        btn.classList.add('active');
        btn.setAttribute('title', 'Direction: RTL (Click to switch to LTR)');
        btn.setAttribute('aria-label', 'Direction: RTL (Click to switch to LTR)');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('title', 'Direction: LTR (Click to switch to RTL)');
        btn.setAttribute('aria-label', 'Direction: LTR (Click to switch to RTL)');
      }
    });
  }

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(newDir);
    });
  });

  /* ==========================================================================
     3. STICKY HEADER
     ========================================================================== */
  const navbar = document.querySelector('.navbar-custom');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('is-sticky');
      } else {
        navbar.classList.remove('is-sticky');
      }
    });
  }

  /* ==========================================================================
     4. BACK TO TOP BUTTON
     ========================================================================== */
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     5. ANIMATED NUMBER COUNTERS
     ========================================================================== */
  const counterElements = document.querySelectorAll('.counter-number[data-count]');
  if (counterElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 2000;
          const stepTime = Math.max(Math.floor(duration / target), 15);

          const timer = setInterval(() => {
            count += Math.ceil(target / (duration / stepTime));
            if (count >= target) {
              el.textContent = target.toLocaleString() + suffix;
              clearInterval(timer);
            } else {
              el.textContent = count.toLocaleString() + suffix;
            }
          }, stepTime);

          obs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counterElements.forEach(el => observer.observe(el));
  } else {
    // Fallback
    counterElements.forEach(el => {
      const target = el.getAttribute('data-count');
      const suffix = el.getAttribute('data-suffix') || '';
      el.textContent = parseInt(target, 10).toLocaleString() + suffix;
    });
  }

  /* ==========================================================================
     6. ACTIVE NAV LINK DETECTION
     ========================================================================== */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const allNavLinks = document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .dropdown-item');
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || 
       (currentPath === 'service-details.html' && href === 'services.html') || 
       (currentPath === 'blog-details.html' && href === 'blog.html')) {
      link.classList.add('active');
      const parentDropdown = link.closest('.dropdown');
      if (parentDropdown) {
        const toggle = parentDropdown.querySelector('.dropdown-toggle');
        if (toggle) {
          toggle.classList.add('active');
          if (currentPath === 'home-2.html') {
            toggle.innerHTML = 'Home 2 <i class="fa-solid fa-angle-down ms-1 dropdown-caret-icon"></i>';
          } else if (currentPath === 'index.html' || currentPath === '') {
            toggle.innerHTML = 'Home 1 <i class="fa-solid fa-angle-down ms-1 dropdown-caret-icon"></i>';
          }
        }
      }
    }
  });


  /* ==========================================================================
     7. BLOG TOPIC PILLS INTERACTIVE FILTER
     ========================================================================== */
  const topicPills = document.querySelectorAll('.blog-topic-pill');
  const blogCards = document.querySelectorAll('.blog-article-item');
  if (topicPills.length > 0 && blogCards.length > 0) {
    topicPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        topicPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const topic = pill.getAttribute('data-topic');
        blogCards.forEach(card => {
          const cardTag = card.querySelector('.blog-grid-tag')?.textContent.toLowerCase() || '';
          if (!topic || topic === 'all' || cardTag.includes(topic)) {
            card.style.display = 'block';
            card.style.transition = 'all 0.3s ease';
            setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 30);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => { card.style.display = 'none'; }, 250);
          }
        });
      });
    });
  }

});
