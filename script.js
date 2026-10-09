/* ==========================================================
   AURA PORTFOLIO - 3D & ANIMATION JAVASCRIPT ENGINE
   - Three.js Interactive 3D WebGL Constellation & Geometric Mesh
   - 3D Dynamic Tilt Engine with Holographic Light Glare
   - Magnetic Cursor Hover Attraction on Primary CTAs
   - 3D Scroll Perspective Entrances (IntersectionObserver)
   - Dynamic Stats Number Counter with Easing
   - Interactive Cyber Web Audio Synthesizer
   - HUD Terminal Transmission Dispatcher
   - Full-Site Card-Deck Stacking Scroll (Tareeqa 1)
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeroVideo();
  initThreeJS3DBackground();
  init3DTiltEngine();
  initMagneticButtons();
  initScrollReveal3D();
  initStatsCounter();
  initAudioSystem();
  initTerminalDispatch();
  initNavScroll();
  initCardStackDynamics();
  initSectionStackScaling();
});

/* ================= 1. THREE.JS 3D INTERACTIVE WEBGL BACKGROUND ================= */
function initThreeJS3DBackground() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  if (typeof THREE === 'undefined') {
    init2DFallbackParticles(canvas);
    return;
  }

  let scene, camera, renderer, particles, icosaMesh, innerMesh;
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let width = window.innerWidth;
  let height = window.innerHeight;

  try {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 2000);
    camera.position.z = 600;

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Circular glowing point texture
    const pointTexture = createPointTexture();

    // 1. 3D Particle Starfield Constellation
    const particleCount = Math.min(Math.floor(width / 3.5), 360);
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const goldColors = [
      new THREE.Color(0xfbbf24), // gold bright
      new THREE.Color(0xf59e0b), // amber primary
      new THREE.Color(0xd97706), // warm amber
      new THREE.Color(0xfef3c7)  // light highlight
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1400;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1000;

      const col = goldColors[Math.floor(Math.random() * goldColors.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 5.5,
      map: pointTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 2. Floating 3D Geometric Artifact in Upper Right Hero Ambient Space
    const icosaGeo = new THREE.IcosahedronGeometry(72, 1);
    const icosaWire = new THREE.WireframeGeometry(icosaGeo);
    const icosaMat = new THREE.LineBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending
    });
    icosaMesh = new THREE.LineSegments(icosaWire, icosaMat);
    icosaMesh.position.set(width > 900 ? 320 : 0, 100, -80);
    scene.add(icosaMesh);

    const innerGeo = new THREE.OctahedronGeometry(38, 0);
    const innerWire = new THREE.WireframeGeometry(innerGeo);
    const innerMat = new THREE.LineBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    innerMesh = new THREE.LineSegments(innerWire, innerMat);
    innerMesh.position.copy(icosaMesh.position);
    scene.add(innerMesh);

    // Mouse movement parallax listener
    window.addEventListener('mousemove', (e) => {
      targetMouseX = ((e.clientX - width / 2) / width) * 0.45;
      targetMouseY = ((e.clientY - height / 2) / height) * 0.45;
    }, { passive: true });

    // Responsive window resize
    window.addEventListener('resize', () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      if (icosaMesh) {
        icosaMesh.position.set(width > 900 ? 320 : 0, 100, -80);
        innerMesh.position.copy(icosaMesh.position);
      }
    });

    // 3D Animation Loop
    function animate() {
      requestAnimationFrame(animate);

      // Smooth camera interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      camera.position.x = mouseX * 180;
      camera.position.y = -mouseY * 180;
      camera.lookAt(scene.position);

      // Continuous 3D spatial rotation
      particles.rotation.y += 0.0005;
      particles.rotation.x += 0.0002;

      if (icosaMesh) {
        icosaMesh.rotation.x += 0.003;
        icosaMesh.rotation.y += 0.005;
        innerMesh.rotation.x -= 0.004;
        innerMesh.rotation.y -= 0.006;
      }

      renderer.render(scene, camera);
    }

    animate();

  } catch (err) {
    console.warn('WebGL init error, falling back to 2D:', err);
    init2DFallbackParticles(canvas);
  }
}

function createPointTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(251, 191, 36, 0.85)');
  gradient.addColorStop(0.7, 'rgba(245, 158, 11, 0.35)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function init2DFallbackParticles(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const count = 45;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 0.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.1,
      alpha: Math.random() * 0.6 + 0.2
    });
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#fbbf24';
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(loop);
  }
  loop();
}

