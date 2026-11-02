/* animations.js – step visibility, terminal rendering, packet control */
(function () {
  'use strict';
  var NS = (window.EC2V = window.EC2V || {});
  var SVGNS = 'http://www.w3.org/2000/svg';
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  function inRange(el, step) {
    var from = el.getAttribute('data-from') ? +el.getAttribute('data-from') : 1;
    var until = el.getAttribute('data-until') ? +el.getAttribute('data-until') : 99;
    return step >= from && step <= until;
  }

  function lineClass(line) {
    if (line.charAt(0) === '$') return 'cmd';
    if (line.charAt(0) === '#') return 'cmt';
    if (/running|Complete!|200 OK|Successfully|Congratulations|ALLOW|enabled/.test(line)) return 'ok';
    return '';
  }

  function renderTerminal(svg, step) {
    var data = NS.STEPS[step - 1];
    var title = svg.querySelector('#term-title');
    var g = svg.querySelector('#term-lines');
    if (!title || !g) return;
    title.textContent = data.panelTitle;
    while (g.firstChild) g.removeChild(g.firstChild);
    data.lines.slice(-7).forEach(function (line, i) {
      var t = document.createElementNS(SVGNS, 'text');
      t.setAttribute('x', 506);
      t.setAttribute('y', 118 + i * 20);
      t.setAttribute('class', 'mono term-line ' + lineClass(line));
      t.textContent = line;
      g.appendChild(t);
    });
  }

  NS.Anim = {
    reduced: function () { return !!mq.matches; },
    apply: function (svg, step) {
      if (!svg) return;
      var reduced = !!mq.matches;
      Array.prototype.forEach.call(svg.querySelectorAll('[data-from]'), function (el) {
        el.classList.toggle('off', !inRange(el, step));
      });
      Array.prototype.forEach.call(svg.querySelectorAll('[data-steps]'), function (el) {
        var on = el.getAttribute('data-steps').split(',').map(Number).indexOf(step) !== -1;
        var isPacket = el.classList.contains('packet');
        var show = on && (isPacket ? !reduced : reduced);
        el.style.display = show ? '' : 'none';
      });
      if (typeof svg.setCurrentTime === 'function') svg.setCurrentTime(0);
      renderTerminal(svg, step);
    }
  };

  if (mq.addEventListener) {
    mq.addEventListener('change', function () {
      if (NS.refresh) NS.refresh();
    });
  }
})();
