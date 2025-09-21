gsap.registerPlugin(ScrollTrigger);

const CONFIG = {
    TYPING_SPEED: 100, CURSOR_SPEED: 0.2, SCROLL_THRESHOLD: 500,
    DEBOUNCE_DELAY: 16, THROTTLE_DELAY: 100,
    ANIMATION_DURATION: { SHORT: 0.3, MEDIUM: 0.5, LONG: 0.8 }
};

const throttle = window.throttle || ((fn, d) => {
    let l = 0; return (...a) => { let n = Date.now(); if (n - l >= d) { l = n; fn(...a); } };
});
const debounce = window.debounce || ((fn, d) => {
    let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), d); };
});

// Replace $ and $$ with _$ and _$$ to avoid conflicts
const _$ = s => document.querySelector(s), _$$ = s => document.querySelectorAll(s);
const DOM = {
    get body() { return document.body; }, get html() { return document.documentElement; },
    get navbar() { return _$('#navbar'); }, get mobileMenu() { return _$('#mobile-menu'); },
    get cursor() { return _$('#cursor'); }, get cursorTrail() { return _$('#cursor-trail'); },
    get backToTopButton() { return _$('#backToTopButton'); }, get contactForm() { return _$('#contact-form'); },
    get loading() { return _$('#loading'); }
};

class TypeWriter {
    constructor(text, id) { this.text = text; this.el = $(id ? `#${id}` : null); this.i = 0; this.done = false; }
    type = () => {
        if (!this.el || this.done) return;
        const next = () => {
            if (this.i < this.text.length) {
                this.el.textContent += this.text[this.i++];
                setTimeout(next, CONFIG.TYPING_SPEED);
            } else this.complete();
        }; next();
    }
    complete = () => {
        this.done = true;
        gsap.to(this.el, {
            duration: CONFIG.ANIMATION_DURATION.MEDIUM, color: "#3B82F6", yoyo: true, repeat: 1,
            onComplete: () => gsap.to(this.el, { duration: 1, backgroundPositionX: "100%", ease: "power3.inOut" })
        });
    }
}

class CursorManager {
    constructor() { this.mx = 0; this.my = 0; this.cx = 0; this.cy = 0; this.af = null; this.active = false; }
    init = () => {
        if (!DOM.cursor) return;
        document.addEventListener('mousemove', throttle(e => { this.mx = e.clientX; this.my = e.clientY; if (!this.af) this.start(); }, CONFIG.DEBOUNCE_DELAY), { passive: true });
        document.addEventListener('mouseleave', () => this.stop());
        _$$('a,button,input,textarea,.interactive').forEach(el => {
            el.addEventListener('mouseenter', () => this.setHover(true), { passive: true });
            el.addEventListener('mouseleave', () => this.setHover(false), { passive: true });
        });
        this.start();
    }
    setHover = h => DOM.cursor && gsap.to(DOM.cursor, {
        scale: h ? 1.5 : 1, backgroundColor: h ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.5)',
        border: h ? '2px solid rgba(59,130,246,0.5)' : 'none', duration: CONFIG.ANIMATION_DURATION.SHORT
    });
    update = () => {
        if (!DOM.cursor) return;
        this.cx += (this.mx - this.cx) * CONFIG.CURSOR_SPEED;
        this.cy += (this.my - this.cy) * CONFIG.CURSOR_SPEED;
        gsap.set(DOM.cursor, { x: this.cx, y: this.cy });
        let dx = this.mx - this.cx, dy = this.my - this.cy, s = Math.max(1, Math.min(1.5, 1 + Math.sqrt(dx * dx + dy * dy) * 0.01));
        gsap.to(DOM.cursor, { scale: s, duration: 0.2 });
        if (DOM.cursorTrail) gsap.to(DOM.cursorTrail, { x: this.cx, y: this.cy, duration: CONFIG.ANIMATION_DURATION.MEDIUM, ease: "power2.out" });
        this.af = requestAnimationFrame(this.update);
    }
    start = () => { if (!this.active) { this.active = true; this.update(); } }
    stop = () => { if (this.af) { cancelAnimationFrame(this.af); this.af = null; this.active = false; } }
}

