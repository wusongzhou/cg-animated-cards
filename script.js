document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // Animate navigation
    gsap.from("nav", {
        duration: 1,
        y: -100,
        opacity: 0,
        ease: "power3.out"
    });

    // Animate scroll indicator
    gsap.from(".scroll-indicator", {
        duration: 1,
        opacity: 0,
        y: 20,
        delay: 2.2,
        ease: "power2.out"
    });

    // Scroll indicator click - smooth scroll to features
    document.querySelector(".scroll-indicator").addEventListener("click", () => {
        const target = document.querySelector(".features");
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 100;

        window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
        });
    });

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // =====================
    // Hero Title Animation - gsap.com 1:1 replica
    // =====================

    const heroTitle = document.querySelector(".hero-title");
    const heroWords = heroTitle.querySelectorAll(".word-animate");

    // Timeline for title animation
    const heroTl = gsap.timeline({ delay: 0.3 });

    // Helper: animate regular letters (clip reveal from bottom)
    const animateRegularLetter = (clip, delay) => {
        const char = clip.querySelector(".char");
        // Initial hidden state
        gsap.set(char, { y: "100%", opacity: 0 });
        heroTl.to(char, {
            y: "0%",
            opacity: 1,
            duration: 0.6,
            ease: "power3.out"
        }, delay);
    };

    // Helper: animate 3D letters (a, i, y)
    const animate3DLetter = (clip, delay) => {
        const char = clip.querySelector(".char");
        gsap.set(char, { rotationX: -90, y: "100%", opacity: 0, transformOrigin: "center bottom" });
        heroTl.to(char, {
            rotationX: 0,
            y: "0%",
            opacity: 1,
            duration: 0.7,
            ease: "power4.out"
        }, delay);
    };

    // Helper: animate swap letters (n, t) - Y-axis flip
    const animateSwapLetter = (clip, delay) => {
        const front = clip.querySelector(".char-front");
        const back = clip.querySelector(".char-back");

        // Step 1: Make front visible at start of animation
        heroTl.set(front, { opacity: 1, visibility: "visible", rotationY: 0 }, delay);

        // Step 2: Front flips away
        heroTl.to(front, {
            rotationY: -180,
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut"
        }, delay);

        // Step 3: Back flips in (was at 180deg)
        heroTl.set(back, { rotationY: 180, opacity: 0, visibility: "visible" }, delay);
        heroTl.to(back, {
            rotationY: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.inOut"
        }, delay);
    };

    // =====================================
    // Word 1: "Animate" - sequential reveal
    // =====================================
    const word1Clips = heroWords[0].querySelectorAll(".clip");
    let word1Delay = 0;

    word1Clips.forEach((clip, index) => {
        if (clip.classList.contains("clip-3d")) {
            // a(4), i(2) are 3D
            animate3DLetter(clip, word1Delay);
        } else if (clip.classList.contains("clip-swap")) {
            // n(1), t(5) are swap
            animateSwapLetter(clip, word1Delay);
        } else {
            // A(0), m(3), e(6) are regular
            animateRegularLetter(clip, word1Delay);
        }
        word1Delay += 0.05; // 50ms stagger between letters
    });

    // =====================================
    // Word 2: "Anything" - starts after word 1
    // =====================================
    const word2Clips = heroWords[1].querySelectorAll(".clip");
    let word2Delay = word1Delay + 0.15; // Slight pause between words

    word2Clips.forEach((clip, index) => {
        if (clip.classList.contains("clip-3d")) {
            // y(2), i(5) are 3D
            animate3DLetter(clip, word2Delay);
        } else if (clip.classList.contains("clip-swap")) {
            // n(1), t(3), n(6) are swap
            animateSwapLetter(clip, word2Delay);
        } else {
            // A(0), h(4), g(7) are regular
            animateRegularLetter(clip, word2Delay);
        }
        word2Delay += 0.05;
    });

    // Subtle floating animation for entire title after reveal
    gsap.to(heroTitle, {
        y: -5,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2
    });

    // Continuous flip animation for 'i' in "Anything" - like gsap.com
    // Wait for entrance animation then start flipping
    setTimeout(() => {
        const wordAny = document.querySelectorAll(".word-animate")[1];
        const clipsAny = wordAny.querySelectorAll(".clip");
        const letterI = clipsAny[5]; // 0:A, 1:n, 2:y, 3:t, 4:h, 5:i
        const charI = letterI.querySelector(".char");

        // Set transform origin to center
        gsap.set(charI, { transformOrigin: "center center" });

        // Flip animation - 540 degrees, hold, then flip back
        const tl = gsap.timeline({ repeat: -1 });

        tl.to(charI, {
            rotationX: 540,
            duration: 2,
            ease: "power1.inOut"
        })
        .to(charI, {
            rotationX: 540,
            duration: 1.5 // hold
        })
        .to(charI, {
            rotationX: 0,
            duration: 2,
            ease: "power1.inOut"
        })
        .to(charI, {
            rotationX: 0,
            duration: 1.5 // hold
        });
    }, 2500);

    // Hover effect
    const allClips = heroTitle.querySelectorAll(".clip");
    allClips.forEach((clip) => {
        clip.addEventListener("mouseenter", () => {
            gsap.to(clip, { y: -3, duration: 0.2, ease: "power2.out" });
        });
        clip.addEventListener("mouseleave", () => {
            gsap.to(clip, { y: 0, duration: 0.2, ease: "power2.out" });
        });
    });

    // Animate subtitle with fade
    gsap.from(".hero-subtitle", {
        duration: 1,
        opacity: 0,
        y: 20,
        delay: 1.5,
        ease: "power2.out"
    });

    // =====================
    // Features Animations
    // =====================

    const featureCards = document.querySelectorAll(".feature-card");

    // Animate features title with word stagger
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

    // Animate feature card titles
    gsap.from(".feature-card h3", {
        scrollTrigger: {
            trigger: ".features-grid",
            start: "top 70%",
            toggleActions: "play none none reverse"
        },
        duration: 0.6,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out"
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

    // Demo animations in feature cards
    featureCards.forEach((card, index) => {
        const dots = card.querySelectorAll(".demo-dot");
        const colors = ["var(--green)", "var(--pink)", "var(--blue)", "var(--purple)"];

        // Continuous demo animation
        gsap.to(dots, {
            x: () => Math.random() * 40 - 20,
            y: () => Math.random() * 20 - 10,
            duration: 0.8 + Math.random() * 0.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: {
                each: 0.1,
                from: "random"
            }
        });

        // Click interaction
        card.addEventListener("click", () => {
            const isActive = card.classList.contains("active");

            // Close all other cards
            featureCards.forEach(c => {
                if (c !== card) {
                    c.classList.remove("active");
                    gsap.to(c, { scale: 1, duration: 0.3 });
                }
            });

            // Toggle this card
            if (isActive) {
                card.classList.remove("active");
                gsap.to(card, { scale: 1, duration: 0.3 });
            } else {
                card.classList.add("active");
                gsap.to(card, {
                    scale: 1.02,
                    duration: 0.3,
                    boxShadow: `0 20px 40px ${colors[index]}33`
                });
            }
        });
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

    // Animate showcase items as they enter view with 3D effect
    showcaseItems.forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                containerAnimation: tween,
                start: "left 90%",
                toggleActions: "play none none reverse"
            },
            duration: 0.8,
            scale: 0.6,
            opacity: 0,
            rotationY: 15,
            transformPerspective: 500,
            ease: "power3.out"
        });

        // Add hover effect
        item.addEventListener("mouseenter", () => {
            gsap.to(item, {
                scale: 1.05,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        item.addEventListener("mouseleave", () => {
            gsap.to(item, {
                scale: 1,
                duration: 0.4,
                ease: "power2.out"
            });
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

    // CTA button hover effect
    const ctaButton = document.querySelector(".cta-button");
    ctaButton.addEventListener("mouseenter", () => {
        gsap.to(ctaButton, {
            scale: 1.1,
            boxShadow: "0 0 60px rgba(10, 228, 72, 0.6)",
            duration: 0.3,
            ease: "power2.out"
        });
    });

    ctaButton.addEventListener("mouseleave", () => {
        gsap.to(ctaButton, {
            scale: 1,
            boxShadow: "0 0 30px rgba(10, 228, 72, 0.3)",
            duration: 0.3,
            ease: "power2.out"
        });
    });

    // Footer animation
    gsap.from("footer", {
        scrollTrigger: {
            trigger: "footer",
            start: "top 90%"
        },
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: "power2.out"
    });
});
