"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getAllPromotion } from "@/service/queries";
import Link from "next/link";
export default function NewsLetterModal() {
  const pathname = usePathname();
  const modalElement = useRef();
  const [activePromotion, setActivePromotion] = useState(null);

  useEffect(() => {
    const showModal = async () => {
      if (pathname === "/") {
        const response = await getAllPromotion({});
        if (response.content.length <= 0) return;

        await setActivePromotion(response.content[0])

        const bootstrap = await import("bootstrap"); // dynamically import bootstrap
        const myModal = new bootstrap.Modal(
          document.getElementById("newsletterPopup"),
          {
            keyboard: false,
          }
        );

        myModal.show();
        modalElement.current.addEventListener("hidden.bs.modal", () => {
          myModal.hide();
        });
      }
    };

    showModal();
  }, [pathname]);

  return (
    <div
      className="modal modalCentered fade auto-popup modal-newleter"
      id="newsletterPopup"
      ref={modalElement}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-top">
            <Image
              className="lazyload"
              data-src={activePromotion?.imageUrl}
              alt="/images"
              src={activePromotion?.imageUrl}
              width={660}
              height={440}
            />
            <span
              className="icon icon-close btn-hide-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="modal-bottom text-center">
            <p className="text-btn-uppercase fw-4 font-2">
              Limited Offer!
            </p>
            <h5>
              {activePromotion?.title}
            </h5>
            <Link href={activePromotion?.url || '#'}
              id="subscribe-button"
              className="btn-style-2 radius-12 w-100 justify-content-center"
            >
              <span className="text text-btn-uppercase">Discover Now</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
