// app/blog/page.js
import React from "react";
import Link from "next/link";
import BlogGrid from "./components/BlogGrid";
import { getArticle } from "@/service/queries";

export const metadata = {
  title: "Blog | Octarine",
  description: "",
};

export default async function BlogGridPage({ searchParams }) {
  const pagetest = await searchParams;

  const page = pagetest.page || 1;
  const { posts, currentPage, totalPages } = await getArticle({
    page,
    size: 6,
  });

  return (
    <>
      <div className="page-title" style={{ background: "white" }}>
        <div className="container-full">
          <div className="row">
            <div className="col-12">
              <h3 className="heading text-center">Blog / Story</h3>
              <ul className="breadcrumbs d-flex align-items-center justify-content-center fw-light">
                <li>
                  <Link className="link" href={`/`}>
                    Homepage
                  </Link>
                </li>
                <li>
                  <i className="icon-arrRight" />
                </li>
                <li>
                  <a className="link text-secondary-3" href="#">
                    Blog / story
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <BlogGrid
        posts={posts}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}
