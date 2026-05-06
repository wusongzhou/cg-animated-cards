"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Tools.module.css";

export default function Tools() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const toolCards = sectionRef.current.querySelectorAll(`.${styles.toolCard}`);

    gsap.from(`.${styles.toolsTitle}, .${styles.toolsSubtitle}`, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
      },
      duration: 0.8,
      y: 40,
      opacity: 0,
      stagger: 0.1,
      ease: "power3.out",
    });

    gsap.from(toolCards, {
      scrollTrigger: {
        trigger: `.${styles.toolsGrid}`,
        start: "top 75%",
      },
      duration: 0.8,
      y: 60,
      opacity: 0,
      stagger: 0.1,
      ease: "power3.out",
    });

    toolCards.forEach((card, index) => {
      gsap.to(card, {
        y: -5,
        duration: 2 + index * 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.2,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.tools}>
      <h2 className={styles.toolsTitle}>GSAP <span>Tools</span></h2>
      <p className={styles.toolsSubtitle}>Powerful plugins for every animation need</p>
      <div className={styles.toolsGrid}>
        <a href="#" className={styles.toolCard}>
          <div className={styles.toolIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 12h6l3-9 3 18 3-9h6" />
            </svg>
          </div>
          <h3>Scroll</h3>
          <p>ScrollTrigger &amp; more</p>
        </a>
        <a href="#" className={styles.toolCard}>
          <div className={styles.toolIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M8 12l2 2 4-4" />
            </svg>
          </div>
          <h3>SVG</h3>
          <p>MorphSVG, DrawSVG &amp; more</p>
        </a>
        <a href="#" className={styles.toolCard}>
          <div className={styles.toolIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7V4h16v3" />
              <path d="M9 20h6" />
              <path d="M12 4v16" />
            </svg>
          </div>
          <h3>Text</h3>
          <p>SplitText &amp; more</p>
        </a>
        <a href="#" className={styles.toolCard}>
          <div className={styles.toolIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </div>
          <h3>UI</h3>
          <p>Flip, Observer &amp; more</p>
        </a>
      </div>
    </section>
  );
}
