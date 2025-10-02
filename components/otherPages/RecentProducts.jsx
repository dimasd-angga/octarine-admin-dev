"use client";

import { products } from "@/data/products";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard1 from "../productCards/ProductCard1";
import { Pagination } from "swiper/modules";
import ProductCard from "../homes/BestSeller/ProductCard";
import { useContextElement } from "@/context/Context";

export default function RecentProducts() {
  const {
    recommendedProducts,
  } = useContextElement();

  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="heading-section text-center wow fadeInUp">
          <h4 className="heading">You may also like</h4>
        </div>
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
            el: ".spd79",
          }}
        >
          {recommendedProducts.slice(4).map((product, i) => (
            <SwiperSlide key={i} className="swiper-slide">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}

          <div className="sw-pagination-latest sw-dots type-circle justify-content-center spd79" />
        </Swiper>
      </div>
    </section>
  );
}
