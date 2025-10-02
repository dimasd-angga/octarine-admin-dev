"use client";

import React from "react";
import Image from "next/image";

export default function UserPrefenceStep3({ submitStep }) {
    const favoritSeasons = [
        'Fall',
        'Winter',
        'Spring',
        'Summer',
    ];

    return (
        <div>
            <p className="text-center" style={{ fontSize: '24px', marginBottom: '40px' }}>What is your favorite season?</p>
            <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
                {favoritSeasons.map((item, index) =>
                    <button className="btn-outline d-flex justify-content-center align-items-center" style={{ maxHeight: '45px', width: '225px' }} onClick={() => submitStep({ favoritSeason: item })} key={index}>
                        {item}
                    </button>
                )}
            </div>
        </div>
    );
}