"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function PaymentStatusPage() {
    return (
        <Suspense>
            <PaymentStatusComponent />
        </Suspense>
    );
}

function PaymentStatusComponent() {
    const searchParams = useSearchParams()
    const statusCode = searchParams.get('status_code');
    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (statusCode == 200) {
            toast.success('Your order success');
            const currentOrder = localStorage.getItem('order');
            setOrder(JSON.parse(currentOrder));
        } else {
            toast.error('Your order failed');
        }
    }, []);

    return (
        <div className="mx-auto d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: '80vh', maxWidth: '628px' }}>
            {statusCode == 200 ?
                <>
                    <div className="d-flex justify-content-center align-items-center gap-3" style={{ marginBottom: '66px' }}>
                        <h2 className="fw-bold" style={{ fontSize: '40px' }}>Payment Success</h2>
                        <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M33.3123 12.6206L28.9719 8.28027L15.0457 22.2065L10.0298 17.1907L5.68945 21.5311L15.1253 30.9777L33.3123 12.6206Z" fill="#B1CC33" />
                            <path d="M5.6875 21.5364L15.1233 30.9831L33.3125 12.626L28.9721 8.28564L15.0459 22.2119L10.03 17.1961L5.6875 21.5364Z" stroke="black" stroke-width="0.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    {order?.id &&
                        <Link href={`/my-account-orders/${order.id}`} className="tf-btn w-100">
                            <span className="text">Track Shipping</span>
                        </Link>}
                </>
                :
                <>
                    <div className="d-flex justify-content-center align-items-center gap-3" style={{ marginBottom: '66px' }}>
                        <h2 className="fw-bold" style={{ fontSize: '40px' }}>Payment Failed</h2>
                        <p style={{ fontSize: '40px' }}>❌</p>
                    </div>
                    <Link href={'/'} className="tf-btn w-100">
                        <span className="text">Back To Home</span>
                    </Link>
                </>
            }
        </div>
    );
}