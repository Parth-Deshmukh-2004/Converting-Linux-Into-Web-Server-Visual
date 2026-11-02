/* architecture.js – the inline SVG diagram */
(function () {
  'use strict';
  var NS = (window.EC2V = window.EC2V || {});

  function packet(color, icon, steps, pathId, dur, extra) {
    var hold = extra && extra.hold;
    var motion = hold
      ? '<animateMotion dur="' + dur + '" repeatCount="indefinite" keyPoints="0;0;1" keyTimes="0;.5;1" calcMode="linear"><mpath href="#' + pathId + '"/></animateMotion>' +
        '<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.5;.56;.95;1" dur="' + dur + '" repeatCount="indefinite"/>'
      : '<animateMotion dur="' + dur + '" repeatCount="indefinite" calcMode="linear"><mpath href="#' + pathId + '"/></animateMotion>' +
        '<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.9;1" dur="' + dur + '" repeatCount="indefinite"/>';
    return '<g class="packet" data-steps="' + steps + '" filter="url(#glow)">' +
      '<circle r="17" fill="' + color + '" fill-opacity=".25" stroke="' + color + '" stroke-width="2"/>' +
      '<text text-anchor="middle" dy="6" font-size="18">' + icon + '</text>' + motion + '</g>';
  }

  function tile(x, y, from, until, stroke, title, l1, l2) {
    return '<g class="el" data-from="' + from + '"' + (until ? ' data-until="' + until + '"' : '') + '>' +
      '<rect x="' + x + '" y="' + y + '" width="200" height="90" rx="12" fill="#0f2447" stroke="' + stroke + '" stroke-width="2"/>' +
      '<text x="' + (x + 16) + '" y="' + (y + 28) + '" class="lbl" fill="#e8eefc">' + title + '</text>' +
      '<text x="' + (x + 16) + '" y="' + (y + 52) + '" class="small" fill="#bcd6ff">' + l1 + '</text>' +
      '<text x="' + (x + 16) + '" y="' + (y + 72) + '" class="tiny" fill="#8aa0c8">' + l2 + '</text></g>';
  }

  var SVG =
'<svg id="diagram" viewBox="0 0 1200 640" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram of a Linux server being turned into a web server: Apache, systemd, a firewall, website files, a virtual host and HTTPS, reachable from a visitor\'s browser over the Internet">' +
'<title>Linux server becoming a web server</title>' +
'<defs>' +
  '<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a1428"/><stop offset="1" stop-color="#14305c"/></linearGradient>' +
  '<pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#6f8fd0" opacity=".25"/></pattern>' +
  '<filter id="glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
  '<marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#ff9f43"/></marker>' +
  '<marker id="arrg" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#2ed573"/></marker>' +
  '<path id="path-in" d="M190,300 L600,300"/>' +
  '<path id="path-out" d="M600,336 L190,336"/>' +
  '<path id="path-pkg" d="M300,300 L600,300"/>' +
  '<path id="path-block" d="M190,300 L384,300"/>' +
'</defs>' +
'<rect width="1200" height="640" fill="url(#bg)"/>' +
'<rect width="1200" height="640" fill="url(#dots)"/>' +

/* wires first */
'<g class="el" data-from="2">' +
  '<line x1="180" y1="300" x2="470" y2="300" stroke="#5b7bb8" stroke-width="2" stroke-dasharray="5 5" opacity=".75"/>' +
  '<line x1="180" y1="336" x2="470" y2="336" stroke="#5b7bb8" stroke-width="2" stroke-dasharray="5 5" opacity=".75"/>' +
'</g>' +

/* server box */
'<rect x="470" y="30" width="700" height="570" rx="16" fill="#0f2447" fill-opacity=".55" stroke="#ffb84d" stroke-width="3"/>' +
'<text x="490" y="57" class="lbl" fill="#ffb84d">🐧 Linux server · Ubuntu Server 24.04 LTS</text>' +
'<g class="el" data-from="3"><rect x="840" y="38" width="70" height="26" rx="13" fill="#3b1219" stroke="#ff5d73"/><text x="875" y="56" text-anchor="middle" class="small" fill="#ffb3be">:80</text></g>' +
'<g class="el" data-from="7"><rect x="920" y="38" width="70" height="26" rx="13" fill="#0f2a1c" stroke="#2ed573"/><text x="955" y="56" text-anchor="middle" class="small" fill="#b6f5cd">:443</text></g>' +
'<g class="el" data-from="2"><text x="1150" y="56" text-anchor="end" class="small" fill="#9fb0d0">Public IP 203.0.113.25</text></g>' +

/* terminal */
'<rect x="490" y="72" width="660" height="190" rx="8" fill="#07101f" stroke="#2b3f6b"/>' +
'<rect x="490" y="72" width="660" height="24" rx="8" fill="#16264a"/>' +
'<circle cx="506" cy="84" r="4" fill="#ff5f57"/><circle cx="522" cy="84" r="4" fill="#febc2e"/><circle cx="538" cy="84" r="4" fill="#28c840"/>' +
'<text id="term-title" x="556" y="88" class="tiny mono" fill="#9fb0d0" style="font-size:11.5px"></text>' +
'<g id="term-lines"></g>' +

/* tiles */
tile(490, 372, 1, 0, '#8aa0c8', '🐧 Linux OS', 'Ubuntu Server 24.04', 'packages: up to date') +
tile(720, 372, 2, 2, '#8aa0c8', '📦 apache2', 'installed via apt', '○ installed, not running') +
tile(720, 372, 3, 0, '#2ed573', '📦 apache2', 'listening on :80', '● running') +
tile(950, 372, 3, 0, '#5aa9ff', '⚙️ systemd', 'apache2 · enabled', 'starts at every boot') +
tile(490, 480, 5, 0, '#f5b942', '📁 Web root', '/var/www/mysite', 'index.html · www-data') +
tile(720, 480, 6, 0, '#c084fc', '🧾 Virtual host', 'mysite.conf', 'example.com → web root') +
tile(950, 480, 7, 0, '#2ed573', '🔒 HTTPS', 'Let\'s Encrypt cert', 'port 443 · auto-renew') +

/* internet cloud */
'<g class="el" data-from="2">' +
  '<path d="M218,338 C196,338 196,304 222,302 C222,276 262,268 276,290 C300,280 318,308 300,322 C308,338 296,338 290,338 Z" fill="#1b3a6e" stroke="#7aa7ff" stroke-width="2"/>' +
  '<text x="255" y="362" text-anchor="middle" class="small halo" fill="#bcd6ff">Internet</text>' +
'</g>' +

/* visitor laptop */
'<g class="el" data-from="3">' +
  '<rect x="40" y="245" width="130" height="85" rx="6" fill="#0b1a38" stroke="#cbd5e1" stroke-width="2"/>' +
  '<rect x="25" y="336" width="160" height="10" rx="4" fill="#cbd5e1"/>' +
  '<text x="105" y="292" text-anchor="middle" class="tiny" fill="#8aa0c8">Browser</text>' +
  '<text x="105" y="372" text-anchor="middle" class="small" fill="#e8eefc">Visitor\'s laptop</text>' +
'</g>' +
'<g class="el" data-from="8">' +
  '<rect x="46" y="251" width="118" height="73" rx="4" fill="#0f2a1c"/>' +
  '<text x="105" y="270" text-anchor="middle" class="tiny" fill="#b6f5cd">🔒 example.com</text>' +
  '<text x="105" y="298" text-anchor="middle" class="small" fill="#2ed573">Welcome to</text>' +
  '<text x="105" y="316" text-anchor="middle" class="small" fill="#2ed573">my server!</text>' +
'</g>' +

/* DNS pill */
'<g class="el" data-from="6">' +
  '<rect x="30" y="480" width="350" height="30" rx="15" fill="#2a1647" stroke="#c084fc"/>' +
  '<text x="205" y="500" text-anchor="middle" class="small" fill="#e9d5ff">🌐 DNS A record: example.com → 203.0.113.25</text>' +
'</g>' +

/* firewall wall: closed in step 3, open from step 4 */
'<g class="el" data-from="3" data-until="3">' +
  '<rect x="405" y="230" width="24" height="180" rx="4" fill="#4a1620" stroke="#ff5d73" stroke-width="2.5"/>' +
  '<text x="417" y="326" text-anchor="middle" font-size="22" fill="#ff5d73">✖</text>' +
  '<text x="417" y="432" text-anchor="middle" class="tiny halo" fill="#ffb3be">Firewall</text>' +
  '<text x="417" y="448" text-anchor="middle" class="tiny halo" fill="#ffb3be">80 blocked</text>' +
'</g>' +
'<g class="el" data-from="4">' +
  '<rect x="405" y="230" width="24" height="46" rx="4" fill="#0f2a1c" stroke="#2ed573" stroke-width="2.5"/>' +
  '<rect x="405" y="360" width="24" height="50" rx="4" fill="#0f2a1c" stroke="#2ed573" stroke-width="2.5"/>' +
  '<text x="417" y="432" text-anchor="middle" class="tiny halo" fill="#b6f5cd">Firewall (ufw)</text>' +
  '<text x="417" y="448" text-anchor="middle" class="tiny halo" fill="#b6f5cd">allow 80, 443</text>' +
'</g>' +

/* packets last */
packet('#5aa9ff', '📦', '2', 'path-pkg', '2.6s') +
packet('#ff9f43', '✉️', '3', 'path-block', '2.6s') +
packet('#ff9f43', '✉️', '4,8', 'path-in', '4s') +
packet('#2ed573', '🔐', '7', 'path-in', '4s') +
packet('#2ed573', '📄', '8', 'path-out', '4s', { hold: true }) +

/* static arrows for reduced motion */
'<g class="sarrow" data-steps="2,4,7,8" style="display:none"><line x1="200" y1="300" x2="590" y2="300" stroke="#ff9f43" stroke-width="3" marker-end="url(#arr)"/></g>' +
'<g class="sarrow" data-steps="3" style="display:none"><line x1="200" y1="300" x2="384" y2="300" stroke="#ff9f43" stroke-width="3" marker-end="url(#arr)"/></g>' +
'<g class="sarrow" data-steps="8" style="display:none"><line x1="590" y1="336" x2="200" y2="336" stroke="#2ed573" stroke-width="3" marker-end="url(#arrg)"/></g>' +
'</svg>';

  NS.buildDiagram = function (container) {
    container.innerHTML = SVG;
    return container.querySelector('svg');
  };
})();
