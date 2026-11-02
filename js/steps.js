/* steps.js – learning-step content, legend and glossary */
(function () {
  'use strict';
  var NS = (window.EC2V = window.EC2V || {});

  NS.STEPS = [
    {
      id: 1, title: 'Update the System', subtitle: 'Start from a fresh, current Linux',
      panelTitle: 'ubuntu@server: ~',
      lines: [
        '$ sudo apt update',
        'Reading package lists... Done',
        '$ sudo apt upgrade -y',
        'Calculating upgrade... Done',
        '$ grep PRETTY_NAME /etc/os-release',
        'PRETTY_NAME="Ubuntu 24.04 LTS"'
      ],
      plain: "Ravi has a plain Linux computer. It can run programs, but it cannot hand out web pages yet. Before changing anything he refreshes the list of available software (like refreshing an app store) and installs pending updates so the machine is safe and current.",
      tech: "apt update refreshes the package index from the configured repositories; apt upgrade installs newer versions of installed packages. These examples use Ubuntu/Debian. On RHEL, Fedora or Amazon Linux use dnf instead. Always do this over SSH or at the console as a user with sudo rights.",
      watch: "Only the Linux server box is visible, with one tile for the operating system. The terminal shows the update commands."
    },
    {
      id: 2, title: 'Install Apache', subtitle: 'Get the web server software',
      panelTitle: 'ubuntu@server: ~',
      lines: [
        '$ sudo apt install -y apache2',
        'Setting up apache2 (2.4.x) ...',
        '$ apache2 -v',
        'Server version: Apache/2.4.x (Ubuntu)'
      ],
      plain: "A web server is just a program whose job is to hand out web pages. Ravi downloads one called Apache from the app store (the package manager). Think of it as hiring a shopkeeper who has not started work yet.",
      tech: "On Debian/Ubuntu the package is apache2 (on RHEL-family systems it is httpd). The package manager downloads it from the repository, installs the binaries, creates the www-data user and places default config in /etc/apache2. Nginx is a popular alternative web server.",
      watch: "A 📦 package travels from the Internet into the server and an apache2 tile appears, marked 'installed, not running'."
    },
    {
      id: 3, title: 'Start & Enable the Service', subtitle: 'Switch the shopkeeper on',
      panelTitle: 'ubuntu@server: ~',
      lines: [
        '$ sudo systemctl start apache2',
        '$ sudo systemctl enable apache2',
        '$ systemctl status apache2',
        'Active: active (running)',
        '$ curl -I http://localhost',
        'HTTP/1.1 200 OK',
        '# works locally, but outsiders are blocked'
      ],
      plain: "Ravi tells the computer to start the shopkeeper now, and to start him again every time the computer reboots. Inside the building everything works. But visitors from outside are still stopped at a locked gate: nobody has allowed them in yet.",
      tech: "systemd manages services. systemctl start launches apache2 now; systemctl enable makes it start at boot (on Ubuntu the package usually starts it automatically at install, but enabling is still good practice). Apache listens on TCP port 80. The curl test works on localhost, yet a firewall or a cloud security group may still block external traffic to port 80.",
      watch: "The service tile turns green ('running'), a :80 badge appears, and the ✉️ request from a visitor stops at the red wall with ✖."
    },
    {
      id: 4, title: 'Open the Firewall', subtitle: 'Let web traffic in, safely',
      panelTitle: 'ubuntu@server: ~',
      lines: [
        '$ sudo ufw allow OpenSSH',
        '$ sudo ufw allow "Apache Full"',
        '$ sudo ufw enable',
        '$ sudo ufw status',
        'OpenSSH        ALLOW    Anywhere',
        'Apache Full    ALLOW    Anywhere'
      ],
      plain: "The gate guard (the firewall) now gets a guest list: remote-login visitors (SSH) are allowed, and so are web visitors on the two web doors (ports 80 and 443). Everything else stays locked. Ravi adds the login door first so he does not lock himself out.",
      tech: "ufw is Ubuntu's front end for the kernel firewall. Allow OpenSSH before enabling ufw, otherwise you can cut off your own SSH session. The 'Apache Full' profile opens TCP 80 (HTTP) and 443 (HTTPS). On RHEL-family systems use firewalld: firewall-cmd --add-service=http --add-service=https --permanent. On cloud servers (e.g. EC2) also allow these ports in the security group.",
      watch: "The wall opens a gap and the ✉️ request now passes through the firewall into the server."
    },
    {
      id: 5, title: 'Add Your Website Files', subtitle: 'Put pages on the shelf',
      panelTitle: 'ubuntu@server: ~',
      lines: [
        '$ sudo mkdir -p /var/www/mysite',
        "$ echo '<h1>Welcome to my server!</h1>' | \\",
        '    sudo tee /var/www/mysite/index.html',
        '$ sudo chown -R www-data:www-data /var/www/mysite',
        '$ sudo chmod -R 755 /var/www/mysite',
        '$ ls -l /var/www/mysite'
      ],
      plain: "Pages need a home. Ravi makes a shelf (a folder), puts his Welcome page on it and tells the computer that the shopkeeper is allowed to read from that shelf.",
      tech: "The document root is the folder Apache serves files from. The default is /var/www/html; here we create /var/www/mysite for our own site. Apache runs as www-data on Debian/Ubuntu, so that user needs read access. Mode 755 lets the owner write and everyone else read and traverse.",
      watch: "A new tile for the web root folder appears, holding index.html owned by www-data."
    },
    {
      id: 6, title: 'Create a Virtual Host', subtitle: 'Tell Apache which site is where',
      panelTitle: 'ubuntu@server: ~',
      lines: [
        '$ sudo nano /etc/apache2/sites-available/mysite.conf',
        '  <VirtualHost *:80>',
        '    ServerName example.com',
        '    DocumentRoot /var/www/mysite',
        '  </VirtualHost>',
        '$ sudo a2ensite mysite.conf && sudo a2dissite 000-default.conf',
        '$ sudo apache2ctl configtest && sudo systemctl reload apache2'
      ],
      plain: "One shopkeeper can run many shops. A virtual host is a note that says: when a visitor asks for example.com, serve pages from this shelf. A DNS record is the phone book entry that points the name example.com at the server's address.",
      tech: "A VirtualHost block maps a ServerName to a DocumentRoot. a2ensite enables the site (a symlink into sites-enabled) and a2dissite disables the default one. Always run apache2ctl configtest before reloading, so a typo cannot take the site down. For the name to work, create a DNS A record pointing example.com to the server's public IP; replace example.com with your own domain.",
      watch: "A virtual-host tile appears and a pill below the laptop shows the DNS record: example.com → 203.0.113.25."
    },
    {
      id: 7, title: 'Secure with HTTPS', subtitle: 'Add a padlock with Certbot',
      panelTitle: 'ubuntu@server: ~',
      lines: [
        '# needs a real domain that points to this server',
        '$ sudo apt install -y certbot python3-certbot-apache',
        '$ sudo certbot --apache -d example.com',
        'Successfully received certificate.',
        'Congratulations! You have successfully enabled HTTPS',
        '$ sudo certbot renew --dry-run',
        'Congratulations, all simulated renewals succeeded'
      ],
      plain: "Plain HTTP is like sending a postcard: anyone on the way can read it. HTTPS puts the message in a sealed envelope. Ravi gets a free digital ID card (a certificate) for his shop and the shopkeeper starts using the second web door (port 443).",
      tech: "HTTPS is HTTP over TLS on TCP port 443. Certbot requests a free certificate from Let's Encrypt, proves you control the domain over port 80, edits the Apache config and sets up automatic renewal. It only works for a public domain name whose DNS points at this server; it cannot issue a certificate for a bare IP address in this flow.",
      watch: "A 🔐 encrypted request travels in through the open firewall and a 🔒 HTTPS tile and :443 badge appear."
    },
    {
      id: 8, title: 'Visit & Check the Logs', subtitle: 'Test it like a real customer',
      panelTitle: 'ubuntu@server: ~',
      lines: [
        '# from any browser open: https://example.com',
        '$ curl -I https://example.com',
        'HTTP/1.1 200 OK',
        '$ sudo tail -n 1 /var/log/apache2/access.log',
        '198.51.100.7 - - [02/Nov/2026:10:15:02 +0000] "GET / HTTP/1.1" 200 312',
        '$ sudo tail -n 1 /var/log/apache2/error.log'
      ],
      plain: "The big moment: a customer types the name into a browser. The request walks through the gate, the shopkeeper finds the page and sends it back. Every visit is also written in a visitor diary (the access log), and mistakes go into a problem diary (the error log).",
      tech: "The browser resolves the name via DNS, opens a TLS connection to port 443, sends GET / and Apache replies 200 OK with index.html. Logs live in /var/log/apache2: access.log records each request and error.log records problems. If something fails, check in order: DNS, firewall and security group, systemctl status apache2, apache2ctl configtest, then the error log.",
      watch: "✉️ goes in along the top lane and 📄 returns along the bottom lane. The laptop now shows the Welcome page with a padlock."
    }
  ];

  NS.PACKETS = [
    { icon: '📦', name: 'Package download', desc: 'Apache downloaded from the repository (step 2)' },
    { icon: '✉️', name: 'Visitor request', desc: 'HTTP request, blocked in step 3, allowed from step 4' },
    { icon: '🔐', name: 'HTTPS request', desc: 'Encrypted request on port 443 (step 7)' },
    { icon: '📄', name: 'Web page response', desc: 'Server replies with the page (step 8)' }
  ];

  NS.GLOSSARY = [
    { term: 'Web server', def: 'A program that answers browser requests (HTTP/HTTPS) by sending back web pages and files.', analogy: 'A shopkeeper handing out pages.', role: 'Apache is the web server that turns Linux into a website host.' },
    { term: 'Apache (apache2 / httpd)', def: 'A free, widely used open-source web server. Package name is apache2 on Debian/Ubuntu and httpd on RHEL-family systems.', analogy: 'The shopkeeper you hire.', role: 'Installed in step 2.' },
    { term: 'Nginx', def: 'Another popular open-source web server and reverse proxy.', analogy: 'A different brand of shopkeeper.', role: 'An alternative to Apache; not used in this walkthrough.' },
    { term: 'Package manager (apt / dnf)', def: 'A tool that downloads, installs and updates software from trusted repositories.', analogy: 'An app store for the server.', role: 'apt installs apache2 and certbot.' },
    { term: 'Repository', def: 'An online library of software packages that a package manager downloads from.', analogy: 'The warehouse behind the app store.', role: 'Source of the 📦 package in step 2.' },
    { term: 'sudo', def: 'Runs a command with administrator (root) rights.', analogy: 'A manager’s permission card.', role: 'Needed to install software and edit system files.' },
    { term: 'systemd / systemctl', def: 'The Linux service manager. systemctl starts, stops, enables and inspects services.', analogy: 'The building manager who opens shops each morning.', role: 'Keeps apache2 running and starts it at boot.' },
    { term: 'Service / daemon', def: 'A program that runs in the background waiting for work.', analogy: 'An employee always at the desk.', role: 'apache2 runs as a daemon.' },
    { term: 'Port', def: 'A numbered channel on a computer. HTTP uses 80, HTTPS uses 443, SSH uses 22.', analogy: 'A numbered door on the building.', role: 'Apache listens on 80 and, after step 7, 443.' },
    { term: 'Firewall (ufw / firewalld)', def: 'Software that allows or blocks network traffic by port, protocol and source.', analogy: 'A gate guard with a guest list.', role: 'Opened for SSH, 80 and 443 in step 4.' },
    { term: 'Security group', def: 'A cloud-provider firewall around a virtual server (for example on AWS EC2).', analogy: 'A second guard outside the building.', role: 'On cloud servers, also allow ports 80 and 443 here.' },
    { term: 'SSH', def: 'Secure Shell: an encrypted way to control a remote machine from a terminal.', analogy: 'A private encrypted phone line to the server.', role: 'How you run the commands; keep its port allowed in the firewall.' },
    { term: 'Document root', def: 'The folder a web server serves files from, for example /var/www/html or /var/www/mysite.', analogy: 'The shelf holding the pages.', role: 'Created and filled in step 5.' },
    { term: 'www-data', def: 'The Linux user that Apache runs as on Debian/Ubuntu.', analogy: 'The shopkeeper’s staff badge.', role: 'Must be able to read the web files.' },
    { term: 'chown / chmod', def: 'chown sets who owns a file; chmod sets who may read, write or run it.', analogy: 'Deciding who holds the key and who may look.', role: 'Give www-data read access in step 5.' },
    { term: 'Virtual host', def: 'An Apache configuration block that maps a domain name to a folder, so one server can host many sites.', analogy: 'A note saying which shop door leads to which shelf.', role: 'mysite.conf in step 6.' },
    { term: 'DNS A record', def: 'A DNS entry that maps a domain name to an IPv4 address.', analogy: 'A phone-book entry.', role: 'Points example.com to the server so browsers can find it.' },
    { term: 'apache2ctl configtest', def: 'Checks Apache configuration files for syntax errors without restarting.', analogy: 'Proofreading before printing.', role: 'Run before every reload.' },
    { term: 'HTTPS / TLS', def: 'HTTP carried inside an encrypted TLS connection on port 443.', analogy: 'A sealed envelope instead of a postcard.', role: 'Enabled in step 7.' },
    { term: 'Certificate (Let’s Encrypt / Certbot)', def: 'A digital ID that proves your domain is yours. Let’s Encrypt issues them free and Certbot automates it.', analogy: 'A government-issued ID card for the shop.', role: 'Certbot installs it and renews it automatically.' },
    { term: 'Access log / error log', def: 'Files in /var/log/apache2 recording every request (access.log) and every problem (error.log).', analogy: 'A visitor diary and a problem diary.', role: 'First place to look when debugging, step 8.' }
  ];
})();
