/* ============================================
   TECH-TEZO - PREMIUM JS SYSTEM
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Year update
  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Loader transition
  const loader = document.getElementById('loader');
  if (loader) {
    const hideLoader = () => {
      loader.classList.add('hidden');
    };

    // Force hide loader after 2 seconds max (prevents being stuck on slow iframe resources)
    const safetyTimeout = setTimeout(hideLoader, 2000);

    if (document.readyState === 'complete') {
      clearTimeout(safetyTimeout);
      hideLoader();
    } else {
      window.addEventListener('load', () => {
        clearTimeout(safetyTimeout);
        hideLoader();
      });
    }
  }

  // Smooth Custom Cursor & Follower
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (cursor && follower) {
    let mouseX = -100, mouseY = -100;
    let cursorX = -100, cursorY = -100;
    let followerX = -100, followerY = -100;
    let isMoving = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMoving = true;
    });

    const animateCursor = () => {
      if (isMoving) {
        // Higher lerp factors for more responsive, moderate speed
        cursorX += (mouseX - cursorX) * 0.45;
        cursorY += (mouseY - cursorY) * 0.45;
        followerX += (mouseX - followerX) * 0.18;
        followerY += (mouseY - followerY) * 0.18;

        cursor.style.transform = `translate3d(${cursorX - 4}px, ${cursorY - 4}px, 0)`;
        follower.style.transform = `translate3d(${followerX - 20}px, ${followerY - 20}px, 0)`;
      }
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Add hover states for interactive items
    const interactiveSelectors = 'a, button, .btn, .service-card, .work-card, .footer-social a';
    const attachHoverHandlers = () => {
      document.querySelectorAll(interactiveSelectors).forEach(el => {
        el.addEventListener('mouseenter', () => {
          follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
          follower.classList.remove('hover');
        });
      });
    };
    attachHoverHandlers();

    // Re-bind hovers on dynamic updates if needed
    window.addEventListener('resize', attachHoverHandlers);
  }

  // Navigation Menu System
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Header Scroll Effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // Intersection Observer for Reveal-on-Scroll
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach((element) => observer.observe(element));
  }

  // Tilt Card Animation
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 8;
      const rotateX = ((centerY - y) / centerY) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      card.style.transition = 'none';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
    });
  });

  // Particle Canvas System (Constellation Network)
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
      }

      update() {
        // Move particle
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse attraction/repulsion interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          
          if (dist < mouse.radius) {
            // Soft attraction to mouse
            const force = (mouse.radius - dist) / mouse.radius;
            this.x += (dx / dist) * force * 0.6;
            this.y += (dy / dist) * force * 0.6;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.fill();
      }
    }

    // Initialize particles
    const particleCount = Math.min(80, Math.floor((width * height) / 18000));
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Connect particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 100) {
            const alpha = (100 - dist) / 100 * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw connections to mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            const alpha = (mouse.radius - dist) / mouse.radius * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

  // Magnetic Buttons Animation
  const magneticButtons = document.querySelectorAll('.btn');
  magneticButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });

  // Stats Counter Animation
  const stats = document.querySelectorAll('.stat-number');
  if (stats.length > 0) {
    const animateCounter = (element) => {
      const target = parseInt(element.getAttribute('data-count'), 10);
      const duration = 2000; // 2 seconds
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing function outQuad
        const easeProgress = progress * (2 - progress);
        const currentValue = Math.floor(easeProgress * target);
        
        element.textContent = currentValue;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          element.textContent = target;
        }
      };

      requestAnimationFrame(updateCount);
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach((stat) => statsObserver.observe(stat));
  }

  // Copyright & Content Piracy Protection
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    console.warn("Copyright Protection: Right-click is disabled to protect visual assets from piracy.");
  });

  document.addEventListener('keydown', (e) => {
    // Disable Inspect Element key shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'i' || e.key === 'j')) ||
      (e.ctrlKey && (e.key === 'u' || e.key === 'U'))
    ) {
      e.preventDefault();
      console.warn("Security System: Source code inspection shortcuts are restricted to prevent copying.");
    }
  });

  // Scroll Indicator Click Action
  const scrollIndicator = document.getElementById('scrollIndicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Premium Console Banner Warning
  console.log(
    "%cTech-Tezo Security System Active",
    "color: #3b82f6; font-size: 16px; font-weight: bold; padding: 4px;"
  );
  console.log(
    "%cAll rights reserved. Code, designs, and content are protected under international copyright laws.",
    "color: #475569; font-size: 12px;"
  );
});
