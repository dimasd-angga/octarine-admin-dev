"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import styles from "./login.module.scss";
import { login } from "@/service/queries";
import { useRouter, useSearchParams } from "next/navigation";
import { useContextElement } from "@/context/Context";
import { toast } from "react-toastify";

export default function LoginForm() {
  const router = useRouter();
  const { getCurrentUser } = useContextElement();
  const searchParams = useSearchParams();
  const btnSubmit = useRef(null);

  const [passwordType, setPasswordType] = useState("password");

  const togglePassword = () => {
    setPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  const onSubmitForm = async (formData) => {
    const email = formData.get("email");
    const password = formData.get("password");
    const redirectUrl = searchParams.get("redirect_url");

    btnSubmit.current.disabled = true;
    try {
      const response = await login({ email, password });
      localStorage.setItem("token", response["token"]);
      getCurrentUser();
      toast.success(`Welcome, ${email}`);
      if (redirectUrl != null) {
        router.push(redirectUrl);
      } else {
        router.push("/");
      }
    } catch (error) {
      toast.error(`Email or password is wrong`);
      console.error(error);
    }
    btnSubmit.current.disabled = false;
  };

  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="login-wrap">
          <div className="container">
            <div className="heading text-center mb-3">
              <h4>Login</h4>
            </div>
            <form
              action={onSubmitForm}
              className="form-login form-has-password"
            >
              <div className="wrap">
                <fieldset className="">
                  <input
                    className={styles.inputLogin}
                    type="email"
                    placeholder="Username or email address*"
                    name="email"
                    tabIndex={2}
                    defaultValue=""
                    aria-required="true"
                    required
                  />
                </fieldset>
                <fieldset className="position-relative password-item">
                  <input
                    className={`input-password ${styles.inputLogin}`}
                    type={passwordType}
                    placeholder="Password*"
                    name="password"
                    tabIndex={2}
                    defaultValue=""
                    aria-required="true"
                    required
                  />
                  <span
                    className={`toggle-password ${
                      !(passwordType === "text") ? "unshow" : ""
                    }`}
                    onClick={togglePassword}
                  >
                    <i
                      className={`icon-eye-${
                        !(passwordType === "text") ? "hide" : "show"
                      }-line`}
                    />
                  </span>
                </fieldset>
                <div className="d-flex align-items-center justify-content-end">
                  <Link
                    href={`/forget-password`}
                    className="font-2 text-button forget-password link"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
              <div className="button-submit d-flex justify-content-center">
                <button
                  ref={btnSubmit}
                  className="tf-btn btn-fill"
                  type="submit"
                >
                  <span className="text text-button">Login</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
