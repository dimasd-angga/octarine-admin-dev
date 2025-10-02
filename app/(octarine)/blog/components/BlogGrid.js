import React from "react";
import Link from "next/link";
import Pagination from "@/components/common/Pagination";
import { format } from "date-fns";

export default function BlogGrid({
  posts,
  currentPage,
  totalPages,
  showPagination = true,
}) {
  return (
    <div
      className="main-content-page"
      style={{ padding: "10px 0px", paddingBottom: "80px" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="tf-grid-layout md-col-3">
              {posts.map((blog, index) => (
                <div className="wg-blog" key={blog.id || index}>
                  <div className="image">
                    <div
                      className="image-wrapper"
                      style={{
                        width: "100%",
                        height: "274px",
                        backgroundImage: `url(${
                          blog.image || "/placeholder.jpg"
                        })`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    ></div>
                  </div>
                  <div className="content" style={{ marginTop: 23 }}>
                    <div>
                      <h6 className="title">
                        <Link
                          className="link"
                          href={`/blog/${blog.slug}`}
                          style={{ backgroundImage: "none" }}
                        >
                          {blog.title}
                        </Link>
                      </h6>
                      <div
                        className="meta-item gap-8"
                        style={{ marginTop: 10, marginBottom: 10 }}
                      >
                        <p className="text-caption-1">
                          <span>by </span>
                          <a className="link" href="#">
                            {blog.publishedBy || "Unknown Author"}
                          </a>
                          <span style={{ marginLeft: 10, marginRight: 10 }}>
                            |
                          </span>
                          {blog.publishedAt
                            ? format(new Date(blog.publishedAt), "MMMM d, yyyy")
                            : "Unknown Date"}
                        </p>
                      </div>
                      <div className="body-text">{blog.excerpt}</div>
                    </div>
                  </div>
                </div>
              ))}
              {showPagination && (
                <ul className="wg-pagination justify-content-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                  />
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
