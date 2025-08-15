gsap.registerPlugin(ScrollTrigger);

const CONFIG = {
    TYPING_SPEED: 100,
    CURSOR_SPEED: 0.2,
    SCROLL_THRESHOLD: 500,
    DEBOUNCE_DELAY: 16,
    THROTTLE_DELAY: 100,
    ANIMATION_DURATION: {
        SHORT: 0.3,
        MEDIUM: 0.5,
        LONG: 0.8
    }
};

const throttle = window.throttle || ((func, delay) => {
    let lastCall = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func(...args);
        }
    };
});

const debounce = window.debounce || ((func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
});

const DOM = {
    body: document.body,
    html: document.documentElement,
    navbar: null,
    mobileMenu: null,
    cursor: null,
    cursorTrail: null,
    backToTopButton: null,
    contactForm: null,
    loading: null,

    init() {
        this.navbar = document.getElementById('navbar');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.cursor = document.getElementById('cursor');
        this.cursorTrail = document.getElementById('cursor-trail');
        this.backToTopButton = document.getElementById('backToTopButton');
        this.contactForm = document.getElementById('contact-form');
        this.loading = document.getElementById('loading');
    }
};

class TypeWriter {
    constructor(text, elementId) {
        this.text = text;
        this.element = document.getElementById(elementId);
        this.index = 0;
        this.isComplete = false;
    }

    async type() {
        if (!this.element || this.isComplete) return;

        const typeNextChar = () => {
            if (this.index < this.text.length) {
                this.element.textContent += this.text.charAt(this.index);
                this.index++;
                setTimeout(typeNextChar, CONFIG.TYPING_SPEED);
            } else {
                this.complete();
            }
        };

        typeNextChar();
    }

    complete() {
        this.isComplete = true;
        gsap.to(this.element, {
            duration: CONFIG.ANIMATION_DURATION.MEDIUM,
            color: "#3B82F6",
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                gsap.to(this.element, {
                    duration: 1,
                    backgroundPositionX: "100%",
                    ease: "power3.inOut"
                });
            }
        });
    }
}

class CursorManager {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.animationFrame = null;
        this.isActive = false;
    }

    init() {
        if (!DOM.cursor) return;

        this.setupEventListeners();
        this.setupInteractiveElements();
        this.start();
    }

    setupEventListeners() {
        const handleMouseMove = throttle((e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            if (!this.animationFrame) {
                this.start();
            }
        }, CONFIG.DEBOUNCE_DELAY);

        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseleave', () => this.stop());
    }

    setupInteractiveElements() {
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .interactive');

        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => this.setHoverState(true), { passive: true });
            element.addEventListener('mouseleave', () => this.setHoverState(false), { passive: true });
        });
    }

    setHoverState(isHover) {
        if (!DOM.cursor) return;

        gsap.to(DOM.cursor, {
            scale: isHover ? 1.5 : 1,
            backgroundColor: isHover ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.5)',
            border: isHover ? '2px solid rgba(59, 130, 246, 0.5)' : 'none',
            duration: CONFIG.ANIMATION_DURATION.SHORT
        });
    }

    update() {
        if (!DOM.cursor) return;

        this.cursorX += (this.mouseX - this.cursorX) * CONFIG.CURSOR_SPEED;
        this.cursorY += (this.mouseY - this.cursorY) * CONFIG.CURSOR_SPEED;

        gsap.set(DOM.cursor, {
            x: this.cursorX,
            y: this.cursorY
        });

        const dx = this.mouseX - this.cursorX;
        const dy = this.mouseY - this.cursorY;
        const speed = Math.sqrt(dx * dx + dy * dy);
        const scale = Math.max(1, Math.min(1.5, 1 + speed * 0.01));

        gsap.to(DOM.cursor, {
            scale: scale,
            duration: 0.2
        });

        if (DOM.cursorTrail) {
            gsap.to(DOM.cursorTrail, {
                x: this.cursorX,
                y: this.cursorY,
                duration: CONFIG.ANIMATION_DURATION.MEDIUM,
                ease: "power2.out"
            });
        }

        this.animationFrame = requestAnimationFrame(() => this.update());
    }

    start() {
        if (!this.isActive) {
            this.isActive = true;
            this.update();
        }
    }

    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
            this.isActive = false;
        }
    }
}

