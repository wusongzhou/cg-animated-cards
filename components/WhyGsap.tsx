"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./WhyGsap.module.css";

export default function WhyGsap() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const whyGsapSection = sectionRef.current;
    const whyTrack = whyGsapSection.querySelector(`.${styles.track}`) as HTMLElement;
    const whyCards = whyGsapSection.querySelectorAll(`.${styles.card}`);
    const whyTitle = whyGsapSection.querySelector(`.${styles.sectionTitle}`);

    if (!whyTrack || whyCards.length === 0) return;

    // Show title
    if (whyTitle) {
      gsap.to(whyTitle, {
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: whyGsapSection,
          start: "top 80%",
        },
      });
    }

    // Calculate scroll amount
    const whyScrollAmount = () => {
      const cardWidth = (whyCards[0] as HTMLElement).offsetWidth;
      const gap = 48;
      return -((cardWidth * 2) + (gap * 3));
    };

    // Animated cards tracking
    const animatedCards = new Set<number>();

    function animateCardContent(card: Element, _index: number) {
      const subtitle = card.querySelector(`.${styles.subtitle}`);
      const desc = card.querySelector(`.${styles.desc}`);
      const tags = card.querySelector(`.${styles.tags}`);
      const visual = card.querySelector(`.${styles.cardVisual}`);
      const chars = card.querySelectorAll(`.${styles.titleChar}`);

      gsap.killTweensOf([subtitle, desc, tags, visual, ...chars].filter(Boolean) as Element[]);

      const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

      if (subtitle) {
        tl.fromTo(subtitle,
          { opacity: 0, x: -60, scale: 0.9 },
          { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "power2.out" },
          0
        );
      }

      if (chars.length > 0) {
        chars.forEach((char, i) => {
          tl.fromTo(char,
            { opacity: 0, y: 60, rotationX: -45, scale: 0.9 },
            { opacity: 1, y: 0, rotationX: 0, scale: 1, duration: 0.5, ease: "power2.out" },
            0.1 + i * 0.04
          );
        });
      }

      if (desc) {
        tl.fromTo(desc,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          0.3
        );
      }

      if (tags) {
        const tagSpans = tags.querySelectorAll("span");
        tl.fromTo(tagSpans,
          { opacity: 0, y: 20, scale: 0.8 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.08, ease: "back.out(1.5)" },
          0.4
        );
      }

      if (visual) {
        tl.fromTo(visual,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 0.6, duration: 0.6, ease: "power2.out" },
          0.2
        );
      }

      return tl;
    }

    // Initialize first 2 cards
    whyCards.forEach((card, index) => {
      if (index < 2) {
        gsap.fromTo(card,
          { opacity: 0, scale: 0.9, rotationY: index === 0 ? -15 : 15, x: index === 0 ? -50 : 50 },
          { opacity: 1, scale: 1, rotationY: 0, x: 0, duration: 0.8, delay: index * 0.15, ease: "power3.out" }
        );
      } else {
        gsap.set(card, { opacity: 0, scale: 0.85, rotationY: -8 });
      }
    });

    setTimeout(() => {
      animatedCards.add(0);
      animatedCards.add(1);
      animateCardContent(whyCards[0], 0);
      animateCardContent(whyCards[1], 1);
    }, 100);

    let currentRow = "first";
    let isAnimating = false;

    // Horizontal scroll tween
    gsap.to(whyTrack, {
      x: whyScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: whyGsapSection,
        start: "top top",
        end: () => `+=${whyTrack.scrollWidth - window.innerWidth * 0.3}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        toggleActions: "play none none none",
        onUpdate: (self) => {
          if (isAnimating) return;

          const progress = self.progress;
          const isFirstRow = progress < 0.5;
          const targetRow = isFirstRow ? "first" : "second";

          if (currentRow !== targetRow) {
            isAnimating = true;
            currentRow = targetRow;

            if (isFirstRow) {
              gsap.to([whyCards[0], whyCards[1]], {
                opacity: 1, visibility: "visible", duration: 0.4, ease: "power2.out",
              });
              gsap.to([whyCards[2], whyCards[3]], {
                opacity: 0, visibility: "hidden", duration: 0.3, ease: "power2.in",
                onComplete: () => { isAnimating = false; },
              });
              animateCardContent(whyCards[0], 0);
              animateCardContent(whyCards[1], 1);
            } else {
              gsap.to([whyCards[0], whyCards[1]], {
                opacity: 0, visibility: "hidden", duration: 0.3, ease: "power2.in",
              });
              gsap.to([whyCards[2], whyCards[3]], {
                opacity: 1, visibility: "visible", duration: 0.4, ease: "power2.out",
                onComplete: () => { isAnimating = false; },
              });
              if (!animatedCards.has(2)) {
                animatedCards.add(2);
                animateCardContent(whyCards[2], 2);
              }
              if (!animatedCards.has(3)) {
                animatedCards.add(3);
                animateCardContent(whyCards[3], 3);
              }
            }
          }
        },
      },
    });

    // Hover effects
    whyCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, { scale: 1.02, duration: 0.4, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { scale: 1, duration: 0.4, ease: "power2.out" });
      });
    });

    // Parallax on background shapes
    const shapes = whyGsapSection.querySelectorAll(`.${styles.shape}`);
    shapes.forEach((shape, i) => {
      const yValues = [100, -80, 60];
      gsap.to(shape, {
        y: yValues[i] || 0,
        ease: "none",
        scrollTrigger: {
          trigger: whyGsapSection,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={`${styles.whyGsap} why-gsap`}>
      <div className={styles.bg}>
        <div className={`${styles.shape} ${styles.shape1}`}></div>
        <div className={`${styles.shape} ${styles.shape2}`}></div>
        <div className={`${styles.shape} ${styles.shape3}`}></div>
        <div className={styles.grid}></div>
      </div>

      <h2 className={styles.sectionTitle}>{'{ Why GSAP\u00AE }'}</h2>

      <div className={styles.wrapper}>
        <div className={styles.track}>
          {/* Card 1 */}
          <div className={`${styles.card} ${styles.card1}`}>
            <div className={styles.cardVisual}>
              <div className={styles.visualCircle}></div>
              <div className={styles.visualRing}></div>
              <div className={styles.visualDot}></div>
            </div>
            <span className={styles.subtitle}>That&apos;s right,</span>
            <h2 className={styles.title}>
              <span className={styles.titleWord}>
                {"Animate".split("").map((ch, i) => (
                  <span key={i} className={styles.titleChar} style={{ "--i": i + 1 } as React.CSSProperties}>{ch}</span>
                ))}
              </span>
              <br />
              <span className={styles.titleWord}>
                {"Anything".split("").map((ch, i) => (
                  <span key={i} className={styles.titleChar} style={{ "--i": i + 8 } as React.CSSProperties}>{ch}</span>
                ))}
              </span>
            </h2>
            <p className={styles.desc}>Whether you&apos;re animating UI, SVG or creating immersive WebGL experiences, GSAP has your back.</p>
            <div className={styles.tags}>
              <span>UI</span><span>SVG</span><span>WebGL</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className={`${styles.card} ${styles.card2}`}>
            <div className={styles.cardVisual}>
              <div className={styles.visualWave}></div>
              <div className={styles.visualWave}></div>
              <div className={styles.visualWave}></div>
            </div>
            <span className={styles.subtitle}>Add personality with</span>
            <h2 className={styles.title}>
              <span className={styles.titleWord}>
                {"Nice".split("").map((ch, i) => (
                  <span key={i} className={styles.titleChar} style={{ "--i": i + 1 } as React.CSSProperties}>{ch}</span>
                ))}
              </span>
              <br />
              <span className={styles.titleWord}>
                {"and".split("").map((ch, i) => (
                  <span key={i} className={styles.titleChar} style={{ "--i": i + 5 } as React.CSSProperties}>{ch}</span>
                ))}
              </span>
              <br />
              <span className={styles.titleWord}>
                {"Easy".split("").map((ch, i) => (
                  <span key={i} className={styles.titleChar} style={{ "--i": i + 8 } as React.CSSProperties}>{ch}</span>
                ))}
              </span>
              <br />
              <span className={styles.titleWord}>
                {"Easing".split("").map((ch, i) => (
                  <span key={i} className={styles.titleChar} style={{ "--i": i + 12 } as React.CSSProperties}>{ch}</span>
                ))}
              </span>
            </h2>
            <p className={styles.desc}>A huge variety of super plug-and-play eases, or build your own custom curves.</p>
            <div className={styles.tags}>
              <span>Eases</span><span>Custom</span><span>Curves</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className={`${styles.card} ${styles.card3}`}>
            <div className={styles.cardVisual}>
              <div className={styles.visualSequence}>
                <span></span><span></span><span></span><span></span>
              </div>
            </div>
            <span className={styles.subtitle}>Arrange, Control and Choreograph</span>
            <h2 className={styles.title}>
              <span className={styles.titleWord}>
                {"Sequence".split("").map((ch, i) => (
                  <span key={i} className={styles.titleChar} style={{ "--i": i + 1 } as React.CSSProperties}>{ch}</span>
                ))}
              </span>
              <br />
              <span className={styles.titleWord}>
                {"With".split("").map((ch, i) => (
                  <span key={i} className={styles.titleChar} style={{ "--i": i + 9 } as React.CSSProperties}>{ch}</span>
                ))}
              </span>
              <br />
              <span className={styles.titleWord}>
                {"Ease".split("").map((ch, i) => (
                  <span key={i} className={styles.titleChar} style={{ "--i": i + 13 } as React.CSSProperties}>{ch}</span>
                ))}
              </span>
            </h2>
            <p className={styles.desc}>Create complex sequences with precise timing control. Use labels, offsets, and nested timelines to build sophisticated animations that would be impossible with other tools.</p>
            <div className={styles.tags}>
              <span>Timeline</span><span>Labels</span><span>Nested</span><span>Offsets</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className={`${styles.card} ${styles.card4}`}>
            <div className={styles.cardVisual}>
              <div className={styles.visualPlugin}>
                <span></span><span></span><span></span><span></span>
              </div>
            </div>
            <span className={styles.subtitle}>Supercharge with Professional</span>
            <h2 className={styles.title}>
              <span className={styles.titleWord}>
                {"Plugins".split("").map((ch, i) => (
                  <span key={i} className={styles.titleChar} style={{ "--i": i + 1 } as React.CSSProperties}>{ch}</span>
                ))}
              </span>
              <br />
              <span className={styles.titleWord}>
                {"&Tools".split("").map((ch, i) => (
                  <span key={i} className={styles.titleChar} style={{ "--i": i + 8 } as React.CSSProperties}>{ch}</span>
                ))}
              </span>
            </h2>
            <p className={styles.desc}>Unlock advanced capabilities with GSAP&apos;s premium plugins. From scroll-driven animations to complex SVG morphing, state transitions, and beyond.</p>
            <div className={styles.tags}>
              <span>ScrollTrigger</span><span>MorphSVG</span><span>Flip</span><span>SplitText</span><span>Observer</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
