# Linux Web Server Visualizer

An interactive, animated, beginner-friendly website that explains **how to convert a plain Linux machine into a web server**, step by step. Same story-driven style as the AWS visualizers: Ravi updates his Linux box, installs Apache, opens the firewall, adds his site, points a domain at it and adds HTTPS.

Built with only HTML5, CSS3, vanilla JavaScript and inline SVG. No frameworks, npm, build tools or backend.

## Features

- 8 learning steps with progressive reveal (clicking an earlier step returns the diagram to that state)
- One animated inline SVG diagram (`viewBox="0 0 1200 640"`, dark navy, dot grid)
- Moving packets via `animateMotion` + `mpath`: 📦 package, ✉️ request (blocked, then allowed), 🔐 HTTPS request, 📄 response
- Auto-play (5 s per step), Pause, Reset, progress indicator (e.g. 4/8)
- Beginner / Technical explanation mode
- Light and dark page themes (the diagram always stays dark navy)
- Architecture summary and a searchable glossary of 21 terms
- Keyboard accessible: focus outlines and ← / → to change steps
- Respects `prefers-reduced-motion` (packets become static arrows)

## The eight steps

| # | Step | Key commands (Ubuntu/Debian) |
|---|------|------|
| 1 | Update the system | `sudo apt update && sudo apt upgrade -y` |
| 2 | Install Apache | `sudo apt install -y apache2` |
| 3 | Start & enable the service | `sudo systemctl enable --now apache2` |
| 4 | Open the firewall | `sudo ufw allow OpenSSH && sudo ufw allow "Apache Full" && sudo ufw enable` |
| 5 | Add website files | `mkdir`, `tee index.html`, `chown www-data`, `chmod 755` |
| 6 | Create a virtual host | `a2ensite`, `apache2ctl configtest`, `systemctl reload apache2` |
| 7 | Secure with HTTPS | `sudo certbot --apache -d example.com` |
| 8 | Visit & check logs | `curl -I`, `tail /var/log/apache2/access.log` |

Notes:
- Allow **OpenSSH before enabling ufw**, or you can lock yourself out.
- On RHEL/Fedora/Amazon Linux use `dnf`, the package `httpd` and `firewalld`.
- On cloud servers (e.g. AWS EC2) also open ports 80 and 443 in the security group.
- Certbot needs a real domain whose DNS A record points to your server. `example.com` and `203.0.113.25` are documentation examples.

## Folder structure

```text
linux-webserver-visualizer/
├── index.html
├── css/style.css
├── js/
│   ├── app.js            UI wiring (steps, controls, theme, glossary)
│   ├── architecture.js   the inline SVG diagram
│   ├── animations.js     step visibility, terminal text, packets
│   └── steps.js          step text, legend, glossary data
├── assets/favicon.svg
├── .nojekyll
├── LICENSE
└── README.md
```

## Run locally

```bash
python3 -m http.server 8000
```

Open http://localhost:8000

## Deploy to GitHub Pages

Settings → Pages → Deploy from a branch → main → / (root) → Save.

## Customise

- Edit step text, terminal lines, legend and glossary in `js/steps.js` (keep terminal lines under about 75 characters and at most 7 lines).
- Edit the diagram in `js/architecture.js`: elements with `data-from` / `data-until` appear on those steps; packets use `data-steps`.
- Change colours and layout in `css/style.css`.

## License

MIT, see `LICENSE`.
