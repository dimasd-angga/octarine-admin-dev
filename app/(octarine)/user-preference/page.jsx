"use client";

import './UserPreference.scss';

import React, { useState } from "react";
import Image from "next/image";
import UserPrefenceStep1 from "./components/Step1";
import UserPrefenceStep2 from "./components/Step2";
import UserPrefenceStep3 from "./components/Step3";
import UserPrefenceStep4 from "./components/Step4";
import UserPrefenceStep5 from "./components/Step5";
import UserPrefenceStep6 from "./components/Step6";

export default function UserPreferencePage() {
  const [preferences, setPreferences] = useState({});
  const [currentStep, setCurrentStep] = useState(0);


  const submitStep = async (data = null) => {
    if (data != null) {
      await setPreferences((prev) => ({ ...prev, ...data }));
    }

    setCurrentStep(currentStep + 1);
  }

  const componentSteps = [
    <UserPrefenceStep1 submitStep={submitStep} />,
    <UserPrefenceStep2 submitStep={submitStep} />,
    <UserPrefenceStep3 submitStep={submitStep} />,
    <UserPrefenceStep4 submitStep={submitStep} />,
    <UserPrefenceStep5 submitStep={submitStep} />,
    <UserPrefenceStep6 submitStep={submitStep} />,
  ];

  return (
    <>
      <div className="position-relative">
        <div className="d-flex justify-content-center align-items-center">
          <div className="container-content m-4 p-3 bg-white w-100">
            <div className="w-100 h-100 p-5" style={{ border: '7px solid black' }}>
              <div className="d-flex gap-3 flex-column flex-md-row align-items-center justify-content-stretch h-100">
                <div className="w-100 h-100">
                  <div className="d-flex gap-3 flex-column justify-content-between h-100" style={{ maxWidth: '360px' }}>
                    <p style={{ fontSize: '24px', lineHeight: '100%' }}>Take a quick fun quiz with us and discover the perfect scent tailored perfectly to your character.</p>
                    <h3 className="fw-bold" style={{ fontSize: '64px', lineHeight: '100%' }}>Discover your scent</h3>
                  </div>
                </div>
                <div style={{ borderRight: '1px solid black', height: '80%' }}></div>
                <div className="h-100 w-100 d-flex justify-content-center align-items-center">
                  {componentSteps[currentStep]}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="position-absolute d-flex flex-column flex-md-row gap-16 top-0 start-0 end-0 bottom-0" style={{ minHeight: '756px', zIndex: -1 }}>
          <div className="position-relative" style={{ width: '50%' }}>
            <Image
              alt="Background User Preference"
              src={'/images/user-preference-1-1.png'}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="position-relative" style={{ width: '50%' }}>
            <Image
              alt="Background User Preference"
              src={'/images/user-preference-1-2.png'}
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </div >
    </>
  );
}
