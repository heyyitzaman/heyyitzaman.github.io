document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        lucide.createIcons();
    }
});

/* =========================
   Cursor Dot
========================= */
(() => {
    const dot = document.getElementById('cursorDot');
    if (!dot || window.innerWidth <= 768) return;

    document.addEventListener('mousemove', e => {
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
    });
})();

/* =========================
   Theme Toggle
========================= */
(() => {
    const root = document.documentElement;
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const saved = localStorage.getItem('theme');
    if (saved) root.setAttribute('data-theme', saved);

    toggle.addEventListener('click', () => {
        const next =
            root.getAttribute('data-theme') === 'light' ? '' : 'light';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
})();

/* =========================
   Navbar Hamburger
========================= */
(() => {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('mobileNav');
    const header = document.querySelector('.nav');

    if (!hamburger || !nav || !header) return;

    const toggleMenu = () => {
        const isOpen = nav.classList.toggle('open');
        hamburger.classList.toggle('active', isOpen);

        hamburger.setAttribute('aria-expanded', isOpen);
        header.classList.toggle('menu-open', isOpen);
    };

    hamburger.addEventListener('click', toggleMenu);

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            header.classList.remove('menu-open');
        });
    });
})();

/* =========================
   Keyboard Shortcuts
========================= */
(() => {
    document.addEventListener('keydown', e => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key.toLowerCase() === 'b') location.href = 'blog.html';
        if (e.key.toLowerCase() === 'd') location.href = 'diary.html';
        if (e.key.toLowerCase() === 'j') location.href = 'about.html';
    });
})();

document.querySelectorAll("a").forEach(link => {
    if (link.href.startsWith(location.origin)) {
        link.addEventListener("click", e => {
            e.preventDefault();
            document.body.style.opacity = 0;
            setTimeout(() => {
                location.href = link.href;
            }, 200);
        });
    }
});

(() => {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let lastScrollY = window.scrollY;
    const navHeight = nav.offsetHeight;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Always show nav near top
        if (currentScrollY <= navHeight) {
            nav.classList.remove('nav-hidden');
            lastScrollY = currentScrollY;
            return;
        }

        if (currentScrollY > lastScrollY) {
            nav.classList.add('nav-hidden');
            nav.classList.remove('scrolling-up');
        } else {
            nav.classList.remove('nav-hidden');
            nav.classList.add('scrolling-up');
        }

        lastScrollY = currentScrollY;
    }, { passive: true });
})();
