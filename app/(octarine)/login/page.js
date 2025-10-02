import React, { Suspense } from "react";
import LoginForm from "./components/LoginForm";

export const metadata = {
  title: "Login || Modave - Multipurpose React Nextjs eCommerce Template",
  description: "Modave - Multipurpose React Nextjs eCommerce Template",
};

export default function LoginPage() {
  return (
    <div style={{ marginBottom: 100, marginTop: 0 }}>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
