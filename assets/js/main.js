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

  /* ---- interactive ray-burst (cursor-repel) ---- */
  (function () {
    var canvas = document.getElementById('ray-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var section = document.querySelector('.ray-section');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, ox = 0, oy = 0;
    var rays = [], SEG = 6;
    var mouse = { x: -9999, y: -9999, active: false };
    var running = false, rafId = null;
    var themes = {
      'pre-dawn': { bg: 'linear-gradient(180deg,#1e1b4b,#312e81)', dark: true, colors: ['#818cf8', '#a5b4fc', '#6366f1'], dot: '#c7d2fe' },
      'sunrise':  { bg: 'linear-gradient(180deg,#fef3c7,#fbcfe8)', dark: false, colors: ['#fb923c', '#f472b6', '#fbbf24'], dot: '#f59e0b' },
      'daytime':  { bg: 'linear-gradient(180deg,#dbeafe,#eff6ff)', dark: false, colors: ['#3b82f6', '#60a5fa', '#2563eb'], dot: '#1d4ed8' },
      'dusk':     { bg: 'linear-gradient(180deg,#ede9fe,#fae8ff)', dark: false, colors: ['#7C3AED', '#a78bfa', '#c084fc'], dot: '#6d28d9' },
      'sunset':   { bg: 'linear-gradient(180deg,#fed7aa,#fecaca)', dark: false, colors: ['#f97316', '#ef4444', '#fb7185'], dot: '#ea580c' },
      'night':    { bg: 'linear-gradient(180deg,#0f172a,#1e1b4b)', dark: true, colors: ['#6366f1', '#475569', '#818cf8'], dot: '#a5b4fc' }
    };
    var current = 'dusk';
    function build() {
      rays = [];
      var N = 130, startA = Math.PI * 200 / 180, endA = Math.PI * 340 / 180, maxLen = H * 0.62;
      for (var i = 0; i < N; i++) {
        var t = i / (N - 1), ang = startA + t * (endA - startA), len = maxLen * (0.45 + Math.random() * 0.55), pts = [];
        for (var s = 0; s <= SEG; s++) {
          var f = s / SEG, hx = ox + Math.cos(ang) * len * f, hy = oy + Math.sin(ang) * len * f;
          pts.push({ hx: hx, hy: hy, x: hx, y: hy });
        }
        rays.push({ pts: pts, jitter: Math.random() });
      }
    }
    function resize() {
      var r = canvas.getBoundingClientRect();
      W = canvas.width = Math.max(1, r.width * dpr); H = canvas.height = Math.max(1, r.height * dpr);
      ox = W * 0.5; oy = H * 0.99; build();
    }
    function frame() {
      var th = themes[current], R = 95 * dpr, RR = R * R;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < rays.length; i++) {
        var ray = rays[i], col = th.colors[i % th.colors.length];
        for (var s = 1; s < ray.pts.length; s++) {
          var p = ray.pts[s];
          if (mouse.active) {
            var dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
            if (d2 < RR && d2 > 0.01) {
              var d = Math.sqrt(d2), force = (1 - d / R) * 30 * dpr * (s / SEG);
              p.x += (dx / d) * force; p.y += (dy / d) * force;
            }
          }
          p.x += (p.hx - p.x) * 0.12; p.y += (p.hy - p.y) * 0.12;
        }
        ctx.beginPath(); ctx.moveTo(ray.pts[0].x, ray.pts[0].y);
        for (var s2 = 1; s2 < ray.pts.length; s2++) ctx.lineTo(ray.pts[s2].x, ray.pts[s2].y);
        ctx.strokeStyle = col; ctx.globalAlpha = 0.16 + ray.jitter * 0.22; ctx.lineWidth = dpr * 0.7; ctx.stroke();
        var tip = ray.pts[ray.pts.length - 1];
        ctx.globalAlpha = 0.7 + ray.jitter * 0.3; ctx.fillStyle = th.dot;
        ctx.beginPath(); ctx.arc(tip.x, tip.y, dpr * 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 0.4;
        for (var s3 = 2; s3 < ray.pts.length - 1; s3 += 2) { var mp = ray.pts[s3]; ctx.beginPath(); ctx.arc(mp.x, mp.y, dpr * 1.1, 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.globalAlpha = 1;
      if (running) rafId = requestAnimationFrame(frame);
    }
    function start() { if (!running) { running = true; rafId = requestAnimationFrame(frame); } }
    function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); }
    function setMode(m) {
      current = m; var th = themes[m];
      section.style.background = th.bg;
      section.classList.toggle('dark', th.dark);
      document.querySelectorAll('.ray-mode').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-mode') === m); });
    }
    function onMove(e) { var r = canvas.getBoundingClientRect(); mouse.x = (e.clientX - r.left) * dpr; mouse.y = (e.clientY - r.top) * dpr; mouse.active = true; }
    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', function () { mouse.active = false; mouse.x = mouse.y = -9999; });
    section.addEventListener('touchmove', function (e) { var t = e.touches[0]; if (t) { var r = canvas.getBoundingClientRect(); mouse.x = (t.clientX - r.left) * dpr; mouse.y = (t.clientY - r.top) * dpr; mouse.active = true; } }, { passive: true });
    window.addEventListener('resize', resize);
    document.querySelectorAll('.ray-mode').forEach(function (b) { b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); }); });
    resize(); setMode('dusk');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { en.forEach(function (e) { e.isIntersecting ? start() : stop(); }); }, { threshold: 0.05 }).observe(section);
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
