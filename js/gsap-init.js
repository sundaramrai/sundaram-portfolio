gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
class TextSplitter {
    constructor(elemSelector) {
        this.elems = document.querySelectorAll(elemSelector);
        this.init();
    }

    init() {
        this.elems.forEach(elem => {
            const text = elem.innerText;
            elem.innerHTML = "";
            text.split("").forEach(char => {
                const span = document.createElement("span");
                span.className = "inline-block";
                span.innerText = char === " " ? "\u00A0" : char;
                elem.appendChild(span);
            });
            this.animate(elem);
        });
    }

    animate(element) {
        const chars = element.querySelectorAll("span");

        ScrollTrigger.create({
            trigger: element,
            start: "top bottom-=100",
            onEnter: () => {
                gsap.fromTo(chars,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.03,
                        ease: "power3.out"
                    }
                );
            },
            once: true
        });
    }
}

class ScrollReveal {
    constructor() {
        this.initFadeUp();
        this.initFadeIn();
        this.initScaleIn();
        this.initStaggeredItems();
    }

    initFadeUp() {
        gsap.utils.toArray('.fade-up').forEach(item => {
            gsap.fromTo(item,
                { opacity: 0, y: 50 },
                {
                    scrollTrigger: {
                        trigger: item,
                        start: "top bottom-=100",
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out"
                }
            );
        });
    }

    initFadeIn() {
        gsap.utils.toArray('.fade-in').forEach(item => {
            gsap.fromTo(item,
                { opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: item,
                        start: "top bottom-=100",
                    },
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out"
                }
            );
        });
    }

    initScaleIn() {
        gsap.utils.toArray('.scale-in').forEach(item => {
            gsap.fromTo(item,
                { opacity: 0, scale: 0.8 },
                {
                    scrollTrigger: {
                        trigger: item,
                        start: "top bottom-=100",
                    },
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: "back.out(1.7)"
                }
            );
        });
    }

    initStaggeredItems() {
        gsap.utils.toArray('.stagger-container').forEach(container => {
            const items = container.querySelectorAll('.stagger-item');

            gsap.fromTo(items,
                { opacity: 0, y: 20 },
                {
                    scrollTrigger: {
                        trigger: container,
                        start: "top bottom-=100",
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power3.out"
                }
            );
        });
    }
}

class PortfolioHover {
    constructor() {
        this.items = document.querySelectorAll('.project-card');
        this.initHoverEffects();
    }

    initHoverEffects() {
        this.items.forEach(item => {
            const image = item.querySelector('.project-image');
            const overlay = item.querySelector('.project-image-overlay');
            const content = item.querySelector('.project-content');
            const icons = item.querySelectorAll('.project-links a');

            if (image && overlay && content) {
                const tl = gsap.timeline({ paused: true });

                tl.to(overlay, {
                    opacity: 1,
                    duration: 0.3
                })
                    .to(content, {
                        y: 0,
                        opacity: 1,
                        duration: 0.3
                    }, "-=0.1")
                    .to(icons, {
                        opacity: 1,
                        x: 0,
                        duration: 0.2,
                        stagger: 0.1
                    }, "-=0.2");
                item.addEventListener('mouseenter', () => {
                    tl.play();
                });

                item.addEventListener('mouseleave', () => {
                    tl.reverse();
                });
            }
        });
    }
}

class ParallaxBackground {
    constructor() {
        this.elements = document.querySelectorAll('.parallax-bg');
        this.initParallax();
    }

    initParallax() {
        this.elements.forEach(element => {
            const depth = element.getAttribute('data-depth') || 0.2;

            gsap.to(element, {
                y: () => -window.scrollY * depth,
                ease: "none",
                scrollTrigger: {
                    trigger: element.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('section h2').forEach(h2 => {
        h2.classList.add('fade-up');
    });

    document.querySelectorAll('.project-card, .experience-card').forEach(card => {
        card.classList.add('scale-in');
    });

    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.classList.add('stagger-item');
    });

    document.querySelector('#skills .max-w-4xl')?.classList.add('stagger-container');
    new TextSplitter('#home h1, section h2');
    new ScrollReveal();
    new PortfolioHover();
    new ParallaxBackground();
    createBackgroundElements();
    setupScrollSpy();

    if (!gsap.plugins.ScrollToPlugin) {
        console.warn('ScrollToPlugin is not loaded. Some scroll animations may not work properly.');
    }
});

function createBackgroundElements() {
    const container = document.createElement('div');
    container.className = 'fixed inset-0 pointer-events-none overflow-hidden z-0';
    document.body.prepend(container);

    for (let i = 0; i < 10; i++) {
        const shape = document.createElement('div');
        const size = Math.random() * 300 + 50;

        shape.className = 'absolute rounded-full bg-gradient-to-r';
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.top = `${Math.random() * 100}%`;
        shape.style.opacity = '0.03';
        shape.style.filter = 'blur(70px)';

        const colors = [
            'from-blue-400 to-purple-500',
            'from-green-400 to-blue-500',
            'from-purple-400 to-pink-500',
            'from-yellow-400 to-orange-500',
            'from-teal-400 to-green-500'
        ];
        shape.classList.add(...colors[Math.floor(Math.random() * colors.length)].split(' '));

        container.appendChild(shape);
        gsap.to(shape, {
            x: () => (Math.random() - 0.5) * 100,
            y: () => (Math.random() - 0.5) * 100,
            scale: () => 0.5 + Math.random() * 1.5,
            opacity: () => 0.02 + Math.random() * 0.08,
            duration: 10 + Math.random() * 20,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }
}

function setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link-underline');

    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => updateActiveNav(section.id),
            onEnterBack: () => updateActiveNav(section.id)
        });
    });

    function updateActiveNav(sectionId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    const scrollPosition = window.scrollY + 200;
    let currentSection = null;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });

    if (currentSection) {
        updateActiveNav(currentSection);
    }
}

window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash) {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
            setTimeout(() => {
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                const offset = navbarHeight + 20;

                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
});
