"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./Cta.module.css";

export default function Cta() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP((context, contextSafe) => {
    if (!sectionRef.current) return;

    gsap.from(`.${styles.ctaTitle}`, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
      duration: 1,
      y: 60,
      opacity: 0,
      ease: "power3.out",
    });

    const ctaButton = sectionRef.current.querySelector(`.${styles.ctaButton}`) as HTMLElement;
    if (!ctaButton) return;

    gsap.from(ctaButton, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
        toggleActions: "play none none reverse",
      },
      duration: 0.8,
      scale: 0,
      opacity: 0,
      ease: "back.out(1.7)",
      delay: 0.3,
    });

    const glowTween = gsap.to(ctaButton, {
      boxShadow: "0 0 30px rgba(10, 228, 72, 0.3)",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onLeave: () => glowTween.pause(),
        onEnterBack: () => glowTween.resume(),
      },
    });

    const cs = contextSafe ?? ((fn: () => void) => fn);
    const onEnter = cs(() => {
      gsap.to(ctaButton, {
        scale: 1.1,
        boxShadow: "0 0 60px rgba(10, 228, 72, 0.6)",
        duration: 0.3,
        ease: "power2.out",
      });
    });
    const onLeave = cs(() => {
      gsap.to(ctaButton, {
        scale: 1,
        boxShadow: "0 0 30px rgba(10, 228, 72, 0.3)",
        duration: 0.3,
        ease: "power2.out",
      });
    });
    ctaButton.addEventListener("mouseenter", onEnter);
    ctaButton.addEventListener("mouseleave", onLeave);

    return () => {
      ctaButton.removeEventListener("mouseenter", onEnter);
      ctaButton.removeEventListener("mouseleave", onLeave);
    };
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.cta}>
      <h2 className={styles.ctaTitle}>Ready to <span>animate</span>?</h2>
      <a href="https://gsap.com" target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
        Get Started
      </a>
    </section>
  );
}
