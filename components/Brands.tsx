"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Brands.module.css";

const brandNames = ["Netflix", "Adobe", "Microsoft", "Spotify", "Nike", "Apple", "Google", "Amazon"];

export default function Brands() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(`.${styles.brandsLabel}`, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      },
      duration: 0.8,
      y: 20,
      opacity: 0,
      ease: "power2.out",
    });

    gsap.from(`.${styles.brandItem}`, {
      scrollTrigger: {
        trigger: `.${styles.brandsTrack}`,
        start: "top 90%",
      },
      duration: 0.6,
      opacity: 0,
      stagger: 0.05,
      ease: "power2.out",
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

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