class MobileMenuManager {
    constructor() {
        this.mobileMenuButton = document.getElementById('mobile-menu-button');
        this.closeMenuButton = document.getElementById('close-menu');
        this.mobileMenuLinks = DOM.mobileMenu?.querySelectorAll('a');
    }

    init() {
        if (!this.mobileMenuButton || !this.closeMenuButton || !DOM.mobileMenu) return;

        this.mobileMenuButton.addEventListener('click', () => this.open(), { passive: true });
        this.closeMenuButton.addEventListener('click', () => this.close(), { passive: true });

        this.mobileMenuLinks?.forEach(link => {
            link.style.opacity = "0";
            link.style.transform = "translateY(20px)";
            link.addEventListener('click', () => this.close(), { passive: true });
        });
    }

    open() {
        gsap.to(DOM.mobileMenu, {
            duration: CONFIG.ANIMATION_DURATION.MEDIUM,
            x: 0,
            ease: "power3.out",
            onComplete: () => {
                gsap.to(this.mobileMenuLinks, {
                    duration: CONFIG.ANIMATION_DURATION.MEDIUM,
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    ease: "power2.out"
                });
            }
        });
    }

    close() {
        gsap.to(DOM.mobileMenu, {
            duration: CONFIG.ANIMATION_DURATION.MEDIUM,
            x: '100%',
            ease: "power3.out"
        });
    }
}

class ScrollManager {
    constructor() {
        this.scrollTop = 0;
        this.isScrolling = false;
    }

    init() {
        this.setupBackToTop();
        this.setupNavbarScroll();
        this.setupActiveNavLinks();
        this.setupSmoothScrolling();
    }

    setupBackToTop() {
        if (!DOM.backToTopButton) return;

        const handleScroll = throttle(() => {
            const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

            if (scrollTop > CONFIG.SCROLL_THRESHOLD) {
                this.showBackToTop();
            } else {
                this.hideBackToTop();
            }
        }, CONFIG.THROTTLE_DELAY);

        window.addEventListener("scroll", handleScroll, { passive: true });
        DOM.backToTopButton.addEventListener("click", () => this.scrollToTop(), { passive: true });
    }

    showBackToTop() {
        gsap.to(DOM.backToTopButton, {
            duration: CONFIG.ANIMATION_DURATION.SHORT,
            opacity: 1,
            visibility: "visible",
            ease: "power2.out"
        });
    }

    hideBackToTop() {
        gsap.to(DOM.backToTopButton, {
            duration: CONFIG.ANIMATION_DURATION.SHORT,
            opacity: 0,
            ease: "power2.out",
            onComplete: () => {
                DOM.backToTopButton.style.visibility = "hidden";
            }
        });
    }

