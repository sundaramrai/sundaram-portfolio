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
let speed = 0.2;
let animationFrame;
function updateCursor() {
    const cursor = document.getElementById('cursor');
    if (cursor) {
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        gsap.set(cursor, {
            x: cursorX,
            y: cursorY
        });
        animationFrame = requestAnimationFrame(updateCursor);
    }
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
                ease: "power3.out"
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
            mobileMenuLinks.forEach(link => {
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
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}

function setupNavbarScroll() {
    const navbar = document.getElementById('navbar');

    if (navbar) {
        ScrollTrigger.create({
            start: "top top",
            end: "max",
            onUpdate: (self) => {
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
        ease: "back.out(1.7)"
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
}

function setupContactForm() {
    const form = document.getElementById("contact-form");
    const submitButton = document.getElementById("submit-btn");
    const formStatus = document.getElementById("form-status");
    const successMessage = document.getElementById("success-message");
    const errorMessage = document.getElementById("error-message");

    if (form && submitButton && formStatus && successMessage && errorMessage) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            emailjs.sendForm('service_tj734fz', 'template_qbpvaji', form)
                .then(() => {
                    formStatus.classList.remove('hidden');
                    successMessage.classList.remove('hidden');
                    errorMessage.classList.add('hidden');
                    form.reset();
                    setTimeout(() => {
                        submitButton.disabled = false;
                        submitButton.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                        gsap.from(successMessage, {
                            y: -20,
                            opacity: 0,
                            duration: 0.5,
                            ease: "power2.out"
                        });
                    }, 2000);
                    setTimeout(() => {
                        gsap.to(successMessage, {
                            opacity: 0,
                            duration: 0.5,
                            ease: "power2.out",
                            onComplete: () => {
                                formStatus.classList.add('hidden');
                                successMessage.classList.add('hidden');
                                successMessage.style.opacity = 1;
                            }
                        });
                    }, 5000);

                }, (error) => {
                    console.error('Email error:', error);
                    formStatus.classList.remove('hidden');
                    errorMessage.classList.remove('hidden');
                    successMessage.classList.add('hidden');
                    setTimeout(() => {
                        submitButton.disabled = false;
                        submitButton.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                        gsap.from(errorMessage, {
                            y: -20,
                            opacity: 0,
                            duration: 0.5,
                            ease: "power2.out"
                        });
                    }, 2000);

                    setTimeout(() => {
                        gsap.to(errorMessage, {
                            opacity: 0,
                            duration: 0.5,
                            ease: "power2.out",
                            onComplete: () => {
                                formStatus.classList.add('hidden');
                                errorMessage.classList.add('hidden');
                                errorMessage.style.opacity = 1;
                            }
                        });
                    }, 5000);
                });
        });
    }
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

window.addEventListener("load", () => {
    const loadingElement = document.getElementById("loading");
    if (loadingElement) {
        gsap.to(loadingElement, {
            duration: 0.5,
            opacity: 0,
            ease: "power2.inOut",
            onComplete: () => {
                loadingElement.style.display = "none";
                gsap.from("header", { duration: 1, y: -20, opacity: 0, ease: "power3.out" });
                type();
                const heroElements = gsap.timeline({ delay: 0.5 });
                heroElements.from(".container p", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" })
                    .from(".container .flex.flex-col.sm\\:flex-row", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" }, "-=0.6")
                    .from(".container .flex.flex-wrap.items-center", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" }, "-=0.6")
                    .from(".container .flex.space-x-6", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" }, "-=0.6");
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
