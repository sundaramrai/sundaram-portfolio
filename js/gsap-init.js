gsap.registerPlugin(ScrollTrigger);
if (gsap.plugins?.ScrollToPlugin) {
    gsap.registerPlugin(ScrollToPlugin);
}

window.debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

window.throttle = (func, limit) => {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

class OptimizedTextSplitter {
    constructor(elemSelector) {
        this.elems = [...document.querySelectorAll(elemSelector)];
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        this.elems.forEach(elem => {
            const text = elem.textContent;
            const fragment = document.createDocumentFragment();

            const spans = text.split("").map(char => {
                const span = document.createElement("span");
                span.className = "inline-block";
                span.textContent = char === " " ? "\u00A0" : char;
                return span;
            });

            spans.forEach(span => fragment.appendChild(span));
            elem.innerHTML = "";
            elem.appendChild(fragment);

            this.setupAnimation(elem);
        });
    }

    setupAnimation(element) {
        const chars = [...element.querySelectorAll("span")];

        ScrollTrigger.batch(chars, {
            trigger: element,
            start: "top bottom-=100",
            onEnter: (elements) => {
                if (this.animatedElements.has(element)) return;
                this.animatedElements.add(element);

                gsap.set(elements, { opacity: 0, y: 20 });
                gsap.to(elements, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.03,
                    ease: "power3.out"
                });
            },
            once: true
        });
    }
}

class OptimizedScrollReveal {
    constructor() {
        this.initBatchedAnimations();
    }

    initBatchedAnimations() {
        const animationGroups = {
            fadeUp: [...document.querySelectorAll('.fade-up')],
            fadeIn: [...document.querySelectorAll('.fade-in')],
            scaleIn: [...document.querySelectorAll('.scale-in')]
        };

        if (animationGroups.fadeUp.length) {
            ScrollTrigger.batch(animationGroups.fadeUp, {
                start: "top bottom-=100",
                onEnter: (elements) => {
                    gsap.fromTo(elements,
                        { opacity: 0, y: 50 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            stagger: 0.1,
                            ease: "power3.out"
                        }
                    );
                }
            });
        }

        if (animationGroups.fadeIn.length) {
            ScrollTrigger.batch(animationGroups.fadeIn, {
                start: "top bottom-=100",
                onEnter: (elements) => {
                    gsap.fromTo(elements,
                        { opacity: 0 },
                        {
                            opacity: 1,
                            duration: 1,
                            stagger: 0.05,
                            ease: "power2.out"
                        }
                    );
                }
            });
        }

        if (animationGroups.scaleIn.length) {
            ScrollTrigger.batch(animationGroups.scaleIn, {
                start: "top bottom-=100",
                onEnter: (elements) => {
                    gsap.fromTo(elements,
                        { opacity: 0, scale: 0.8 },
                        {
                            opacity: 1,
                            scale: 1,
                            duration: 0.8,
                            stagger: 0.1,
                            ease: "back.out(1.7)"
                        }
                    );
                }
            });
        }

        this.initStaggeredContainers();
    }

    initStaggeredContainers() {
        const containers = [...document.querySelectorAll('.stagger-container')];

        ScrollTrigger.batch(containers, {
            start: "top bottom-=100",
            onEnter: (containers) => {
                containers.forEach(container => {
                    const items = [...container.querySelectorAll('.stagger-item')];
                    gsap.fromTo(items,
                        { opacity: 0, y: 20 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            stagger: 0.1,
                            ease: "power3.out"
                        }
                    );
                });
            }
        });
    }
}

class OptimizedPortfolioHover {
    constructor() {
        this.items = [...document.querySelectorAll('.project-card')];
        this.timelines = new Map();
        this.initHoverEffects();
    }

    initHoverEffects() {
        this.items.forEach(item => {
            const image = item.querySelector('.project-image');
            const overlay = item.querySelector('.project-image-overlay');
            const content = item.querySelector('.project-content');
            const icons = [...item.querySelectorAll('.project-links a')];

            if (image && overlay && content) {
                const tl = gsap.timeline({ paused: true });

                tl.to(overlay, { opacity: 1, duration: 0.3 })
                    .to(content, { y: 0, opacity: 1, duration: 0.3 }, "-=0.1")
                    .to(icons, { opacity: 1, x: 0, duration: 0.2, stagger: 0.1 }, "-=0.2");

                this.timelines.set(item, tl);

                item.addEventListener('mouseenter', () => tl.play(), { passive: true });
                item.addEventListener('mouseleave', () => tl.reverse(), { passive: true });
            }
        });
    }

    destroy() {
        this.timelines.clear();
    }
}

