"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import styles from "./BestSeller.module.scss";

// Helper function to format Indonesian price
const formatIDRPrice = (price) => {
  if (!price) return "";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Helper function to calculate discount percentage
const calculateDiscountPercentage = (oldPrice, newPrice) => {
  if (!oldPrice || !newPrice || oldPrice <= newPrice) return 0;
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
};

export default function ProductVariantCard({
  product,
  gridClass = "",
  parentClass = "card-product wow fadeInUp",
  isNotImageRatio = false,
  radiusClass = "",
}) {
  const [currentImage, setCurrentImage] = useState(product.imageUrl);

  const {
    setQuickAddItem,
    addToWishlist,
    isAddedtoWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
    setQuickViewItem,
    addProductToCart,
    isAddedToCartProducts,
  } = useContextElement();

  useEffect(() => {
    setCurrentImage(product.imageUrl);
  }, [product]);

  // Calculate dynamic discount percentage
  const discountPercentage = calculateDiscountPercentage(
    product.oldPrice,
    product.price
  );

  return (
    <div
      className={`${parentClass} ${gridClass} ${
        product.isOnSale ? "on-sale" : ""
      } ${product.sizes ? "card-product-size" : ""}`}
    >
      <div
        className={`card-product-wrapper ${
          isNotImageRatio ? "aspect-ratio-0" : styles.aspectRatio1_1
        } ${radiusClass} `}
      >
        <Link
          href={`/product-detail/${product.productId}`}
          className="product-img"
        >
          <Image
            className="lazyload img-product"
            src={currentImage}
            alt={product.name}
            width={600}
            height={600}
          />

          <Image
            className="lazyload img-hover"
            src={currentImage}
            alt={product.name}
            width={600}
            height={600}
          />
        </Link>
        {product.hotSale && (
          <div className="marquee-product bg-main">
            <div className="marquee-wrapper">
              <div className="initial-child-container">
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale {discountPercentage}% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale {discountPercentage}% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale {discountPercentage}% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale {discountPercentage}% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale {discountPercentage}% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
              </div>
            </div>
            <div className="marquee-wrapper">
              <div className="initial-child-container">
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale {discountPercentage}% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale {discountPercentage}% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale {discountPercentage}% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale {discountPercentage}% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale {discountPercentage}% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic discount badge */}
        {/* {discountPercentage > 0 && (
              <div className="on-sale-wrap">
                <span className="on-sale-item">-{discountPercentage}%</span>
              </div>
          )} */}

        {/*<div className="list-btn-main">*/}
        {/*  {product.addToCart == "Quick Add" ? (*/}
        {/*      <a*/}
        {/*          className="btn-main-product"*/}
        {/*          href="#quickAdd"*/}
        {/*          onClick={() => setQuickAddItem(product.productId)}*/}
        {/*          data-bs-toggle="modal"*/}
        {/*      >*/}
        {/*        Quick Add*/}
        {/*      </a>*/}
        {/*  ) : (*/}
        {/*      <a*/}
        {/*          className="btn-main-product"*/}
        {/*          onClick={() => addProductToCart(product.productId)}*/}
        {/*      >*/}
        {/*        {isAddedToCartProducts(product.productId)*/}
        {/*            ? "Already Added"*/}
        {/*            : "ADD TO CART"}*/}
        {/*      </a>*/}
        {/*  )}*/}
        {/*</div>*/}
      </div>
      <div className="card-product-info">
        <p style={{ fontSize: "13px" }}>Woody, Ambery, Vanilla</p>

        <Link
          href={`/product-detail/${product.productId}`}
          className="title link"
        >
          {product.name}
        </Link>
        <span className="price" style={{ marginTop: 5 }}>
          {product.oldPrice && (
            <span className="old-price">
              {formatIDRPrice(product.oldPrice)}
            </span>
          )}{" "}
          {formatIDRPrice(product.price)}
        </span>
        <div className="d-flex align-items-center">
          <svg
            width="14"
            height="13"
            viewBox="0 0 14 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.88301 13.0002L3.96634 8.31683L0.333008 5.16683L5.13301 4.75016L6.99967 0.333496L8.86634 4.75016L13.6663 5.16683L10.033 8.31683L11.1163 13.0002L6.99967 10.5168L2.88301 13.0002Z"
              fill="#F0A750"
            />
          </svg>
          <div className="text-rating">
            4.5 <span>(2)</span>
          </div>
        </div>
        {/* {product.colors && (
          <ul className="list-color-product">
            {product.colors.map((color, index) => (
              <li
                key={index}
                className={`list-color-item color-swatch ${
                  currentImage == color.imgSrc ? "active" : ""
                } ${color.bgColor == "bg-white" ? "line" : ""}`}
                onMouseOver={() => setCurrentImage(color.imgSrc)}
              >
                <span className={`swatch-value ${color.bgColor}`} />
                <Image
                  className="lazyload"
                  src={color.imgSrc}
                  alt="color variant"
                  width={600}
                  height={800}
                />
              </li>
            ))}
          </ul>
        )} */}
      </div>
    </div>
  );
}
