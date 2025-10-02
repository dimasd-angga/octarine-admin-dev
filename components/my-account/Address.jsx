"use client";
import { useContextElement } from "@/context/Context";
import { addAddress, deleteAddress, getAllAddress, getDestinations, updateAddress } from "@/service/queries";
import React, { useEffect, useState } from "react";
import AsyncSelect from 'react-select/async';
import { toast } from "react-toastify";

export default function Address() {
  const { user } = useContextElement();

  const [addresses, setAddresses] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllAddress();
      setAddresses(response.map((address) => ({ ...address, isEditing: false })))
    }
    fetchData();
  }, [])

  const handleEditToggle = (id) => {
    setSelectedDestination(null);
    setAddresses((prev) =>
      prev.map((address) =>
        address.id === id
          ? { ...address, isEditing: !address.isEditing }
          : address
      )
    );
  };

  const handleAdd = async (formData) => {
    const object = {};
    formData.forEach(function (value, key) {
      object[key] = value;
    });

    object['isDefault'] = object['isDefault'] == 'true';
    object['provider'] = 'komship';
    object['destinationId'] = selectedDestination.destinationId;
    object['destinationName'] = selectedDestination.name;
    object['addressLabel'] = selectedDestination.name;
    object['province'] = selectedDestination.province;
    object['city'] = selectedDestination.city;
    object['district'] = selectedDestination.district;
    object['subdistrict'] = selectedDestination.subdistrict;
    object['postalCode'] = selectedDestination.postalCode;

    try {
      const response = await addAddress(object);

      toast.success('Address added sucessfully');
      setAddresses((prev) => prev.concat([{ ...response, isEditing: false }]));
      setSelectedDestination(null);
      document.querySelector(".createForm").classList.toggle("d-block");
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleEdit = async (formData, index) => {
    const currentAddress = addresses[index];

    let object = {};
    formData.forEach(function (value, key) {
      object[key] = value;
    });

    object['isDefault'] = object['isDefault'] == 'true';
    if (selectedDestination == null) {
      object = { ...currentAddress, ...object };
    } else {
      object['destinationId'] = selectedDestination.destinationId;
      object['destinationName'] = selectedDestination.name;
      object['addressLabel'] = selectedDestination.name;
      object['province'] = selectedDestination.province;
      object['city'] = selectedDestination.city;
      object['district'] = selectedDestination.district;
      object['subdistrict'] = selectedDestination.subdistrict;
      object['postalCode'] = selectedDestination.postalCode;
    }

    try {
      const response = await updateAddress(currentAddress.id, object);

      toast.success('Address updated sucessfully');
      setAddresses((prev) => prev.map((item) => item.id == currentAddress.id ? { ...response, isEditing: false } : item));
      setSelectedDestination(null);
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await deleteAddress(id);
      setAddresses((prev) => prev.filter((address) => address.id !== id));
      toast.success('Address deleted successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const promiseOptions = async (inputValue) => {
    const response = await getDestinations(inputValue);
    return response.map((item) => ({ value: item.destinationId, label: item.name, item }));
  };

  return (
    <div className="my-account-content">
      <div className="account-address">
        <div className="text-center widget-inner-address">
          <button
            className="tf-btn btn-fill radius-4 mb_20 btn-address"
            onClick={() => {
              document.querySelector(".createForm").classList.toggle("d-block");
              setSelectedDestination(null);
            }
            }
          >
            <span className="text text-caption-1">Add a new address</span>
          </button>
          <form
            className="show-form-address wd-form-address createForm"
            action={handleAdd}
          >
            <div className="title">Add a new address</div>
            <div className="cols mb_20">
              <fieldset className="">
                <input
                  className=""
                  type="text"
                  placeholder="Address Name*"
                  name="addressName"
                  tabIndex={2}
                  defaultdefaultValue=""
                  aria-required="true"
                  required
                />
              </fieldset>
            </div>
            <div className="cols mb_20">
              <fieldset className="">
                <input
                  className=""
                  type="text"
                  placeholder="First Name*"
                  name="firstName"
                  tabIndex={2}
                  defaultdefaultValue=""
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
                  defaultdefaultValue=""
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
                  defaultValue={user?.email || ''}
                  aria-required="true"
                  disabled
                />
              </fieldset>
              <fieldset className="">
                <input
                  className=""
                  type="text"
                  placeholder="Phone*"
                  name="phone"
                  tabIndex={2}
                  defaultdefaultValue=""
                  aria-required="true"
                  required
                />
              </fieldset>
            </div>
            <fieldset className="mb_20">
              <input
                className=""
                type="text"
                placeholder="Street Address"
                name="streetAddress"
                tabIndex={2}
                defaultdefaultValue=""
                aria-required="true"
                required
              />
            </fieldset>
            <fieldset className="mb_20 text-start">
              <AsyncSelect cacheOptions defaultOptions loadOptions={promiseOptions} placeholder={'Search your address...'} onChange={(value) => {
                setSelectedDestination(value.item);
              }} />
            </fieldset>
            <div className="tf-cart-checkbox mb_20">
              <div className="tf-checkbox-wrapp">
                <input
                  defaultChecked
                  className=""
                  type="checkbox"
                  name="isDefault"
                  defaultValue={true}
                />
                <div>
                  <i className="icon-check" />
                </div>
              </div>
              <label htmlFor="CartDrawer-Form_agree">
                Set as default address.
              </label>
            </div>
            <div className="d-flex align-items-center justify-content-center gap-20">
              <button type="submit" className="tf-btn btn-fill radius-4">
                <span className="text">Add address</span>
              </button>
              <span
                className="tf-btn btn-fill radius-4 btn-hide-address"
                onClick={() => {
                  document
                    .querySelector(".createForm")
                    .classList.remove("d-block")
                  setSelectedDestination(null);
                }
                }
              >
                <span className="text">Cancel</span>
              </span>
            </div>
          </form>
          <div className="list-account-address">
            {addresses.map((address, index) => (
              <div key={address.id}>
                <div className="account-address-item">
                  <div>
                    <h6 className="mb_20">{address.addressName}</h6>
                    <p>{address.firstName} {address.lastName}</p>
                    <p>{address.streetAddress}</p>
                    <p>{address.destinationName}</p>
                    <p className="mb_10">{address.phone}</p>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="d-flex gap-10 justify-content-center">
                      <button
                        className="tf-btn radius-4 btn-fill justify-content-center btn-edit-address"
                        onClick={() => handleEditToggle(address.id)}
                      >
                        <span className="text">
                          {address.isEditing ? "Close" : "Edit"}
                        </span>
                      </button>
                      <button
                        className="tf-btn radius-4 btn-outline justify-content-center btn-delete-address"
                        onClick={() => handleDelete(address.id)}
                      >
                        <span className="text">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
                {address.isEditing && (
                  <form
                    className="edit-form-address wd-form-address d-block"
                    action={(formData) => handleEdit(formData, index)}
                  >
                    <div className="title">Edit address</div>
                    <div className="cols mb_20">
                      <fieldset className="">
                        <input
                          className=""
                          type="text"
                          placeholder="Address Name*"
                          name="addressName"
                          tabIndex={2}
                          aria-required="true"
                          defaultValue={address?.addressName || ''}
                          required
                        />
                      </fieldset>
                    </div>
                    <div className="cols mb_20">
                      <fieldset className="">
                        <input
                          className=""
                          type="text"
                          placeholder="First Name*"
                          name="firstName"
                          tabIndex={2}
                          aria-required="true"
                          defaultValue={address?.firstName || ''}
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
                          defaultValue={address?.lastName || ''}
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
                          defaultValue={user?.email || ''}
                          aria-required="true"
                          disabled
                        />
                      </fieldset>
                      <fieldset className="">
                        <input
                          className=""
                          type="text"
                          placeholder="Phone*"
                          name="phone"
                          tabIndex={2}
                          defaultValue={address?.phone || ''}
                          aria-required="true"
                          required
                        />
                      </fieldset>
                    </div>
                    <fieldset className="mb_20">
                      <input
                        className=""
                        type="text"
                        placeholder="Street Address"
                        name="streetAddress"
                        tabIndex={2}
                        defaultValue={address?.streetAddress || ''}
                        aria-required="true"
                        required
                      />
                    </fieldset>
                    <fieldset className="mb_20 text-start">
                      <AsyncSelect cacheOptions defaultOptions={[{ value: address.destinationId, label: address.destinationName }]} defaultValue={{ value: address.destinationId, label: address.destinationName }} loadOptions={promiseOptions} placeholder={'Search your address...'} onChange={(value) => {
                        setSelectedDestination(value.item);
                      }} />
                    </fieldset>
                    <div className="tf-cart-checkbox mb_20">
                      <div className="tf-checkbox-wrapp">
                        <input
                          defaultChecked={address?.isDefault || false}
                          className=""
                          type="checkbox"
                          id="CartDrawer-Form_agree"
                          name="isDefault"
                          value={true}
                        />
                        <div>
                          <i className="icon-check"></i>
                        </div>
                      </div>
                      <label htmlFor="CartDrawer-Form_agree">
                        Set as default address.
                      </label>
                    </div>
                    <div className="d-flex flex-column gap-20">
                      <button
                        type="submit"
                        className="tf-btn btn-fill radius-4"
                      >
                        <span className="text">Update address</span>
                      </button>
                      <span
                        onClick={() => handleEditToggle(address.id)}
                        className="tf-btn btn-fill radius-4 btn-hide-edit-address"
                      >
                        <span className="text">Cancel</span>
                      </span>
                    </div>
                  </form>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
