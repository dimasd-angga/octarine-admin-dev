"use client";

import Sorting from "./Sorting";
import GridView from "./GridView";
import { useEffect, useReducer, useState } from "react";
import FilterModal from "./FilterModal";
import { initialState, reducer } from "@/reducer/octarineReducer";
import FilterSidebar from "./FilterSidebar";
import Pagination from "./Pagination";
import { useRouter } from "next/navigation";

export default function Products({
  initialProducts,
  currentPage: initialPage,
  totalElements,
  totalPages: initialTotalPages,
  menPerfumeCount,
  womenPerfumeCount,
  unisexPerfumeCount,
  genderPreferences,
  bannerTypes,
  productTypes,
}) {
  const [activeLayout, setActiveLayout] = useState(3);
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    filtered: initialProducts,
    sorted: initialProducts,
    currentPage: initialPage || 1,
    itemPerPage: 10,
  });

  const {
    price,
    availability,
    color,
    size,
    brands,
    filtered,
    sortingOption,
    sorted,
    activeFilterOnSale,
    currentPage,
    itemPerPage,
    gender,
    banner,
    product,
  } = state;

  const [initialProductsState, setInitialProducts] = useState(
    Array.isArray(initialProducts) ? initialProducts : []
  );

  const allProps = {
    ...state,
    setPrice: (value) => dispatch({ type: "SET_PRICE", payload: value }),
    setColor: (value) =>
      value === color
        ? dispatch({ type: "SET_COLOR", payload: "All" })
        : dispatch({ type: "SET_COLOR", payload: value }),
    setSize: (value) =>
      value === size
        ? dispatch({ type: "SET_SIZE", payload: "All" })
        : dispatch({ type: "SET_SIZE", payload: value }),
    setAvailability: (value) => {
      return value === availability
        ? dispatch({ type: "SET_AVAILABILITY", payload: "All" })
        : dispatch({ type: "SET_AVAILABILITY", payload: value });
    },
    setBrands: (newBrand) => {
      const updated = brands.includes(newBrand)
        ? brands.filter((elm) => elm !== newBrand)
        : [...brands, newBrand];
      dispatch({ type: "SET_BRANDS", payload: updated });
      updateURL({ brands: updated });
    },
    setGender: (value) => {
      const updated = gender.includes(value)
        ? gender.filter((elm) => elm !== value)
        : [...gender, value];
      dispatch({ type: "SET_GENDER", payload: updated });
      updateURL({ gender: updated });
    },
    setProduct: (value) => {
      const updated = product.includes(value)
        ? product.filter((elm) => elm !== value)
        : [...product, value];
      dispatch({ type: "SET_PRODUCT", payload: updated });
      updateURL({ product: updated });
    },
    setBanner: (newBrand) => {
      const updated = banner.includes(newBrand)
        ? banner.filter((elm) => elm !== newBrand)
        : [...banner, newBrand];
      dispatch({ type: "SET_BANNER", payload: updated });
      updateURL({ banner: updated });
    },
    removeBrand: (newBrand) => {
      const updated = brands.filter((brand) => brand !== newBrand);
      dispatch({ type: "SET_BRANDS", payload: updated });
      updateURL({ brands: updated });
    },
    setSortingOption: (value) =>
      dispatch({ type: "SET_SORTING_OPTION", payload: value }),
    toggleFilterWithOnSale: () => {
      dispatch({ type: "TOGGLE_FILTER_ON_SALE" });
      updateURL({ onSale: !activeFilterOnSale });
    },
    setCurrentPage: (value) =>
      dispatch({ type: "SET_CURRENT_PAGE", payload: value }),
    setItemPerPage: (value) => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
      dispatch({ type: "SET_ITEM_PER_PAGE", payload: value });
    },
    clearFilter: () => {
      dispatch({ type: "CLEAR_FILTER" });
      updateURL({
        brands: [],
        gender: [],
        banner: [],
        product: [],
        onSale: false,
      });
    },
  };

  const updateURL = (newParams) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(newParams).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(","));
      } else if (typeof value === "boolean") {
        params.set(key, value.toString());
      } else if (value === null || value.length === 0) {
        params.delete(key);
      }
    });
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const commonItems = initialProducts;
    dispatch({ type: "SET_SORTED", payload: commonItems });
  }, [initialProducts]);

  return (
    <>
      <section className="flat-spacing">
        <div className="container">
          <div className="tf-shop-control no-grid row">
            <div className="tf-control-filter col-3">
              <button className="filterShop tf-btn-filter hidden-mx-1200">
                <span className="icon icon-filter" />
                <span className="text">Filters</span>
              </button>
              <a
                href="#filterShop"
                data-bs-toggle="offcanvas"
                aria-controls="filterShop"
                className="tf-btn-filter show-mx-1200"
              >
                <span className="icon icon-filter" />
                <span className="text">Filters</span>
              </a>
              <div
                className={`d-none d-lg-flex shop-sale-text ${
                  activeFilterOnSale ? "active" : ""
                }`}
              >
                {totalElements} Products Found
              </div>
            </div>
            <div className="col-9 tf-search-input">
              <form
                className="form-search"
                onSubmit={(e) => e.preventDefault()}
              >
                <fieldset className="text">
                  <input
                    type="text"
                    placeholder="Searching..."
                    className=""
                    name="text"
                    tabIndex={0}
                    defaultValue=""
                    aria-required="true"
                    required
                  />
                </fieldset>
                <button className="" type="submit">
                  <svg
                    className="icon"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                      stroke="#181818"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21.35 21.0004L17 16.6504"
                      stroke="#181818"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>
          <div className="wrapper-control-shop">
            <div className="row">
              <div className="col-xl-3">
                <FilterSidebar
                  allProps={allProps}
                  genderPreferences={genderPreferences}
                  bannerTypes={bannerTypes}
                  productTypes={productTypes}
                />
              </div>
              <div className="col-xl-9">
                <div
                  className={`tf-grid-layout wrapper-shop tf-col-${activeLayout}`}
                  id="gridLayout"
                >
                  <GridView products={sorted} allProps={allProps} />
                </div>
                {itemPerPage < filtered.length && (
                  <ul className="wg-pagination justify-content-center">
                    <Pagination
                      allProps={allProps}
                      totalPages={initialTotalPages}
                    />
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <FilterModal allProps={allProps} />
    </>
  );
}
