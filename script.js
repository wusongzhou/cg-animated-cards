document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // =====================
    // Hero Animations
    // =====================

    // Animate hero title words with stagger
    const heroTitle = document.querySelector(".hero-title");
    const heroWords = heroTitle.querySelectorAll(".word span");

    gsap.from(heroWords, {
        duration: 1.2,
        y: 100,
        opacity: 0,
        rotateX: -90,
        stagger: 0.15,
        ease: "power4.out",
        transformPerspective: 750
    });

    // Animate subtitle
    gsap.from(".hero-subtitle", {
        duration: 1,
        opacity: 0,
        y: 30,
        delay: 0.8,
        ease: "power2.out"
    });

    // Animate decorations
    gsap.from(".decor-circle", {
        duration: 2,
        scale: 0,
        opacity: 0,
        ease: "elastic.out(1, 0.5)",
        delay: 0.5
    });

    gsap.from(".decor-star", {
        duration: 1.5,
        rotation: -180,
        scale: 0,
        opacity: 0,
        ease: "back.out(1.7)",
        delay: 0.7
    });

    gsap.from(".decor-diamond", {
        duration: 1.5,
        x: -100,
        opacity: 0,
        ease: "power3.out",
        delay: 0.9
    });

    gsap.from(".decor-spinner", {
        duration: 2,
        rotation: 180,
        scale: 0,
        opacity: 0,
        ease: "power2.out",
        delay: 1.1
    });

    // Floating animation for decorations
    gsap.to(".decor-circle", {
        y: 30,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to(".decor-diamond", {
        y: -20,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // =====================
    // Features Animations
    // =====================

    const featureCards = document.querySelectorAll(".feature-card");

    // Animate features title
    gsap.from(".features-title", {
        scrollTrigger: {
            trigger: ".features",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        duration: 1,
        y: 60,
        opacity: 0,
        ease: "power3.out"
    });

    // Animate feature cards with stagger
    gsap.from(featureCards, {
        scrollTrigger: {
            trigger: ".features-grid",
            start: "top 75%",
            toggleActions: "play none none reverse"
        },
        duration: 0.8,
        y: 80,
        opacity: 0,
        stagger: 0.15,
        ease: "power3.out"
    });

    // =====================
    // Showcase - Horizontal Scroll
    // =====================

    const showcase = document.querySelector(".showcase");
    const showcaseWrapper = document.querySelector(".showcase-wrapper");
    const showcaseItems = document.querySelectorAll(".showcase-item");

    // Calculate total scroll distance
    const getScrollAmount = () => {
        return -(showcaseWrapper.scrollWidth - window.innerWidth);
    };

    const tween = gsap.to(showcaseWrapper, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
            trigger: ".showcase",
            start: "top top",
            end: () => `+=${showcaseWrapper.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1
        }
    });

    // Animate showcase items as they enter view
    showcaseItems.forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                containerAnimation: tween,
                start: "left 90%",
                toggleActions: "play none none reverse"
            },
            duration: 0.6,
            scale: 0.8,
            opacity: 0,
            ease: "back.out(1.7)"
        });
    });

    // =====================
    // CTA Animations
    // =====================

    gsap.from(".cta h2", {
        scrollTrigger: {
            trigger: ".cta",
            start: "top 70%",
            toggleActions: "play none none reverse"
        },
        duration: 1,
        y: 60,
        opacity: 0,
        ease: "power3.out"
    });

    gsap.from(".cta-button", {
        scrollTrigger: {
            trigger: ".cta",
            start: "top 60%",
            toggleActions: "play none none reverse"
        },
        duration: 0.8,
        scale: 0,
        opacity: 0,
        ease: "back.out(1.7)",
        delay: 0.3
    });

    // Continuous float animation for CTA button
    gsap.to(".cta-button", {
        boxShadow: "0 0 30px rgba(10, 228, 72, 0.3)",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // =====================
    // Parallax Decorations on Scroll
    // =====================

    gsap.to(".decor-circle", {
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1
        },
        y: -100
    });

    gsap.to(".decor-star", {
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1
        },
        y: -150,
        rotation: 45
    });
});
