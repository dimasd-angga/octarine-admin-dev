"use client";

import AccountSidebar from "@/components/my-account/AccountSidebar";
import OrderDetails from "@/components/my-account/OrderDetails";
import { getDetailOrder } from "@/service/queries";
import React, { useEffect, useState } from "react";

export default function MyAccountOrdersDetailsPage({ params }) {
    const { id } = params;

    const [order, setOrder] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const response = await getDetailOrder(id);
            console.log(response);
            setOrder(response);
        }
        fetchData();
    }, [])

    return (
        <>
            <section className="flat-spacing">
                <div className="container">
                    <div className="my-account-wrap">
                        <AccountSidebar />
                        <OrderDetails />
                    </div>
                </div>
            </section>
        </>
    );
}