class MobileMenuManager {
    constructor() {
        this.btn = $('#mobile-menu-button'); this.closeBtn = $('#close-menu');
        this.links = DOM.mobileMenu ? DOM.mobileMenu.querySelectorAll('a') : [];
    }
    init = () => {
        if (!this.btn || !this.closeBtn || !DOM.mobileMenu) return;
        this.btn.addEventListener('click', this.open, { passive: true });
        this.closeBtn.addEventListener('click', this.close, { passive: true });
        this.links.forEach(l => {
            l.style.opacity = "0"; l.style.transform = "translateY(20px)";
            l.addEventListener('click', this.close, { passive: true });
        });
    }
    open = () => gsap.to(DOM.mobileMenu, {
        duration: CONFIG.ANIMATION_DURATION.MEDIUM, x: 0, ease: "power3.out",
        onComplete: () => gsap.to(this.links, { duration: CONFIG.ANIMATION_DURATION.MEDIUM, opacity: 1, y: 0, stagger: 0.1, ease: "power2.out" })
    });
    close = () => gsap.to(DOM.mobileMenu, { duration: CONFIG.ANIMATION_DURATION.MEDIUM, x: '100%', ease: "power3.out" });
}

class ScrollManager {
    init = () => { this.backToTop(); this.navbarScroll(); this.activeNavLinks(); this.smoothScrolling(); }
    backToTop = () => {
        if (!DOM.backToTopButton) return;
        window.addEventListener("scroll", throttle(() => {
            let st = document.body.scrollTop || document.documentElement.scrollTop;
            st > CONFIG.SCROLL_THRESHOLD ? this.showBackToTop() : this.hideBackToTop();
        }, CONFIG.THROTTLE_DELAY), { passive: true });
        DOM.backToTopButton.addEventListener("click", () => this.scrollToTop(), { passive: true });
    }
    showBackToTop = () => gsap.to(DOM.backToTopButton, { duration: CONFIG.ANIMATION_DURATION.SHORT, opacity: 1, visibility: "visible", ease: "power2.out" });
    hideBackToTop = () => gsap.to(DOM.backToTopButton, { duration: CONFIG.ANIMATION_DURATION.SHORT, opacity: 0, ease: "power2.out", onComplete: () => { DOM.backToTopButton.style.visibility = "hidden"; } });
    scrollToTop = () => {
        gsap.to(DOM.backToTopButton, { rotation: 360, duration: CONFIG.ANIMATION_DURATION.MEDIUM, ease: "power2.out" });
        if (gsap.plugins?.ScrollToPlugin) gsap.to(window, { duration: 1.5, scrollTo: { y: 0, autoKill: false }, ease: "power4.out" });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    navbarScroll = () => {
        if (!DOM.navbar) return;
        let si = document.createElement('div');
        si.classList.add('h-1', 'bg-gradient-to-r', 'from-blue-500', 'to-purple-500', 'w-0');
        DOM.navbar.appendChild(si);
        ScrollTrigger.create({
            start: "top top", end: "max",
            onUpdate: self => {
                gsap.to(si, { width: `${self.progress * 100}%`, duration: CONFIG.ANIMATION_DURATION.SHORT });
                let navbarOpacity;
                if (self.direction === -1) {
                    navbarOpacity = 1;
                } else {
                    navbarOpacity = self.progress > 0.1 ? 0 : 1;
                }
                let navbarY = 0;
                if (self.direction !== -1) {
                    navbarY = self.progress > 0.1 ? -100 : 0;
                }
                gsap.to(DOM.navbar, {
                    duration: CONFIG.ANIMATION_DURATION.SHORT,
                    y: navbarY,
                    opacity: navbarOpacity,
                    borderBottomColor: self.progress > 0.1 ? 'rgba(203,213,225,0.3)' : 'transparent'
                });
            }
        });
    }
    activeNavLinks = () => {
        const update = throttle(() => {
            let cs = "";
            _$$("section").forEach(s => {
                let st = s.offsetTop - 150, sh = s.offsetHeight, id = s.id;
                if (window.scrollY >= st && window.scrollY < st + sh) cs = id;
            });
            $$(".nav-link-underline").forEach(l => {
                l.classList.toggle("active", l.getAttribute("href") === `#${cs}`);
            });
        }, CONFIG.THROTTLE_DELAY);
        update(); window.addEventListener("scroll", update, { passive: true });
    }
    smoothScrolling = () => {
        _$$('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                e.preventDefault();
                let tid = a.getAttribute('href');
                if (tid === '#') return;
                let t = $(tid); if (!t) return;
                if (DOM.mobileMenu && getComputedStyle(DOM.mobileMenu).transform !== 'matrix(1, 0, 0, 1, 0, 0)')
                    gsap.to(DOM.mobileMenu, { duration: CONFIG.ANIMATION_DURATION.SHORT, x: '100%', ease: "power3.out" });
                let nh = DOM.navbar ? DOM.navbar.offsetHeight : 80, off = nh + 20;
                window.scrollTo({ top: t.offsetTop - off, behavior: 'smooth' });
                $$('.nav-link-underline').forEach(l => l.classList.remove('active'));
                if (a.classList.contains('nav-link-underline')) a.classList.add('active');
                history.pushState(null, null, tid);
            }, { passive: false });
        });
    }
}

