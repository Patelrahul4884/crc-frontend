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
  // INTERACTIVE ARCHITECTURE INSPECTOR
  // ═══════════════════════════════════════════

  const archNodesData = {
    'visitor': {
      title: 'Visitor (Client Browser)',
      badge: 'Client Origin & HTTPS Request',
      purpose: 'The end-user web browser initiating secure HTTPS requests to the portfolio domain.',
      why: 'Fetches static assets over TLS 1.3 from CloudFront edge locations and asynchronously executes background fetch() requests to the API Gateway endpoint to register visits.',
      specs: 'Protocol: HTTPS (TLS 1.3) | HTTP Version: HTTP/2 & HTTP/3 | Asynchronous Request: Modern Fetch API'
    },
    'route53': {
      title: 'Amazon Route 53',
      badge: 'DNS & Edge Routing',
      purpose: 'Authoritative Domain Name System (DNS) service with global Anycast routing.',
      why: 'Provides global Anycast DNS routing with native Alias records mapping directly to the CloudFront distribution without CNAME flattening issues or extra query hops.',
      specs: 'Hosted Zone: Public | Record: Alias A to CloudFront distribution | Health Check & Latency Routing supported'
    },
    'cloudfront': {
      title: 'Amazon CloudFront',
      badge: 'Global CDN & TLS Termination',
      purpose: 'Global content delivery network caching static assets at edge locations.',
      why: 'CloudFront distributes cached content through edge locations, reducing the distance between users and the origin, while keeping the S3 origin private via Origin Access Control (OAC) with built-in AWS Shield Standard DDoS mitigation.',
      specs: 'Origin: S3 via Origin Access Control (OAC) | Protocol: HTTPS Redirect | Cache Policy: Managed-CachingOptimized | Compression: Gzip/Brotli | TLS: 1.3'
    },
    's3': {
      title: 'Amazon S3 (Simple Storage Service)',
      badge: 'Object Storage Origin',
      purpose: 'Managed object store hosting HTML, CSS, JavaScript, and static assets.',
      why: 'Provides high data durability without operating system or server maintenance overhead. Cost-effective pay-for-storage model avoiding always-on compute infrastructure.',
      specs: 'Public Access: Blocked | Access Policy: Read permission strictly granted to CloudFront OAC principal | Encryption: AES-256 (SSE-S3)'
    },
    'frontend': {
      title: 'Static Frontend',
      badge: 'Client Presentation Layer',
      purpose: 'Static client presentation layer executed directly in the visitor\'s web browser.',
      why: 'Constructed with lightweight semantic HTML5, Vanilla CSS, and modern JavaScript for rapid initial paint, no server-side rendering overhead, responsive mobile-first layouts, and accessible screen-reader compliance.',
      specs: 'Stack: Semantic HTML5, Vanilla CSS3, Modern ES6+ | Hosting: S3 + CloudFront CDN | Visitor API: Fetch API to API Gateway'
    },
    'apigateway': {
      title: 'Amazon API Gateway',
      badge: 'REST API & CORS Gateway',
      purpose: 'Serverless HTTP API entry point managing traffic, CORS headers, and request routing.',
      why: 'Decouples frontend clients from serverless compute. Handles automated request routing, SSL termination, and CORS preflight handling without provisioning or managing server instances.',
      specs: 'Endpoint: REST API (/prod/countVisitor) | Integration: Lambda Proxy Integration | CORS: Access-Control-Allow-Origin: * | Protocol: HTTPS'
    },
    'lambda': {
      title: 'AWS Lambda',
      badge: 'Serverless Event Compute',
      purpose: 'Event-driven compute executing visitor increment mutation and counter logic.',
      why: 'Serverless execution avoids always-on compute infrastructure and fits the low and variable traffic profile of this portfolio. Automatically scales per request and runs with least-privilege IAM permissions.',
      specs: 'Runtime: Python 3.x | Memory: 128 MB | IAM Role: Least-privilege dynamodb:UpdateItem & dynamodb:GetItem execution policy'
    },
    'dynamodb': {
      title: 'Amazon DynamoDB',
      badge: 'NoSQL Key-Value Store',
      purpose: 'Persistent state storage for visitor counter records.',
      why: 'Provides predictable read and write performance. Supports atomic numeric updates (ADD visitor_count :inc) to handle concurrent visits without external locking mechanisms.',
      specs: 'Capacity Mode: On-Demand (Pay-Per-Request) | Primary Key: id (String) | Concurrency: Atomic numeric increment expressions'
    },
    'terraform': {
      title: 'HashiCorp Terraform',
      badge: 'Infrastructure as Code (IaC)',
      purpose: 'Declarative specification and lifecycle orchestration of all AWS cloud resources.',
      why: 'Prevents configuration drift and manual ClickOps errors. Provides deterministic planning (terraform plan), automated resource dependency graphing, and version-controlled Git history.',
      specs: 'Repository: Patelrahul4884/crc-terraform | Resources: S3, CloudFront, Lambda, API Gateway, DynamoDB, ACM, Route 53, IAM'
    },
    'githubactions': {
      title: 'GitHub Actions CI/CD',
      badge: 'Automated Delivery Pipeline',
      purpose: 'Automated continuous deployment, static asset synchronization, and CDN cache invalidation.',
      why: 'Triggers on every commit pushed to main. Deploys updated frontend assets directly to S3 and triggers CloudFront cache invalidation (/*) to reduce stale-cache time as part of deployment.',
      specs: 'Repository: Patelrahul4884/crc-frontend | Steps: Checkout -> Configure AWS Credentials -> S3 Sync -> CloudFront Invalidation'
    }
  };

  function selectArchNode(nodeKey) {
    const data = archNodesData[nodeKey];
    if (!data) return;

    $('.arch-node').removeClass('active').attr('aria-selected', 'false');
    $('.arch-node[data-node="' + nodeKey + '"]').addClass('active').attr('aria-selected', 'true');

    const $inspector = $('#archInspector');
    if ($inspector.length) {
      $inspector.css('opacity', '0.4');
      setTimeout(function() {
        $('#inspector-title').text(data.title);
        $('#inspector-badge').text(data.badge);
        $('#inspector-purpose').text(data.purpose);
        $('#inspector-why').text(data.why);
        $('#inspector-specs').html('<strong>Configuration Specs:</strong> ' + data.specs);
        $inspector.css('opacity', '1');
      }, 150);
    }
  }

  $(document).on('click', '.arch-node', function() {
    const nodeKey = $(this).data('node');
    selectArchNode(nodeKey);
  });

  $(document).on('keydown', '.arch-node', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const nodeKey = $(this).data('node');
      selectArchNode(nodeKey);
    }
  });

  // Architecture Path Hover Illumination & Node Dimming
  $(document).on('mouseenter', '.arch-node', function() {
    const $node = $(this);
    const $flow = $node.closest('.arch-flow');
    if ($flow.length) {
      $flow.addClass('has-hover');
      $node.addClass('hovered');
      // Highlight adjacent connected nodes in same flow
      const $nodes = $flow.find('.arch-node');
      const idx = $nodes.index($node);
      if (idx > 0) $nodes.eq(idx - 1).addClass('connected');
      if (idx < $nodes.length - 1) $nodes.eq(idx + 1).addClass('connected');
    }
  });

  $(document).on('mouseleave', '.arch-node', function() {
    const $flow = $(this).closest('.arch-flow');
    if ($flow.length) {
      $flow.removeClass('has-hover');
      $flow.find('.arch-node').removeClass('hovered connected');
    }
  });

  // ═══════════════════════════════════════════
  // INTERACTIVE DECISION EXPLORER
  // ═══════════════════════════════════════════

  function selectDecision(decId) {
    $('.decision-tab-btn').removeClass('active').attr('aria-selected', 'false');
    $('.decision-tab-btn[data-decision="' + decId + '"]').addClass('active').attr('aria-selected', 'true');

    $('.decision-panel').removeClass('active');
    const $targetPanel = $('#dec-panel-' + decId);
    if ($targetPanel.length) {
      $targetPanel.addClass('active');
    }
  }

  $(document).on('click', '.decision-tab-btn', function() {
    const decId = $(this).data('decision');
    selectDecision(decId);
  });

  $(document).on('keydown', '.decision-tab-btn', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const decId = $(this).data('decision');
      selectDecision(decId);
    }
  });

  // ═══════════════════════════════════════════
  // ENGINEERING TOOLKIT CATEGORY FILTER
  // ═══════════════════════════════════════════

  $(document).on('click', '.toolkit-filter-btn', function() {
    const filter = $(this).data('filter');
    $('.toolkit-filter-btn').removeClass('active');
    $(this).addClass('active');

    if (filter === 'all') {
      $('.skill-panel').removeClass('dimmed highlighted');
    } else {
      $('.skill-panel').each(function() {
        const cat = $(this).data('category');
        if (cat === filter) {
          $(this).removeClass('dimmed').addClass('highlighted');
        } else {
          $(this).removeClass('highlighted').addClass('dimmed');
        }
      });
    }
  });

  // ═══════════════════════════════════════════
  // TECHNICAL CASE STUDY MODAL
  // ═══════════════════════════════════════════

  $(document).on('click', '.case-modal-trigger', function(e) {
    e.preventDefault();
    const modalId = $(this).data('case-target') || 'modal-case-study';
    const $modal = $('#' + modalId);
    if ($modal.length) {
      $modal.addClass('visible');
      $('body').css('overflow', 'hidden');
      $modal.find('.case-modal-close').focus();
    }
  });

  $(document).on('click', '.case-modal-close', function() {
    $(this).closest('.case-modal-overlay').removeClass('visible');
    $('body').css('overflow', '');
  });

  $(document).on('click', '.case-modal-overlay', function(e) {
    if ($(e.target).hasClass('case-modal-overlay')) {
      $(this).removeClass('visible');
      $('body').css('overflow', '');
    }
  });

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

  // Close modals on Escape
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape') {
      $('.cert-modal-overlay.visible').removeClass('visible');
      $('.case-modal-overlay.visible').removeClass('visible');
      $('body').css('overflow', '');
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

  // ═══════════════════════════════════════════
  // VISITOR COUNTER SYNC
  // ═══════════════════════════════════════════

  function syncVisitorCount() {
    const el = document.getElementById('visitors');
    if (!el) return;
    const count = el.textContent.trim();
    if (count && count !== '—') {
      $('.visitors-sync').text(count);
    }
  }

  // Observe visitor counter update
  const visitorTarget = document.getElementById('visitors');
  if (visitorTarget) {
    const observer = new MutationObserver(syncVisitorCount);
    observer.observe(visitorTarget, { childList: true, characterData: true, subtree: true });
    // Fallback checks
    setTimeout(syncVisitorCount, 1200);
    setTimeout(syncVisitorCount, 3000);
  }

  // ═══════════════════════════════════════════
  // DESKTOP CURSOR-AWARE INTERACTIONS
  // ═══════════════════════════════════════════

  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (!prefersReducedMotion && isFinePointer) {
    // 1. Subtle 3D Card Tilt (1-2 degrees max)
    let tiltRaf;
    $(document).on('mousemove', '.card-tilt', function(e) {
      const card = this;
      if (tiltRaf) cancelAnimationFrame(tiltRaf);
      tiltRaf = requestAnimationFrame(function() {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateX = (-y * 3).toFixed(2);
        const rotateY = (x * 3).toFixed(2);
        card.style.transform = 'perspective(900px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-2px)';
      });
    });

    $(document).on('mouseleave', '.card-tilt', function() {
      if (tiltRaf) cancelAnimationFrame(tiltRaf);
      this.style.transform = '';
    });

    // 2. Magnetic Button Hover Pull (2-3px)
    let magRaf;
    $(document).on('mousemove', '.btn-magnetic', function(e) {
      const btn = this;
      if (magRaf) cancelAnimationFrame(magRaf);
      magRaf = requestAnimationFrame(function() {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = ((e.clientX - cx) * 0.12).toFixed(1);
        const dy = ((e.clientY - cy) * 0.12).toFixed(1);
        btn.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
      });
    });

    $(document).on('mouseleave', '.btn-magnetic', function() {
      if (magRaf) cancelAnimationFrame(magRaf);
      this.style.transform = '';
    });

    // 3. Hero Ambient Engineering Badges Cursor Drift
    const $ambientNodes = $('.ambient-node');
    if ($ambientNodes.length) {
      let ambRaf;
      window.addEventListener('mousemove', function(e) {
        if (ambRaf) cancelAnimationFrame(ambRaf);
        ambRaf = requestAnimationFrame(function() {
          const normX = (e.clientX / window.innerWidth - 0.5) * 18;
          const normY = (e.clientY / window.innerHeight - 0.5) * 18;
          $ambientNodes.each(function(i) {
            const factor = (i + 1) * 0.35;
            this.style.transform = 'translate(' + (normX * factor).toFixed(1) + 'px, ' + (normY * factor).toFixed(1) + 'px)';
          });
        });
      }, { passive: true });
    }
  }

})(jQuery);