/* ================= 2. 3D CARD TILT & HOLOGRAPHIC LIGHT ENGINE ================= */
function init3DTiltEngine() {
  const tiltCards = document.querySelectorAll('.tilt-3d-card');
  if (!tiltCards.length) return;

  tiltCards.forEach((card) => {
    const maxTilt = parseFloat(card.getAttribute('data-tilt-max')) || 12;

    function handleMouseMove(e) {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Bound checking
      if (x < 0 || x > 1 || y < 0 || y > 1) return;

      const tiltX = (y - 0.5) * -maxTilt * 2;
      const tiltY = (x - 0.5) * maxTilt * 2;

      card.classList.remove('reset-tilt');
      card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
      card.style.setProperty('--glare-x', `${(x * 100).toFixed(1)}%`);
      card.style.setProperty('--glare-y', `${(y * 100).toFixed(1)}%`);
    }

    function handleMouseLeave() {
      card.classList.add('reset-tilt');
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    }

    card.addEventListener('mousemove', handleMouseMove, { passive: true });
    card.addEventListener('mouseleave', handleMouseLeave);
  });
}

/* ================= 3. MAGNETIC 3D BUTTONS ================= */
function initMagneticButtons() {
  const magneticElements = document.querySelectorAll(
    '.btn-hero-primary, .btn-hero-secondary, .btn-card-action, .btn-execute-dispatch, .btn-talk'
  );
  if (!magneticElements.length) return;

  magneticElements.forEach((btn) => {
    btn.classList.add('btn-magnetic');

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    }, { passive: true });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* ================= 4. 3D SCROLL ENTRANCE REVEALS ================= */
function initScrollReveal3D() {
  const revealElements = document.querySelectorAll('.reveal-3d');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach((el) => observer.observe(el));
}

/* ================= 5. STATS NUMBER COUNTER ================= */
function initStatsCounter() {
  const metrics = document.querySelectorAll('.metric-value[data-target]');
  if (!metrics.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target'));
          const isDecimal = el.getAttribute('data-decimal') === 'true';
          const suffix = el.getAttribute('data-suffix') || '+';
          const duration = 1800;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const easeVal = 1 - Math.pow(1 - progress, 3);
            const currentVal = easeVal * target;

            if (isDecimal) {
              el.textContent = currentVal.toFixed(2) + suffix;
            } else {
              el.textContent = Math.floor(currentVal) + suffix;
            }

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = (isDecimal ? target.toFixed(2) : target) + suffix;
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.3 }
  );

  metrics.forEach((m) => observer.observe(m));
}

/* ================= 6. WEB AUDIO SYNTHESIZER ================= */
let audioCtx = null;
let sfxEnabled = false;

function initAudioSystem() {
  const toggleBtn = document.getElementById('audioToggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    sfxEnabled = !sfxEnabled;
    toggleBtn.classList.toggle('playing', sfxEnabled);
    const audioText = toggleBtn.querySelector('.audio-text');
    if (audioText) {
      audioText.textContent = sfxEnabled ? 'SFX: ACTIVE' : 'SFX: OFF';
    }

    if (sfxEnabled) {
      playBeep(520, 'sine', 0.1);
    }
  });

  // Attach hover sound to interactive elements
  const buttons = document.querySelectorAll('button, .btn-hero-primary, .btn-hero-secondary, .btn-card-action, .btn-talk, .nav-item, .social-hud-link');
  buttons.forEach((b) => {
    b.addEventListener('mouseenter', () => {
      if (sfxEnabled) playBeep(380, 'sine', 0.04, 0.04);
    });
  });
}

function playBeep(freq, type = 'sine', duration = 0.08, vol = 0.08) {
  if (!audioCtx || !sfxEnabled) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn('Audio play error:', e);
  }
}

function playSuccessChime() {
  if (!audioCtx || !sfxEnabled) return;
  const notes = [440, 554.37, 659.25, 880];
  notes.forEach((freq, idx) => {
    setTimeout(() => playBeep(freq, 'triangle', 0.16, 0.1), idx * 75);
  });
}

