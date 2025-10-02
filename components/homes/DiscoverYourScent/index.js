import React from "react";
import styles from "./HeroBanner.module.scss";
import Image from "next/image";
import Link from "next/link";

const DiscoverYourScent = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <div className={styles.product}>
          {/* <Image
            src="/images/products.jpg"
            alt="Perfume Product"
            width={400}
            height={400}
            priority
          /> */}
        </div>
        <div className={styles.content}>
          <h1>Discover Your Scent!</h1>
          <p>
            Capture the essence of your memories. <br /> Find your ideal scent.
          </p>
          <Link href="#">
            <button className={styles.button}>Discover Now</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DiscoverYourScent;
