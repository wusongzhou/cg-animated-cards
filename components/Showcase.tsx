"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Showcase.module.css";

const showcaseData = [
  { title: "ScrollTrigger", desc: "Scroll-driven animations made easy" },
  { title: "MorphSVG", desc: "Seamlessly morph any path into another" },
  { title: "Flip", desc: "State-based animation transitions" },
  { title: "CustomEases", desc: "Total control over motion curves" },
];

export default function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const showcaseWrapper = sectionRef.current.querySelector(`.${styles.wrapper}`) as HTMLElement;
    const showcaseItems = sectionRef.current.querySelectorAll(`.${styles.item}`);

    if (!showcaseWrapper) return;

    const getScrollAmount = () => {
      return -(showcaseWrapper.scrollWidth - window.innerWidth);
    };

    const tween = gsap.to(showcaseWrapper, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${showcaseWrapper.scrollWidth - window.innerWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    showcaseItems.forEach((item) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          containerAnimation: tween,
          start: "left 90%",
          toggleActions: "play none none reverse",
        },
        duration: 0.8,
        scale: 0.6,
        opacity: 0,
        rotationY: 15,
        transformPerspective: 500,
        ease: "power3.out",
      });

      item.addEventListener("mouseenter", () => {
        gsap.to(item, { scale: 1.05, duration: 0.4, ease: "power2.out" });
      });

      item.addEventListener("mouseleave", () => {
        gsap.to(item, { scale: 1, duration: 0.4, ease: "power2.out" });
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.showcase}>
      <div className={styles.wrapper}>
        {showcaseData.map((item, i) => (
          <div key={i} className={`${styles.item} ${styles[`item${i + 1}`]}`}>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
