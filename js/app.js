/* app.js – UI wiring: steps, controls, modes, theme, glossary */
(function () {
  'use strict';
  var NS = window.EC2V;
  var STEPS = NS.STEPS;
  var TOTAL = STEPS.length;
  var step = 1;
  var timer = null;
  var svg = null;

  function $(s) { return document.querySelector(s); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function buildSteps() {
    var ol = $('#steps');
    STEPS.forEach(function (s) {
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'step-btn';
      b.setAttribute('data-step', s.id);
      b.innerHTML = '<span class="num">' + s.id + '</span><span><strong>' + esc(s.title) + '</strong><small>' + esc(s.subtitle) + '</small></span>';
      b.addEventListener('click', function () { pause(); goTo(s.id); });
      li.appendChild(b);
      ol.appendChild(li);
    });
  }

  function buildLegend() {
    var ul = $('#legend');
    NS.PACKETS.forEach(function (p) {
      var li = document.createElement('li');
      li.innerHTML = '<span class="ico" aria-hidden="true">' + p.icon + '</span><span><strong>' + esc(p.name) + '</strong><small>' + esc(p.desc) + '</small></span>';
      ul.appendChild(li);
    });
  }

  function goTo(n) {
    step = Math.max(1, Math.min(TOTAL, n));
    var data = STEPS[step - 1];
    Array.prototype.forEach.call(document.querySelectorAll('.step-btn'), function (b) {
      var id = +b.getAttribute('data-step');
      b.classList.toggle('done', id < step);
      if (id === step) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    var active = document.querySelector('.step-btn[aria-current="step"]');
    if (active && active.scrollIntoView) {
      try { active.scrollIntoView({ block: 'nearest', inline: 'center' }); } catch (e) { /* ignore */ }
    }
    $('#progressText').textContent = step + '/' + TOTAL;
    $('#progressFill').style.width = (step / TOTAL * 100) + '%';
    $('#cardKicker').textContent = 'Step ' + step + ' of ' + TOTAL;
    $('#cardTitle').textContent = data.title;
    $('#cardPlain').textContent = data.plain;
    $('#cardTech').textContent = data.tech;
    $('#cardWatch').textContent = data.watch;
    NS.Anim.apply(svg, step);
  }

  function play() {
    if (timer) return;
    if (step >= TOTAL) goTo(1);
    $('#playBtn').disabled = true;
    $('#pauseBtn').disabled = false;
    timer = setInterval(function () {
      if (step < TOTAL) goTo(step + 1);
      else pause();
    }, 5000);
  }

  function pause() {
    if (timer) { clearInterval(timer); timer = null; }
    $('#playBtn').disabled = false;
    $('#pauseBtn').disabled = true;
  }

  function reset() { pause(); goTo(1); }

  function setMode(m) {
    document.body.setAttribute('data-mode', m);
    $('#modeBeginner').setAttribute('aria-pressed', String(m === 'beginner'));
    $('#modeTechnical').setAttribute('aria-pressed', String(m === 'technical'));
  }

  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    var btn = $('#themeBtn');
    btn.textContent = t === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    try { localStorage.setItem('ec2v-theme', t); } catch (e) { /* ignore */ }
  }

  function initialTheme() {
    try { var s = localStorage.getItem('ec2v-theme'); if (s === 'light' || s === 'dark') return s; } catch (e) { /* ignore */ }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function renderGlossary(q) {
    var list = $('#glossList');
    var query = (q || '').trim().toLowerCase();
    var items = NS.GLOSSARY.filter(function (g) {
      return !query || (g.term + ' ' + g.def + ' ' + g.analogy + ' ' + g.role).toLowerCase().indexOf(query) !== -1;
    });
    list.innerHTML = items.map(function (g) {
      return '<article class="gloss-item"><h3>' + esc(g.term) + '</h3>' +
        '<p>' + esc(g.def) + '</p>' +
        '<p><b>Analogy:</b> ' + esc(g.analogy) + '</p>' +
        '<p><b>Role here:</b> ' + esc(g.role) + '</p></article>';
    }).join('');
    $('#glossCount').textContent = items.length ? items.length + ' of ' + NS.GLOSSARY.length + ' terms' : 'No matching terms. Try another word.';
  }

  function bind() {
    $('#playBtn').addEventListener('click', play);
    $('#pauseBtn').addEventListener('click', pause);
    $('#resetBtn').addEventListener('click', reset);
    $('#modeBeginner').addEventListener('click', function () { setMode('beginner'); });
    $('#modeTechnical').addEventListener('click', function () { setMode('technical'); });
    $('#themeBtn').addEventListener('click', function () {
      setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
    $('#glossSearch').addEventListener('input', function (e) { renderGlossary(e.target.value); });
    document.addEventListener('keydown', function (e) {
      var tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowRight') { pause(); goTo(step + 1); }
      if (e.key === 'ArrowLeft') { pause(); goTo(step - 1); }
    });
  }

  function init() {
    svg = NS.buildDiagram($('#diagramWrap'));
    buildSteps();
    buildLegend();
    renderGlossary('');
    bind();
    setTheme(initialTheme());
    setMode('beginner');
    NS.refresh = function () { NS.Anim.apply(svg, step); };
    var m = /step-(\d+)/.exec(window.location.hash || '');
    svg.classList.add('instant');
    goTo(m ? +m[1] : 1);
    requestAnimationFrame(function () { requestAnimationFrame(function () { svg.classList.remove('instant'); }); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