class ThemeManager {
    constructor() { this.isDark = false; }
    init = () => { this.loadTheme(); this.updateFavicon(); this.mediaQuery(); }
    loadTheme = () => {
        let st = localStorage.getItem("darkMode"), pd = window.matchMedia("(prefers-color-scheme: dark)").matches;
        this.isDark = st === "true" || (!st && pd); if (this.isDark) DOM.html.classList.add("dark");
    }
    toggle = () => {
        this.isDark = !this.isDark; DOM.html.classList.toggle("dark", this.isDark);
        localStorage.setItem("darkMode", this.isDark.toString());
        this.animateToggle(); this.updateFavicon(); this.particles();
    }
    animateToggle = () => {
        let ti = DOM.html.classList.contains("dark") ? $(".fa-sun") : $(".fa-moon");
        if (ti) gsap.from(ti, { duration: 0.6, rotate: 360, scale: 0.5, ease: "back.out(1.7)" });
        _$$("section,header,footer").forEach(s => gsap.fromTo(s, { opacity: 0.8 }, { opacity: 1, duration: CONFIG.ANIMATION_DURATION.MEDIUM, ease: "power2.out" }));
    }
    updateFavicon = () => {
        let f = $('#favicon');
        if (f) f.href = this.isDark ? './assets/icons/SR-Black.png' : './assets/icons/SR-White.png';
    }
    particles = () => {
        let p = 20, c = this.isDark ? ["#3b82f6", "#6366f1", "#8b5cf6"] : ["#f59e0b", "#f97316", "#ef4444"];
        let cont = document.createElement("div"); cont.className = "pointer-events-none fixed inset-0 z-50"; DOM.body.appendChild(cont);
        let btn = $(".fa-moon, .fa-sun")?.parentElement; if (!btn) return;
        let r = btn.getBoundingClientRect();
        for (let i = 0; i < p; i++) {
            let d = document.createElement("div");
            d.className = "absolute rounded-full pointer-events-none";
            d.style.width = d.style.height = `${Math.random() * 10 + 5}px`;
            d.style.background = c[Math.floor(Math.random() * c.length)];
            d.style.left = `${r.left + r.width / 2}px`; d.style.top = `${r.top + r.height / 2}px`;
            cont.appendChild(d);
            gsap.to(d, {
                duration: Math.random() * 1 + 0.5, x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100,
                opacity: 0, scale: 0, rotation: Math.random() * 360, ease: "power3.out",
                onComplete: () => {
                    if (cont.contains(d)) cont.removeChild(d);
                    if (!cont.childElementCount && DOM.body.contains(cont)) DOM.body.removeChild(cont);
                }
            });
        }
    }
    mediaQuery = () => window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
        if (!localStorage.getItem("darkMode")) { this.isDark = e.matches; DOM.html.classList.toggle("dark", this.isDark); this.updateFavicon(); }
    });
}

