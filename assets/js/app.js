/**
 * Cypherpunks Taiwan V2.2
 * Main Application JavaScript - Matrix Hacker Edition
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initMobileMenu();
  initThemeToggle();
  initReadingProgress();
  initBackToTop();
  initSearchModal();
  initMatrixRain();
  initCodeCopyButtons();
  initSmoothScroll();

  // New V2.2 Features
  initTypewriterEffect();
  initGlitchEffect();
  initCounterAnimation();
  initScrollReveal();
  initParallax();
  initTerminal();
  initParticles();
  initCard3D();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    menuBtn.setAttribute('aria-expanded', !isOpen);
  });

  // Mobile dropdown toggles
  const dropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
  dropdownBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const dropdown = btn.nextElementSibling;
      const icon = btn.querySelector('svg');
      dropdown.classList.toggle('hidden');
      icon.classList.toggle('rotate-180');
    });
  });

  // Close menu on link click
  const menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * Theme Toggle (Dark/Light Mode)
 */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');

    if (isDark) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }

    // Update Giscus theme if present
    updateGiscusTheme(!isDark);
  });
}

function updateGiscusTheme(isDark) {
  const giscusFrame = document.querySelector('iframe.giscus-frame');
  if (giscusFrame) {
    giscusFrame.contentWindow.postMessage(
      { giscus: { setConfig: { theme: isDark ? 'dark' : 'light' } } },
      'https://giscus.app'
    );
  }
}

/**
 * Reading Progress Bar
 */
function initReadingProgress() {
  const progressBar = document.getElementById('reading-progress');
  if (!progressBar) return;

  const article = document.querySelector('article');
  if (!article) {
    progressBar.style.display = 'none';
    return;
  }

  function updateProgress() {
    const articleRect = article.getBoundingClientRect();
    const articleTop = articleRect.top + window.scrollY;
    const articleHeight = article.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollTop = window.scrollY;

    // Calculate progress
    const start = articleTop;
    const end = articleTop + articleHeight - windowHeight;
    const current = scrollTop;

    let progress = 0;
    if (current >= start && current <= end) {
      progress = ((current - start) / (end - start)) * 100;
    } else if (current > end) {
      progress = 100;
    }

    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/**
 * Back to Top Button
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  function toggleVisibility() {
    if (window.scrollY > 500) {
      backToTopBtn.classList.remove('opacity-0', 'invisible');
      backToTopBtn.classList.add('opacity-100', 'visible');
    } else {
      backToTopBtn.classList.remove('opacity-100', 'visible');
      backToTopBtn.classList.add('opacity-0', 'invisible');
    }
  }

  window.addEventListener('scroll', toggleVisibility, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Search Modal
 */
function initSearchModal() {
  const searchBtn = document.getElementById('search-btn');
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  const searchClose = document.getElementById('search-close');
  const searchBackdrop = document.querySelector('.search-backdrop');

  if (!searchBtn || !searchModal) return;

  // Open modal
  function openSearch() {
    searchModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    setTimeout(() => searchInput?.focus(), 100);
  }

  // Close modal
  function closeSearch() {
    searchModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    if (searchInput) searchInput.value = '';
  }

  // Event listeners
  searchBtn.addEventListener('click', openSearch);
  searchClose?.addEventListener('click', closeSearch);
  searchBackdrop?.addEventListener('click', closeSearch);

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + K to open
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (searchModal.classList.contains('hidden')) {
        openSearch();
      } else {
        closeSearch();
      }
    }

    // ESC to close
    if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) {
      closeSearch();
    }
  });

  // Search functionality (Pagefind integration placeholder)
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        performSearch(e.target.value);
      }, 300);
    });
  }
}

// Pagefind instance
let pagefind = null;

async function initPagefind() {
  if (pagefind) return pagefind;

  try {
    pagefind = await import('/pagefind/pagefind.js');
    await pagefind.init();
    return pagefind;
  } catch (e) {
    console.warn('Pagefind not available:', e);
    return null;
  }
}

