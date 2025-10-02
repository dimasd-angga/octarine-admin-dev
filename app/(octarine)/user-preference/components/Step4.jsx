"use client";

import React from "react";
import Image from "next/image";

export default function UserPrefenceStep4({ submitStep }) {
    const secondSkins = [
        'Silk',
        'Leather Jacket',
        'Jeans',
        'Cotton',
    ];

    return (
        <div>
            <p className="text-center" style={{ fontSize: '24px', marginBottom: '40px' }}>Which one could be your second skin?</p>
            <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
                {secondSkins.map((item, index) =>
                    <button className="btn-outline d-flex justify-content-center align-items-center" style={{ maxHeight: '45px', width: '225px' }} onClick={() => submitStep({ secondSkin: item })} key={index}>
                        {item}
                    </button>
                )}
            </div>
        </div>
    );
}