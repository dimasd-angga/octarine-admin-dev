"use client";

import { useContextElement } from "@/context/Context";
import { checkout, getAllAddress, getDeliveryCost } from "@/service/queries";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Checkout() {
  const [addresses, setAddresses] = useState([]);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const btnSubmitInformation = useRef(null);

  const { cartProducts, totalPrice, discountPrice } = useContextElement();
  const { user, getTotalWeightCart } = useContextElement();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllAddress();
      setAddresses(response);
    }
    if (user != null) {
      fetchData();
    }
  }, [user])

  useEffect(() => {
    const fetchData = async () => {
      const weight = getTotalWeightCart();
      const response = await getDeliveryCost({ destinationId: selectedAddress.destinationId, weight });
      setShippingOptions(response);
    }
    if (selectedAddress != null) {
      fetchData();
    }
  }, [selectedAddress])


  const onSubmitPaymentInformation = async (formData) => {
    if (user == null) {
      toast.error('Please login first');
      return;
    }
    if (selectedAddress == null) {
      toast.error('Please select address');
      return;
    }
    if (selectedShipping == null) {
      toast.error('Please select shipping');
      return;
    }

    const object = {};
    formData.forEach(function (value, key) {
      object[key] = value;
    });

    object['userAddressId'] = selectedAddress.id;
    object['receiverDestinationId'] = selectedAddress.destinationId;
    object['shippingName'] = selectedShipping.shippingName;
    object['shippingServiceName'] = selectedShipping.serviceName;

    toast.info('Initialize payment...');
    btnSubmitInformation.current.disabled = true;
    try {
      const response = await checkout(object);
      localStorage.setItem('order', JSON.stringify(response));
      if (response?.snapRedirectUrl != null) {
        window.location.href = response.snapRedirectUrl;
      } else {
        toast.error('Url payment not found.');
      }
    } catch (error) {
      toast.error('Failed to checkout');
      console.error(error);
    }
    btnSubmitInformation.current.disabled = false;
  }

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-xl-6">
            <div className="flat-spacing tf-page-checkout">
              {user == null &&
                <div className="wrap">
                  <div className="title-login">
                    <p>Already have an account?</p>{" "}
                    <Link href={`/login`} className="text-button">
                      Login here
                    </Link>
                  </div>
                  <form
                    className="login-box"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <div className="grid-2">
                      <input type="text" placeholder="Your name/Email" />
                      <input type="password" placeholder="Password" />
                    </div>
                    <button className="tf-btn" type="submit">
                      <span className="text">Login</span>
                    </button>
                  </form>
                </div>
              }
              <form action={onSubmitPaymentInformation}>
                <div className="wrap">
                  <h5 className="title">Select Address</h5>
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
                          <div className="d-flex justify-content-center align-items-center">
                            <input
                              type="radio"
                              name="userAddressId"
                              className="tf-check-rounded"
                              checked={selectedAddress?.destinationId == address.destinationId}
                              value={address.destinationId}
                              onChange={() => setSelectedAddress(address)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="wrap">
                  <h5 className="title">Choose payment Option:</h5>
                  <div
                    className="form-payment"
                  >
                    <div className="payment-box" id="payment-box">
                      {/* <div className="payment-item payment-choose-card active">
                      <label
                        htmlFor="credit-card-method"
                        className="payment-header"
                        data-bs-toggle="collapse"
                        data-bs-target="#credit-card-payment"
                        aria-controls="credit-card-payment"
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          className="tf-check-rounded"
                          id="credit-card-method"
                          defaultChecked
                        />
                        <span className="text-title">Credit Card</span>
                      </label>
                      <div
                        id="credit-card-payment"
                        className="collapse show"
                        data-bs-parent="#payment-box"
                      >
                        <div className="payment-body">
                          <p className="text-secondary">
                            Make your payment directly into our bank account.
                            Your order will not be shipped until the funds have
                            cleared in our account.
                          </p>
                          <div className="input-payment-box">
                            <input type="text" placeholder="Name On Card*" />
                            <div className="ip-card">
                              <input type="text" placeholder="Card Numbers*" />
                              <div className="list-card">
                                <Image
                                  width={48}
                                  height={16}
                                  alt="card"
                                  src="/images/payment/img-7.png"
                                />
                                <Image
                                  width={21}
                                  height={16}
                                  alt="card"
                                  src="/images/payment/img-8.png"
                                />
                                <Image
                                  width={22}
                                  height={16}
                                  alt="card"
                                  src="/images/payment/img-9.png"
                                />
                                <Image
                                  width={24}
                                  height={16}
                                  alt="card"
                                  src="/images/payment/img-10.png"
                                />
                              </div>
                            </div>
                            <div className="grid-2">
                              <input type="date" />
                              <input type="text" placeholder="CVV*" />
                            </div>
                          </div>
                          <div className="check-save">
                            <input
                              type="checkbox"
                              className="tf-check"
                              id="check-card"
                              defaultChecked
                            />
                            <label htmlFor="check-card">
                              Save Card Details
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-item">
                      <label
                        htmlFor="delivery-method"
                        className="payment-header collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#delivery-payment"
                        aria-controls="delivery-payment"
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          className="tf-check-rounded"
                          id="delivery-method"
                        />
                        <span className="text-title">Cash on delivery</span>
                      </label>
                      <div
                        id="delivery-payment"
                        className="collapse"
                        data-bs-parent="#payment-box"
                      />
                    </div>
                    <div className="payment-item">
                      <label
                        htmlFor="apple-method"
                        className="payment-header collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#apple-payment"
                        aria-controls="apple-payment"
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          className="tf-check-rounded"
                          id="apple-method"
                        />
                        <span className="text-title apple-pay-title">
                          <Image
                            alt="apple"
                            src="/images/payment/applePay.png"
                            width={13}
                            height={18}
                          />
                          Apple Pay
                        </span>
                      </label>
                      <div
                        id="apple-payment"
                        className="collapse"
                        data-bs-parent="#payment-box"
                      />
                    </div>
                    <div className="payment-item paypal-item">
                      <label
                        htmlFor="paypal-method"
                        className="payment-header collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#paypal-method-payment"
                        aria-controls="paypal-method-payment"
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          className="tf-check-rounded"
                          id="paypal-method"
                        />
                        <span className="paypal-title">
                          <Image
                            alt="apple"
                            src="/images/payment/paypal.png"
                            width={90}
                            height={23}
                          />
                        </span>
                      </label>
                      <div
                        id="paypal-method-payment"
                        className="collapse"
                        data-bs-parent="#payment-box"
                      />
                    </div> */}
                      <div className="payment-item">
                        <label
                          htmlFor="midtrans-method"
                          className="payment-header collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#midtrans-payment"
                          aria-controls="midtrans-payment"
                        >
                          <input
                            type="radio"
                            name="payment-method"
                            className="tf-check-rounded"
                            id="midtrans-method"
                            checked
                          />
                          <div className="text-title midtrans-pay-title d-flex aligm-items-center gap-2">
                            <div>
                              <Image
                                alt="midtrans"
                                src="/images/payment/midtrans-logo.jpg"
                                width={13}
                                height={18}
                              />
                            </div>
                            <span>
                              Midtrans
                            </span>
                          </div>
                        </label>
                        <div
                          id="midtrans-payment"
                          className="collapse"
                          data-bs-parent="#payment-box"
                        />
                      </div>
                    </div>
                    <button ref={btnSubmitInformation} className="tf-btn btn-reset">Payment</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-xl-1">
            <div className="line-separation" />
          </div>
          <div className="col-xl-5">
            <div className="flat-spacing flat-sidebar-checkout">
              <div className="sidebar-checkout-content">
                <h5 className="title">Shopping Cart</h5>
                <div className="list-product">
                  {cartProducts.map((elm, i) => (
                    <div key={i} className="item-product">
                      <Link
                        href={`/product-detail/${elm.productVariantDto.productId}`}
                        className="img-product"
                      >
                        <Image
                          alt="img-product"
                          src={elm.productVariantDto.imageUrl}
                          width={600}
                          height={600}
                        />
                      </Link>
                      <div className="content-box">
                        <div className="info">
                          <Link
                            href={`/product-detail/${elm.productVariantDto.productId}`}
                            className="name-product link text-title"
                          >
                            {elm.productVariantDto.name}
                          </Link>
                          <div className="variant text-caption-1 text-secondary">
                            {elm.productVariantDto.volume} ML
                          </div>
                        </div>
                        <div className="total-price text-button">
                          <span className="count">{elm.quantity}</span>X
                          <span className="price">IDR {elm.productVariantDto.price?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="sec-total-price">
                  <div className="top">
                    <div className="ship text-button d-flex justify-content-between align-items-center">
                      <span className="text-button">Shipping</span>
                      <div className="w-100">
                        <select className="w-100 form-select" name="selectedShipping" onChange={(e) => e.target.value == null ? setSelectedShipping(null) : setSelectedShipping(shippingOptions[e.target.value])}>
                          <option value="" selected>Select shipping</option>
                          {shippingOptions.map((option, index) => (
                            <option value={index} key={index}>
                              {option.shippingName} - {option.type.toUpperCase()}&emsp;({option.etd})&emsp;IDR {(option.shippingCost || 0).toLocaleString()}
                            </option>
                          ))}
                        </select>
                        {/* {shippingOptions.map((option, index) => (
                          <fieldset key={index} className="ship-item">
                            <input
                              type="radio"
                              name="ship-check"
                              className="tf-check-rounded"
                              id={`shipping-${index}`}
                              checked={selectedShipping === option}
                              onChange={() => setSelectedShipping(option)}
                            />
                            <label htmlFor={`shipping-${index}`} className="d-flex gap-3">
                              <span className="text-capitalize">{option.shippingName || 'Unknown'} - {option.type || 'Unknown'}</span>
                              <span className="estimated">
                                ({option.etd})
                              </span>
                              <span className="price">
                                IDR {(option.shippingCost || 0).toLocaleString()}
                              </span>
                            </label>
                          </fieldset>
                        ))} */}
                      </div>
                    </div>
                    <div className="item d-flex align-items-center justify-content-between text-button">
                      <span>Discounts</span>
                      <span>IDR {discountPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="bottom">
                    <h5 className="d-flex justify-content-between">
                      <span>Total</span>
                      <span className="total-price-checkout">
                        IDR {(totalPrice + (selectedShipping?.shippingCost || 0)).toLocaleString()}
                      </span>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