async function performSearch(query) {
  const resultsContainer = document.getElementById('search-results-list');
  const emptyState = document.getElementById('search-empty');
  const noResults = document.getElementById('search-no-results');
  const loading = document.getElementById('search-loading');
  const countDisplay = document.getElementById('search-count');
  const template = document.getElementById('search-result-template');

  if (!query.trim()) {
    emptyState?.classList.remove('hidden');
    resultsContainer?.classList.add('hidden');
    noResults?.classList.add('hidden');
    loading?.classList.add('hidden');
    if (countDisplay) countDisplay.textContent = '';
    return;
  }

  // Show loading
  emptyState?.classList.add('hidden');
  resultsContainer?.classList.add('hidden');
  noResults?.classList.add('hidden');
  loading?.classList.remove('hidden');

  try {
    // Initialize Pagefind
    const pf = await initPagefind();

    if (!pf) {
      // Fallback: search not available
      loading?.classList.add('hidden');
      noResults?.classList.remove('hidden');
      if (countDisplay) countDisplay.textContent = '搜尋功能尚未建立索引';
      return;
    }

    // Perform search
    const search = await pf.search(query);

    loading?.classList.add('hidden');

    if (search.results.length === 0) {
      noResults?.classList.remove('hidden');
      if (countDisplay) countDisplay.textContent = '';
      return;
    }

    // Show results
    resultsContainer.innerHTML = '';

    // Get first 10 results with data
    const results = await Promise.all(
      search.results.slice(0, 10).map(r => r.data())
    );

    results.forEach(result => {
      if (!template) return;

      const clone = template.content.cloneNode(true);
      const link = clone.querySelector('a');
      const title = clone.querySelector('.search-result-title');
      const excerpt = clone.querySelector('.search-result-excerpt');
      const date = clone.querySelector('.search-result-date');

      if (link) link.href = result.url;
      if (title) title.innerHTML = result.meta?.title || result.url;
      if (excerpt) excerpt.innerHTML = result.excerpt || '';
      if (date) date.textContent = result.meta?.date || '';

      resultsContainer.appendChild(clone);
    });

    resultsContainer?.classList.remove('hidden');
    if (countDisplay) {
      countDisplay.textContent = `找到 ${search.results.length} 個結果`;
    }

  } catch (e) {
    console.error('Search error:', e);
    loading?.classList.add('hidden');
    noResults?.classList.remove('hidden');
    if (countDisplay) countDisplay.textContent = '搜尋發生錯誤';
  }
}

/**
 * Matrix Rain Effect - Optimized for Performance
 */