class OptimizedParallaxBackground {
    constructor() {
        this.elements = [...document.querySelectorAll('.parallax-bg')];
        this.initParallax();
    }

    initParallax() {
        this.elements.forEach(element => {
            const depth = parseFloat(element.getAttribute('data-depth')) || 0.2;
            const parent = element.parentElement;

            gsap.to(element, {
                yPercent: -50 * depth,
                ease: "none",
                scrollTrigger: {
                    trigger: parent,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            });
        });
    }
}

const initializeAnimationClasses = () => {
    const updates = [
        { selector: 'section h2', className: 'fade-up' },
        { selector: '.project-card, .experience-card', className: 'scale-in' },
        { selector: '.skill-tag', className: 'stagger-item' }
    ];

    updates.forEach(({ selector, className }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.classList.add(className));
    });

    const skillsContainer = document.querySelector('#skills .max-w-4xl');
    if (skillsContainer) {
        skillsContainer.classList.add('stagger-container');
    }
};

const createOptimizedBackgroundElements = () => {
    const container = document.createElement('div');
    container.className = 'fixed inset-0 pointer-events-none overflow-hidden z-0';

    const fragment = document.createDocumentFragment();
    const colors = [
        'from-blue-400 to-purple-500',
        'from-green-400 to-blue-500',
        'from-purple-400 to-pink-500',
        'from-yellow-400 to-orange-500',
        'from-teal-400 to-green-500'
    ];

    for (let i = 0; i < 10; i++) {
        const shape = document.createElement('div');
        const size = Math.random() * 300 + 50;
        const colorClass = colors[Math.floor(Math.random() * colors.length)];

        shape.className = `absolute rounded-full bg-gradient-to-r ${colorClass}`;
        Object.assign(shape.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: '0.03',
            filter: 'blur(70px)'
        });

        fragment.appendChild(shape);
    }

    container.appendChild(fragment);
    document.body.prepend(container);

    const shapes = container.children;
    gsap.to(shapes, {
        x: () => (Math.random() - 0.5) * 100,
        y: () => (Math.random() - 0.5) * 100,
        scale: () => 0.5 + Math.random() * 1.5,
        opacity: () => 0.02 + Math.random() * 0.08,
        duration: () => 10 + Math.random() * 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
            amount: 2,
            from: "random"
        }
    });
};

const setupOptimizedScrollSpy = () => {
    const sections = [...document.querySelectorAll('section[id]')];
    const navLinks = [...document.querySelectorAll('.nav-link-underline')];

    if (!sections.length || !navLinks.length) return;

    const linkMap = new Map();
    navLinks.forEach(link => {
        linkMap.set(link.getAttribute('href'), link);
    });

    const updateActiveNav = (sectionId) => {
        const href = `#${sectionId}`;
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = linkMap.get(href);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    };

    ScrollTrigger.batch(sections, {
        start: 'top center',
        end: 'bottom center',
        onEnter: (elements) => elements.forEach(el => updateActiveNav(el.id)),
        onEnterBack: (elements) => elements.forEach(el => updateActiveNav(el.id))
    });

    const scrollPosition = window.pageYOffset + 200;
    let currentSection = null;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.pageYOffset;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + rect.height) {
            currentSection = section.id;
        }
    });

    if (currentSection) {
        updateActiveNav(currentSection);
    }
};

const setupHashNavigation = () => {
    const navbar = document.getElementById('navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 80;
    const offset = navbarHeight + 20;

    const handleHashChange = debounce(() => {
        const hash = window.location.hash;
        if (hash) {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: targetElement.offsetTop - offset,
                        autoKill: false
                    },
                    ease: "power2.inOut"
                });
            }
        }
    }, 100);

    window.addEventListener('hashchange', handleHashChange);
};

document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeAnimationClasses();

        new OptimizedTextSplitter('#home h1, section h2');
        new OptimizedScrollReveal();
        new OptimizedPortfolioHover();
        new OptimizedParallaxBackground();

        createOptimizedBackgroundElements();
        setupOptimizedScrollSpy();
        setupHashNavigation();

        if (!gsap.plugins.ScrollToPlugin) {
            console.warn('ScrollToPlugin not loaded. Hash navigation may not work smoothly.');
        }

    } catch (error) {
        console.error('Animation initialization failed:', error);
    }

    if (performance.mark) {
        performance.mark('animations-loaded');
        performance.measure('animation-init', 'navigationStart', 'animations-loaded');
    }
});

window.addEventListener('beforeunload', () => {
    ScrollTrigger.killAll();
    gsap.killTweensOf("*");
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
});