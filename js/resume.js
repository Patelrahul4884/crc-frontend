/**
 * Deep Space Mission Control — Portfolio JS
 * Rahul Patel · Cloud & DevOps Engineer
 * 
 * Features:
 * - Smooth scrolling (jQuery easing)
 * - Mobile nav toggle
 * - Active nav link tracking
 * - Scroll reveal animations (IntersectionObserver)
 * - Lightweight starfield canvas
 * - Certificate popup modals
 * - prefers-reduced-motion support
 */

(function($) {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ═══════════════════════════════════════════
  // SMOOTH SCROLLING
  // ═══════════════════════════════════════════

  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function(e) {
    if (
      location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') &&
      location.hostname === this.hostname
    ) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        e.preventDefault();
        $('html, body').animate(
          { scrollTop: target.offset().top - 64 }, // offset for sticky nav
          prefersReducedMotion ? 0 : 800,
          'easeInOutExpo'
        );
        // Close mobile menu if open
        closeMobileNav();
        return false;
      }
    }
  });

  // ═══════════════════════════════════════════
  // MOBILE NAVIGATION
  // ═══════════════════════════════════════════

  const $navToggle = $('#navToggle');
  const $navLinks = $('#navLinks');

  function closeMobileNav() {
    $navToggle.removeClass('active').attr('aria-expanded', 'false');
    $navLinks.removeClass('open');
  }

  $navToggle.on('click', function() {
    const isOpen = $navLinks.hasClass('open');
    if (isOpen) {
      closeMobileNav();
    } else {
      $navToggle.addClass('active').attr('aria-expanded', 'true');
      $navLinks.addClass('open');
    }
  });

  // Close mobile nav on link click
  $navLinks.find('a').on('click', function() {
    closeMobileNav();
  });

  // Close mobile nav on Escape
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape' && $navLinks.hasClass('open')) {
      closeMobileNav();
      $navToggle.focus();
    }
  });

  // ═══════════════════════════════════════════
  // NAVBAR SCROLL STATE + ACTIVE LINK TRACKING
  // ═══════════════════════════════════════════

  const $nav = $('#mainNav');
  const sections = [];

  // Collect section data
  $navLinks.find('a').each(function() {
    const hash = $(this).attr('href');
    if (hash && hash.startsWith('#')) {
      const $section = $(hash);
      if ($section.length) {
        sections.push({ el: $section, link: $(this), id: hash });
      }
    }
  });

  // Also track hero
  const $hero = $('#hero');

  function onScroll() {
    const scrollTop = $(window).scrollTop();

    // Navbar background
    if (scrollTop > 50) {
      $nav.addClass('scrolled');
    } else {
      $nav.removeClass('scrolled');
    }

    // Active link
    let current = '';
    for (let i = sections.length - 1; i >= 0; i--) {
      const offset = sections[i].el.offset().top - 100;
      if (scrollTop >= offset) {
        current = sections[i].id;
        break;
      }
    }

    $navLinks.find('a').removeClass('active');
    if (current) {
      $navLinks.find('a[href="' + current + '"]').addClass('active');
    }
  }

  $(window).on('scroll', onScroll);
  onScroll(); // run once on load

  // ═══════════════════════════════════════════
  // SCROLL REVEAL (IntersectionObserver)
  // ═══════════════════════════════════════════

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(function(el) {
      observer.observe(el);
    });
  } else {
    // If reduced motion or no IO, show everything immediately
    document.querySelectorAll('.reveal').forEach(function(el) {
      el.classList.add('visible');
    });
  }

  // ═══════════════════════════════════════════
  // CERTIFICATE POPUP MODALS
  // ═══════════════════════════════════════════

  $('.cert-popup-trigger').on('click', function(e) {
    e.preventDefault();
    const modalId = $(this).data('cert');
    const $modal = $('#' + modalId);
    if ($modal.length) {
      $modal.addClass('visible');
      // Trap focus
      $modal.find('.cert-modal-close').focus();
    }
  });

  // Close modal on close button
  $('.cert-modal-close').on('click', function() {
    $(this).closest('.cert-modal-overlay').removeClass('visible');
  });

  // Close modal on overlay click
  $('.cert-modal-overlay').on('click', function(e) {
    if ($(e.target).hasClass('cert-modal-overlay')) {
      $(this).removeClass('visible');
    }
  });

  // Close modal on Escape
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape') {
      $('.cert-modal-overlay.visible').removeClass('visible');
    }
  });

  // ═══════════════════════════════════════════
  // STARFIELD CANVAS
  // ═══════════════════════════════════════════

  if (!prefersReducedMotion) {
    const canvas = document.getElementById('starfield-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let stars = [];
      const STAR_COUNT = 80;
      let animId;

      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      function createStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
          stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.2 + 0.3,
            alpha: Math.random() * 0.5 + 0.2,
            speed: Math.random() * 0.3 + 0.05,
            drift: (Math.random() - 0.5) * 0.1
          });
        }
      }

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, ' + s.alpha + ')';
          ctx.fill();

          // Gentle drift
          s.y += s.speed;
          s.x += s.drift;

          // Twinkle
          s.alpha += (Math.random() - 0.5) * 0.02;
          if (s.alpha < 0.1) s.alpha = 0.1;
          if (s.alpha > 0.7) s.alpha = 0.7;

          // Wrap
          if (s.y > canvas.height + 2) {
            s.y = -2;
            s.x = Math.random() * canvas.width;
          }
          if (s.x < -2) s.x = canvas.width + 2;
          if (s.x > canvas.width + 2) s.x = -2;
        }

        animId = requestAnimationFrame(draw);
      }

      resize();
      createStars();
      draw();

      window.addEventListener('resize', function() {
        resize();
        createStars();
      });

      // Pause when tab not visible
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          cancelAnimationFrame(animId);
        } else {
          draw();
        }
      });
    }
  }

})(jQuery);
