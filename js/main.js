gsap.registerPlugin(ScrollTrigger);

const text = "Sundaram Rai";
let index = 0;

function type() {
    if (index < text.length) {
        document.getElementById("typed-text").innerHTML += text.charAt(index);
        index++;
        setTimeout(type, 100);
    } else {
        gsap.to("#typed-text", {
            duration: 0.5,
            color: "#3B82F6",
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                gsap.to("#typed-text", {
                    duration: 1,
                    backgroundPositionX: "100%",
                    ease: "power3.inOut"
                });
            }
        });
    }
}

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let cursorSpeed = 0.2;
let animationFrame;

function updateCursor() {
    const cursor = document.getElementById('cursor');
    const cursorTrail = document.getElementById('cursor-trail');

    if (cursor) {
        cursorX += (mouseX - cursorX) * cursorSpeed;
        cursorY += (mouseY - cursorY) * cursorSpeed;

        gsap.set(cursor, {
            x: cursorX,
            y: cursorY
        });
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        const speed = Math.sqrt(dx * dx + dy * dy);
        const scale = Math.max(1, Math.min(1.5, 1 + speed * 0.01));

        gsap.to(cursor, {
            scale: scale,
            duration: 0.2
        });

        if (cursorTrail) {
            gsap.to(cursorTrail, {
                x: cursorX,
                y: cursorY,
                duration: 0.5,
                ease: "power2.out"
            });
        }

        animationFrame = requestAnimationFrame(updateCursor);
    }
}

function setupCursorInteraction() {
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .interactive');
    const cursor = document.getElementById('cursor');

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            if (cursor) {
                gsap.to(cursor, {
                    scale: 1.5,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    border: '2px solid rgba(59, 130, 246, 0.5)',
                    duration: 0.3
                });
            }
        });

        element.addEventListener('mouseleave', () => {
            if (cursor) {
                gsap.to(cursor, {
                    scale: 1,
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    border: 'none',
                    duration: 0.3
                });
            }
        });
    });
}

function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!animationFrame) {
        animationFrame = requestAnimationFrame(updateCursor);
    }
}

function handleMouseLeave() {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }
}

document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseleave', handleMouseLeave);

function setupMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMenuButton = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = mobileMenu?.querySelectorAll('a');

    if (mobileMenuButton && closeMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            gsap.to(mobileMenu, {
                duration: 0.5,
                x: 0,
                ease: "power3.out",
                onComplete: () => {
                    gsap.to(mobileMenuLinks, {
                        duration: 0.5,
                        opacity: 1,
                        y: 0,
                        stagger: 0.1,
                        ease: "power2.out"
                    });
                }
            });
        });

        closeMenuButton.addEventListener('click', () => {
            gsap.to(mobileMenu, {
                duration: 0.5,
                x: '100%',
                ease: "power3.out"
            });
        });

        if (mobileMenuLinks) {
            mobileMenuLinks.forEach((link, index) => {
                link.style.opacity = "0";
                link.style.transform = "translateY(20px)";

                link.addEventListener('click', () => {
                    gsap.to(mobileMenu, {
                        duration: 0.5,
                        x: '100%',
                        ease: "power3.out"
                    });
                });
            });
        }
    }
}

function setupBackToTopButton() {
    const button = document.getElementById("backToTopButton");

    if (button) {
        window.addEventListener("scroll", () => {
            if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
                gsap.to(button, {
                    duration: 0.3,
                    opacity: 1,
                    visibility: "visible",
                    ease: "power2.out"
                });
            } else {
                gsap.to(button, {
                    duration: 0.3,
                    opacity: 0,
                    ease: "power2.out",
                    onComplete: () => {
                        button.style.visibility = "hidden";
                    }
                });
            }
        });

        button.addEventListener("click", () => {
            gsap.to(button, {
                rotation: 360,
                duration: 0.5,
                ease: "power2.out"
            });

            scrollToTop();
        });
    }
}

function scrollToTop() {
    gsap.to(window, {
        duration: 1.5,
        scrollTo: 0,
        ease: "power4.out"
    });
}

