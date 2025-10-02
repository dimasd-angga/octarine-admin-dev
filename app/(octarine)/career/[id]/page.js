import { getCareerById } from "@/service/queries";
import Image from "next/image";
import styles from "./careerDetail.module.scss";

export default async function CareerDetail({ params }) {
  const { id } = params;
  const career = await getCareerById(id);

  return (
    <div className={styles.container}>
      <div className={styles.jobCard}>
        <h1>{career.title || "Senior Graphic Designer"}</h1>
        <div className={styles.jobInfo}>
          <span>
            <Image
              alt="Icon"
              src="/svg/mdi_clock-outline.svg"
              width={20}
              height={20}
              styles={{ marginLeft: "8px" }}
            />{" "}
            {career.employmentType || "Full Time"}
          </span>
          <span>
            <Image
              alt="Icon"
              src="/svg/lucide_map-pin.svg"
              width={20}
              height={20}
              styles={{ marginLeft: "8px" }}
            />{" "}
            {career.location || "Jakarta"}
          </span>
        </div>
        <div className={styles.description}>
          <h2>Deskripsi Pekerjaan</h2>
          <div
            className={styles.htmlContent}
            dangerouslySetInnerHTML={{ __html: career.responsibilities || "" }}
          />
        </div>
        <div className="d-flex justify-content-center">
          <button className={styles.applyButton}>Apply Now</button>
        </div>
      </div>
    </div>
  );
}
