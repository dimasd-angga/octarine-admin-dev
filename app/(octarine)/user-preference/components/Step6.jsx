"use client";

import React from "react";
import Image from "next/image";

export default function UserPrefenceStep6({ submitStep }) {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center gap-3">
            <p className="text-center" style={{ fontSize: '24px' }}>Your matching fragrance is...</p>
            <div className="position-relative" style={{ width: '240px', height: '240px' }}>
                <Image
                    alt="Product"
                    src={'/images/50-ML-1.png'}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center text-center">
                <h3 className="fw-semibold lh-1 mb-2" style={{ fontSize: '20px' }}>B Opium</h3>
                <p className="lh-1 mb-1" style={{ fontSize: '20px' }}>Eau de toilette</p>
                <p className="fw-light lh-1" style={{ fontSize: '14px' }}>
                    Afternoon Delight Eau de Toilette captures a moment of self-indulgence, transporting you to a Parisian café where the uplifting aroma of warm madeleines fills the air. This sweet yet light, ambery gourmand fragrance evokes moments of joyful escapism.
                </p>
            </div>
        </div>
    );
}