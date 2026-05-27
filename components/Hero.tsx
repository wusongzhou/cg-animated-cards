"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./Hero.module.css";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP((context, contextSafe) => {
    if (!heroRef.current) return;

    const heroTitle = heroRef.current.querySelector(`.${styles.heroTitle}`);
    if (!heroTitle) return;

    const heroWords = heroTitle.querySelectorAll(`.${styles.wordAnimate}`);
    if (heroWords.length === 0) return;

    // Nav animation
    const nav = document.querySelector("nav");
    if (nav) {
      gsap.from(nav, {
        duration: 1,
        y: -100,
        opacity: 0,
        ease: "power3.out",
      });
    }

    // Scroll indicator animation
    const scrollIndicator = heroRef.current.querySelector(`.${styles.scrollIndicator}`);
    const onScrollClick = () => {
      const target = document.querySelector(".why-gsap");
      if (target) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top: targetPosition, behavior: "smooth" });
      }
    };
    if (scrollIndicator) {
      gsap.from(scrollIndicator, {
        duration: 1,
        opacity: 0,
        y: 20,
        delay: 2.2,
        ease: "power2.out",
      });
      scrollIndicator.addEventListener("click", onScrollClick);
    }

    // Timeline for title animation
    const heroTl = gsap.timeline({ delay: 0.3 });

    // Helper: animate regular letters (clip reveal from bottom)
    const animateRegularLetter = (clip: Element, delay: number) => {
      const char = clip.querySelector(`.${styles.char}`);
      if (!char) return;
      gsap.set(char, { y: "100%", opacity: 0 });
      heroTl.to(char, {
        y: "0%",
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
      }, delay);
    };

    // Helper: animate 3D letters (a, i, y)
    const animate3DLetter = (clip: Element, delay: number) => {
      const char = clip.querySelector(`.${styles.char}`);
      if (!char) return;
      gsap.set(char, { rotationX: -90, y: "100%", opacity: 0, transformOrigin: "center bottom" });
      heroTl.to(char, {
        rotationX: 0,
        y: "0%",
        opacity: 1,
        duration: 0.7,
        ease: "power4.out",
      }, delay);
    };

    // Helper: animate swap letters (n, t) - Y-axis flip
    const animateSwapLetter = (clip: Element, delay: number) => {
      const front = clip.querySelector(`.${styles.charFront}`);
      const back = clip.querySelector(`.${styles.charBack}`);
      if (!front || !back) return;

      heroTl.set(front, { opacity: 1, visibility: "visible", rotationY: 0 }, delay);
      heroTl.to(front, {
        rotationY: -180,
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
      }, delay);
      heroTl.set(back, { rotationY: 180, opacity: 0, visibility: "visible" }, delay);
      heroTl.to(back, {
        rotationY: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.inOut",
      }, delay);
    };

    // Word 1: "Animate"
    const word1Clips = heroWords[0].querySelectorAll(`.${styles.clip}`);
    let word1Delay = 0;

    word1Clips.forEach((clip) => {
      if (clip.classList.contains(styles.clip3d)) {
        animate3DLetter(clip, word1Delay);
      } else if (clip.classList.contains(styles.clipSwap)) {
        animateSwapLetter(clip, word1Delay);
      } else {
        animateRegularLetter(clip, word1Delay);
      }
      word1Delay += 0.05;
    });

    // Word 2: "Anything"
    const word2Clips = heroWords[1].querySelectorAll(`.${styles.clip}`);
    let word2Delay = word1Delay + 0.15;

    word2Clips.forEach((clip) => {
      if (clip.classList.contains(styles.clip3d)) {
        animate3DLetter(clip, word2Delay);
      } else if (clip.classList.contains(styles.clipSwap)) {
        animateSwapLetter(clip, word2Delay);
      } else {
        animateRegularLetter(clip, word2Delay);
      }
      word2Delay += 0.05;
    });

    // Floating animation for title
    gsap.to(heroTitle, {
      y: -5,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2,
    });

    // Continuous flip animation for 'i' in "Anything"
    gsap.delayedCall(2.5, () => {
      const wordAny = heroWords[1];
      const clipsAny = wordAny.querySelectorAll(`.${styles.clip}`);
      const letterI = clipsAny[5]; // 0:A, 1:n, 2:y, 3:t, 4:h, 5:i
      if (!letterI) return;
      const charI = letterI.querySelector(`.${styles.char}`);
      if (!charI) return;

      gsap.set(charI, { transformOrigin: "center center" });

      const tl = gsap.timeline({ repeat: -1 });
      tl.to(charI, { rotationX: 540, duration: 2, ease: "power1.inOut" })
        .to(charI, { rotationX: 540, duration: 1.5 })
        .to(charI, { rotationX: 0, duration: 2, ease: "power1.inOut" })
        .to(charI, { rotationX: 0, duration: 1.5 });
    });

    // Hover effect on all clips
    const allClips = heroTitle.querySelectorAll(`.${styles.clip}`);
    const hoverHandlers: Array<{ el: Element; enter: () => void; leave: () => void }> = [];
    allClips.forEach((clip) => {
      const enter = contextSafe(() => { gsap.to(clip, { y: -3, duration: 0.2, ease: "power2.out" }); });
      const leave = contextSafe(() => { gsap.to(clip, { y: 0, duration: 0.2, ease: "power2.out" }); });
      clip.addEventListener("mouseenter", enter);
      clip.addEventListener("mouseleave", leave);
      hoverHandlers.push({ el: clip, enter, leave });
    });

    // Subtitle animation
    const subtitle = heroRef.current.querySelector(`.${styles.heroSubtitle}`);
    if (subtitle) {
      gsap.from(subtitle, {
        duration: 1,
        opacity: 0,
        y: 20,
        delay: 1.5,
        ease: "power2.out",
      });
    }

    return () => {
      if (scrollIndicator) scrollIndicator.removeEventListener("click", onScrollClick);
      hoverHandlers.forEach(({ el, enter, leave }) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, { scope: heroRef });

  return (
    <section ref={heroRef} className={styles.hero}>
      <h1 className={styles.heroTitle}>
        {/* Word 1: Animate */}
        <span className={styles.wordAnimate}>
          <span className={styles.clip}><span className={styles.char}>A</span></span>
          <span className={`${styles.clip} ${styles.clipSwap}`}>
            <span className={styles.char}>
              <span className={styles.charFront}>n</span>
              <span className={styles.charBack}>n</span>
            </span>
          </span>
          <span className={`${styles.clip} ${styles.clip3d}`}><span className={styles.char}>i</span></span>
          <span className={styles.clip}><span className={styles.char}>m</span></span>
          <span className={`${styles.clip} ${styles.clip3d}`}><span className={styles.char}>a</span></span>
          <span className={`${styles.clip} ${styles.clipSwap}`}>
            <span className={styles.char}>
              <span className={styles.charFront}>t</span>
              <span className={styles.charBack}>t</span>
            </span>
          </span>
          <span className={styles.clip}><span className={styles.char}>e</span></span>
        </span>
        {/* Word 2: Anything */}
        <span className={styles.wordAnimate}>
          <span className={styles.clip}><span className={styles.char}>A</span></span>
          <span className={`${styles.clip} ${styles.clipSwap}`}>
            <span className={styles.char}>
              <span className={styles.charFront}>n</span>
              <span className={styles.charBack}>n</span>
            </span>
          </span>
          <span className={`${styles.clip} ${styles.clip3d}`}><span className={styles.char}>y</span></span>
          <span className={`${styles.clip} ${styles.clipSwap}`}>
            <span className={styles.char}>
              <span className={styles.charFront}>t</span>
              <span className={styles.charBack}>t</span>
            </span>
          </span>
          <span className={styles.clip}><span className={styles.char}>h</span></span>
          <span className={`${styles.clip} ${styles.clip3d}`}><span className={styles.char}>i</span></span>
          <span className={`${styles.clip} ${styles.clipSwap}`}>
            <span className={styles.char}>
              <span className={styles.charFront}>n</span>
              <span className={styles.charBack}>n</span>
            </span>
          </span>
          <span className={styles.clip}><span className={styles.char}>g</span></span>
        </span>
      </h1>
      <p className={styles.heroSubtitle}>{'{ The animation platform that pushes the limits }'}</p>
      <div className={styles.scrollIndicator}>
        <div className={styles.mouse}></div>
        <span>Scroll</span>
      </div>
    </section>
  );
}