function initMatrixRain() {
  const container = document.getElementById('matrix-rain');
  if (!container) return;

  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: transparent; opacity: 0.3;';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Simplified character set for better performance
  const chars = 'アイウエオカキクケコ0123456789';
  const charArray = chars.split('');

  const fontSize = 16;
  let columns = 0;
  let drops = [];

  function resize() {
    const parent = container.parentElement;
    const width = container.offsetWidth || parent?.offsetWidth || window.innerWidth;
    const height = container.offsetHeight || parent?.offsetHeight || 400;
    canvas.width = width;
    canvas.height = height;

    // Fewer columns for better performance
    columns = Math.floor(canvas.width / (fontSize * 2)) || 25;
    drops = new Array(columns).fill(0).map(() => Math.random() * -50);
  }

  resize();
  window.addEventListener('resize', resize);

  function draw() {
    if (columns === 0) return;

    // Semi-transparent to create fade trail (performant)
    ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px monospace`;
    ctx.fillStyle = '#4ade80';

    for (let i = 0; i < drops.length; i++) {
      const x = i * fontSize * 2;
      const y = drops[i] * fontSize;

      const char = charArray[Math.floor(Math.random() * charArray.length)];
      ctx.fillText(char, x, y);

      if (y > canvas.height && Math.random() > 0.98) {
        drops[i] = 0;
      }
      drops[i] += 0.5;
    }
  }

  // Lower frame rate for performance
  let lastTime = 0;
  const fps = 12;
  const interval = 1000 / fps;

  function animate(currentTime) {
    requestAnimationFrame(animate);

    const delta = currentTime - lastTime;
    if (delta < interval) return;

    lastTime = currentTime - (delta % interval);
    draw();
  }

  setTimeout(() => {
    resize();
    requestAnimationFrame(animate);
  }, 100);
}

/**
 * Typewriter Effect
 */
function initTypewriterEffect() {
  const zhElement = document.getElementById('typewriter-zh');
  const enElement = document.getElementById('typewriter-en');

  if (!zhElement || !enElement) return;

  const zhText = '密碼學使自由和隱私再次偉大';
  const enText = 'Cryptography makes freedom and privacy great again.';

  let zhIndex = 0;
  let enIndex = 0;
  let zhComplete = false;

  function typeZh() {
    if (zhIndex <= zhText.length) {
      zhElement.innerHTML = zhText.substring(0, zhIndex) + '<span class="typewriter-cursor">_</span>';
      zhIndex++;
      setTimeout(typeZh, 80);
    } else {
      zhComplete = true;
      zhElement.innerHTML = zhText + '<span class="typewriter-cursor blink">_</span>';
      setTimeout(typeEn, 300);
    }
  }

  function typeEn() {
    if (enIndex <= enText.length) {
      enElement.innerHTML = enText.substring(0, enIndex) + '<span class="typewriter-cursor">_</span>';
      enIndex++;
      setTimeout(typeEn, 40);
    } else {
      enElement.innerHTML = enText + '<span class="typewriter-cursor blink">_</span>';
    }
  }

  // Start typing after a short delay
  setTimeout(typeZh, 500);
}

/**
 * Glitch Effect for ASCII Logo
 */
function initGlitchEffect() {
  const logo = document.getElementById('ascii-logo');
  if (!logo) return;

  const originalText = logo.textContent;

  function glitch() {
    // Random glitch every 3-8 seconds
    const interval = 3000 + Math.random() * 5000;

    setTimeout(() => {
      // Apply glitch class
      logo.classList.add('glitching');

      // Random character replacement
      let glitchedText = originalText;
      const glitchChars = '!@#$%^&*()░▒▓█▀▄';
      const numGlitches = Math.floor(Math.random() * 10) + 5;

      for (let i = 0; i < numGlitches; i++) {
        const pos = Math.floor(Math.random() * originalText.length);
        const char = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        glitchedText = glitchedText.substring(0, pos) + char + glitchedText.substring(pos + 1);
      }

      logo.textContent = glitchedText;

      // Restore after glitch
      setTimeout(() => {
        logo.textContent = originalText;
        logo.classList.remove('glitching');
      }, 150);

      glitch();
    }, interval);
  }

  glitch();
}

/**
 * Counter Animation for Stats
 */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.counter');
  if (counters.length === 0) return;

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.target);
        animateCounter(counter, target);
        observer.unobserve(counter);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
  const duration = 2000;
  const start = 0;
  const startTime = performance.now();
  const prefix = element.dataset.prefix || '';
  const suffix = element.dataset.suffix || '';

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (target - start) * easeOutQuart);

    element.textContent = prefix + current + (progress < 1 ? '' : suffix);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = prefix + target + suffix;
      // Add pop animation on complete
      element.classList.add('counter-complete');
    }
  }

  requestAnimationFrame(update);
}

/**
 * Scroll Reveal Animation
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if (revealElements.length === 0) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    el.classList.add('reveal-hidden');
    observer.observe(el);
  });
}

/**
 * Parallax Effect
 */
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (parallaxElements.length === 0) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;

    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      const yPos = -(scrollY * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Interactive Terminal - Bitcoin Core Style
 */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');

  if (!input || !output) return;

  const commands = {
    help: () => `
<span class="text-cp-green-500">Available commands:</span>
  <span class="text-bitcoin-orange">help</span>      - Show this help message
  <span class="text-bitcoin-orange">about</span>     - About Cypherpunks Taiwan
  <span class="text-bitcoin-orange">btc</span>       - Bitcoin information
  <span class="text-bitcoin-orange">ln</span>        - Lightning Network info
  <span class="text-bitcoin-orange">manifesto</span> - Cypherpunk's Manifesto
  <span class="text-bitcoin-orange">blog</span>      - Go to blog
  <span class="text-bitcoin-orange">github</span>    - Visit our GitHub
  <span class="text-bitcoin-orange">clear</span>     - Clear terminal
  <span class="text-bitcoin-orange">satoshi</span>   - Famous Satoshi quotes
  <span class="text-bitcoin-orange">hash</span>      - Generate random hash`,

    about: () => `
<span class="text-cp-green-500">Cypherpunks Taiwan</span>
━━━━━━━━━━━━━━━━━━━━
Founded: <span class="text-bitcoin-orange">2019</span>
Mission: 推廣密碼學與隱私技術
Website: <span class="text-cp-green-400">cypherpunks-core.github.io</span>

"密碼學使自由和隱私再次偉大"
"Cryptography makes freedom and privacy great again."`,

    btc: () => `
<span class="text-bitcoin-orange">₿ Bitcoin</span>
━━━━━━━━━━━━
Genesis Block: <span class="text-cp-green-500">2009-01-03</span>
Creator: <span class="text-cp-green-500">Satoshi Nakamoto</span>
Max Supply: <span class="text-bitcoin-orange">21,000,000 BTC</span>
Consensus: Proof of Work (SHA-256)

"Chancellor on brink of second bailout for banks"
- Genesis Block Message`,

    ln: () => `
<span class="text-cp-green-500">⚡ Lightning Network</span>
━━━━━━━━━━━━━━━━━━━━
Layer 2 scaling solution for Bitcoin
Enables instant, low-cost transactions

Resources: /markdown/resources/resources-ln/`,

    manifesto: () => `
<span class="text-cp-green-500">"A Cypherpunk's Manifesto"</span> - Eric Hughes, 1993
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Privacy is necessary for an open society in the
electronic age. Privacy is not secrecy."

"Cypherpunks write code. We know that someone has
to write software to defend privacy, and we're
going to write it."`,

    blog: () => {
      setTimeout(() => window.location.href = '/blog/', 500);
      return '<span class="text-cp-green-500">Redirecting to blog...</span>';
    },

    github: () => {
      setTimeout(() => window.open('https://github.com/cypherpunks-core', '_blank'), 500);
      return '<span class="text-cp-green-500">Opening GitHub...</span>';
    },

    clear: () => {
      output.innerHTML = `
<div class="terminal-line text-cp-dark-600">
  Welcome to Cypherpunks Taiwan Terminal v2.2
</div>
<div class="terminal-line text-cp-dark-600">
  Type <span class="text-cp-green-500">help</span> to see available commands.
</div>
<div class="terminal-line text-cp-dark-600 mb-4">
  ───────────────────────────────────────────
</div>`;
      return null;
    },

    satoshi: () => {
      const quotes = [
        "If you don't believe it or don't get it, I don't have the time to try to convince you, sorry.",
        "The root problem with conventional currency is all the trust that's required to make it work.",
        "I've been working on a new electronic cash system that's fully peer-to-peer, with no trusted third party.",
        "Lost coins only make everyone else's coins worth slightly more. Think of it as a donation to everyone.",
        "The nature of Bitcoin is such that once version 0.1 was released, the core design was set in stone for the rest of its lifetime."
      ];
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      return `<span class="text-bitcoin-orange">Satoshi Nakamoto:</span>\n"${quote}"`;
    },

    hash: () => {
      const chars = '0123456789abcdef';
      let hash = '';
      for (let i = 0; i < 64; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
      }
      return `<span class="text-cp-dark-600">SHA-256:</span> <span class="text-cp-green-500">${hash}</span>`;
    }
  };

  function addLine(content, isCommand = false) {
    const line = document.createElement('div');
    line.className = 'terminal-line mb-1';
    if (isCommand) {
      line.innerHTML = `<span class="text-bitcoin-orange">bitcoin-cli&gt;</span> <span class="text-cp-dark-700">${content}</span>`;
    } else {
      line.innerHTML = content;
    }
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  // Terminal cursor tracking
  const cursor = document.getElementById('terminal-cursor');

  function updateCursorPosition() {
    if (!cursor) return;

    const inputRect = input.getBoundingClientRect();
    const inputStyle = window.getComputedStyle(input);
    const fontSize = parseFloat(inputStyle.fontSize);

    // Create a temporary span to measure text width
    const measureSpan = document.createElement('span');
    measureSpan.style.cssText = `
      font-family: ${inputStyle.fontFamily};
      font-size: ${inputStyle.fontSize};
      visibility: hidden;
      position: absolute;
      white-space: pre;
    `;
    measureSpan.textContent = input.value || '';
    document.body.appendChild(measureSpan);

    const textWidth = measureSpan.offsetWidth;
    document.body.removeChild(measureSpan);

    cursor.style.left = `${textWidth}px`;
  }

  input.addEventListener('input', updateCursorPosition);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim().toLowerCase();
      input.value = '';
      updateCursorPosition();

      if (cmd) {
        addLine(cmd, true);

        if (commands[cmd]) {
          const result = commands[cmd]();
          if (result) {
            addLine(`<pre class="whitespace-pre-wrap">${result}</pre>`);
          }
        } else {
          addLine(`<span class="text-red-500">Command not found: ${cmd}</span>`);
          addLine(`Type <span class="text-cp-green-500">help</span> for available commands.`);
        }
      }
    }
    // Update cursor after any key press
    setTimeout(updateCursorPosition, 0);
  });

  // Focus input when clicking terminal
  output.parentElement.addEventListener('click', () => {
    input.focus();
  });

  // Initial cursor position
  updateCursorPosition();
}

