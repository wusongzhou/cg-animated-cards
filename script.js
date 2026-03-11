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

    // Scroll indicator click - smooth scroll to why-gsap
    document.querySelector(".scroll-indicator").addEventListener("click", () => {
        const target = document.querySelector(".why-gsap");
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
    // Why GSAP Section - Enhanced Horizontal Scroll (GSAP.com style)
    // =====================

    const whyGsapSection = document.querySelector(".why-gsap");
    const whyTrack = document.querySelector(".why-gsap-track");
    const whyCards = document.querySelectorAll(".why-card");
    const whyTitle = document.querySelector(".why-gsap-title");

    // Create horizontal scroll animation - more distance for 3 cards
    const whyScrollAmount = () => {
        // Each card needs more scroll distance to fully appear
        return -(whyTrack.scrollWidth - window.innerWidth * 0.2);
    };

    // Track current active card
    let currentWhyCard = 0;
    let whyAnimated = false;
    function initWhyCards() {
        whyCards.forEach((card, index) => {
            if (index === 0) {
                // First card - visible
                gsap.set(card, { opacity: 1, scale: 1, rotationY: 0 });
            } else if (index === 1) {
                // Second card - slightly visible on right
                gsap.set(card, { opacity: 0.5, scale: 0.98, rotationY: -2 });
            } else {
                // Other cards - hidden
                gsap.set(card, { opacity: 0, scale: 0.9, rotationY: -5 });
            }
        });
    }

    // Initialize on load
    initWhyCards();
    
    // Track which cards have been animated
    let animatedCards = new Set();

    // Function to trigger animation based on scroll progress
    function checkAndAnimateCards(self) {
        const totalCards = whyCards.length;
        const cardThreshold = 1 / totalCards;
        
        whyCards.forEach((card, index) => {
            // Each card has a progress range: 0-0.33, 0.33-0.66, 0.66-1.0
            const cardStart = index * cardThreshold * 0.9;
            const cardEnd = cardStart + cardThreshold;
            
            const shouldAnimate = self.progress >= cardStart && self.progress < cardEnd;
            
            if (shouldAnimate && !animatedCards.has(index)) {
                animatedCards.add(index);
                
                gsap.to(card, {
                    opacity: 1,
                    scale: 1,
                    rotationY: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                console.log(`✓ Animating card ${index}, progress=${self.progress.toFixed(2)}, range=[${cardStart.toFixed(2)}-${cardEnd.toFixed(2)}]`);
                animateCardContent(card, index, true);
            }
        });
    }

    // Initialize first card immediately
    setTimeout(() => {
        animatedCards.add(0);
        animateCardContent(whyCards[0], 0, true);
    }, 100);

    // Horizontal scroll tween
    const whyTween = gsap.to(whyTrack, {
        x: whyScrollAmount,
        ease: "none",
        scrollTrigger: {
            trigger: whyGsapSection,
            start: "top top",
            // More scroll distance so each card takes time to appear
            end: () => `+=${whyTrack.scrollWidth * 2.2}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            toggleActions: "play none none none",
            onEnter: () => {
                // Trigger background animation on first enter
            },
            onUpdate: (self) => {
                // Check and animate cards
                checkAndAnimateCards(self);
                
                // Simple: just show cards based on progress
                const totalCards = whyCards.length;
                
                whyCards.forEach((card, index) => {
                    const cardStart = index / totalCards;
                    const cardEnd = (index + 1) / totalCards;
                    
                    // Current card is fully visible
                    if (self.progress >= cardStart && self.progress < cardEnd) {
                        gsap.to(card, {
                            opacity: 1,
                            scale: 1,
                            rotationY: 0,
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    }
                    // Previous cards fade out
                    else if (self.progress < cardStart) {
                        gsap.to(card, {
                            opacity: 0,
                            duration: 0.2
                        });
                    }
                    // Next cards
                    else {
                        gsap.to(card, {
                            opacity: 0,
                            duration: 0.2
                        });
                    }
                });
            }
        }
    });

    // Function to animate card content - animate each time card becomes active
    function animateCardContent(card, index, isEntering = false) {
        // Only animate when entering (not during scroll)
        if (!isEntering) {
            return;
        }
        
        // Kill any existing animations on this card's elements
        gsap.killTweensOf(card.querySelectorAll(".title-char"));
        gsap.killTweensOf(card.querySelector(".why-subtitle"));
        gsap.killTweensOf(card.querySelector(".why-desc"));
        gsap.killTweensOf(card.querySelector(".why-tags"));
        gsap.killTweensOf(card.querySelector(".why-card-visual"));
        
        const subtitle = card.querySelector(".why-subtitle");
        const desc = card.querySelector(".why-desc");
        const tags = card.querySelector(".why-tags");
        const visual = card.querySelector(".why-card-visual");
        const chars = card.querySelectorAll(".title-char");
        
        // Subtitle animation - smooth fade in
        if (subtitle) {
            gsap.fromTo(subtitle, 
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
            );
        }
        
        // Animate each character with staggered delay
        if (chars.length > 0) {
            chars.forEach((char, i) => {
                gsap.fromTo(char, 
                    { opacity: 0, y: 80, rotationX: -60, scale: 0.8 },
                    { opacity: 1, y: 0, rotationX: 0, scale: 1, duration: 0.8, delay: i * 0.03 + 0.1, ease: "elastic.out(1, 0.5)" }
                );
            });
        }
        
        // Description animation
        if (desc) {
            gsap.fromTo(desc,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, delay: chars.length * 0.03 + 0.3, ease: "power2.out" }
            );
        }
        
        // Tags animation
        if (tags) {
            const tagSpans = tags.querySelectorAll("span");
            gsap.fromTo(tagSpans, 
                { opacity: 0, y: 20, scale: 0.8 },
                { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, delay: chars.length * 0.03 + 0.4, ease: "back.out(1.7)" }
            );
        }
        
        // Visual animation
        if (visual) {
            gsap.fromTo(visual, 
                { scale: 0.5, opacity: 0, rotation: -30 },
                { scale: 1, opacity: 1, rotation: 0, duration: 1, delay: 0.2, ease: "elastic.out(1, 0.6)" }
            );
        }
    }

    // Function to reset/hide card content for smooth transition
    function resetCardContent(card) {
        const subtitle = card.querySelector(".why-subtitle");
        const desc = card.querySelector(".why-desc");
        const tags = card.querySelector(".why-tags");
        const visual = card.querySelector(".why-card-visual");
        const chars = card.querySelectorAll(".title-char");
        
        gsap.to(subtitle, { opacity: 0, duration: 0.2 });
        gsap.to(chars, { opacity: 0, duration: 0.2 });
        gsap.to(desc, { opacity: 0, duration: 0.2 });
        gsap.to(tags.querySelectorAll("span"), { opacity: 0, duration: 0.2 });
        gsap.to(visual, { opacity: 0, duration: 0.2 });
    }

    // Add hover effect to cards
    whyCards.forEach((card, index) => {
        card.addEventListener("mouseenter", () => {
            gsap.to(card, {
                scale: 1.02,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        card.addEventListener("mouseleave", () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.4,
                ease: "power2.out"
            });
        });
    });

    // Parallax effect on background shapes
    gsap.to(".why-shape--1", {
        y: 100,
        ease: "none",
        scrollTrigger: {
            trigger: whyGsapSection,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });

    gsap.to(".why-shape--2", {
        y: -80,
        ease: "none",
        scrollTrigger: {
            trigger: whyGsapSection,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });

    gsap.to(".why-shape--3", {
        y: 60,
        ease: "none",
        scrollTrigger: {
            trigger: whyGsapSection,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });

    // =====================
    // Tools Animations
    // =====================

    const toolCards = document.querySelectorAll(".tool-card");

    // Animate tools title
    gsap.from(".tools-title, .tools-subtitle", {
        scrollTrigger: {
            trigger: ".tools",
            start: "top 70%"
        },
        duration: 0.8,
        y: 40,
        opacity: 0,
        stagger: 0.1,
        ease: "power3.out"
    });

    // Animate tool cards with stagger
    gsap.from(toolCards, {
        scrollTrigger: {
            trigger: ".tools-grid",
            start: "top 75%"
        },
        duration: 0.8,
        y: 60,
        opacity: 0,
        stagger: 0.1,
        ease: "power3.out"
    });

    // Continuous floating animation for tool cards
    toolCards.forEach((card, index) => {
        gsap.to(card, {
            y: -5,
            duration: 2 + index * 0.3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.2
        });
    });

    // =====================
    // Brands Animations
    // =====================

    gsap.from(".brands-label", {
        scrollTrigger: {
            trigger: ".brands",
            start: "top 80%"
        },
        duration: 0.8,
        y: 20,
        opacity: 0,
        ease: "power2.out"
    });

    gsap.from(".brand-item", {
        scrollTrigger: {
            trigger: ".brands-track",
            start: "top 90%"
        },
        duration: 0.6,
        opacity: 0,
        stagger: 0.05,
        ease: "power2.out"
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
