"use client";

import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import ProductCard from "@/components/homes/BestSeller/ProductCard";
import { useEffect, useState } from "react";
import { getAllDiscovery, getbestSeller } from "@/service/queries";
import ProductVariantCard from "@/components/homes/BestSeller/ProductVariantCard";

export default function DiscoveryPage() {
    const [discoveries, setDiscoveries] = useState([]);
    const [pagination, setPagination] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const response = await getAllDiscovery({});
            setDiscoveries(response.content);
            setPagination(response.page);
        }
        fetchData();
    }, [])


    return (
        <div>
            <h2 className="fw-medium text-center" style={{ fontSize: '40px', marginBottom: '66px' }}>Available Promo/Campaign</h2>
            {discoveries.map((discovery) => (
                <div className="mb-3">
                    <div className="position-relative w-100" style={{ height: '590px', marginBottom: '74px' }}>
                        <Image
                            alt="Banner"
                            src={discovery.banner.imageUrl}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <div className="container" style={{ marginBottom: '200px' }}>
                        <h3 className="heading text-center" style={{ marginBottom: "24px" }}>
                            {discovery.title}
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
                            {discovery.productVariants.map((product, i) => (
                                <SwiperSlide key={i} className="swiper-slide">
                                    <ProductVariantCard product={product} />
                                </SwiperSlide>
                            ))}
                            <div className="sw-pagination-latest spd4 sw-dots type-circle justify-content-center" />
                        </Swiper>
                    </div>
                </div>
            ))}
        </div>
    );
}