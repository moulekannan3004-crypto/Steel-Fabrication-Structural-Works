/**
 * SteelCraft - Portfolio & Gallery Interactive System
 * Category Filtering and Image Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. PROJECT & GALLERY CATEGORY FILTERING
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');
  const galleryItems = document.querySelectorAll('.gallery-item-wrap');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const parentNav = this.closest('.filter-nav');
      if (parentNav) {
        parentNav.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      }
      this.classList.add('active');

      const filterValue = this.getAttribute('data-filter');

      // Filter Projects if on projects section
      if (projectItems.length > 0) {
        projectItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            item.style.display = 'block';
            setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => { item.style.display = 'none'; }, 300);
          }
        });
      }

      // Filter Gallery if on gallery section
      if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            item.style.display = 'block';
            setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => { item.style.display = 'none'; }, 300);
          }
        });
      }
    });
  });

  /* ==========================================================================
     2. INDUSTRIAL GALLERY LIGHTBOX
     ========================================================================== */
  const galleryElements = Array.from(document.querySelectorAll('.gallery-item'));
  if (galleryElements.length > 0) {
    // Inject Lightbox Modal Container if not already in DOM
    let lightbox = document.querySelector('.lightbox-modal');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox-modal';
      lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close Lightbox"><i class="fa-solid fa-xmark"></i></button>
        <button class="lightbox-prev" aria-label="Previous Image"><i class="fa-solid fa-chevron-left"></i></button>
        <button class="lightbox-next" aria-label="Next Image"><i class="fa-solid fa-chevron-right"></i></button>
        <div class="lightbox-content">
          <img src="" alt="Enlarged Industrial Photograph" id="lightbox-img">
          <div class="lightbox-caption" id="lightbox-caption"></div>
        </div>
      `;
      document.body.appendChild(lightbox);
    }

    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    let currentIndex = 0;

    function openLightbox(index) {
      currentIndex = index;
      const item = galleryElements[currentIndex];
      const img = item.querySelector('img');
      const captionText = item.getAttribute('data-title') || img.getAttribute('alt') || 'Steel Fabrication Project';

      lightboxImg.src = img.src;
      lightboxCaption.textContent = `${captionText} (${currentIndex + 1} of ${galleryElements.length})`;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % galleryElements.length;
      openLightbox(currentIndex);
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + galleryElements.length) % galleryElements.length;
      openLightbox(currentIndex);
    }

    galleryElements.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    // Close on clicking backdrop outside image
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard support (Escape, Left, Right)
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });
  }

});
