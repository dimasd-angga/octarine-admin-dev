"use client";

import React from "react";
import Image from "next/image";

export default function UserPrefenceStep5({ submitStep }) {
    const atmospheres = [
        'Floral & Delicate',
        'Clean & Fresh',
        'Sunny & Refreshing',
        'Warm & Cozy',
    ];

    return (
        <div>
            <p className="text-center" style={{ fontSize: '24px', marginBottom: '40px' }}>Which olfactory atmosphere do you indentify the most?</p>
            <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
                {atmospheres.map((item, index) =>
                    <button className="btn-outline d-flex justify-content-center align-items-center" style={{ maxHeight: '45px', width: '225px' }} onClick={() => submitStep({ atmosphere: item })} key={index}>
                        {item}
                    </button>
                )}
            </div>
        </div>
    );
}