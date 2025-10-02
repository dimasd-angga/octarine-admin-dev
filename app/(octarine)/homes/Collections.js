"use client";
import Image from "next/image";
import Link from "next/link";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./Collections.scss";

export default function OctarineHomeCollections({ collections }) {
  return (
    <section className="flat-spacing ">
      <div className="container">
        <div
          className="heading-section-2 wow fadeInUp"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <h3 className="heading" style={{ margin: 0 }}>
            Explore Collections
          </h3>
          <Link href="/shop" className="btn-line">
            View All Collection
          </Link>
        </div>

        <Swiper
          spaceBetween={10}
          slidesPerView={3}
          breakpoints={{
            1024: { slidesPerView: 3, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            0: { slidesPerView: 1, spaceBetween: 10 },
          }}
          className="swiper tf-sw-categories"
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: ".spd39",
          }}
          dir="ltr"
        >
          {collections.map((category, index) => (
            <SwiperSlide key={index}>
              <div
                className="collection-position-2 style-2 collection-hover-container"
                data-wow-delay={category.delay}
              >
                <a className="img-style">
                  <Image
                    className="lazyload"
                    data-src={category.imageUrl}
                    alt={category.alt}
                    src={category.imageUrl}
                    width={category.imgWidth || 628}
                    height={category.imgHeight || 833}
                  />
                </a>

                <div className="collection-overlay">
                  <div className="overlay-content">
                    <h6 className="collection-title">
                      {category.genderPreference}
                    </h6>
                    {category.itemsCount && (
                      <span className="collection-count">
                        {category.itemsCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="sw-pagination-categories sw-dots type-circle justify-content-center spd39" />
        </Swiper>
      </div>
    </section>
  );
}
