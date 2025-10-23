/* site.js
   Site-wide behaviors:
   - Accessible mobile menu toggle (ARIA, focus management, Escape to close)
   - Close mobile menu when nav link clicked
   - Smooth-scroll for same-page anchors (respects prefers-reduced-motion)
   - Safe cookie notice initialization (no errors if elements missing)
*/
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const toggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('mainNav');
    if (toggle && nav) {
      toggle.setAttribute('role', 'button');
      toggle.setAttribute('aria-controls', 'mainNav');
      toggle.setAttribute('aria-expanded', nav.classList.contains('active') ? 'true' : 'false');
      toggle.tabIndex = 0;

      function openNav() {
        nav.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        // trap focus within nav lightly by focusing first link
        const firstLink = nav.querySelector('a');
        if (firstLink) firstLink.focus();
      }
      function closeNav() {
        nav.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }

      const onToggle = (e) => {
        if (nav.classList.contains('active')) closeNav(); else openNav();
      };

      toggle.addEventListener('click', onToggle);
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); }
      });

      // Close when link clicked
      nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => { nav.classList.remove('active'); toggle.setAttribute('aria-expanded', 'false'); });
      });

      // Close with Escape key when nav open
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
          closeNav();
        }
      });
    }

    // Smooth scrolling for same-page anchors
    try {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if ('scrollBehavior' in document.documentElement.style && !prefersReduced) {
        document.querySelectorAll('a[href^="#"]').forEach(a => {
          a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
              e.preventDefault();
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
        });
      }
    } catch (err) {
      // safe fallback — do nothing
    }

    // Cookie notice: only show if not accepted; guard missing elements
    try {
      const cookieNotice = document.getElementById('cookie-notice');
      const cookieAccept = document.getElementById('cookie-accept');
      if (cookieNotice && cookieAccept) {
        if (!localStorage.getItem('bnuts_cookies_accepted')) cookieNotice.style.display = 'block';
        cookieAccept.addEventListener('click', () => {
          localStorage.setItem('bnuts_cookies_accepted', 'true');
          cookieNotice.style.display = 'none';
        });
      }
    } catch (err) {
      // localStorage may be unavailable in some contexts — ignore silently
    }
  });
})();
