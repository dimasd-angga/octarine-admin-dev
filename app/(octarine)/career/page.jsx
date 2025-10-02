import { getCareer } from "@/service/queries";
import Link from "next/link";
import CareerList from "./components/Career";

export const metadata = {
  title: "Career | Octarine",
  description: "",
};

export default async function CustomerFeedbackPage() {
  const career = await getCareer();
  return (
    <>
      <div className="page-title" style={{ background: "white" }}>
        <div className="container-full">
          <div className="row">
            <div className="col-12 text-center">
              <h3 className="heading text-center">Career</h3>
              <ul className="breadcrumbs d-flex align-items-center justify-content-center fw-light">
                <li>
                  <Link className="link" href={`/`}>
                    Homepage
                  </Link>
                </li>
                <li>
                  <i className="icon-arrRight" />
                </li>
                <li>
                  <a className="link text-secondary-3" href="#">
                    Career
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <CareerList career={career} />
    </>
  );
}
