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

    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', () => {
        nav.classList.toggle('open');
        hamburger.classList.toggle('active');
    });

    // Close on link click
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            hamburger.classList.remove('active');
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