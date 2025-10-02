import React from "react";
import ProductCard1 from "./ProductCard";

export default function GridView({ products, allProps }) {
  return (
    <>
      {products.map((product, index) => (
        <ProductCard1 key={index} product={product} gridClass="grid" />
      ))}
    </>
  );
}
