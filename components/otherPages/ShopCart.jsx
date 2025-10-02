"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";

const shippingOptions = [
  {
    id: "free",
    label: "Free Shipping",
    price: 0.0,
  },
  {
    id: "local",
    label: "Local:",
    price: 35.0,
  },
  {
    id: "rate",
    label: "Flat Rate:",
    price: 35.0,
  },
];

export default function ShopCart() {
  const [activeDiscountIndex, setActiveDiscountIndex] = useState(1);
  const [selectedOption, setSelectedOption] = useState(shippingOptions[0]);
  const { cartProducts, setCartProducts, eligibleVouchers, totalPrice, subTotalPrice, updateQuantity, applyVoucherCart, removeVoucherCart, voucherCode, discountPrice } = useContextElement();
  const inputVoucherRef = useRef(null);

  const {
    removeProductFromCart,
  } = useContextElement();

  const handleOptionChange = (elm) => {
    setSelectedOption(elm);
  };

  const submitVoucher = () => {
    const voucherCode = inputVoucherRef.current.value;
    applyVoucherCart(voucherCode);
  }

  useEffect(() => {
    // document.querySelector(".progress-cart .value").style.width = "70%";
  }, []);

  useEffect(() => {
    if (inputVoucherRef.current != null) {
      inputVoucherRef.current.value = voucherCode;
    }
  }, [inputVoucherRef.current]);

  return (
    <>
      <section className="flat-spacing">
        <div className="container">
          <div className="row">
            <div className="col-xl-8">
              {cartProducts.length ? (
                <form onSubmit={(e) => e.preventDefault()}>
                  <table className="tf-table-page-cart">
                    <thead>
                      <tr>
                        <th>Products</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total Price</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {cartProducts.map((elm, i) => (
                        <tr key={i} className="tf-cart-item file-delete">
                          <td className="tf-cart-item_product">
                            <Link
                              href={`/product-detail/${elm.productVariantDto.productId}`}
                              className="img-box"
                            >
                              <Image
                                alt="product"
                                src={elm.productVariantDto.imageUrl}
                                width={600}
                                height={600}
                              />
                            </Link>
                            <div className="cart-info">
                              <Link
                                href={`/product-detail/${elm.productVariantDto.productId}`}
                                className="cart-title link"
                              >
                                {elm.productVariantDto.name}
                              </Link>
                              <div className="variant-box text-secondary-2" style={{ fontSize: 14 }}>
                                {elm.productVariantDto.volume} ML
                              </div>
                            </div>
                          </td>
                          <td
                            data-cart-title="Quantity"
                            className="tf-cart-item_quantity"
                          >
                            <div className="wg-quantity mx-md-auto">
                              <span
                                className="btn-quantity btn-decrease"
                                onClick={() =>
                                  updateQuantity(elm.productVariantDto.productId, elm.quantity - 1)
                                }
                              >
                                -
                              </span>
                              <input
                                type="text"
                                className="quantity-product"
                                name="number"
                                value={elm.quantity}
                                readOnly
                              />
                              <span
                                className="btn-quantity btn-increase"
                                onClick={() =>
                                  updateQuantity(elm.productVariantDto.productId, elm.quantity + 1)
                                }
                              >
                                +
                              </span>
                            </div>
                          </td>
                          <td
                            data-cart-title="Price"
                            className="tf-cart-item_price text-center"
                          >
                            <div className="cart-price text-button price-on-sale">
                              IDR {elm.productVariantDto.price?.toLocaleString() || 0}
                            </div>
                          </td>
                          <td
                            data-cart-title="Total"
                            className="tf-cart-item_total text-center"
                          >
                            <div className="cart-total text-button total-price">
                              IDR {(elm.productVariantDto.price * elm.quantity).toLocaleString()}
                            </div>
                          </td>
                          <td
                            data-cart-title="Remove"
                            className="remove-cart"
                            onClick={() => removeProductFromCart(elm.productVariantDto.productId)}
                          >
                            <span className="remove icon icon-close" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="ip-discount-code">
                    <input ref={inputVoucherRef} type="text" placeholder="Add voucher discount" />
                    {voucherCode == null ?
                      <button className="tf-btn" onClick={() => submitVoucher()}>
                        <span className="text">Apply Code</span>
                      </button> :
                      <button className="tf-btn bg-red" onClick={() => {
                        inputVoucherRef.current.value = null;
                        removeVoucherCart()
                      }}>
                        <span className="text">Remove Voucher</span>
                      </button>
                    }
                  </div>
                  <div className="group-discount">
                    {eligibleVouchers.map((item, index) => (
                      <div
                        key={index}
                        className={`box-discount ${activeDiscountIndex === index ? "active" : ""
                          }`}
                      >
                        <div className="discount-top d-flex flex-column">
                          <div className="discount-off">
                            <span className="sale-off text-btn-uppercase fw-normal">
                              {item.name}
                            </span>
                          </div>
                          <div className="discount-from">
                            <p className="text-caption-1 fw-bold">IDR {item.discountValue.toLocaleString()} Off</p>
                          </div>
                        </div>
                        <div className="discount-bot">
                          <button className="tf-btn" onClick={() => {
                            inputVoucherRef.current.value = item.code;
                            submitVoucher();
                          }}>
                            <span className="text">Use Coupon</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </form>
              ) : (
                <div>
                  Your wishlist is empty. Start adding your favorite products to
                  save them for later!{" "}
                  <Link className="btn-line" href="/shop-default-grid">
                    Explore Products
                  </Link>
                </div>
              )}
            </div>
            <div className="col-xl-4">
              <div className="fl-sidebar-cart">
                <div className="box-order bg-surface">
                  <h5 className="title">Order Summary</h5>
                  <div className="subtotal text-button d-flex justify-content-between align-items-center">
                    <span>Subtotal</span>
                    <span className="total">IDR {subTotalPrice.toLocaleString()}</span>
                  </div>
                  <div className="discount text-button d-flex justify-content-between align-items-center">
                    <span>Discounts</span>
                    <span className="total">IDR {discountPrice.toLocaleString()}</span>
                  </div>
                  {/* <div className="ship text-button d-flex justify-content-between align-items-center">
                    <span className="text-button">Shipping</span>
                    <span className="total">Free</span>
                    <div className="flex-grow-1">
                      {shippingOptions.map((option) => (
                        <fieldset key={option.id} className="ship-item">
                          <input
                            type="radio"
                            name="ship-check"
                            className="tf-check-rounded"
                            id={option.id}
                            checked={selectedOption === option}
                            onChange={() => handleOptionChange(option)}
                          />
                          <label htmlFor={option.id}>
                            <span>{option.label}</span>
                            <span className="price">
                              IDR {option.price.toLocaleString()}
                            </span>
                          </label>
                        </fieldset>
                      ))}
                    </div>
                  </div> */}
                  <h5 className="total-order d-flex justify-content-between align-items-center">
                    <span>Total</span>
                    <span className="total">
                      IDR {totalPrice
                        ? (selectedOption.price + totalPrice).toLocaleString()
                        : 0}
                    </span>
                  </h5>
                  <div className="box-progress-checkout">
                    <fieldset className="check-agree">
                      <input
                        type="checkbox"
                        id="check-agree"
                        className="tf-check-rounded"
                      />
                      <label htmlFor="check-agree">
                        I agree with the
                        <Link href={`/term-of-use`}>terms and conditions</Link>
                      </label>
                    </fieldset>
                    <Link href={`/checkout`} className="tf-btn btn-reset">
                      Process To Checkout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
