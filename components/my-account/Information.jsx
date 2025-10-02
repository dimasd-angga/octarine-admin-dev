"use client";
import { useContextElement } from "@/context/Context";
import { updateUserProfile } from "@/service/queries";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function Information() {
  const { user, setUser } = useContextElement();

  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [newPasswordType, setNewPasswordType] = useState("password");

  const togglePassword = () => {
    setPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  const toggleConfirmPassword = () => {
    setConfirmPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };
  const toggleNewPassword = () => {
    setNewPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  const onSubmitForm = async (formData) => {
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const phoneNumber = formData.get("phoneNumber");
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    try {
      const response = await updateUserProfile({ firstName, lastName, email, phoneNumber, currentPassword, newPassword, confirmPassword });
      setUser(response);
      toast.success(`Profile updated sucessfully.`);
    } catch (error) {
      toast.error(`Failed to update profile`);
      console.error(error);
    }
  };

  return (
    <div className="my-account-content">
      <div className="account-details">
        <form
          action={onSubmitForm}
          className="form-account-details form-has-password"
        >
          <div className="account-info">
            <h5 className="title">Information</h5>
            <div className="cols mb_20">
              <fieldset className="">
                <input
                  className=""
                  type="text"
                  placeholder="First Name*"
                  name="firstName"
                  tabIndex={2}
                  defaultValue={user?.firstName}
                  aria-required="true"
                  required
                />
              </fieldset>
              <fieldset className="">
                <input
                  className=""
                  type="text"
                  placeholder="Last Name*"
                  name="lastName"
                  tabIndex={2}
                  defaultValue={user?.lastName}
                  aria-required="true"
                  required
                />
              </fieldset>
            </div>
            <div className="cols mb_20">
              <fieldset className="">
                <input
                  className=""
                  type="email"
                  placeholder="Username or email address*"
                  name="email"
                  tabIndex={2}
                  defaultValue={user?.email}
                  aria-required="true"
                  required
                />
              </fieldset>
              <fieldset className="">
                <input
                  className=""
                  type="text"
                  placeholder="Phone*"
                  name="phoneNumber"
                  tabIndex={2}
                  defaultValue={user?.phoneNumber}
                  aria-required="true"
                  required
                />
              </fieldset>
            </div>
          </div>
          <div className="account-password">
            <h5 className="title">Change Password</h5>
            <fieldset className="position-relative password-item mb_20">
              <input
                className="input-password"
                type={passwordType}
                placeholder="Password*"
                name="currentPassword"
                tabIndex={2}
                defaultValue=""
              />
              <span
                className={`toggle-password ${!(passwordType === "text") ? "unshow" : ""
                  }`}
                onClick={togglePassword}
              >
                <i
                  className={`icon-eye-${!(passwordType === "text") ? "hide" : "show"
                    }-line`}
                />
              </span>
            </fieldset>
            <fieldset className="position-relative password-item mb_20">
              <input
                className="input-password"
                type={newPasswordType}
                placeholder="New Password*"
                name="newPassword"
                tabIndex={2}
                defaultValue=""
              />
              <span
                className={`toggle-password ${!(newPasswordType === "text") ? "unshow" : ""
                  }`}
                onClick={toggleNewPassword}
              >
                <i
                  className={`icon-eye-${!(newPasswordType === "text") ? "hide" : "show"
                    }-line`}
                />
              </span>
            </fieldset>
            <fieldset className="position-relative password-item">
              <input
                className="input-password"
                type={confirmPasswordType}
                placeholder="Confirm Password*"
                name="confirmPassword"
                tabIndex={2}
                defaultValue=""
              />
              <span
                className={`toggle-password ${!(confirmPasswordType === "text") ? "unshow" : ""
                  }`}
                onClick={toggleConfirmPassword}
              >
                <i
                  className={`icon-eye-${!(confirmPasswordType === "text") ? "hide" : "show"
                    }-line`}
                />
              </span>
            </fieldset>
          </div>
          <div className="button-submit">
            <button className="tf-btn btn-fill" type="submit">
              <span className="text text-button">Update Account</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
