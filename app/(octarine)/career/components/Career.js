import React from "react";
import styles from "../career.module.scss";
import Link from "next/link";

export default function CareerList({ career }) {
  return (
    <section style={{ marginBottom: 80 }}>
      <div className={styles.container}>
        <div className={styles.careerGrid}>
          {career.content.map((job, index) => (
            <div key={index} className={styles.careerCard}>
              <h3 className={styles.careerTitle}>{job.title}</h3>
              <p className={styles.careerType}>
                {job.employmentType} | {job.location}
              </p>
              <p className={styles.careerDescription}>
                Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor
                sit amet consectetur adipiscing elit quisque faucibus.
              </p>
              <Link href={`/career/${job.id}`}>Learn More</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
