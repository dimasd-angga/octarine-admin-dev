
"use client";

import AccountSidebar from "@/components/my-account/AccountSidebar";
import React from "react";
import ProgressTracker from "./components/ProgressTracker";
import { useState } from "react";
import { useContextElement } from "@/context/Context";

const discounts = [
  {
    discount: "10% OFF",
    details: "For all orders from 200$",
    code: "Mo234231",
  },
  {
    discount: "10% OFF",
    details: "For all orders from 200$",
    code: "Mo234231",
  },
  {
    discount: "10% OFF",
    details: "For all orders from 200$",
    code: "Mo234231",
  },
];

export default function LoyaltyProgramPage() {
  const { user } = useContextElement();

  const [activeDiscountIndex, setActiveDiscountIndex] = useState(1);

  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="my-account-wrap">
          <AccountSidebar />
          <div className="w-100">
            <div className="d-flex flex-column gap-3" style={{ backgroundColor: '#F7F7F7', padding: '82px 56px' }}>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h3 className="fw-medium" style={{ fontSize: '48px' }}>{user?.loyaltyPoints || 0}</h3>
                  <svg width="30" height="29" viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.7375 29L8.175 18.2776L0 11.0658L10.8 10.1118L15 0L19.2 10.1118L30 11.0658L21.825 18.2776L24.2625 29L15 23.3145L5.7375 29Z" fill="#F0A750" />
                  </svg>
                </div>
                <p className="fw-medium" style={{ color: '#7E7E7E' }}>Star Balance</p>
              </div>
              <div>
                <ProgressTracker currentStep={user?.loyaltyPoints || 0} />
              </div>
              {/* <div>
                <button className="tf-btn" style={{ maxHeight: '45px' }}>
                  <span className="text">Redeem Point</span>
                </button>
              </div> */}
            </div>
            {/* <div className="group-discount">
              {discounts.map((item, index) => (
                <div
                  key={index}
                  className={`box-discount ${activeDiscountIndex === index ? "active" : ""
                    }`}
                  onClick={() => setActiveDiscountIndex(index)}
                >
                  <div className="discount-top">
                    <div className="discount-off">
                      <div className="text-caption-1">Discount</div>
                      <span className="sale-off text-btn-uppercase">
                        {item.discount}
                      </span>
                    </div>
                    <div className="discount-from">
                      <p className="text-caption-1">{item.details}</p>
                    </div>
                  </div>
                  <div className="discount-bot">
                    <button className="tf-btn">
                      <span className="text">Use Coupon</span>
                    </button>
                  </div>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
