import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Topbar6 from "@/components/headers/Topbar6";
import AccountSidebar from "@/components/my-account/AccountSidebar";
import Information from "@/components/my-account/Information";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "My Account || Octarine",
  description: "Octarine",
};

export default function MyAccountPage() {

  return (
    <>
      <section className="flat-spacing">
        <div className="container">
          <div className="my-account-wrap">
            <AccountSidebar />
            <Information />
          </div>
        </div>
      </section>
    </>
  );
}
