"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./Brands.module.css";

const brandNames = ["Netflix", "Adobe", "Microsoft", "Spotify", "Nike", "Apple", "Google", "Amazon"];

export default function Brands() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    gsap.from(`.${styles.brandsLabel}`, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      duration: 0.8,
      y: 20,
      opacity: 0,
      ease: "power2.out",
    });

    gsap.from(`.${styles.brandItem}`, {
      scrollTrigger: {
        trigger: sectionRef.current.querySelector(`.${styles.brandsTrack}`),
        start: "top 90%",
        toggleActions: "play none none none",
      },
      duration: 0.6,
      opacity: 0,
      stagger: 0.05,
      ease: "power2.out",
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.brands}>
      <p className={styles.brandsLabel}>Trusted by innovative teams worldwide</p>
      <div className={styles.brandsTrack}>
        {[...brandNames, ...brandNames].map((name, i) => (
          <div key={i} className={styles.brandItem}>{name}</div>
        ))}
      </div>
    </section>
  );
}
