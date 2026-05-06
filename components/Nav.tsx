"use client";

import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <a href="#" className={styles.logo}>GSAP</a>
      <div className={styles.menuBtn}>
        <a href="https://github.com/wusongzhou" target="_blank" rel="noopener noreferrer">Github</a>
      </div>
    </nav>
  );
}
