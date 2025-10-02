export default function DescriptionAccrdion({ description }) {
  return (
    <section className="">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <ul className="accordion-product-wrap" id="accordion-product">
              <li className="accordion-product-item">
                <a
                  href="#accordion-1"
                  className="accordion-title current"
                  data-bs-toggle="collapse"
                  aria-expanded="true"
                  aria-controls="accordion-1"
                >
                  <h6>Description</h6>
                  <span className="btn-open-sub" />
                </a>
                <div id="accordion-1" data-bs-parent="#accordion-product">
                  <div className="accordion-content tab-description">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: description || "",
                      }}
                    />
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