/**
 * Floating Particles Background
 */
function initParticles() {
  const container = document.getElementById('particles-bg');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let particles = [];
  const particleCount = 50;

  function resize() {
    const parent = container.parentElement;
    const width = container.offsetWidth || parent?.offsetWidth || window.innerWidth;
    const height = container.offsetHeight || parent?.offsetHeight || 400;
    canvas.width = width;
    canvas.height = height;

    // Reinitialize particles on resize
    if (particles.length === 0) {
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    }
  }

  resize();
  window.addEventListener('resize', resize);

  function draw() {
    if (particles.length === 0) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 255, 0, ${p.opacity})`;
      ctx.fill();

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });

    // Draw connections
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 255, 0, ${0.1 * (1 - dist / 100)})`;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(draw);
  }

  draw();
}

/**
 * 3D Card Tilt Effect
 */
function initCard3D() {
  const cards = document.querySelectorAll('.card-3d');
  if (cards.length === 0) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}

/**
 * Code Copy Buttons with Language Labels
 */
function initCodeCopyButtons() {
  // Process highlighter-rouge blocks (Jekyll/Rouge)
  const highlightBlocks = document.querySelectorAll('div.highlighter-rouge, figure.highlight');

  highlightBlocks.forEach((block) => {
    // Skip if already processed
    if (block.dataset.processed) return;
    block.dataset.processed = 'true';

    // Extract language from class
    const classList = block.className.split(' ');
    let language = '';
    classList.forEach(cls => {
      if (cls.startsWith('language-')) {
        language = cls.replace('language-', '');
      }
    });

    // Set data-lang attribute for CSS
    if (language) {
      block.setAttribute('data-lang', language);
    }

    // Find code element
    const codeElement = block.querySelector('code');
    if (!codeElement) return;

    // Create copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-copy-btn';
    copyBtn.innerHTML = `
      <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
      </svg>
      <span>複製</span>
    `;
    copyBtn.setAttribute('aria-label', '複製程式碼');
    block.style.position = 'relative';
    block.appendChild(copyBtn);

    // Copy functionality
    copyBtn.addEventListener('click', async () => {
      const code = codeElement.textContent;
      try {
        await navigator.clipboard.writeText(code);
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = `
          <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span>已複製!</span>
        `;
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = `
            <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
            </svg>
            <span>複製</span>
          `;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    });
  });

  // Process standalone pre>code blocks
  const codeBlocks = document.querySelectorAll('pre > code');

  codeBlocks.forEach((codeBlock) => {
    const pre = codeBlock.parentElement;
    if (!pre) return;

    // Skip if inside highlighter-rouge (already processed)
    if (pre.closest('.highlighter-rouge') || pre.closest('figure.highlight')) return;

    // Skip if already wrapped
    if (pre.parentElement?.classList.contains('code-block')) return;

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block relative';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    // Create copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-copy-btn';
    copyBtn.innerHTML = `
      <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
      </svg>
      <span>複製</span>
    `;
    copyBtn.setAttribute('aria-label', '複製程式碼');
    wrapper.appendChild(copyBtn);

    // Copy functionality
    copyBtn.addEventListener('click', async () => {
      const code = codeBlock.textContent;
      try {
        await navigator.clipboard.writeText(code);
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = `
          <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span>已複製!</span>
        `;
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = `
            <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
            </svg>
            <span>複製</span>
          `;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    });
  });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 100; // Account for fixed header
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without jumping
        history.pushState(null, null, href);
      }
    });
  });
}

