/**
 * Finsweet Agency - Main Interactive JavaScript
 * High Performance, Zero Dependencies (Pure Vanilla JS ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initActiveNavLinks();
  initTabs();
  initSliders();
  initForms();
  initScrollEffects();
});

/* ==========================================================================
   1. Mobile Navigation
   ========================================================================== */
function initMobileNav() {
  const navComponent = document.querySelector('.w-nav');
  const navButton = document.querySelector('.w-nav-button');
  const navMenu = document.querySelector('.w-nav-menu');

  if (!navButton || !navMenu) return;

  navButton.setAttribute('role', 'button');
  navButton.setAttribute('aria-expanded', 'false');
  navButton.setAttribute('tabindex', '0');

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !navMenu.classList.contains('w--open');
    navButton.classList.toggle('w--open', isOpen);
    navMenu.classList.toggle('w--open', isOpen);
    navButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    
    if (isOpen) {
      document.body.style.overflow = window.innerWidth <= 767 ? 'hidden' : '';
    } else {
      document.body.style.overflow = '';
    }
  }

  navButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  navButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });

  // Close when clicking nav link
  navMenu.querySelectorAll('.w-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 991) {
        toggleMenu(false);
      }
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('w--open') && !navComponent.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('w--open')) {
      toggleMenu(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 991 && navMenu.classList.contains('w--open')) {
      toggleMenu(false);
    }
  });
}

/* ==========================================================================
   2. Active Navigation Link Highlighting
   ========================================================================== */
function initActiveNavLinks() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav_link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('/').pop() || 'index.html';

    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('w--current');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('w--current');
      link.removeAttribute('aria-current');
    }
  });
}

/* ==========================================================================
   3. Tab Switching (.w-tabs)
   ========================================================================== */
function initTabs() {
  const tabComponents = document.querySelectorAll('.w-tabs');

  tabComponents.forEach(tabComp => {
    const tabLinks = tabComp.querySelectorAll('.w-tab-link');
    const tabPanes = tabComp.querySelectorAll('.w-tab-pane');

    tabLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabTarget = link.getAttribute('data-w-tab');

        // Update links
        tabLinks.forEach(l => l.classList.remove('w--current'));
        link.classList.add('w--current');

        // Update panes
        tabPanes.forEach(pane => {
          if (pane.getAttribute('data-w-tab') === tabTarget) {
            pane.classList.add('w--tab-active');
            pane.style.display = 'block';
            pane.style.opacity = '0';
            setTimeout(() => {
              pane.style.transition = 'opacity 0.3s ease';
              pane.style.opacity = '1';
            }, 10);
          } else {
            pane.classList.remove('w--tab-active');
            pane.style.display = 'none';
          }
        });
      });
    });

    // Initialize first active tab if not set
    const activeLink = tabComp.querySelector('.w-tab-link.w--current') || tabLinks[0];
    if (activeLink) {
      const tabTarget = activeLink.getAttribute('data-w-tab');
      tabPanes.forEach(pane => {
        if (pane.getAttribute('data-w-tab') === tabTarget) {
          pane.classList.add('w--tab-active');
          pane.style.display = 'block';
        } else {
          pane.classList.remove('w--tab-active');
          pane.style.display = 'none';
        }
      });
    }
  });
}

/* ==========================================================================
   4. Slider Carousel (.w-slider)
   ========================================================================== */
function initSliders() {
  const sliders = document.querySelectorAll('.w-slider');

  sliders.forEach(slider => {
    const mask = slider.querySelector('.w-slider-mask');
    if (!mask) return;

    const slides = mask.querySelectorAll('.w-slide');
    if (slides.length <= 1) return;

    let currentIndex = 0;
    const total = slides.length;
    let autoplayTimer = null;
    const delay = parseInt(slider.getAttribute('data-delay') || '5000', 10);

    // Style mask and slides for smooth sliding
    mask.style.position = 'relative';
    mask.style.overflow = 'hidden';
    
    // Create an inner track to translate slides
    const track = document.createElement('div');
    track.className = 'custom-slider-track';
    track.style.display = 'flex';
    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.width = `${total * 100}%`;

    // Move slides into track
    slides.forEach(slide => {
      slide.style.width = `${100 / total}%`;
      slide.style.flexShrink = '0';
      track.appendChild(slide);
    });
    mask.appendChild(track);

    // Dots navigation
    let navContainer = slider.querySelector('.w-slider-nav');
    if (!navContainer) {
      navContainer = document.createElement('div');
      navContainer.className = 'home_review_slider-nav w-slider-nav w-round';
      slider.appendChild(navContainer);
    }
    navContainer.innerHTML = '';

    const dots = [];
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.className = `w-slider-dot ${i === 0 ? 'w-active' : ''}`;
      dot.setAttribute('role', 'button');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      navContainer.appendChild(dot);
      dots.push(dot);
    }

    function goToSlide(index) {
      currentIndex = (index + total) % total;
      track.style.transform = `translateX(-${(currentIndex * 100) / total}%)`;

      dots.forEach((d, i) => {
        d.classList.toggle('w-active', i === currentIndex);
      });
    }

    // Next / Prev arrows
    const leftArrow = slider.querySelector('.w-slider-arrow-left');
    const rightArrow = slider.querySelector('.w-slider-arrow-right');

    if (leftArrow) {
      leftArrow.classList.remove('hide');
      leftArrow.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(currentIndex - 1);
        resetAutoplay();
      });
    }

    if (rightArrow) {
      rightArrow.classList.remove('hide');
      rightArrow.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(currentIndex + 1);
        resetAutoplay();
      });
    }

    // Touch Swipe Support
    let startX = 0;
    let endX = 0;
    mask.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    mask.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(currentIndex - 1);
        }
        resetAutoplay();
      }
    }, { passive: true });

    // Autoplay
    function startAutoplay() {
      autoplayTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, delay);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    slider.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    slider.addEventListener('mouseleave', () => startAutoplay());

    startAutoplay();
  });
}

