import styles from "./NotFound.module.scss";
import Image from "next/image";

export const metadata = {
  title:
    "Page Not Found || Modave - Multipurpose React Nextjs eCommerce Template",
  description: "Modave - Multipurpose React Nextjs eCommerce Template",
};

export default function PageNotFoundPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Image
          src="/new/octarine.png"
          alt="octarine"
          className={styles.illustrationImage}
          width={167}
          height={167}
          style={{ objectFit: "contain" }}
        />
        <div className={styles.illustration}>
          <Image
            src="/new/coming-soon.png"
            alt="Illustration"
            className={styles.illustrationImage}
            width={300}
            height={300}
            style={{ objectFit: "contain" }}
          />
        </div>
        <div className={styles.progressText} style={{ marginTop: 65 }}>
          <p className={styles.progressText}>Coming Soon!</p>

          <Image
            src="/new/svg/under_construction.svg"
            alt="under construction"
            className={styles.illustrationImage}
            width={32}
            height={32}
            style={{ objectFit: "contain", marginLeft: 18 }}
          />
        </div>
      </div>
    </div>
  );
}
