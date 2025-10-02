"use client";
import { useContextElement } from "@/context/Context";
import { useState } from "react";
import VariantSelect from "./Variant";
import Slider1 from "./Slider";
import QuantitySelect from "@/components/productDetails/QuantitySelect";

export default function ProductDetail({ product }) {
  const [activeColor, setActiveColor] = useState("beige");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(product?.variants[0]?.price || 0);
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants[0]?.volume
  ); // Default value is "L"

  const handleChangeVariant = (volume, price) => {
    setSelectedVariant(volume);
    onSelectPrice(price);
  };

  const {
    addProductToCart,
    isAddedToCartProducts,
    addToWishlist,
    isAddedtoWishlist,
    isAddedtoCompareItem,
    addToCompareItem,
    cartProducts,
    updateQuantity,
  } = useContextElement();

  return (
    <section className="flat-spacing">
      <div className="tf-main-product section-image-zoom">
        <div className="container">
          <div className="row">
            {/* Product default */}
            <div className="col-md-6">
              <div className="tf-product-media-wrap sticky-top">
                <Slider1
                  setActiveColor={setActiveColor}
                  activeColor={activeColor}
                  firstItem={product.images[0]}
                  slideItems={
                    product.variants.length > 0
                      ? product.variants.map((data) => data.imageUrl)
                      : []
                  }
                />
              </div>
            </div>
            {/* /Product default */}
            {/* tf-product-info-list */}
            <div className="col-md-6">
              <div className="sticky-top">
                <div className="tf-product-info-wrap position-relative">
                  <div className="tf-zoom-main" />
                  <div className="tf-product-info-list other-image-zoom">
                    <div className="tf-product-info-heading">
                      <div className="tf-product-info-name">
                        <div className="text text-btn-uppercase">Clothing</div>
                        <h3 className="name">{product.name}</h3>
                      </div>
                      <div className="tf-product-info-desc">
                        <div className="tf-product-info-price">
                          <h5 className="price-on-sale font-2">
                            {" "}
                            IDR {price.toLocaleString("id-ID")}
                          </h5>
                        </div>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: product.description || "",
                          }}
                        />
                      </div>
                    </div>
                    {product.variants.length > 0 && (
                      <div className="tf-product-info-choose-option">
                        <div className="variant-picker-item">
                          <div className="d-flex justify-content-between mb_12">
                            <div className="variant-picker-label">
                              selected Variant:
                              <span className="text-title variant-picker-label-value">
                                {selectedVariant}
                              </span>
                            </div>
                          </div>
                          <div className="variant-picker-values gap12">
                            {product.variants.map(
                              ({ id, volume, price, disabled }) => (
                                <div
                                  key={id}
                                  onClick={() =>
                                    handleChangeVariant(volume, price)
                                  }
                                >
                                  <input
                                    type="radio"
                                    id={id}
                                    checked={selectedVariant === volume}
                                    disabled={disabled}
                                    readOnly
                                  />
                                  <label
                                    className={`style-text size-btn ${
                                      disabled ? "type-disable" : ""
                                    }`}
                                    htmlFor={id}
                                    data-value={volume}
                                    data-price={price}
                                  >
                                    <span className="text-title">{volume}</span>
                                  </label>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    <div
                      className="tf-product-info-choose-option"
                      style={{ marginTop: 12 }}
                    >
                      <div className="tf-product-info-quantity">
                        <div className="title mb_12">Quantity:</div>
                        <QuantitySelect
                          quantity={
                            isAddedToCartProducts(product.id)
                              ? cartProducts.filter(
                                  (elm) =>
                                    elm.productVariantDto.productId ==
                                    product.id
                                )[0].quantity
                              : quantity
                          }
                          setQuantity={(qty) => {
                            if (isAddedToCartProducts(product.id)) {
                              updateQuantity(product.id, qty);
                            } else {
                              setQuantity(qty);
                            }
                          }}
                        />
                      </div>
                      <div className="tf-product-info-by-btn mb_10">
                        <a
                          onClick={() =>
                            addProductToCart(product, selectedVariant, quantity)
                          }
                          className="btn-style-2 flex-grow-1 text-btn-uppercase fw-6 btn-add-to-cart"
                        >
                          <span>
                            {isAddedToCartProducts(product.id)
                              ? "Already Added"
                              : "Add to cart"}
                          </span>
                        </a>
                        <a
                          onClick={() => addToWishlist(product.id)}
                          className="box-icon hover-tooltip text-caption-2 wishlist btn-icon-action"
                        >
                          <span className="icon icon-heart" />
                          <span className="tooltip text-caption-2">
                            {isAddedtoWishlist(product.id)
                              ? "Already Wishlished"
                              : "Wishlist"}
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /tf-product-info-list */}
          </div>
        </div>
      </div>
      {/* <ProductStikyBottom /> */}
    </section>
  );
}
