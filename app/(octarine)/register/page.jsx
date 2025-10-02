import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Topbar6 from "@/components/headers/Topbar6";
import Register from "@/components/otherPages/Register";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Login || Modave - Multipurpose React Nextjs eCommerce Template",
  description: "Modave - Multipurpose React Nextjs eCommerce Template",
};

export default function RegisterPage() {
  return (
    <div style={{marginBottom: 100, marginTop: 0}}>
      <Register />
    </div>
  );
}
