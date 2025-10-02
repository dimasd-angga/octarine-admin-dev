"use client";
import React from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { getbestSeller } from "@/service/queries";

export default async function BestSeller({
  title = "Our Products",
  products = [],
  parentClass = "",
}) {
  return (
    <section className={parentClass} style={{ marginTop: "66px" }}>
      <div className="container">
        <h3 className="heading text-center" style={{ marginBottom: "24px" }}>
          {title}
        </h3>

        <Swiper
          className="swiper tf-sw-latest"
          dir="ltr"
          spaceBetween={15}
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 15 },

            768: { slidesPerView: 3, spaceBetween: 30 },
            1200: { slidesPerView: 4, spaceBetween: 30 },
          }}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: ".spd4",
          }}
        >
          {products.map((product, i) => (
            <SwiperSlide key={i} className="swiper-slide">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}

          <div className="sw-pagination-latest spd4  sw-dots type-circle justify-content-center" />
        </Swiper>

        <div className="flat-animate-tab">
          <div className="tab-content">
            <div
              className="tab-pane active show tabFilter filtered"
              id="newArrivals2"
              role="tabpanel"
            >
              <div className="sec-btn text-center">
                <Link href={`/shop`} className="btn-line">
                  View All Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
