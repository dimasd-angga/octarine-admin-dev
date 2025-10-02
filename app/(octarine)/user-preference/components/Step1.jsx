"use client";

import React from "react";
import Image from "next/image";

export default function UserPrefenceStep1({ submitStep }) {
    return (
        <button className="tf-btn" style={{ maxHeight: '45px' }} onClick={() => submitStep()}>
            <span className="text">Get Started</span>
        </button>
    );
}