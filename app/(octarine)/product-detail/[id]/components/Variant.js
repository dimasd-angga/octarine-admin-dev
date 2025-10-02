"use client";

import { useState } from "react";

export default function VariantSelect({ variant, onSelectPrice }) {
  const [selectedVariant, setSelectedVariant] = useState(variant[0].volume); // Default value is "L"

  const handleChange = (volume, price) => {
    setSelectedVariant(volume);
    onSelectPrice(price);
  };
  return (
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
        {variant.map(({ id, volume, price, disabled }) => (
          <div key={id} onClick={() => handleChange(volume, price)}>
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
        ))}
      </div>
    </div>
  );
}
