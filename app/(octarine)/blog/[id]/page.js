import { getArticle, getArticleById } from "@/service/queries";
import styles from "./BlogDetail.module.scss";
import { format } from "date-fns";
import React from "react";
import IconFacebook from "@/components/icons/facebook";
import IconInstagram from "@/components/icons/instagram";
import IconX from "@/components/icons/x";
import IconPinterest from "@/components/icons/pinterest";
import BlogGrid from "../components/BlogGrid";

export default async function BlogDetail({ params }) {
  const { id } = params;
  const detail = await getArticleById(id);
  const bannerImage = detail.image || "https://via.placeholder.com/800x300";

  const { posts, currentPage, totalPages } = await getArticle({
    page: 1,
    size: 3,
  });

  return (
    <div
      className={styles.container}
      style={{
        "--banner-image": `url(${bannerImage})`,
      }}
    >
      <div className={styles.blogCard}>
        <div className="heading">
          <ul className="list-tags has-bg justify-content-center">
            <li style={{ marginBottom: 10 }}>
              <a href="#" className="link">
                Octarine Article
              </a>
            </li>
          </ul>
          <h3 className="fw-5 text-center" style={{ marginBottom: 10 }}>
            {detail.title || "Article / Blog"}
          </h3>
          <div
            className="meta justify-content-center"
            style={{ marginBottom: 30 }}
          >
            <div className="meta-item gap-8">
              <div className="icon" style={{ marginTop: "4px" }}>
                <i className="icon-calendar" />
              </div>
              <p className="body-text-1">
                {format(new Date(detail.publishedAt), "MMMM d, yyyy") ||
                  "Unknown Date"}
              </p>
            </div>
            <div className="meta-item gap-8">
              <div className="icon">
                <i className="icon-user" />
              </div>
              <p className="body-text-1">
                by{" "}
                <a className="link" href="#">
                  {detail.publishedBy}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <div
            className={styles.htmlContent}
            dangerouslySetInnerHTML={{
              __html: detail.body || "<p>No content available.</p>",
            }}
          />
        </div>
        <div
          className="d-flex justify-content-between align-items-center w-full"
          style={{ marginTop: 20, marginBottom: 106 }}
        >
          <div className="d-flex align-items-center gap-10">
            <span style={{ fontSize: 13 }}>Tag: </span>
            {detail.tags.length > 0
              ? detail.tags.map((tag, index) => {
                  return (
                    <span key={index} className={styles.tag}>
                      {tag}
                    </span>
                  );
                })
              : null}
          </div>
          <div className="d-flex align-items-center gap-20">
            <span>Share this post: </span>
            <IconFacebook />
            <IconInstagram />
            <IconX />
            <IconPinterest />
          </div>
        </div>
        <div>
          <div className="heading-section text-center">
            <h3 className="heading">Related Articles</h3>
            <p
              className="subheading text-secondary"
              style={{ fontSize: "20px" }}
            >
              Discover the Hottest Fragrance Trends Straight from the Perfume
              Industry
            </p>
          </div>
          <BlogGrid
            posts={posts}
            currentPage={currentPage}
            totalPages={totalPages}
            showPagination={false}
          />
        </div>
      </div>
    </div>
  );
}