/* ==========================================================================
   5. Form Handling with Feedback
   ========================================================================== */
function initForms() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formWrap = form.closest('.w-form') || form.parentElement;
      const doneMsg = formWrap ? formWrap.querySelector('.w-form-done') : null;
      const failMsg = formWrap ? formWrap.querySelector('.w-form-fail') : null;

      // Simple validation
      const requiredInputs = form.querySelectorAll('[required]');
      let isValid = true;
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#ff4d4f';
        } else {
          input.style.borderColor = '';
        }
      });

      if (!isValid) {
        if (failMsg) {
          failMsg.style.display = 'block';
        }
        showToast('Iltimos, barcha talab qilingan maydonlarni to\'ldiring!', 'error');
        return;
      }

      // Success feedback
      const submitBtn = form.querySelector('[type="submit"]') || form.querySelector('.w-button');
      if (submitBtn) {
        submitBtn.setAttribute('disabled', 'true');
        const origText = submitBtn.value || submitBtn.textContent;
        if (submitBtn.tagName === 'INPUT') {
          submitBtn.value = 'Yuborilmoqda...';
        } else {
          submitBtn.textContent = 'Yuborilmoqda...';
        }

        setTimeout(() => {
          form.style.display = 'none';
          if (doneMsg) {
            doneMsg.style.display = 'block';
            doneMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          if (failMsg) {
            failMsg.style.display = 'none';
          }
          showToast('Muvaffaqiyatli qabul qilindi! Tez orada siz bilan bog\'lanamiz.', 'success');
        }, 600);
      }
    });
  });
}

/* ==========================================================================
   6. Toast Notifications
   ========================================================================== */
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bg = type === 'success' ? '#10b981' : '#ef4444';
  toast.style.cssText = `
    background: ${bg};
    color: #ffffff;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    font-family: 'Poppins', sans-serif;
    font-size: 0.9375rem;
    font-weight: 500;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    pointer-events: auto;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
  `;

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${type === 'success' 
        ? '<polyline points="20 6 9 17 4 12"></polyline>' 
        : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'}
    </svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   7. Scroll Effects & Back to Top
   ========================================================================== */
function initScrollEffects() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Back to top floating button
  const bttBtn = document.createElement('button');
  bttBtn.className = 'back-to-top-btn';
  bttBtn.setAttribute('aria-label', 'Back to top');
  bttBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  `;
  bttBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 2rem;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background-color: #444cfc;
    color: #ffffff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 24px rgba(68, 76, 252, 0.35);
    opacity: 0;
    pointer-events: none;
    transform: translateY(15px);
    transition: all 0.3s ease;
    z-index: 999;
  `;

  document.body.appendChild(bttBtn);

  bttBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  bttBtn.addEventListener('mouseenter', () => {
    bttBtn.style.backgroundColor = '#3038d4';
    bttBtn.style.transform = 'translateY(0) scale(1.08)';
  });

  bttBtn.addEventListener('mouseleave', () => {
    bttBtn.style.backgroundColor = '#444cfc';
    bttBtn.style.transform = 'translateY(0) scale(1)';
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      bttBtn.style.opacity = '1';
      bttBtn.style.pointerEvents = 'auto';
      bttBtn.style.transform = 'translateY(0)';
    } else {
      bttBtn.style.opacity = '0';
      bttBtn.style.pointerEvents = 'none';
      bttBtn.style.transform = 'translateY(15px)';
    }
  });
}
