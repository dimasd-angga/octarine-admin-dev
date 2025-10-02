"use client";

import styles from "./about.module.scss";

const About = () => {
  return (
    <div className={styles.containerAbout}>
      <div className={styles.banner}>
        <img
          src="/new/career-banner.jpg"
          alt="Banner"
          className={styles.bannerImage}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={`${styles.aboutSection} ${styles.row}`}>
            <div className={`${styles.aboutImage} ${styles["col-md-6"]}`}>
              <img
                src="/new/octarine/about.png"
                alt="About Octarine"
                className={styles.image}
              />
            </div>
            <div className={`${styles.aboutText} ${styles["col-md-6"]}`}>
              <h2 className="fw-bold">About Octarine</h2>
              <p>
                Welcome to Octarine, where every fragrance is a masterpiece. We
                craft unique, memorable scents designed to elevate your every
                moment. From bold to subtle, each perfume reflects elegance,
                authenticity, and creativity. Ready to find your signature
                scent? Step into the world of Octarine.
              </p>
              <button className={styles.discoverButton}>Discover</button>
            </div>
          </div>

          <div className={`${styles.columns} ${styles.row}`}>
            <div className={`${styles.column} ${styles["col-md-4"]}`}>
              <div className={styles.columnImage}>
                <img src="/new/octarine/about.png" alt="Fragrant" />
              </div>
              <h2 className="fw-bold">Fragrant</h2>
              <p>
                Welcome to Octarine, where every fragrance is a masterpiece. We
                craft unique, memorable scents designed to elevate your every
                moment. From bold to subtle, each perfume reflects elegance,
                authenticity, and creativity. Ready to find your signature
                scent? Step into the world of Octarine.
              </p>
            </div>
            <div className={`${styles.column} ${styles["col-md-4"]}`}>
              <div className={styles.columnImage}>
                <img src="/new/octarine/about.png" alt="Discover" />
              </div>
              <h2 className="fw-bold">Discover</h2>
              <p>
                Welcome to Octarine, where every fragrance is a masterpiece. We
                craft unique, memorable scents designed to elevate your every
                moment. From bold to subtle, each perfume reflects elegance,
                authenticity, and creativity. Ready to find your signature
                scent? Step into the world of Octarine.
              </p>
            </div>
            <div className={`${styles.column} ${styles["col-md-4"]}`}>
              <div className={styles.columnImage}>
                <img src="/new/octarine/about.png" alt="Story" />
              </div>
              <h2 className="fw-bold">Story</h2>
              <p>
                Welcome to Octarine, where every fragrance is a masterpiece. We
                craft unique, memorable scents designed to elevate your every
                moment. From bold to subtle, each perfume reflects elegance,
                authenticity, and creativity. Ready to find your signature
                scent? Step into the world of Octarine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
