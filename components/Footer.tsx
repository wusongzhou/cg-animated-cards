"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./Footer.module.css";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!footerRef.current) return;

    gsap.from(footerRef.current, {
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      duration: 0.8,
      y: 30,
      opacity: 0,
      ease: "power2.out",
    });
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className={styles.footer}>
      <p>Built with GSAP &amp; ScrollTrigger</p>
    </footer>
  );
}
