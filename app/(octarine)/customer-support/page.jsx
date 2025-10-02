"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import './CustomerSupport.scss';
import { useContextElement } from "@/context/Context";
import Link from "next/link";
import { createChatCustomerSupport, getAllChatCustomerSupport, getDetailChatCustomerSupport, getProducts, sendMessageChatCustomerSupport } from "@/service/queries";
import Loading from "@/components/common/Loading";
import { toast } from "react-toastify";

export default function CustomerPagePage() {
    const { user } = useContextElement();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isChatboxLoading, setIsChatboxLoading] = useState(false);
    const [isSendMessageLoading, setIsSendMessageLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [productPagination, setProductPagination] = useState({});
    const [includeProducts, setIncludeProducts] = useState([]);
    const [chatPagination, setChatPagination] = useState({});

    useEffect(() => {
        const fetchDataChats = async () => {
            const response = await getAllChatCustomerSupport({});
            setChats(response.content);
            setChatPagination(response.page);
        }
        const fetchDataProducts = async () => {
            const response = await getProducts({});
            setProducts(response.products.map(product => product.variants).reduce((previous, current) => previous.concat(current)));
            setProductPagination(response.page);
        }
        fetchDataChats();
        fetchDataProducts();
    }, [])

    const getTimeAgo = (dateString) => {
        const units = [
            { name: "year", seconds: 365 * 24 * 60 * 60 },
            { name: "month", seconds: 30 * 24 * 60 * 60 },
            { name: "day", seconds: 24 * 60 * 60 },
            { name: "hour", seconds: 60 * 60 },
            { name: "minute", seconds: 60 },
            { name: "second", seconds: 1 },
        ];

        const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);

        for (const unit of units) {
            const value = Math.floor(seconds / unit.seconds);
            if (value >= 1) return `${value} ${unit.name}${value > 1 ? "s" : ""} ago`;
        }

        return "just now";
    }

    const handleCreateChat = async (formData) => {
        const subject = formData.get('subject');
        const description = formData.get('description');
        const data = {
            subject,
            description,
            category: 'GENERAL',
        }
        try {
            const response = await createChatCustomerSupport(data);
            setChats(prev => [...prev, response]);
            toast.success('Chat created successfully');
        } catch (error) {
            toast.error('Failed to create chat');
        }
    }

    const handleChangeSelectedChat = async (chat) => {
        setIsChatboxLoading(true);
        try {
            const response = await getDetailChatCustomerSupport(chat.id);
            await setSelectedChat(response);
            await setMessages(response.messages);
        } catch (error) {
            toast.error('Failed to select chat');
        }
        setIsChatboxLoading(false);
    }

    const handleSendMessage = async (formData) => {
        setIsSendMessageLoading(true);
        try {
            const message = formData.get('message');
            const productVariantIds = includeProducts.map(includeProduct => includeProduct.id);
            const response = await sendMessageChatCustomerSupport(selectedChat.id, { message, productVariantIds });
            setMessages((prev) => [...prev, response]);
            setIncludeProducts([]);
            toast.success('Message sent successfully');
        } catch (error) {
            toast.error('Failed to send message');
        }
        setIsSendMessageLoading(false);
    }

    const handleIncludeProducts = async (formData) => {
        const selectedProducts = formData.getAll('included_products[]');
        setIncludeProducts(selectedProducts.map(selectedProduct => products.find((product) => product.id == selectedProduct)));
    }

    const handleRemoveIncludeProduct = (productId) => {
        setIncludeProducts((prev) => prev.filter((prevProduct) => prevProduct.id != productId));
    }

    const conditionChatBox = () => {
        let content = <></>;

        if (user == null) {
            content = <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                <div className="d-flex flex-column gap-3 justify-content-center align-items-center">
                    <p>Please log in to continue chatting with customer support.</p>
                    <Link href={'/login?redirect_url=/customer-support'} className="tf-btn btn-fill">
                        <span className="text text-button">Login</span>
                    </Link>
                </div>
            </div>;
        } else if (selectedChat == null) {
            content = <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                <div className="d-flex flex-column gap-3 justify-content-center align-items-center">
                    <p>Select a chat from the list to view messages.</p>
                </div>
            </div>;
        }
        else if (isChatboxLoading) {
            content = <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                <div className="d-flex flex-column gap-3 justify-content-center align-items-center">
                    <Loading />
                </div>
            </div>;
        }
        else {
            content = <>
                <div className="d-flex justify-content-stretch align-items-center gap-3" style={{ padding: '20px 36px' }}>
                    <div className="position-relative" style={{ height: '52px', width: '52px' }}>
                        <Image
                            alt="Banner"
                            className="rounded-circle"
                            src={'/images/avatar/women.jpg'}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <h5 className="fw-bold lh-1 mb-1" style={{ fontSize: '20px' }}>
                        {selectedChat.subject}
                    </h5>
                </div>
                <div className="flex-grow-1 overflow-y-auto">
                    <ul className="messages h-100">
                        {messages.map((message, index) => (
                            <>
                                {message.attachedProductVariants.map((product, index) => (
                                    <li key={index} className={`${message.senderType == 'CUSTOMER' ? 'send' : 'response'} product`}>
                                        <div
                                            className="d-flex align-items-center px-2 py-1 position-relative"
                                            style={{ minWidth: "140px" }}
                                        >
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="rounded me-2"
                                                style={{ width: "52px", height: "52px", objectFit: "cover" }}
                                            />
                                            <div className="me-4">
                                                <p className="fw-bold">{product.name}</p>
                                                <p className="text-muted m-0 mb-1 lh-1" style={{ fontSize: '12px' }}>IDR {product.price.toLocaleString()}</p>
                                                <p className="text-muted m-0 lh-1" style={{ fontSize: '12px' }}>{product.volume}ML</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                                <li key={index} className={`${message.senderType == 'CUSTOMER' ? 'send' : 'response'}`}>
                                    <span>{message.message}</span>
                                    <span className="time">{getTimeAgo(message.createdAt)}</span>
                                </li>
                            </>
                        ))}
                        {messages.length == 0 && <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                            <p>No conversations yet. Need help? Start a new message with our team.</p>
                        </div>}
                    </ul>
                </div>
                <form action={handleSendMessage} style={{ padding: '36px' }}>
                    {includeProducts.length > 0 && (
                        <div className="mb-3 p-2 border rounded bg-light">
                            <div className="d-flex flex-wrap gap-2">
                                {includeProducts.map((product, idx) => (
                                    <div
                                        key={idx}
                                        className="d-flex align-items-center border rounded bg-white px-2 py-1 position-relative"
                                        style={{ minWidth: "140px" }}
                                    >
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="rounded me-2"
                                            style={{ width: "36px", height: "36px", objectFit: "cover" }}
                                        />
                                        <div className="me-4">
                                            <p className="fw-bold">{product.name}</p>
                                            <p className="text-muted m-0 mb-1 lh-1" style={{ fontSize: '12px' }}>IDR {product.price.toLocaleString()}</p>
                                            <p className="text-muted m-0 lh-1" style={{ fontSize: '12px' }}>{product.volume}ML</p>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn-close ms-auto"
                                            style={{ fontSize: "0.6rem" }}
                                            aria-label="Remove"
                                            onClick={() => handleRemoveIncludeProduct(product.id)}
                                        ></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="d-flex justify-content-center align-items-center gap-3">
                        <div className="position-relative w-100">
                            <input type="text" placeholder="Write your message here..." name="message" required />
                            <button type="button" className="position-absolute btn btn-ghost p-0" style={{ top: '20%', right: '10px' }} data-bs-toggle="modal" data-bs-target="#modal-include-product">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 1.5C4.416 1.5 1.5 4.416 1.5 8C1.5 11.584 4.416 14.5 8 14.5C11.584 14.5 14.5 11.584 14.5 8C14.5 4.416 11.584 1.5 8 1.5ZM8 2.5C11.0435 2.5 13.5 4.9565 13.5 8C13.5 11.0435 11.0435 13.5 8 13.5C4.9565 13.5 2.5 11.0435 2.5 8C2.5 4.9565 4.9565 2.5 8 2.5ZM7.5 5V7.5H5V8.5H7.5V11H8.5V8.5H11V7.5H8.5V5H7.5Z" fill="black" />
                                </svg>
                            </button>
                        </div>
                        {isSendMessageLoading ? <Loading /> : <button type="submit" className="d-flex justify-content-center align-items-center rounded-circle p-0" style={{ height: '40px', width: '40px' }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.3625 14C8.84354 14 9.1841 13.586 9.43118 12.9444L13.8062 1.51006C13.9265 1.20269 14 0.928676 14 0.701426C14 0.267169 13.7261 0 13.2918 0C13.0647 0 12.7908 0.0667209 12.4836 0.187047L0.99544 4.59063C0.434027 4.80448 0 5.14521 0 5.63307C0 6.24782 0.467655 6.45511 1.10886 6.649L4.72243 7.74477C5.14306 7.87878 5.38359 7.86509 5.67085 7.59792L12.9977 0.747902C13.0846 0.66778 13.185 0.681181 13.2519 0.741344C13.3186 0.808065 13.3252 0.908432 13.2451 0.995112L6.42548 8.35295C6.17184 8.62696 6.14506 8.85422 6.27871 9.30187L7.334 12.8304C7.53434 13.5053 7.74152 14 8.36278 14" fill="currentColor" />
                            </svg>
                        </button>}
                    </div>
                </form>
            </>;
        }

        return content;
    }

    return (
        <div>
            {/* <div className="position-relative w-100" style={{ height: '258px', marginBottom: '80px' }}>
                <h1 className="position-absolute top-50 start-50 fw-medium" style={{ transform: 'translate(-50%,-50%)', zIndex: '10', fontSize: '48px' }}>
                    Customer Support
                </h1>
                <Image
                    alt="Banner"
                    src={'/images/banner/banner-customer-support.png'}
                    layout="fill"
                    objectFit="cover"
                />
            </div> */}
            <div className="container chat d-flex flex-column flex-md-row gap-24">
                <div className="chat-list">
                    <div className="d-flex justify-content-between align-items-center gap-3">
                        <p className="fw-bold lh-1" style={{ fontSize: '20px', padding: '24px' }}>Chat</p>
                        {user && <button type="button" className="btn btn-ghost me-2" data-bs-toggle="modal" data-bs-target="#modal-create-chat">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                            </svg>
                        </button>}
                    </div>
                    <div className="flex-grow-1 overflow-y-auto">
                        {user &&
                            chats.map((chat) => (
                                <button key={chat.id} className={`btn btn-ghost w-100 overflow-hidden ${selectedChat?.id == chat.id ? 'active' : ''}`} style={{ padding: '24px' }} onClick={() => handleChangeSelectedChat(chat)}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="position-relative flex-shrink-0" style={{ height: '52px', width: '52px' }}>
                                            <Image
                                                alt="Banner"
                                                className="rounded-circle"
                                                src={'/images/avatar/women.jpg'}
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        </div>
                                        <div>
                                            <h5 className="fw-bold lh-1 mb-1 text-start" style={{ fontSize: '20px' }}>
                                                {chat.subject}
                                            </h5>
                                            <p className="fw-medium lh-1 text-truncate text-start" style={{ color: '#6A6A6A', fontSize: '13px' }}>
                                                {chat.description}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))
                        }
                    </div>
                </div>
                <div className="chat-box d-flex flex-column">
                    {conditionChatBox()}
                </div>
            </div>

            {/* Modal Create Chat */}
            <div className="modal fade" id="modal-create-chat">
                <div className="modal-dialog">
                    <form action={handleCreateChat} className="modal-content">
                        <div className="modal-header flex-column">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            <h2 className="modal-title fw-medium" style={{ fontSize: '30px', paddingTop: '18px', paddingBottom: '26px' }}>Create New Chat</h2>
                        </div>
                        <div className="modal-body">
                            <div className="d-flex flex-column gap-2">
                                <input type="text" name="subject" placeholder="Subject" required />
                                <textarea name="description" placeholder="Description" required></textarea>
                            </div>
                        </div>
                        <div className="modal-footer justify-content-center" style={{ paddingBlock: '34px' }}>
                            <button className="w-100 d-flex justify-content-center align-items-center" data-bs-dismiss="modal" style={{ maxWidth: '314px' }}>
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal Include Product */}
            <div className="modal fade" id="modal-include-product">
                <div className="modal-dialog ">
                    <form className="modal-content" action={handleIncludeProducts}>
                        <div className="modal-header flex-column">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            <h2 className="modal-title fw-medium" style={{ fontSize: '30px', paddingTop: '18px', paddingBottom: '26px' }}>Include product in chat</h2>
                        </div>
                        <div className="modal-body p-0">
                            {products.map((variant, index) => <>
                                <div key={variant.id} className="d-flex justify-content-between align-items-center gap-3" style={{ padding: '32px 46px' }}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="position-relative" style={{ height: '64px', width: '64px' }}>
                                            <Image
                                                alt="Product"
                                                className="rounded"
                                                src={variant.imageUrl}
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="fw-bold lh-1 mb-2" style={{ fontSize: '12px' }}>{variant.name}</p>
                                            <p className="lh-1" style={{ fontSize: '12px' }}><span className="fw-bold">Volume</span> : {variant.volume}ML</p>
                                        </div>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" name="included_products[]" value={variant.id} />
                                    </div>
                                </div>
                                {products.length - 1 != index && <hr style={{ borderColor: 'gray' }} />}
                            </>)}
                        </div>
                        <div className="modal-footer justify-content-center" style={{ paddingBlock: '34px' }}>
                            <button type="sumbit" className="w-100 d-flex justify-content-center align-items-center" data-bs-dismiss="modal" style={{ maxWidth: '314px' }}>
                                Bring to chat
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
