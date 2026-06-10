/* ============================================================
   writeXpert — interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---- navbar scroll state ---- */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile menu ---- */
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('menu-open');
    });
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { document.body.classList.remove('menu-open'); });
    });
  }

  /* ---- scroll reveal ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ---- count up ---- */
  var counted = false;
  function runCounts() {
    if (counted) return;
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1400, start = null;
      function tick(t) {
        if (!start) start = t;
        var p = Math.min((t - start) / dur, 1);
        var ease = 1 - Math.pow(1 - p, 3);
        var val = target * ease;
        el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
    counted = true;
  }
  var heroMeta = document.querySelector('.hero-meta, [data-count]');
  if (heroMeta) {
    var cio = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { runCounts(); cio.disconnect(); } });
    }, { threshold: 0.4 });
    cio.observe(heroMeta);
  }

  /* ---- card spotlight ---- */
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---- magnetic buttons ---- */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + x * 0.25 + 'px,' + y * 0.35 + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---- custom cursor ---- */
  if (window.matchMedia('(hover: hover)').matches) {
    var dot = document.createElement('div'); dot.className = 'cursor-dot';
    var ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.appendChild(dot); document.body.appendChild(ring);
    var rx = 0, ry = 0, dx = 0, dy = 0;
    document.addEventListener('mousemove', function (e) {
      dx = e.clientX; dy = e.clientY;
      dot.style.transform = 'translate(' + dx + 'px,' + dy + 'px) translate(-50%,-50%)';
    });
    function loop() {
      rx += (dx - rx) * 0.18; ry += (dy - ry) * 0.18;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    }
    loop();
    document.querySelectorAll('a, button, .card, .work-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('hover'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('hover'); });
    });
  }

  /* ---- contact form -> WhatsApp (no backend, static-safe) ---- */
  var form = document.getElementById('lead-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (document.getElementById('f-name') || {}).value || '';
      var email = (document.getElementById('f-email') || {}).value || '';
      var service = (document.getElementById('f-service') || {}).value || '';
      var msg = (document.getElementById('f-msg') || {}).value || '';
      var text = 'Hi writeXpert! 👋%0A%0A' +
        'Name: ' + encodeURIComponent(name) + '%0A' +
        'Email: ' + encodeURIComponent(email) + '%0A' +
        'Interested in: ' + encodeURIComponent(service) + '%0A%0A' +
        'Project details:%0A' + encodeURIComponent(msg);
      window.open('https://wa.me/918824732009?text=' + text, '_blank');
    });
  }
})();

  /* ---- chart bar animation ---- */
  var chart = document.getElementById('db-chart');
  if (chart) {
    var cio = new IntersectionObserver(function(en) {
      en.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.db-bar').forEach(function(bar, i) {
            setTimeout(function() {
              bar.style.height = bar.getAttribute('data-h') + '%';
            }, i * 80);
          });
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    cio.observe(chart);
  }

  /* ---- scroll progress bar ---- */
  var sp = document.getElementById('scroll-progress');
  if (sp) {
    window.addEventListener('scroll', function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      sp.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    }, { passive: true });
  }

  /* ---- hero chart draw ---- */
  var hvFloat = document.querySelector('.hv-float');
  if (hvFloat) {
    setTimeout(function () { hvFloat.classList.add('drawn'); }, 500);
  }

  /* ---- hero visual parallax ---- */
  var hv = document.getElementById('hero-visual');
  var hvInner = document.querySelector('.hv-float');
  if (hv && hvInner && window.matchMedia('(hover: hover)').matches) {
    var hero = document.querySelector('.hero');
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      hvInner.style.transform = 'perspective(1000px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) translate(' + (x * 14) + 'px,' + (y * 14) + 'px)';
    });
    hero.addEventListener('mouseleave', function () {
      hvInner.style.transform = '';
    });
  }

  /* ---- ray-burst: emanating sun-rays (Stripe-grade) ---- */
  (function () {
    var canvas = document.getElementById('ray-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var section = document.querySelector('.ray-section');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, ox = 0, oy = 0, maxLen = 0;
    var rays = [];
    var mouse = { x: -9999, y: -9999, active: false };
    var running = false, rafId = null;
    var P = {
      'pre-dawn': { bg: 'linear-gradient(180deg,#1e1b4b,#312e81)', dark: true, base: '#6366f1', tip: '#a5b4fc', dot: '#c7d2fe', glow: 'rgba(129,140,248,0.30)' },
      'sunrise':  { bg: 'linear-gradient(180deg,#fef3c7,#fbcfe8)', dark: false, base: '#f97316', tip: '#f472b6', dot: '#f59e0b', glow: 'rgba(251,191,36,0.50)' },
      'daytime':  { bg: 'linear-gradient(180deg,#dbeafe,#eff6ff)', dark: false, base: '#2563eb', tip: '#60a5fa', dot: '#1d4ed8', glow: 'rgba(251,191,36,0.45)' },
      'dusk':     { bg: 'linear-gradient(180deg,#ede9fe,#fae8ff)', dark: false, base: '#6d28d9', tip: '#c084fc', dot: '#7C3AED', glow: 'rgba(244,114,182,0.40)' },
      'sunset':   { bg: 'linear-gradient(180deg,#fed7aa,#fecaca)', dark: false, base: '#7c3aed', tip: '#fb7185', dot: '#ef4444', glow: 'rgba(249,115,22,0.48)' },
      'night':    { bg: 'linear-gradient(180deg,#0f172a,#1e1b4b)', dark: true, base: '#475569', tip: '#818cf8', dot: '#a5b4fc', glow: 'rgba(99,102,241,0.30)' }
    };
    var current = 'dusk';
    function build() {
      rays = [];
      var N = 184, startA = Math.PI * 183 / 180, endA = Math.PI * 357 / 180;
      for (var i = 0; i < N; i++) {
        var t = i / (N - 1);
        var ang = startA + t * (endA - startA) + (Math.random() - 0.5) * 0.012;
        var len = maxLen * (0.5 + Math.random() * 0.5);
        var dots = [];
        var nd = 1 + Math.floor(Math.random() * 2);
        for (var d = 0; d < nd; d++) dots.push({ p: Math.random(), spd: 0.0016 + Math.random() * 0.0026, ox: 0, oy: 0 });
        rays.push({ a: ang, len: len, ca: Math.cos(ang), sa: Math.sin(ang), jitter: Math.random(), dots: dots });
      }
    }
    function resize() {
      var r = canvas.getBoundingClientRect();
      W = canvas.width = Math.max(1, r.width * dpr); H = canvas.height = Math.max(1, r.height * dpr);
      ox = W * 0.5; oy = H * 0.985; maxLen = H * 0.66; build();
    }
    function frame() {
      var th = P[current];
      ctx.clearRect(0, 0, W, H);
      // sun glow
      var gR = maxLen * 0.9;
      var g = ctx.createRadialGradient(ox, oy, 0, ox, oy, gR);
      g.addColorStop(0, th.glow); g.addColorStop(0.5, th.glow.replace(/0?\.\d+\)$/, '0.12)')); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ox, oy, gR, Math.PI, 0); ctx.fill();
      var R = 80 * dpr, RR = R * R;
      for (var i = 0; i < rays.length; i++) {
        var ray = rays[i];
        var tx = ox + ray.ca * ray.len, ty = oy + ray.sa * ray.len;
        // gradient line
        var lg = ctx.createLinearGradient(ox, oy, tx, ty);
        lg.addColorStop(0, th.base); lg.addColorStop(1, th.tip);
        ctx.strokeStyle = lg; ctx.globalAlpha = 0.10 + ray.jitter * 0.16; ctx.lineWidth = dpr * 0.6;
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(tx, ty); ctx.stroke();
        // traveling dots
        for (var d = 0; d < ray.dots.length; d++) {
          var dot = ray.dots[d];
          dot.p += dot.spd; if (dot.p > 1) dot.p -= 1;
          var px = ox + ray.ca * ray.len * dot.p, py = oy + ray.sa * ray.len * dot.p;
          if (mouse.active) {
            var dx = px - mouse.x, dy = py - mouse.y, d2 = dx * dx + dy * dy;
            if (d2 < RR && d2 > 0.01) { var dd = Math.sqrt(d2), f = (1 - dd / R) * 24 * dpr; px += (dx / dd) * f; py += (dy / dd) * f; }
          }
          var fade = Math.sin(dot.p * Math.PI);
          ctx.globalAlpha = fade * (0.5 + ray.jitter * 0.5);
          ctx.fillStyle = th.dot;
          ctx.beginPath(); ctx.arc(px, py, dpr * (1.0 + fade * 0.9), 0, Math.PI * 2); ctx.fill();
        }
      }
      // bright sun core
      ctx.globalAlpha = 1;
      var core = ctx.createRadialGradient(ox, oy, 0, ox, oy, maxLen * 0.18);
      core.addColorStop(0, th.dark ? 'rgba(199,210,254,0.5)' : 'rgba(255,255,255,0.85)');
      core.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = core; ctx.beginPath(); ctx.arc(ox, oy, maxLen * 0.18, Math.PI, 0); ctx.fill();
      ctx.globalAlpha = 1;
      if (running) rafId = requestAnimationFrame(frame);
    }
    function start() { if (!running) { running = true; rafId = requestAnimationFrame(frame); } }
    function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); }
    function setMode(m) {
      current = m; var th = P[m];
      section.style.background = th.bg;
      section.classList.toggle('dark', th.dark);
      document.querySelectorAll('.ray-mode').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-mode') === m); });
    }
    function onMove(e) { var r = canvas.getBoundingClientRect(); mouse.x = (e.clientX - r.left) * dpr; mouse.y = (e.clientY - r.top) * dpr; mouse.active = true; }
    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', function () { mouse.active = false; mouse.x = mouse.y = -9999; });
    section.addEventListener('touchmove', function (e) { var t = e.touches[0]; if (t) { var r = canvas.getBoundingClientRect(); mouse.x = (t.clientX - r.left) * dpr; mouse.y = (t.clientY - r.top) * dpr; mouse.active = true; } }, { passive: true });
    // mode toggle (sun icon opens menu)
    var toggle = document.getElementById('ray-toggle');
    var menu = document.querySelector('.ray-modes');
    if (toggle && menu) {
      toggle.addEventListener('click', function (e) { e.stopPropagation(); menu.classList.toggle('open'); });
      document.addEventListener('click', function (e) { if (!menu.contains(e.target) && e.target !== toggle) menu.classList.remove('open'); });
    }
    window.addEventListener('resize', resize);
    document.querySelectorAll('.ray-mode').forEach(function (b) { b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); if (menu) menu.classList.remove('open'); }); });
    resize(); setMode('dusk');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { en.forEach(function (e) { e.isIntersecting ? start() : stop(); }); }, { threshold: 0.04 }).observe(section);
    } else { start(); }
    setTimeout(resize, 80);
  })();

  /* ---- AI chat widget (Groq/Llama via /api/chat) ---- */
  (function () {
    var fab = document.getElementById('ai-fab');
    if (!fab) return;
    var panel = document.getElementById('ai-panel');
    var msgs = document.getElementById('ai-msgs');
    var input = document.getElementById('ai-input-field');
    var send = document.getElementById('ai-send');
    var history = [], greeted = false;
    function addMsg(text, who) { var d = document.createElement('div'); d.className = 'ai-msg ' + who; d.textContent = text; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; }
    function typing() { var d = document.createElement('div'); d.className = 'ai-typing'; d.innerHTML = '<span></span><span></span><span></span>'; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d; }
    function open() { panel.classList.add('open'); if (!greeted) { addMsg("Hi, I'm Xara \u2014 writeXpert's AI assistant. Ask me about what we build, our process, or how to start a project.", 'bot'); greeted = true; } input.focus(); }
    function close() { panel.classList.remove('open'); }
    fab.addEventListener('click', function () { panel.classList.contains('open') ? close() : open(); });
    document.getElementById('ai-close').addEventListener('click', close);
    function ask(text) {
      text = (text || '').trim(); if (!text) return;
      addMsg(text, 'user'); history.push({ role: 'user', content: text });
      input.value = ''; send.disabled = true;
      var t = typing();
      fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-10) }) })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          t.remove();
          var reply = data.reply || data.error || "Sorry, I couldn't respond right now — please try WhatsApp.";
          addMsg(reply, 'bot'); history.push({ role: 'assistant', content: reply });
          send.disabled = false; input.focus();
        })
        .catch(function () {
          t.remove();
          addMsg("I'm having trouble connecting right now. You can reach us on WhatsApp for a quick reply.", 'bot');
          send.disabled = false;
        });
    }
    send.addEventListener('click', function () { ask(input.value); });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') ask(input.value); });
    document.querySelectorAll('.ai-chip').forEach(function (c) { c.addEventListener('click', function () { ask(c.textContent); }); });
  })();
