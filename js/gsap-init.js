gsap.registerPlugin(ScrollTrigger, gsap.plugins?.ScrollToPlugin ? ScrollToPlugin : undefined);

window.debounce = (fn, w) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), w); }; };
window.throttle = (fn, l) => { let it; return function () { if (!it) { fn.apply(this, arguments); it = setTimeout(() => it = 0, l); } }; };

const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);

const addClass = (sel, cls) => $$(sel).forEach(e => e.classList.add(cls));
const batchAnim = (sel, from, to, opts = {}) => {
    if (!$$(sel).length) return;
    ScrollTrigger.batch($$(sel), {
        start: "top bottom-=100",
        onEnter: els => gsap.fromTo(els, from, { ...to, stagger: 0.1, ...opts })
    });
};

document.addEventListener('DOMContentLoaded', () => {
    addClass('section h2', 'fade-up');
    addClass('.project-card, .experience-card', 'scale-in');
    addClass('.skill-tag', 'stagger-item');
    $('#skills .max-w-4xl')?.classList.add('stagger-container');

    $$('#home h1, section h2').forEach(el => {
        el.innerHTML = [...el.textContent].map(c =>
            `<span class="inline-block">${c === " " ? "\u00A0" : c}</span>`
        ).join('');
        ScrollTrigger.batch(el.querySelectorAll('span'), {
            trigger: el, start: "top bottom-=100", once: true,
            onEnter: chars => gsap.fromTo(chars, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.03, ease: "power3.out" })
        });
    });

    batchAnim('.fade-up', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    batchAnim('.fade-in', { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.out" });
    batchAnim('.scale-in', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" });

    $$('.stagger-container').forEach(cont => {
        let items = cont.querySelectorAll('.stagger-item');
        ScrollTrigger.batch(items, {
            start: "top bottom-=100",
            onEnter: els => gsap.fromTo(els, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" })
        });
    });

    $$('.parallax-bg').forEach(el => {
        let d = parseFloat(el.getAttribute('data-depth')) || 0.2, p = el.parentElement;
        gsap.to(el, {
            yPercent: -50 * d, ease: "none",
            scrollTrigger: { trigger: p, start: "top bottom", end: "bottom top", scrub: 1, invalidateOnRefresh: true }
        });
    });

    $$('.project-card').forEach(card => {
        let overlay = card.querySelector('.project-image-overlay'), content = card.querySelector('.project-content'), icons = card.querySelectorAll('.project-links a');
        if (overlay && content) {
            let tl = gsap.timeline({ paused: true })
                .to(overlay, { opacity: 1, duration: 0.3 })
                .to(content, { y: 0, opacity: 1, duration: 0.3 }, "-=0.1")
                .to(icons, { opacity: 1, x: 0, duration: 0.2, stagger: 0.1 }, "-=0.2");
            card.addEventListener('mouseenter', () => tl.play(), { passive: true });
            card.addEventListener('mouseleave', () => tl.reverse(), { passive: true });
        }
    });

    (() => {
        let c = document.createElement('div');
        c.className = 'fixed inset-0 pointer-events-none overflow-hidden z-0';
        let colors = [
            'from-blue-400 to-purple-500', 'from-green-400 to-blue-500', 'from-purple-400 to-pink-500',
            'from-yellow-400 to-orange-500', 'from-teal-400 to-green-500'
        ];
        for (let i = 0; i < 10; i++) {
            let s = document.createElement('div'), sz = Math.random() * 300 + 50, col = colors[Math.floor(Math.random() * colors.length)];
            s.className = `absolute rounded-full bg-gradient-to-r ${col}`;
            Object.assign(s.style, {
                width: `${sz}px`, height: `${sz}px`, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                opacity: '0.03', filter: 'blur(70px)'
            });
            c.appendChild(s);
        }
        document.body.prepend(c);
        gsap.to(c.children, {
            x: () => (Math.random() - 0.5) * 100, y: () => (Math.random() - 0.5) * 100,
            scale: () => 0.5 + Math.random() * 1.5, opacity: () => 0.02 + Math.random() * 0.08,
            duration: () => 10 + Math.random() * 20, repeat: -1, yoyo: true, ease: 'sine.inOut',
            stagger: { amount: 2, from: "random" }
        });
    })();

    let sections = [...$$('section[id]')], navLinks = [...$$('.nav-link-underline')];
    if (sections.length && navLinks.length) {
        let linkMap = new Map(navLinks.map(l => [l.getAttribute('href'), l]));
        let updateActive = id => {
            let href = `#${id}`;
            navLinks.forEach(l => l.classList.remove('active'));
            linkMap.get(href)?.classList.add('active');
        };
        ScrollTrigger.batch(sections, {
            start: 'top center', end: 'bottom center',
            onEnter: els => els.forEach(el => updateActive(el.id)),
            onEnterBack: els => els.forEach(el => updateActive(el.id))
        });
        let scrollY = window.pageYOffset + 200, curr = null;
        sections.forEach(s => {
            let r = s.getBoundingClientRect(), top = r.top + window.pageYOffset;
            if (scrollY >= top && scrollY < top + r.height) curr = s.id;
        });
        if (curr) updateActive(curr);
    }

    window.addEventListener('hashchange', debounce(() => {
        let hash = window.location.hash, nav = $('#navbar'), nh = nav ? nav.offsetHeight : 80, off = nh + 20;
        if (hash) {
            let t = $(hash);
            if (t) gsap.to(window, { duration: 1, scrollTo: { y: t.offsetTop - off, autoKill: false }, ease: "power2.inOut" });
        }
    }, 100));
});

window.addEventListener('beforeunload', () => { ScrollTrigger.killAll(); gsap.killTweensOf("*"); });
document.addEventListener('visibilitychange', () => { document.hidden ? gsap.globalTimeline.pause() : gsap.globalTimeline.resume(); });