class ScrollAnimations {
    init = () => {
        gsap.utils.toArray(".experience-card").forEach(card => gsap.from(card, {
            scrollTrigger: { trigger: card, start: "top bottom-=100", toggleActions: "play none none none" },
            x: -50, opacity: 0, duration: CONFIG.ANIMATION_DURATION.LONG, ease: "power3.out"
        }));
        gsap.utils.toArray(".project-card").forEach((card, i) => gsap.from(card, {
            scrollTrigger: { trigger: card, start: "top bottom-=100", toggleActions: "play none none none" },
            y: 50, opacity: 0, duration: CONFIG.ANIMATION_DURATION.LONG, delay: i * 0.2, ease: "power3.out"
        }));
        gsap.from(".skill-tag", {
            scrollTrigger: { trigger: ".skill-tag", start: "top bottom-=100" },
            scale: 0.8, opacity: 0, duration: 0.4, stagger: 0.03, ease: "back.out(1.7)",
            onComplete: () => gsap.to(".skill-tag", { y: 5, duration: 2, ease: "sine.inOut", stagger: 0.1, yoyo: true, repeat: -1 })
        });
        gsap.utils.toArray("section h2").forEach(header => gsap.from(header, {
            scrollTrigger: { trigger: header, start: "top bottom-=100" },
            y: 30, opacity: 0, duration: CONFIG.ANIMATION_DURATION.LONG, ease: "power3.out"
        }));
        if (DOM.contactForm) gsap.from(DOM.contactForm, {
            scrollTrigger: { trigger: DOM.contactForm, start: "top bottom-=50" },
            y: 30, opacity: 0, duration: CONFIG.ANIMATION_DURATION.LONG, ease: "power3.out"
        });
        gsap.utils.toArray(".section-divider").forEach(section => gsap.to(section, {
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.5 },
            backgroundPositionY: "30%", ease: "none"
        }));
        gsap.utils.toArray(".skill-progress").forEach(progress => {
            let pct = progress.getAttribute("data-percentage") || "0";
            gsap.fromTo(progress, { scaleX: 0 }, {
                scrollTrigger: { trigger: progress.parentElement, start: "top bottom-=100" },
                scaleX: pct / 100, duration: 1.5, ease: "power3.out"
            });
        });
    }
}

class ContactFormManager {
    constructor() { this.isSubmitting = false; this.toastTimeout = null; }
    init = () => { if (DOM.contactForm) this.setupFormSubmission(); }
    setupFormSubmission = () => {
        const btn = DOM.contactForm.querySelector("button[type='submit']");
        DOM.contactForm.addEventListener("submit", async e => {
            e.preventDefault();
            if (this.isSubmitting || !btn) return;
            let f = DOM.contactForm.elements, name = f["name"].value.trim(), email = f["email"].value.trim(), message = f["message"].value.trim();
            if (!name || !email || !message) return this.showToast("Please fill in all fields.", false);
            this.isSubmitting = true; this.startSubmission(btn);
            try {
                await emailjs.sendForm('service_tj734fz', 'template_qbpvaji', DOM.contactForm);
                this.handleSubmitSuccess(btn);
            } catch (err) { this.handleSubmitError(btn, err); }
            finally { this.isSubmitting = false; }
        });
    }
    startSubmission = btn => {
        btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        gsap.to(DOM.contactForm, { opacity: 0.7, scale: 0.98, duration: CONFIG.ANIMATION_DURATION.SHORT });
    }
    handleSubmitSuccess = btn => { this.resetFormAppearance(btn); this.showToast("Your message has been sent successfully! I'll get back to you soon.", true); this.createConfetti(); DOM.contactForm.reset(); }
    handleSubmitError = (btn, err) => { this.resetFormAppearance(btn); console.error(err); this.showToast("There was an error sending your message. Please try again later.", false); }
    resetFormAppearance = btn => {
        gsap.to(DOM.contactForm, { opacity: 1, scale: 1, duration: CONFIG.ANIMATION_DURATION.SHORT });
        btn.disabled = false; btn.innerHTML = 'Send Message';
    }
    showToast = (msg, ok) => {
        let t = $('#contact-toast'); if (t) { t.remove(); if (this.toastTimeout) clearTimeout(this.toastTimeout); }
        t = document.createElement('div'); t.id = 'contact-toast';
        t.className = `fixed bottom-24 right-6 z-[9999] min-w-[260px] max-w-xs px-5 py-4 rounded-lg shadow-lg flex items-center gap-3 cursor-pointer transition-all ${ok ? 'bg-green-100 dark:bg-green-900/80 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/80 text-red-800 dark:text-red-200'}`;
        t.innerHTML = `<i class="fas ${ok ? 'fa-check-circle' : 'fa-exclamation-circle'} text-xl"></i><span class="flex-1">${msg}</span>`;
        t.addEventListener('click', () => this.hideToast()); DOM.body.appendChild(t);
        gsap.fromTo(t, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
        this.toastTimeout = setTimeout(() => this.hideToast(), 5000);
    }
    hideToast = () => {
        let t = $('#contact-toast');
        if (t) gsap.to(t, { opacity: 0, y: 40, duration: 0.3, ease: "power2.in", onComplete: () => t.remove() });
        if (this.toastTimeout) clearTimeout(this.toastTimeout);
    }
    createConfetti = () => {
        let colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#f59e0b'], n = 100, c = document.createElement('div');
        Object.assign(c.style, { position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: '9999' });
        DOM.body.appendChild(c);
        for (let i = 0; i < n; i++) {
            let d = document.createElement('div');
            Object.assign(d.style, { position: 'absolute', width: `${Math.random() * 10 + 5}px`, height: `${Math.random() * 5 + 2}px`, backgroundColor: colors[Math.floor(Math.random() * colors.length)], top: '0', left: `${Math.random() * 100}vw` });
            c.appendChild(d);
            gsap.to(d, {
                y: '100vh', x: `+=${(Math.random() - 0.5) * 400}`, rotation: Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1),
                duration: Math.random() * 3 + 2, ease: 'power1.out',
                onComplete: () => {
                    if (c.contains(d)) c.removeChild(d);
                    if (!c.childElementCount && DOM.body.contains(c)) DOM.body.removeChild(c);
                }
            });
        }
    }
}

