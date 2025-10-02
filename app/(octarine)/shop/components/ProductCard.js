"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import styles from "./productCard.module.scss";

export default function OctarineProductCard({
  product,
  gridClass = "",
  parentClass = "card-product wow fadeInUp",
  isNotImageRatio = false,
  radiusClass = "",
}) {
  const [currentImage, setCurrentImage] = useState(product.images[0]);

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
    setCurrentImage(product.images[0]);
  }, [product]);

  return (
    <div
      className={`${parentClass} ${gridClass} ${styles.card} ${
        product.isOnSale ? "on-sale" : ""
      } ${product.sizes ? "card-product-size" : ""}`}
    >
      <div
        className={`card-product-wrapper ${styles.cardWrapper} ${
          isNotImageRatio ? "aspect-ratio-0" : ""
        } ${radiusClass}`}
      >
        <Link
          href={`/product-detail/${product.id}`}
          className={`${styles.productImg} product-img`}
        >
          <Image
            className={`${styles.imgProduct} img-product lazyload`}
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

        {/* <div className={`list-btn-main ${styles.listBtnMain}`}>
          {product.addToCart === "Quick Add" ? (
            <a
              className={`btn-main-product ${styles.btnMainProduct}`}
              href="#quickAdd"
              onClick={() => setQuickAddItem(product.id)}
              data-bs-toggle="modal"
            >
              Quick Add
            </a>
          ) : (
            <a
              className={`btn-main-product ${styles.btnMainProduct}`}
              onClick={() => addProductToCart(product)}
            >
              {isAddedToCartProducts(product.id)
                ? "Already Added"
                : "ADD TO CART"}
            </a>
          )}
        </div> */}
      </div>
      <div className={`card-product-info ${styles.cardInfo}`}>
        <p style={{ fontSize: "13px" }}>Woody, Ambery, Vanilla</p>

        <Link href={`/product-detail/${product.id}`} className={styles.title}>
          {product.name}
        </Link>
        <span className={styles.price}>
          {product.oldPrice && (
            <span className={styles.oldPrice}>
              IDR {product.oldPrice.toLocaleString()}
            </span>
          )}{" "}
          <span className={styles.newPrice}>
            IDR {product.price?.toLocaleString()}
          </span>
        </span>
        {/* {product.description && (
          <div className={styles.description}>
            <p>{product.description.split("\n")[0]}</p>{" "}
            <p>{product.description.split("\n")[1]}</p>{" "}
          </div>
        )} */}
        <div className={styles.rating}>
          <span>★ {product.rating || "4.5"}</span>
          <span>({product.reviewCount || "2"})</span>
        </div>
        {product.colors && (
          <ul className={styles.listColorProduct}>
            {product.colors.map((color, index) => (
              <li
                key={index}
                className={`${
                  styles.listColorItem
                } list-color-item color-swatch  ${
                  currentImage === color.imgSrc ? "active" : ""
                } ${color.bgColor === "bg-white" ? "line" : ""}`}
                onMouseOver={() => setCurrentImage(color.imgSrc)}
              >
                <span className={`swatch-value ${color.bgColor}`} />
                <Image
                  className="lazyload"
                  src={color.imgSrc}
                  alt="color variant"
                  width={600}
                  height={600}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
