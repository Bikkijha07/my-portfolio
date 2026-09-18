/**
 * BIKKI JHA - PORTFOLIO INTERACTION CONTROLLER
 * Handles:
 * - Dynamic Typewriter effect
 * - 3D Perspective Card Tilt
 * - CV / Resume Download & In-Browser Modal
 * - Copy Email & Contact Form Dispatcher
 * - Mobile Navigation & Active Scroll Tracking
 * - Toast Notification System
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. Dynamic Typewriter Effect
  // ==========================================================================
  const typedTextEl = document.getElementById('typed-text');
  const roles = [
    'MCA Student @ RIT Roorkee',
    'Full-Stack Web Developer',
    'Core Java & DSA Developer',
    'Python Developer & Problem Solver',
    'Proud Tech Builder from Bihar'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    if (!typedTextEl) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typedTextEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typedTextEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at end of text
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before typing new word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // ==========================================================================
  // 2. 3D Card Tilt Interaction
  // ==========================================================================
  function initTiltCards() {
    const tiltCards = document.querySelectorAll('.tilt-card, .hologram-card');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // ==========================================================================
  // 3. Navbar Scrolling & Mobile Menu
  // ==========================================================================
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const navItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active Section Indicator
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 200;

    sections.forEach(sec => {
      const secTop = sec.offsetTop;
      const secHeight = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPosition >= secTop && scrollPosition < secTop + secHeight) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isOpen = navLinks.classList.contains('active');
      mobileToggle.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close on link click
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.innerHTML = '☰';
      });
    });
  }

  // ==========================================================================
  // 4. Toast Notification System
  // ==========================================================================
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, icon = '✨') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 350);
    }, 3500);
  }

  // ==========================================================================
  // 5. Copy Email Action
  // ==========================================================================
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  const emailAddress = 'bikkijhaa@gmail.com';

  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailAddress).then(() => {
          showToast(`Copied to clipboard: ${emailAddress}`, '📋');
        }).catch(() => {
          fallbackCopyText(emailAddress);
        });
      } else {
        fallbackCopyText(emailAddress);
      }
    });
  });

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`Copied to clipboard: ${text}`, '📋');
    } catch (err) {
      showToast(`Email: ${text}`, '✉️');
    }
    document.body.removeChild(textArea);
  }

  // ==========================================================================
  // 6. Resume Modal & CV Download
  // ==========================================================================
  const viewResumeBtns = document.querySelectorAll('.view-resume-btn');
  const resumeModal = document.getElementById('resume-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const downloadCvBtns = document.querySelectorAll('.download-cv-btn');

  viewResumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (resumeModal) {
        resumeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeModalBtn && resumeModal) {
    closeModalBtn.addEventListener('click', () => {
      resumeModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        resumeModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
        resumeModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  downloadCvBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Downloading Bikki Jha Official Resume...', '📄');
    });
  });

  // ==========================================================================
  // 7. Contact Form Handler
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('sender-name')?.value.trim() || 'Visitor';
      const email = document.getElementById('sender-email')?.value.trim() || '';
      const subject = document.getElementById('sender-subject')?.value.trim() || 'Portfolio Inquiry';
      const message = document.getElementById('sender-message')?.value.trim() || '';

      // Create Mailto Link
      const mailtoUrl = `mailto:bikkijhaa@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Hi Bikki,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      )}`;

      window.location.href = mailtoUrl;

      showToast('Opening your email client to send message to Bikki...', '🚀');
      contactForm.reset();
    });
  }

  // ==========================================================================
  // Initialize on DOM Ready
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    typeEffect();
    initTiltCards();
  });
})();