    scrollToTop() {
        gsap.to(DOM.backToTopButton, {
            rotation: 360,
            duration: CONFIG.ANIMATION_DURATION.MEDIUM,
            ease: "power2.out"
        });
        if (gsap.plugins?.ScrollToPlugin) {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: { y: 0, autoKill: false },
                ease: "power4.out"
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    setupNavbarScroll() {
        if (!DOM.navbar) return;

        const scrollIndicator = document.createElement('div');
        scrollIndicator.classList.add('h-1', 'bg-gradient-to-r', 'from-blue-500', 'to-purple-500', 'w-0');
        DOM.navbar.appendChild(scrollIndicator);

        ScrollTrigger.create({
            start: "top top",
            end: "max",
            onUpdate: (self) => {
                gsap.to(scrollIndicator, {
                    width: `${self.progress * 100}%`,
                    duration: CONFIG.ANIMATION_DURATION.SHORT
                });

                if (self.direction === -1) {
                    gsap.to(DOM.navbar, {
                        duration: CONFIG.ANIMATION_DURATION.SHORT,
                        y: 0,
                        opacity: 1,
                        borderBottomColor: self.progress > 0.1 ? 'rgba(203, 213, 225, 0.3)' : 'transparent'
                    });
                } else if (self.direction === 1 && self.progress > 0.1) {
                    gsap.to(DOM.navbar, {
                        duration: CONFIG.ANIMATION_DURATION.SHORT,
                        y: -100,
                        opacity: 0
                    });
                }
            }
        });
    }

    setupActiveNavLinks() {
        const updateActiveNavLinks = throttle(() => {
            const sections = document.querySelectorAll("section");
            const navLinks = document.querySelectorAll(".nav-link-underline");
            let currentSection = "";

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute("id");

                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentSection = sectionId;
                }
            });

            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${currentSection}`) {
                    link.classList.add("active");
                }
            });
        }, CONFIG.THROTTLE_DELAY);

        updateActiveNavLinks();
        window.addEventListener("scroll", updateActiveNavLinks, { passive: true });
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                if (DOM.mobileMenu && window.getComputedStyle(DOM.mobileMenu).transform !== 'matrix(1, 0, 0, 1, 0, 0)') {
                    gsap.to(DOM.mobileMenu, {
                        duration: CONFIG.ANIMATION_DURATION.SHORT,
                        x: '100%',
                        ease: "power3.out"
                    });
                }

                const navbarHeight = DOM.navbar ? DOM.navbar.offsetHeight : 80;
                const offset = navbarHeight + 20;

                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });

                document.querySelectorAll('.nav-link-underline').forEach(link => {
                    link.classList.remove('active');
                });

                if (anchor.classList.contains('nav-link-underline')) {
                    anchor.classList.add('active');
                }

                history.pushState(null, null, targetId);
            }, { passive: false });
        });
    }
}

class ThemeManager {
    constructor() {
        this.isDark = false;
    }

    init() {
        this.loadTheme();
        this.updateFavicon();
        this.setupMediaQuery();
    }

    loadTheme() {
        const savedTheme = localStorage.getItem("darkMode");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        this.isDark = savedTheme === "true" || (!savedTheme && prefersDark);

        if (this.isDark) {
            DOM.html.classList.add("dark");
        }
    }

    toggle() {
        this.isDark = !this.isDark;
        DOM.html.classList.toggle("dark", this.isDark);
        localStorage.setItem("darkMode", this.isDark.toString());

        this.animateToggle();
        this.updateFavicon();
        this.createParticles();
    }

    animateToggle() {
        const themeIcon = DOM.html.classList.contains("dark") ?
            document.querySelector(".fa-sun") :
            document.querySelector(".fa-moon");

        if (themeIcon) {
            gsap.from(themeIcon, {
                duration: 0.6,
                rotate: 360,
                scale: 0.5,
                ease: "back.out(1.7)"
            });
        }

        const sections = document.querySelectorAll("section, header, footer");
        sections.forEach((section) => {
            gsap.fromTo(section,
                { opacity: 0.8 },
                { opacity: 1, duration: CONFIG.ANIMATION_DURATION.MEDIUM, ease: "power2.out" }
            );
        });
    }

    updateFavicon() {
        const favicon = document.getElementById('favicon');
        if (favicon) {
            favicon.href = this.isDark
                ? './assets/icons/SR-Black.png'
                : './assets/icons/SR-White.png';
        }
    }

    createParticles() {
        const particles = 20;
        const colors = this.isDark ?
            ["#3b82f6", "#6366f1", "#8b5cf6"] :
            ["#f59e0b", "#f97316", "#ef4444"];

        const container = document.createElement("div");
        container.className = "pointer-events-none fixed inset-0 z-50";
        DOM.body.appendChild(container);

        const button = document.querySelector(".fa-moon, .fa-sun")?.parentElement;
        if (!button) return;

        const rect = button.getBoundingClientRect();

        for (let i = 0; i < particles; i++) {
            const particle = document.createElement("div");
            particle.className = "absolute rounded-full pointer-events-none";
            particle.style.width = `${Math.random() * 10 + 5}px`;
            particle.style.height = particle.style.width;
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = `${rect.left + rect.width / 2}px`;
            particle.style.top = `${rect.top + rect.height / 2}px`;

            container.appendChild(particle);

            gsap.to(particle, {
                duration: Math.random() * 1 + 0.5,
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
                opacity: 0,
                scale: 0,
                rotation: Math.random() * 360,
                ease: "power3.out",
                onComplete: () => {
                    if (container.contains(particle)) {
                        container.removeChild(particle);
                    }
                    if (container.childElementCount === 0 && DOM.body.contains(container)) {
                        DOM.body.removeChild(container);
                    }
                }
            });
        }
    }

    setupMediaQuery() {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
            if (!localStorage.getItem("darkMode")) {
                this.isDark = e.matches;
                DOM.html.classList.toggle("dark", this.isDark);
                this.updateFavicon();
            }
        });
    }
}

class ScrollAnimations {
    init() {
        this.setupExperienceCards();
        this.setupProjectCards();
        this.setupSkillTags();
        this.setupSectionHeaders();
        this.setupContactForm();
        this.setupSectionDividers();
        this.setupSkillProgress();
    }

    setupExperienceCards() {
        gsap.utils.toArray(".experience-card").forEach((card) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top bottom-=100",
                    toggleActions: "play none none none"
                },
                x: -50,
                opacity: 0,
                duration: CONFIG.ANIMATION_DURATION.LONG,
                ease: "power3.out"
            });
        });
    }

    setupProjectCards() {
        gsap.utils.toArray(".project-card").forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top bottom-=100",
                    toggleActions: "play none none none"
                },
                y: 50,
                opacity: 0,
                duration: CONFIG.ANIMATION_DURATION.LONG,
                delay: i * 0.2,
                ease: "power3.out"
            });
        });
    }

    setupSkillTags() {
        gsap.from(".skill-tag", {
            scrollTrigger: {
                trigger: ".skill-tag",
                start: "top bottom-=100",
            },
            scale: 0.8,
            opacity: 0,
            duration: 0.4,
            stagger: 0.03,
            ease: "back.out(1.7)",
            onComplete: () => {
                gsap.to(".skill-tag", {
                    y: 5,
                    duration: 2,
                    ease: "sine.inOut",
                    stagger: 0.1,
                    yoyo: true,
                    repeat: -1
                });
            }
        });
    }

    setupSectionHeaders() {
        gsap.utils.toArray("section h2").forEach((header) => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: "top bottom-=100",
                },
                y: 30,
                opacity: 0,
                duration: CONFIG.ANIMATION_DURATION.LONG,
                ease: "power3.out"
            });
        });
    }

    setupContactForm() {
        if (DOM.contactForm) {
            gsap.from(DOM.contactForm, {
                scrollTrigger: {
                    trigger: DOM.contactForm,
                    start: "top bottom-=50",
                },
                y: 30,
                opacity: 0,
                duration: CONFIG.ANIMATION_DURATION.LONG,
                ease: "power3.out"
            });
        }
    }

    setupSectionDividers() {
        gsap.utils.toArray(".section-divider").forEach(section => {
            gsap.to(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.5
                },
                backgroundPositionY: "30%",
                ease: "none"
            });
        });
    }

    setupSkillProgress() {
        gsap.utils.toArray(".skill-progress").forEach(progress => {
            const percentage = progress.getAttribute("data-percentage") || "0";

            gsap.fromTo(progress,
                { scaleX: 0 },
                {
                    scrollTrigger: {
                        trigger: progress.parentElement,
                        start: "top bottom-=100",
                    },
                    scaleX: percentage / 100,
                    duration: 1.5,
                    ease: "power3.out"
                }
            );
        });
    }
}

class ContactFormManager {
    constructor() {
        this.isSubmitting = false;
    }

    init() {
        if (!DOM.contactForm) return;

        this.setupFormInputs();
        this.setupFormSubmission();
    }

    setupFormInputs() {
        const inputs = DOM.contactForm.querySelectorAll("input, textarea");

        inputs.forEach(input => {
            this.createFloatingLabel(input);
            this.setupInputEventListeners(input);
        });
    }

    createFloatingLabel(input) {
        input.parentElement.classList.add('form-floating-label');
        if (input.nextElementSibling?.tagName === "LABEL") return;

        const label = document.createElement("label");
        label.setAttribute("for", input.id);
        label.textContent = input.placeholder;
        input.insertAdjacentElement('afterend', label);
    }

    setupInputEventListeners(input) {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        }, { passive: true });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        }, { passive: true });
    }

    setupFormSubmission() {
        const submitButton = DOM.contactForm.querySelector("button[type='submit']");
        const formStatus = document.getElementById("form-status");
        const successMessage = document.getElementById("success-message");
        const errorMessage = document.getElementById("error-message");

        DOM.contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (this.isSubmitting || !submitButton) return;

            this.isSubmitting = true;
            this.startSubmission(submitButton);

            try {
                await emailjs.sendForm('service_tj734fz', 'template_qbpvaji', DOM.contactForm);
                this.handleSubmitSuccess(submitButton, formStatus, successMessage, errorMessage);
            } catch (error) {
                this.handleSubmitError(submitButton, formStatus, successMessage, errorMessage, error);
            } finally {
                this.isSubmitting = false;
            }
        });
    }

    startSubmission(submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        gsap.to(DOM.contactForm, {
            opacity: 0.7,
            scale: 0.98,
            duration: CONFIG.ANIMATION_DURATION.SHORT
        });
    }

    handleSubmitSuccess(submitButton, formStatus, successMessage, errorMessage) {
        this.resetFormAppearance(submitButton);
        this.showMessage(formStatus, successMessage, errorMessage, true);
        this.createConfetti();
        DOM.contactForm.reset();
    }

    handleSubmitError(submitButton, formStatus, successMessage, errorMessage, error) {
        this.resetFormAppearance(submitButton);
        console.error(error);
        this.showMessage(formStatus, successMessage, errorMessage, false);
    }

    resetFormAppearance(submitButton) {
        gsap.to(DOM.contactForm, {
            opacity: 1,
            scale: 1,
            duration: CONFIG.ANIMATION_DURATION.SHORT
        });

        submitButton.disabled = false;
        submitButton.innerHTML = 'Send Message';
    }

    showMessage(formStatus, successMessage, errorMessage, isSuccess) {
        formStatus.classList.remove('hidden');

        if (isSuccess) {
            successMessage.classList.remove('hidden');
            errorMessage.classList.add('hidden');
        } else {
            errorMessage.classList.remove('hidden');
            successMessage.classList.add('hidden');

            gsap.from(errorMessage, {
                opacity: 0,
                y: -20,
                duration: CONFIG.ANIMATION_DURATION.MEDIUM
            });
        }

        this.hideMessageAfterDelay(formStatus, isSuccess ? successMessage : errorMessage);
    }

    hideMessageAfterDelay(formStatus, message) {
        setTimeout(() => {
            gsap.to(message, {
                opacity: 0,
                y: -20,
                duration: CONFIG.ANIMATION_DURATION.MEDIUM,
                onComplete: () => {
                    formStatus.classList.add('hidden');
                    message.classList.add('hidden');
                    message.style.opacity = 1;
                    message.style.transform = 'translateY(0)';
                }
            });
        }, 5000);
    }

    createConfetti() {
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#f59e0b'];
        const confettiCount = 100;
        const container = document.createElement('div');

        Object.assign(container.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: '9999'
        });

        DOM.body.appendChild(container);

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');

            Object.assign(confetti.style, {
                position: 'absolute',
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 5 + 2}px`,
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                top: '0',
                left: `${Math.random() * 100}vw`
            });

