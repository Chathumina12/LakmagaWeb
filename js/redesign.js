document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  const progressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (h > 0 && progressBar) progressBar.style.width = (window.scrollY / h * 100) + '%';
  });

  const topNav = document.querySelector('.top-nav');
  if (topNav) {
    window.addEventListener('scroll', () => {
      topNav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.querySelector('i').classList.toggle('ph-list');
      menuToggle.querySelector('i').classList.toggle('ph-x');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.add('ph-list');
        icon.classList.remove('ph-x');
      });
    });
  }

  const sideLinks = document.querySelectorAll('.side-nav a');
  const sects = document.querySelectorAll('section[id]');
  if (sideLinks.length) {
    window.addEventListener('scroll', () => {
      let cur = '';
      sects.forEach(s => {
        if (window.scrollY >= s.offsetTop - 300) cur = s.id;
      });
      sideLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
      });
    });
  }

  const tw = document.querySelector('.tagline[data-typewriter]');
  if (tw) {
    const text = tw.getAttribute('data-typewriter');
    tw.innerHTML = '<span class="tw-text"></span><span class="cursor"></span>';
    const el = tw.querySelector('.tw-text');
    let i = 0;
    const type = () => {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, 35 + Math.random() * 25);
      }
    };
    setTimeout(type, 800);
  }

  document.querySelectorAll('[data-reveal]').forEach(el => {
    const dir = el.getAttribute('data-reveal') || 'up';
    const fromVars = { opacity: 0 };
    const toVars = { opacity: 1, duration: 0.9, ease: 'power3.out', x: 0, y: 0, scale: 1 };
    
    if (dir === 'up') fromVars.y = 50;
    else if (dir === 'left') fromVars.x = -50;
    else if (dir === 'right') fromVars.x = 50;
    else if (dir === 'scale') fromVars.scale = 0.9;

    gsap.fromTo(el, fromVars, {
      ...toVars,
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  });

  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const children = Array.from(parent.children);
    gsap.fromTo(children, 
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: {
          trigger: parent,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  const solutionSteps = document.querySelectorAll('.solution-step');
  const stepDots = document.querySelectorAll('.step-counter .step-dot');
  if (solutionSteps.length && stepDots.length) {
    const updateActiveStep = () => {
      let activeIdx = 0;
      let minDist = Infinity;
      solutionSteps.forEach((step, i) => {
        const rect = step.getBoundingClientRect();
        // Distance from center of screen
        const dist = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
        if (dist < minDist) {
          minDist = dist;
          activeIdx = i;
        }
      });
      stepDots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
    };
    window.addEventListener('scroll', updateActiveStep);
    updateActiveStep(); // initial check
  }

  document.querySelectorAll('.counter').forEach(el => {
    const target = parseFloat(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target, duration: 2, ease: 'power2.out',
          onUpdate: function () {
            const current = this.targets()[0].val;
            el.textContent = (target % 1 === 0 ? Math.ceil(current) : current.toFixed(1)) + suffix;
          }
        });
      },
      once: true
    });
  });

  const playOverlay = document.querySelector('.play-overlay');
  const theaterVideo = document.querySelector('.video-theater video');
  if (playOverlay && theaterVideo) {
    playOverlay.addEventListener('click', () => {
      theaterVideo.play();
      playOverlay.classList.add('hidden');
    });
    theaterVideo.addEventListener('pause', () => playOverlay.classList.remove('hidden'));
    theaterVideo.addEventListener('ended', () => playOverlay.classList.remove('hidden'));
  }

  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const inner = lightbox.querySelector('.lightbox-inner');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    document.querySelectorAll('.masonry-item').forEach(item => {
      const vid = item.querySelector('video');
      if (vid) {
        let playPromise;
        item.addEventListener('mouseenter', () => { playPromise = vid.play(); });
        item.addEventListener('mouseleave', () => { 
          if (playPromise !== undefined) {
            playPromise.then(_ => { vid.pause(); }).catch(e => {});
          }
        });
      }
      item.addEventListener('click', () => {
        const src = item.getAttribute('data-src');
        const type = item.getAttribute('data-type');
        inner.innerHTML = '';
        if (type === 'video') {
          inner.innerHTML = `<video src="${src}" controls autoplay style="min-width:70vw;max-width:1100px;background:#000"></video>`;
        } else {
          inner.innerHTML = `<img src="${src}" alt="Gallery">`;
        }
        lightbox.classList.add('active');
      });
    });

    const closeLB = () => {
      lightbox.classList.remove('active');
      setTimeout(() => { inner.innerHTML = ''; }, 400);
    };
    closeBtn.addEventListener('click', closeLB);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLB(); });
  }

  const btt = document.querySelector('.back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => btt.classList.toggle('visible', window.scrollY > 500));
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      }
    });
  });

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
    });
  }
});
