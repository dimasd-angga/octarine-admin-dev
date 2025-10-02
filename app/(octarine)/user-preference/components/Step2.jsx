"use client";

import React from "react";
import Image from "next/image";

export default function UserPrefenceStep2({ submitStep }) {
    const bestFeels = [
        'Cozy at home',
        'Sunny Nature',
        'Urban Life',
    ];

    return (
        <div>
            <p className="text-center" style={{ fontSize: '24px', marginBottom: '40px' }}>You feel best when you are...</p>
            <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
                {bestFeels.map((item, index) =>
                    <button className="btn-outline d-flex justify-content-center align-items-center" style={{ maxHeight: '45px', width: '225px' }} onClick={() => submitStep({ bestFeel: item })} key={index}>
                        {item}
                    </button>
                )}
            </div>
        </div>
    );
}