            container.appendChild(confetti);

            gsap.to(confetti, {
                y: '100vh',
                x: `+=${(Math.random() - 0.5) * 400}`,
                rotation: Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1),
                duration: Math.random() * 3 + 2,
                ease: 'power1.out',
                onComplete: () => {
                    if (container.contains(confetti)) {
                        container.removeChild(confetti);
                    }
                    if (container.childElementCount === 0 && DOM.body.contains(container)) {
                        DOM.body.removeChild(container);
                    }
                }
            });
        }
    }
}

class ServiceWorkerManager {
    static async register() {
        if (!('serviceWorker' in navigator)) return;

        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            console.log(registration.scope);
        } catch (error) {
            console.error(error);
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

    async init() {
        DOM.init();

        this.themeManager.init();
        this.mobileMenuManager.init();
        this.scrollManager.init();
        this.scrollAnimations.init();
        this.contactFormManager.init();
        this.cursorManager.init();

        this.setupCursorTrail();

        await ServiceWorkerManager.register();

        this.setupResizeHandler();
    }

    setupCursorTrail() {
        if (document.getElementById('cursor-trail')) return;

        const cursorTrail = document.createElement('div');
        cursorTrail.id = 'cursor-trail';
        cursorTrail.className = 'fixed w-12 h-12 rounded-full bg-primary-500 bg-opacity-20 pointer-events-none z-40 transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block';
        DOM.body.appendChild(cursorTrail);
        DOM.cursorTrail = cursorTrail;
    }

    setupResizeHandler() {
        const handleResize = debounce(() => {
            ScrollTrigger.refresh();
        }, 250);

        window.addEventListener("resize", handleResize, { passive: true });
    }

    handlePageLoad() {
        if (!DOM.loading) return;

        gsap.to(DOM.loading, {
            duration: CONFIG.ANIMATION_DURATION.LONG,
            opacity: 0,
            ease: "power2.inOut",
            onComplete: () => {
                DOM.loading.style.display = "none";
                this.playEntranceAnimation();
            }
        });
    }

    playEntranceAnimation() {
        const entranceTimeline = gsap.timeline();

        entranceTimeline
            .from("nav", {
                y: -50,
                opacity: 0,
                duration: CONFIG.ANIMATION_DURATION.LONG,
                ease: "power3.out"
            })
            .from("#home .order-1", {
                x: -50,
                opacity: 0,
                duration: CONFIG.ANIMATION_DURATION.LONG,
                ease: "power3.out"
            }, "-=0.4")
            .from("#home .order-2", {
                x: 50,
                opacity: 0,
                duration: CONFIG.ANIMATION_DURATION.LONG,
                ease: "power3.out"
            }, "-=0.6")
            .call(() => {
                this.typeWriter = new TypeWriter("Sundaram Rai", "typed-text");
                this.typeWriter.type();
            });
    }
}

window.scrollToTop = function () {
    if (portfolioApp?.scrollManager) {
        portfolioApp.scrollManager.scrollToTop();
    } else {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

window.toggleTheme = function () {
    if (portfolioApp?.themeManager) {
        portfolioApp.themeManager.toggle();
    }
};

let portfolioApp;

window.addEventListener("load", () => {
    try {
        portfolioApp.handlePageLoad();
    } catch (error) {
        console.error(error);
    }
}, { passive: true });

document.addEventListener("DOMContentLoaded", async () => {
    try {
        portfolioApp = new PortfolioApp();
        await portfolioApp.init();
    } catch (error) {
        console.error(error);
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp, DOM, CONFIG };
}