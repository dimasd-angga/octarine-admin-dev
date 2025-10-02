"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getOrders } from "@/service/queries";

export default function Orers() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getOrders();
      setOrders(response);
    }
    fetchData();
  }, [])

  return (
    <div className="my-account-content">
      <div className="account-orders">
        <div className="wrap-account-order">
          <h3>My Orders</h3>

          <ul>
            {orders.length == 0 &&
              <li className="text-center text-secondary">
                Empty Order
              </li>
            }
            {orders.map((order, index) =>
              <li key={index}>
                <div className="top">
                  <div className="d-flex align-items-center flex-wrap gap-3">
                    <div className="information">
                      <p>Order Date :</p>
                      <h5>Jan 21, 2022</h5>
                    </div>
                    <div className="information">
                      <p>Voucher Discount :</p>
                      <h5>IDR {order.voucherDiscount > 0 ? '-' : ''}{order.voucherDiscount.toLocaleString()}</h5>
                    </div>
                    <div className="information">
                      <p>Total Amount :</p>
                      <h5>IDR {order.finalTotalPrice.toLocaleString()}</h5>
                    </div>
                    <div className="information">
                      <p>Ship To :</p>
                      <h5>Rajkot, Gujrat, India</h5>
                    </div>
                  </div>
                  <div className="d-flex flex-column justify-content-end">
                    <p className="invoice">Order: #{order.id}</p>
                    <Link
                      href={`/my-account-orders/${order.id}`}
                      className="tf-btn btn-fill radius-4"
                    >
                      <span className="text">View</span>
                    </Link>
                  </div>
                </div>
                <hr />
                <div className="content">
                  <h4 className="develiry-time">Delivered April 10</h4>
                  {order.orderItems.map((item, index) =>
                    <div className="d-flex align-items-center gap-3 mb-2" key={index}>
                      <div className="wrapper-image-product">
                        <Image
                          alt="product"
                          src={item.productVariantDto.imageUrl}
                          width={600}
                          height={600}
                        />
                      </div>
                      <div className="product-detail">
                        <h5 className="title">{item.productVariantDto.name}</h5>
                        <p className="variant">Variasi: {item.productVariantDto.volume}ml</p>
                        <p className="quantity">x{item.quantity}</p>
                      </div>
                      <div className="wrapper-price">
                        <p className="price">Rp{item.price}</p>
                      </div>
                    </div>
                  )}
                </div>
              </li>)}
          </ul>
          {/* <table>
            <thead>
              <tr>
                <th className="fw-6">Order</th>
                <th className="fw-6">Date</th>
                <th className="fw-6">Status</th>
                <th className="fw-6">Total</th>
                <th className="fw-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="tf-order-item">
                <td>#123</td>
                <td>August 1, 2024</td>
                <td>On hold</td>
                <td>$200.0 for 1 items</td>
                <td>
                  <Link
                    href={`/my-account-orders-details`}
                    className="tf-btn btn-fill radius-4"
                  >
                    <span className="text">View</span>
                  </Link>
                </td>
              </tr>
              <tr className="tf-order-item">
                <td>#345</td>
                <td>August 2, 2024</td>
                <td>On hold</td>
                <td>$300.0 for 1 items</td>
                <td>
                  <Link
                    href={`/my-account-orders-details`}
                    className="tf-btn btn-fill radius-4"
                  >
                    <span className="text">View</span>
                  </Link>
                </td>
              </tr>
              <tr className="tf-order-item">
                <td>#567</td>
                <td>August 3, 2024</td>
                <td>On hold</td>
                <td>$400.0 for 1 items</td>
                <td>
                  <Link
                    href={`/my-account-orders-details`}
                    className="tf-btn btn-fill radius-4"
                  >
                    <span className="text">View</span>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table> */}
        </div>
      </div>
    </div>
  );
}
