"use client";

import React from "react";
import styles from "./QualityPromises.module.scss";
import Image from "next/image";

const promises = [
  {
    icon: "/svg/premium-ingredient.svg",
    title: "Premium Ingredients Only",
  },
  {
    icon: "/svg/ai-chemistry.svg",
    title: "Artisan–Crafted Scents",
  },
  {
    icon: "/svg/ic_baseline-recycling.svg",
    title: "Ethical & Sustainable",
  },
  {
    icon: "/svg/bx_task.svg",
    title: "Quality Control at Every Step",
  },
  {
    icon: "/svg/hugeicons_id-verified.svg",
    title: "Satisfaction Guaranteed",
  },
];

const QualityPromises = () => {
  return (
    <>
      <section className={styles.wrapper}>
        <div className={styles.container}>
          <h2 className={styles.title}>Our Quality Promises</h2>
          <div className={styles.promises}>
            {promises.map((promise, index) => (
              <div className={styles.promise} key={index}>
                <div className={styles.icon}>
                  <Image
                    src={promise.icon}
                    alt={promise.title}
                    width={50}
                    height={50}
                  />
                </div>
                <p className={styles.text}>{promise.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className={styles.wrapperBestSeller}>
        <div className={styles.bestSellers}>
          <h2>Best Sellers</h2>
        </div>
      </section>
    </>
  );
};

export default QualityPromises;