function setupNavbarScroll() {
    const navbar = document.getElementById('navbar');
    const scrollIndicator = document.createElement('div');

    scrollIndicator.classList.add('h-1', 'bg-gradient-to-r', 'from-blue-500', 'to-purple-500', 'w-0');

    if (navbar) {
        navbar.appendChild(scrollIndicator);

        ScrollTrigger.create({
            start: "top top",
            end: "max",
            onUpdate: (self) => {
                gsap.to(scrollIndicator, {
                    width: `${self.progress * 100}%`,
                    duration: 0.3
                });
                if (self.direction === -1) {
                    gsap.to(navbar, {
                        duration: 0.3,
                        y: 0,
                        opacity: 1,
                        borderBottomColor: self.progress > 0.1 ? 'rgba(203, 213, 225, 0.3)' : 'transparent'
                    });
                } else if (self.direction === 1 && self.progress > 0.1) {
                    gsap.to(navbar, {
                        duration: 0.3,
                        y: -100,
                        opacity: 0
                    });
                }
            }
        });
    }
    updateActiveNavLinks();
    window.addEventListener("scroll", updateActiveNavLinks);
}

function updateActiveNavLinks() {
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
}

function initTheme() {
    if (
        localStorage.getItem("darkMode") === "true" ||
        (!("darkMode" in localStorage) &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
        document.documentElement.classList.add("dark");
    }
}

function toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle("dark");
    localStorage.setItem("darkMode", html.classList.contains("dark"));

    const themeIcon = html.classList.contains("dark") ?
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
            { opacity: 1, duration: 0.5, ease: "power2.out" }
        );
    });
    createThemeToggleParticles();
}

function createThemeToggleParticles() {
    const particles = 20;
    const colors = document.documentElement.classList.contains("dark") ?
        ["#3b82f6", "#6366f1", "#8b5cf6"] :
        ["#f59e0b", "#f97316", "#ef4444"];

    const container = document.createElement("div");
    container.className = "pointer-events-none fixed inset-0 z-50";
    document.body.appendChild(container);

    for (let i = 0; i < particles; i++) {
        const particle = document.createElement("div");
        particle.className = "absolute rounded-full pointer-events-none";
        particle.style.width = `${Math.random() * 10 + 5}px`;
        particle.style.height = particle.style.width;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        const button = document.querySelector(".fa-moon, .fa-sun").parentElement;
        const rect = button.getBoundingClientRect();
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
                container.removeChild(particle);
                if (container.childElementCount === 0) {
                    document.body.removeChild(container);
                }
            }
        });
    }
}

function setupScrollAnimations() {
    gsap.utils.toArray(".experience-card").forEach((card) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top bottom-=100",
                toggleActions: "play none none none"
            },
            x: -50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    });
    gsap.utils.toArray(".project-card").forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top bottom-=100",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.2,
            ease: "power3.out"
        });
    });
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
    gsap.utils.toArray("section h2").forEach((header) => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: "top bottom-=100",
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    });
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        gsap.from(contactForm, {
            scrollTrigger: {
                trigger: contactForm,
                start: "top bottom-=50",
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    }

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

function setupContactForm() {
    const form = document.getElementById("contact-form");
    const inputs = form?.querySelectorAll("input, textarea");
    const submitButton = form?.querySelector("button[type='submit']");
    const formStatus = document.getElementById("form-status");
    const successMessage = document.getElementById("success-message");
    const errorMessage = document.getElementById("error-message");

    if (form) {
        inputs?.forEach(input => {
            input.parentElement.classList.add('form-floating-label');
            if (!input.nextElementSibling || input.nextElementSibling.tagName !== "LABEL") {
                const label = document.createElement("label");
                label.setAttribute("for", input.id);
                label.textContent = input.placeholder;
                input.insertAdjacentElement('afterend', label);
            }

            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            if (submitButton) {
                submitButton.disabled = true;
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                gsap.to(form, {
                    opacity: 0.7,
                    scale: 0.98,
                    duration: 0.3
                });

                emailjs.sendForm('service_tj734fz', 'template_qbpvaji', form)
                    .then(() => {
                        gsap.to(form, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.3
                        });

                        formStatus.classList.remove('hidden');
                        successMessage.classList.remove('hidden');
                        errorMessage.classList.add('hidden');
                        createConfetti();

                        form.reset();
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalText;

                        setTimeout(() => {
                            gsap.to(successMessage, {
                                opacity: 0,
                                y: -20,
                                duration: 0.5,
                                onComplete: () => {
                                    formStatus.classList.add('hidden');
                                    successMessage.classList.add('hidden');
                                    successMessage.style.opacity = 1;
                                    successMessage.style.transform = 'translateY(0)';
                                }
                            });
                        }, 5000);
                    })
                    .catch((error) => {
                        gsap.to(form, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.3
                        });

                        console.error('Email error:', error);
                        formStatus.classList.remove('hidden');
                        errorMessage.classList.remove('hidden');
                        successMessage.classList.add('hidden');

                        submitButton.disabled = false;
                        submitButton.innerHTML = originalText;

                        gsap.from(errorMessage, {
                            opacity: 0,
                            y: -20,
                            duration: 0.5
                        });

                        setTimeout(() => {
                            gsap.to(errorMessage, {
                                opacity: 0,
                                y: -20,
                                duration: 0.5,
                                onComplete: () => {
                                    formStatus.classList.add('hidden');
                                    errorMessage.classList.add('hidden');
                                    errorMessage.style.opacity = 1;
                                    errorMessage.style.transform = 'translateY(0)';
                                }
                            });
                        }, 5000);
                    });
            }
        });
    }
}

