"use client";
import Image from "next/image";
import Link from "next/link";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function OctarineHeroBanner({ data }) {
  return (
    <div className="tf-slideshow slider-default slider-effect-fade">
      <Swiper
        modules={[EffectFade, Autoplay, Pagination]}
        effect="fade"
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000 }}
        spaceBetween={0}
        className="swiper tf-sw-slideshow"
        pagination={{
          clickable: true,
          el: ".spd41",
        }}
        dir="ltr"
      >
        {data.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="wrap-slider">
              <Image
                alt={slide.title}
                src={slide.imageUrl}
                width={1920}
                height={800}
                style={{ maxHeight: 800 }}
              />
              <div className="box-content">
                <div className="content-slider">
                  <div className="box-title-slider">
                    {/*<p className="fade-item fade-item-1 subheading text-btn-uppercase text-white">*/}
                    {/*  {slide.title}*/}
                    {/*</p>*/}
                    <div
                      className="fade-item fade-item-2 heading text-white title-display text-center"
                      dangerouslySetInnerHTML={{ __html: slide.title }}
                    ></div>
                  </div>
                  <div className="fade-item fade-item-3 box-btn-slider">
                    <Link
                      href={`https://www.tokopedia.com/octarineperfumeofficial`}
                      target={"_blank"}
                      style={{
                        transition: "all 0.3s ease",
                        backgroundColor: "transparent",
                        color: "#fff",
                        padding: "15px 32px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        fontSize: "16px",
                        lineHeight: "26px",
                        fontWeight: 600,
                        textTransform: "capitalize",
                        border: "1px solid #fff",
                        position: "relative",
                        overflow: "hidden",
                        textDecoration: "none",
                      }}
                    >
                      <span className="text">{slide.linkText}</span>
                      Shop on Tokopedia
                      <img
                        src={"/images/tokopedia.png"}
                        style={{ width: 20 }}
                      />
                    </Link>
                    <Link
                      href={`https://shopee.co.id/octarineperfume.official`}
                      target={"_blank"}
                      style={{
                        transition: "all 0.3s ease",
                        backgroundColor: "transparent",
                        color: "#fff",
                        padding: "15px 32px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        fontSize: "16px",
                        lineHeight: "26px",
                        fontWeight: 600,
                        textTransform: "capitalize",
                        border: "1px solid #fff",
                        position: "relative",
                        overflow: "hidden",
                        textDecoration: "none",
                        marginLeft: 20,
                      }}
                    >
                      <span className="text">{slide.linkText}</span>
                      Shop on Shopee
                      <img src={"/images/shopee.png"} style={{ width: 35 }} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="wrap-pagination">
        <div className="container">
          <div className="sw-dots sw-pagination-slider type-circle white-circle justify-content-center spd41" />
        </div>
      </div>
    </div>
  );
}