class PortfolioApp {
    constructor() {
        this.typeWriter = null;
        this.cursorManager = new CursorManager();
        this.mobileMenuManager = new MobileMenuManager();
        this.scrollManager = new ScrollManager();
        this.themeManager = new ThemeManager();
        this.scrollAnimations = new ScrollAnimations();
        this.contactFormManager = new ContactFormManager();
    }
    init = async () => {
        this.themeManager.init(); this.mobileMenuManager.init(); this.scrollManager.init();
        this.scrollAnimations.init(); this.contactFormManager.init(); this.cursorManager.init();
        if (!$('#cursor-trail')) {
            let ct = document.createElement('div');
            ct.id = 'cursor-trail';
            ct.className = 'fixed w-12 h-12 rounded-full bg-primary-500 bg-opacity-20 pointer-events-none z-40 transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block';
            DOM.body.appendChild(ct);
        }
        window.addEventListener("resize", debounce(() => ScrollTrigger.refresh(), 250), { passive: true });
    }
    handlePageLoad = () => {
        if (!DOM.loading) return;
        gsap.to(DOM.loading, {
            duration: CONFIG.ANIMATION_DURATION.LONG, opacity: 0, ease: "power2.inOut",
            onComplete: () => { DOM.loading.style.display = "none"; this.playEntranceAnimation(); }
        });
    }
    playEntranceAnimation = () => {
        gsap.timeline()
            .from("nav", { y: -50, opacity: 0, duration: CONFIG.ANIMATION_DURATION.LONG, ease: "power3.out" })
            .from("#home .order-1", { x: -50, opacity: 0, duration: CONFIG.ANIMATION_DURATION.LONG, ease: "power3.out" }, "-=0.4")
            .from("#home .order-2", { x: 50, opacity: 0, duration: CONFIG.ANIMATION_DURATION.LONG, ease: "power3.out" }, "-=0.6")
            .call(() => { this.typeWriter = new TypeWriter("Sundaram Rai", "typed-text"); this.typeWriter.type(); });
    }
}

window.scrollToTop = () => portfolioApp?.scrollManager ? portfolioApp.scrollManager.scrollToTop() : window.scrollTo({ top: 0, behavior: 'smooth' });
window.toggleTheme = () => portfolioApp?.themeManager?.toggle();

let portfolioApp;
window.addEventListener("load", () => { try { portfolioApp.handlePageLoad(); } catch (e) { console.error(e); } }, { passive: true });
document.addEventListener("DOMContentLoaded", async () => { try { portfolioApp = new PortfolioApp(); await portfolioApp.init(); } catch (e) { console.error(e); } });

if (typeof module !== 'undefined' && module.exports) module.exports = { PortfolioApp, DOM, CONFIG };