function createConfetti() {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#f59e0b'];
    const confettiCount = 100;
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 5 + 2}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.top = '0';
        confetti.style.left = `${Math.random() * 100}vw`;
        container.appendChild(confetti);

        gsap.to(confetti, {
            y: '100vh',
            x: `+=${(Math.random() - 0.5) * 400}`,
            rotation: Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1),
            duration: Math.random() * 3 + 2,
            ease: 'power1.out',
            onComplete: () => {
                container.removeChild(confetti);
                if (container.childElementCount === 0) {
                    document.body.removeChild(container);
                }
            }
        });
    }
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && window.getComputedStyle(mobileMenu).transform !== 'matrix(1, 0, 0, 1, 0, 0)') {
                    gsap.to(mobileMenu, {
                        duration: 0.3,
                        x: '100%',
                        ease: "power3.out"
                    });
                }
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                const offset = navbarHeight + 20;
                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });
                document.querySelectorAll('.nav-link-underline').forEach(link => {
                    link.classList.remove('active');
                });

                if (this.classList.contains('nav-link-underline')) {
                    this.classList.add('active');
                }
                history.pushState(null, null, targetId);
            }
        });
    });
}

window.addEventListener("load", () => {
    const loadingElement = document.getElementById("loading");
    if (loadingElement) {
        gsap.to(loadingElement, {
            duration: 0.8,
            opacity: 0,
            ease: "power2.inOut",
            onComplete: () => {
                loadingElement.style.display = "none";
                const entranceTimeline = gsap.timeline();

                entranceTimeline
                    .from("nav", {
                        y: -50,
                        opacity: 0,
                        duration: 0.8,
                        ease: "power3.out"
                    })
                    .from("#home .order-1", {
                        x: -50,
                        opacity: 0,
                        duration: 0.8,
                        ease: "power3.out"
                    }, "-=0.4")
                    .from("#home .order-2", {
                        x: 50,
                        opacity: 0,
                        duration: 0.8,
                        ease: "power3.out"
                    }, "-=0.6")
                    .call(type);
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    setupMobileMenu();
    setupBackToTopButton();
    setupNavbarScroll();
    setupScrollAnimations();
    setupContactForm();
    setupSmoothScrolling();
    setupCursorInteraction();
    
    // Register service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    }
    
    const cursorTrail = document.createElement('div');
    cursorTrail.id = 'cursor-trail';
    cursorTrail.className = 'fixed w-12 h-12 rounded-full bg-primary-500 bg-opacity-20 pointer-events-none z-40 transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block';
    document.body.appendChild(cursorTrail);
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!("darkMode" in localStorage)) {
            if (e.matches) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
    });
});

window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
});