/* ================= 7. HUD TERMINAL TRANSMISSION ================= */
function initTerminalDispatch() {
  const form = document.getElementById('transmissionForm');
  const logBox = document.getElementById('terminalLog');
  const submitBtn = document.getElementById('submitDispatchBtn');
  if (!form || !logBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('senderName').value.trim();
    const email = document.getElementById('senderChannel').value.trim();
    const payload = document.getElementById('senderPayload').value.trim();

    if (!name || !email || !payload) return;

    // Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>TRANSMITTING PACKET...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
    playBeep(600, 'square', 0.08, 0.05);

    logBox.innerHTML = `
      <div class="log-line text-warning">&gt; [AUTH] Handshake initiated with endpoint...</div>
    `;

    setTimeout(() => {
      logBox.innerHTML += `
        <div class="log-line text-muted">&gt; [ENCRYPT] AES-256 payload encoded (${payload.length} bytes)...</div>
      `;
      playBeep(720, 'square', 0.05, 0.04);
    }, 500);

    setTimeout(() => {
      logBox.innerHTML += `
        <div class="log-line text-success">&gt; [STATUS 200] Transmission successfully dispatched to Vinod!</div>
        <div class="log-line text-success">&gt; Thank you, ${name}. Reply scheduled on channel: ${email}</div>
      `;
      playSuccessChime();

      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span class="btn-inner-text">TRANSMISSION SENT!</span> <i class="fa-solid fa-check"></i>`;
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = `<span class="btn-inner-text">EXECUTE DISPATCH</span> <i class="fa-solid fa-arrow-up"></i>`;
      }, 4000);
    }, 1200);
  });
}

/* ================= 8. NAVBAR SCROLL & MOBILE MENU ================= */
function initNavScroll() {
  const header = document.querySelector('.navbar-wrapper');
  const navLinks = document.getElementById('navLinks');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const links = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightCurrentSection();
  }, { passive: true });

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    links.forEach((l) => {
      l.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  function highlightCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        links.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }
}

/* ================= 9. CARD STACK DYNAMIC DEPTH ================= */
function initCardStackDynamics() {
  const cards = document.querySelectorAll('.project-hud-card');
  if (!cards.length) return;

  window.addEventListener('scroll', () => {
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      // If card has stuck to its top position and subsequent cards overlap
      if (rect.top <= 120) {
        const diff = 120 - rect.top;
        const scale = Math.max(0.94, 1 - (diff / 2500));
        card.style.setProperty('--card-scale', scale.toFixed(4));
      } else {
        card.style.setProperty('--card-scale', '1');
      }
    });
  }, { passive: true });
}

/* ================= 10. FULL WEBSITE SECTION STACKING CONTROLLER (TAREEQA 1) ================= */
function initSectionStackScaling() {
  const sections = [
    document.getElementById('hero'),
    document.getElementById('about'),
    document.getElementById('projects'),
    document.getElementById('skills'),
    document.getElementById('experience'),
    document.getElementById('contact')
  ].filter(Boolean);

  if (!sections.length) return;

  window.addEventListener('scroll', () => {
    if (window.innerWidth <= 768) return; // standard flow on mobile screens

    const vh = window.innerHeight;

    sections.forEach((sec, idx) => {
      if (idx === sections.length - 1) return; // last section doesn't need to scale down
      const nextSec = sections[idx + 1];
      if (!nextSec) return;

      const nextRect = nextSec.getBoundingClientRect();

      // As the next section slides over this section
      if (nextRect.top < vh && nextRect.top >= 0) {
        const progress = 1 - (nextRect.top / vh);
        const scale = Math.max(0.93, 1 - (progress * 0.055));
        const brightness = Math.max(0.65, 1 - (progress * 0.35));
        const translateY = progress * -18;

        sec.style.transform = `perspective(1200px) scale(${scale}) translateY(${translateY}px)`;
        sec.style.filter = `brightness(${brightness})`;
      } else if (nextRect.top < 0) {
        // Covered
        sec.style.transform = 'perspective(1200px) scale(0.93) translateY(-18px)';
        sec.style.filter = 'brightness(0.65)';
      } else {
        // Active in view
        sec.style.transform = 'perspective(1200px) scale(1) translateY(0px)';
        sec.style.filter = 'brightness(1)';
      }
    });
  }, { passive: true });
}

/* ================= 11. GITHUB MEDIA RESILIENCE & AUTOPLAY ENGINE ================= */
window.handleImageFallback = function(img) {
  const fallbacks = [
    './vinod_portrait_studio.jpg',
    './assets/vinod_portrait.jpeg',
    './vinod_portrait.jpeg',
    './IMAGE FOR PORTFOLIYO WEBSITE.jpeg',
    './assets/hero_portrait.jpg',
    './hero_portrait.jpg'
  ];
  let idx = parseInt(img.dataset.fallbackIdx || '0', 10);
  if (idx < fallbacks.length) {
    img.dataset.fallbackIdx = (idx + 1).toString();
    img.src = fallbacks[idx];
  }
};

function initHeroVideo() {
  const video = document.getElementById('heroMotionVideo');
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');

  // Attempt video autoplay with user gesture fallback for strict mobile/HTTPS policies
  const tryPlay = () => {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => {
        console.warn('Autoplay restricted by browser policy. Awaiting first interaction:', e);
        const onFirstInteract = () => {
          video.play().catch(() => {});
          window.removeEventListener('click', onFirstInteract);
          window.removeEventListener('touchstart', onFirstInteract);
          window.removeEventListener('scroll', onFirstInteract);
        };
        window.addEventListener('click', onFirstInteract, { passive: true, once: true });
        window.addEventListener('touchstart', onFirstInteract, { passive: true, once: true });
        window.addEventListener('scroll', onFirstInteract, { passive: true, once: true });
      });
    }
  };

  if (video.readyState >= 2) {
    tryPlay();
  } else {
    video.addEventListener('loadeddata', tryPlay, { once: true });
    setTimeout(tryPlay, 400);
  }

  // Fallback for resume button if assets directory is not found on GitHub
  const resumeBtn = document.getElementById('resumeDownloadBtn');
  if (resumeBtn) {
    const testImg = new Image();
    testImg.onerror = () => {
      resumeBtn.setAttribute('href', './vinod_resume.pdf');
    };
    testImg.src = './assets/vinod_portrait_studio.jpg';
  }
}

