"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./WhyGsap.module.css";

export default function WhyGsap() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

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

    // Animated cards tracking
    const animatedCards = new Set<number>();

    function animateCardContent(card: Element) {
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

    // Initialize all cards hidden with 3D transforms
    whyCards.forEach((card, index) => {
      if (index < 2) {
        gsap.set(card, { opacity: 0, scale: 0.85, x: -120, rotationY: -20 });
      } else {
        gsap.set(card, { opacity: 0, scale: 0.85, x: 120, rotationY: 15 });
      }
    });

    // ============================================================
    // Per-card particle effects
    // ============================================================
    function getCardCenter(card: Element) {
      const rect = card.getBoundingClientRect();
      const sectionRect = whyGsapSection.getBoundingClientRect();
      return {
        cx: rect.left - sectionRect.left + rect.width / 2,
        cy: rect.top - sectionRect.top + rect.height / 2,
      };
    }

    function spawnCard1Particles(card: Element) {
      const { cx, cy } = getCardCenter(card);
      for (let i = 0; i < 20; i++) {
        const p = document.createElement("div");
        p.className = styles.particle;
        const size = gsap.utils.random(4, 10);
        const color = ["#4EFFAF", "#7DFFCF", "#2BFF8F"][Math.floor(Math.random() * 3)];
        const angle = gsap.utils.random(0, Math.PI * 2);
        const dist = gsap.utils.random(100, 300);
        gsap.set(p, { left: cx, top: cy, width: size, height: size, backgroundColor: color,
          boxShadow: `0 0 ${size * 4}px ${color}`, scale: 0, borderRadius: "50%" });
        whyGsapSection.appendChild(p);
        gsap.to(p, {
          left: cx + Math.cos(angle) * dist, top: cy + Math.sin(angle) * dist,
          scale: gsap.utils.random(0.5, 2), opacity: 0,
          rotation: gsap.utils.random(-360, 360),
          duration: gsap.utils.random(0.8, 1.5), ease: "power2.out",
          delay: gsap.utils.random(0, 0.2), onComplete: () => p.remove(),
        });
      }
    }

    function spawnCard2Particles(card: Element) {
      const { cx, cy } = getCardCenter(card);
      for (let i = 0; i < 15; i++) {
        const p = document.createElement("div");
        p.className = styles.particle;
        const size = gsap.utils.random(3, 7);
        const color = ["#64B4FF", "#4A9EFF", "#8FD4FF"][Math.floor(Math.random() * 3)];
        gsap.set(p, {
          left: cx - gsap.utils.random(100, 200), top: cy + gsap.utils.random(-100, 100),
          width: size, height: size, backgroundColor: color,
          boxShadow: `0 0 ${size * 3}px ${color}`, scale: 0, borderRadius: "50%",
        });
        whyGsapSection.appendChild(p);
        gsap.to(p, {
          left: cx + gsap.utils.random(200, 400),
          keyframes: [
            { top: cy + gsap.utils.random(-60, -30), scale: 1.5, duration: 0.4 },
            { top: cy + gsap.utils.random(30, 60), scale: 1, duration: 0.4 },
            { top: cy, scale: 0.5, opacity: 0, duration: 0.4 },
          ],
          duration: 1.2, ease: "power1.inOut",
          delay: i * 0.06, onComplete: () => p.remove(),
        });
      }
    }

    function spawnCard3Particles(card: Element) {
      const { cx, cy } = getCardCenter(card);
      for (let i = 0; i < 8; i++) {
        const line = document.createElement("div");
        line.className = styles.particle;
        const color = ["#A882FF", "#C4A8FF", "#8B5CF6"][Math.floor(Math.random() * 3)];
        gsap.set(line, {
          left: cx + (i - 4) * 25, top: cy, width: 3, height: 0,
          backgroundColor: color, boxShadow: `0 0 8px ${color}`,
          opacity: 0, borderRadius: "2px",
        });
        whyGsapSection.appendChild(line);
        gsap.to(line, {
          height: gsap.utils.random(60, 120), opacity: 0.8,
          duration: 0.3, ease: "power2.out", delay: i * 0.05,
        });
        gsap.to(line, {
          top: cy - gsap.utils.random(80, 160), opacity: 0, height: 0,
          duration: 0.6, ease: "power2.in", delay: i * 0.05 + 0.3,
          onComplete: () => line.remove(),
        });
      }
    }

    function spawnCard4Particles(card: Element) {
      const { cx, cy } = getCardCenter(card);
      for (let i = 0; i < 18; i++) {
        const p = document.createElement("div");
        p.className = styles.particle;
        const size = gsap.utils.random(2, 5);
        const color = ["#FFA050", "#FF6B6B", "#FFD93D"][Math.floor(Math.random() * 3)];
        const angle = gsap.utils.random(0, Math.PI * 2);
        const dist = gsap.utils.random(50, 200);
        gsap.set(p, {
          left: cx + gsap.utils.random(-50, 50), top: cy + gsap.utils.random(-50, 50),
          width: size, height: size, backgroundColor: color,
          boxShadow: `0 0 ${size * 5}px ${color}`, scale: 0, borderRadius: "1px",
        });
        whyGsapSection.appendChild(p);
        const tl = gsap.timeline({ delay: gsap.utils.random(0, 0.3), onComplete: () => p.remove() });
        tl.to(p, { scale: gsap.utils.random(1, 3), duration: 0.05, ease: "steps(1)" });
        tl.to(p, { scale: 0, duration: 0.05, ease: "steps(1)" });
        tl.to(p, { scale: gsap.utils.random(1, 2), duration: 0.05, ease: "steps(1)" });
        tl.to(p, {
          left: cx + Math.cos(angle) * dist, top: cy + Math.sin(angle) * dist,
          scale: 0, opacity: 0, duration: gsap.utils.random(0.3, 0.6), ease: "power2.out",
        });
      }
    }

    // ============================================================
    // Per-card entrance animations
    // ============================================================
    function animateCardEntrance(card: Element, index: number, opts: { onComplete?: () => void }) {
      gsap.killTweensOf(card);
      const entraces: Record<number, () => gsap.core.Tween | gsap.core.Timeline> = {
        0: () => gsap.to(card, {
          opacity: 1, scale: 1, x: 0, y: 0, rotationY: 0,
          duration: 1.2, ease: "elastic.out(1, 0.5)",
          onComplete: opts.onComplete,
        }),
        1: () => gsap.to(card, {
          opacity: 1, scale: 1, x: 0, y: 0, rotationY: 0,
          duration: 1, ease: "sine.inOut",
          onComplete: opts.onComplete,
        }),
        2: () => {
          const tl = gsap.timeline({ onComplete: opts.onComplete });
          tl.to(card, { opacity: 0.5, x: -60, scale: 0.9, duration: 0.15, ease: "steps(2)" });
          tl.to(card, { opacity: 0.8, x: 30, scale: 0.95, duration: 0.15, ease: "steps(2)" });
          tl.to(card, { opacity: 0.3, x: -15, scale: 0.92, duration: 0.1, ease: "steps(1)" });
          tl.to(card, {
            opacity: 1, scale: 1, x: 0, y: 0, rotationY: 0,
            duration: 0.8, ease: "power3.out",
          });
          return tl;
        },
        3: () => {
          const tl = gsap.timeline({ onComplete: opts.onComplete });
          for (let j = 0; j < 5; j++) {
            tl.to(card, {
              opacity: Math.random() * 0.5 + 0.3,
              x: gsap.utils.random(-20, 20),
              scale: gsap.utils.random(0.9, 1.1),
              duration: 0.04, ease: "steps(1)",
            });
          }
          tl.to(card, {
            opacity: 1, scale: 1, x: 0, y: 0, rotationY: 0,
            duration: 0.7, ease: "power3.out",
          });
          return tl;
        },
      };
      return (entraces[index] || entraces[0])();
    }

    function playGroup1Entrance() {
      animateCardEntrance(whyCards[0], 0, {
        onComplete: () => {
          if (!animatedCards.has(0)) {
            animatedCards.add(0);
            animateCardContent(whyCards[0]);
            spawnCard1Particles(whyCards[0]);
          }
        },
      });
      gsap.delayedCall(0.2, () => {
        animateCardEntrance(whyCards[1], 1, {
          onComplete: () => {
            if (!animatedCards.has(1)) {
              animatedCards.add(1);
              animateCardContent(whyCards[1]);
              spawnCard2Particles(whyCards[1]);
            }
          },
        });
      });
    }

    function playGroup2Entrance() {
      animateCardEntrance(whyCards[2], 2, {
        onComplete: () => {
          if (!animatedCards.has(2)) {
            animatedCards.add(2);
            animateCardContent(whyCards[2]);
            spawnCard3Particles(whyCards[2]);
          }
        },
      });
      gsap.delayedCall(0.2, () => {
        animateCardEntrance(whyCards[3], 3, {
          onComplete: () => {
            if (!animatedCards.has(3)) {
              animatedCards.add(3);
              animateCardContent(whyCards[3]);
              spawnCard4Particles(whyCards[3]);
            }
          },
        });
      });
    }

    let group1Entered = false;
    let group2Entered = false;

    // Horizontal scroll with entrance triggers
    gsap.to(whyTrack, {
      x: () => -(whyTrack.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: whyGsapSection,
        start: "top top",
        end: () => `+=${whyTrack.scrollWidth - window.innerWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onEnter: () => {
          if (!group1Entered) {
            group1Entered = true;
            playGroup1Entrance();
          }
        },
        onEnterBack: () => {
          group2Entered = false;
          // Reset group 2 to hidden for re-entrance
          gsap.set([whyCards[2], whyCards[3]], { opacity: 0, scale: 0.85, x: 120, rotationY: 15 });
        },
        onUpdate: (self) => {
          if (self.progress >= 0.5 && !group2Entered) {
            group2Entered = true;
            playGroup2Entrance();
          }
        },
        onLeaveBack: () => {
          group1Entered = false;
          group2Entered = false;
          // Reset all cards to hidden for re-entrance
          gsap.set([whyCards[0], whyCards[1]], { opacity: 0, scale: 0.85, x: -120, rotationY: -20 });
          gsap.set([whyCards[2], whyCards[3]], { opacity: 0, scale: 0.85, x: 120, rotationY: 15 });
        },
      },
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

  }, { scope: sectionRef });

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
