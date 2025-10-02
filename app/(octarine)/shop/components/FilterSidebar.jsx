"use client";


export default function FilterSidebar({
  allProps,
  genderPreferences,
  bannerTypes,
  productTypes,
}) {
  return (
    <div className="sidebar-filter canvas-filter left">
      <div className="canvas-wrapper">
        <div className="canvas-header d-flex d-xl-none">
          <h5>Filters</h5>
          <span className="icon-close close-filter" />
        </div>
        <div className="canvas-body">

          <div className="widget-facet facet-fieldset">
            <h6 className="facet-title">Gender preferences</h6>
            <div className="box-fieldset-item">
              {genderPreferences.map((genderData, index) => (
                <fieldset
                  key={index}
                  className="fieldset-item"
                  onClick={() => allProps.setGender(genderData.label)}
                >
                  <input
                    type="checkbox"
                    name="gender"
                    className="tf-check"
                    readOnly
                    checked={allProps.gender.includes(genderData.label)}
                  />
                  <label>{genderData.label} </label>
                </fieldset>
              ))}
            </div>
          </div>
          <div className="widget-facet facet-fieldset">
            <h6 className="facet-title">Product Types</h6>
            <div className="box-fieldset-item">
              {productTypes.map((product, index) => (
                <fieldset
                  key={index}
                  className="fieldset-item"
                  onClick={() => allProps.setProduct(product.label)}
                >
                  <input
                    type="checkbox"
                    name="productType"
                    className="tf-check"
                    readOnly
                    checked={allProps.product.includes(product.label)}
                  />
                  <label>{product.label} </label>
                </fieldset>
              ))}
            </div>
          </div>


          <div className="canvas-bottom d-block d-xl-none">
            <button
              id="reset-filter"
              onClick={allProps.clearFilter}
              className="tf-btn btn-reset"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
