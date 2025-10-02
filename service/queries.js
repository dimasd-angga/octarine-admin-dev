import { fetchFromAPI } from "./api";

export async function getBanners() {
  const data = await fetchFromAPI({
    endpoint: "/public/banner",
    query: {
      page: 1,
      size: 20,
    },
  });

  return data.content;
}

export async function getbestSeller() {
  const data = await fetchFromAPI({
    endpoint: "/public/products/best-seller",
    query: {
      pageNumber: 1,
      pageSize: 4,
    },
  });

  return data?.products?.content || [];
}

export async function getCollections() {
  const data = await fetchFromAPI({
    endpoint: "/public/collections",
  });

  return data;
}

export async function getCareer(query) {
  const data = await fetchFromAPI({
    endpoint: "/public/career",
    query,
  });

  return data;
}

export async function getCareerById(id) {
  const data = await fetchFromAPI({
    endpoint: `/public/career/${id}`,
  });

  return data;
}

export async function getArticle({ page = 1, size = 6 }) {
  try {
    const data = await fetchFromAPI({
      endpoint: "/public/article",
      query: { page, size },
      options: { method: "GET" },
    });

    return {
      posts: data.content || [],
      currentPage: (data.page?.number || 0) + 1,
      totalPages: data.page?.totalPages || 1,
    };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return { posts: [], currentPage: 1, totalPages: 1 };
  }
}

export async function getArticleById(id) {
  const data = await fetchFromAPI({
    endpoint: `/public/article/${id}`,
  });

  return data;
}

export async function getProductId(id) {
  const data = await fetchFromAPI({
    endpoint: `/public/products/${id}`,
  });

  return data;
}

export async function getProducts({ page = 1, size = 20 }) {
  try {
    const data = await fetchFromAPI({
      endpoint: "/public/products",
      query: { pageNumber: page, pageSize: size },
      options: { method: "GET" },
    });

    return {
      products: data.products.content || [],
      page: data.products.page,
      currentPage: (data.products.page?.number || 0) + 1,
      totalPages: data.products.page?.totalPages || 1,
      menPerfumeCount: data.menPerfumeCount || 0,
      womenPerfumeCount: data.womenPerfumeCount || 0,
      unisexPerfumeCount: data.unisexPerfumeCount || 0,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      products: [],
      currentPage: 1,
      totalPages: 1,
      menPerfumeCount: 0,
      womenPerfumeCount: 0,
      unisexPerfumeCount: 0,
    };
  }
}

export async function login({ email, password }) {
  const data = await fetchFromAPI({
    endpoint: "/auth/login",
    options: {
      method: "POST",
      body: JSON.stringify({
        username: email,
        password,
      }),
    },
  });

  return data;
}

export async function register({ email, password }) {
  const data = await fetchFromAPI({
    endpoint: "/auth/register",
    options: {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    },
  });

  return data;
}

export async function me() {
  const token = localStorage.getItem("token");
  const data = await fetchFromAPI({
    endpoint: "/me",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function getCart() {
  const token = localStorage.getItem("token");
  const data = await fetchFromAPI({
    endpoint: "/user/order/cart",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function addToCart({ productVariantId, quantity }) {
  const token = localStorage.getItem("token");
  const data = await fetchFromAPI({
    endpoint: "/user/order/cart",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    options: {
      method: "POST",
      body: JSON.stringify({
        productVariantId,
        quantity,
      }),
    },
  });

  return data;
}

export async function deleteFromCart(cartId) {
  const token = localStorage.getItem("token");
  const data = await fetchFromAPI({
    endpoint: `/user/order/cart/${cartId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    options: { method: "DELETE" },
  });

  return data;
}

export async function updateQuantityCart(cartId, quantity) {
  const token = localStorage.getItem("token");
  const data = await fetchFromAPI({
    endpoint: `/user/order/cart/${cartId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    options: {
      method: "PUT",
      body: JSON.stringify({
        quantity,
      }),
    },
  });

  return data;
}

export async function applyVoucher(voucherCode) {
  const token = localStorage.getItem("token");
  const data = await fetchFromAPI({
    endpoint: `/user/order/cart/apply-voucher`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    options: {
      method: "POST",
      body: JSON.stringify({
        voucherCode,
      }),
    },
  });

  return data;
}

export async function removeVoucher(voucherCode) {
  const token = localStorage.getItem("token");
  const data = await fetchFromAPI({
    endpoint: `/user/order/cart/remove-voucher`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    options: {
      method: "DELETE",
    },
  });

  return data;
}

export async function checkout({
  userAddressId,
  receiverDestinationId,
  shippingName,
  shippingServiceName,
}) {
  const token = localStorage.getItem("token");
  const data = await fetchFromAPI({
    endpoint: `/user/order/checkout`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    options: {
      method: "POST",
      body: JSON.stringify({
        userAddressId,
        receiverDestinationId,
        shippingName,
        shippingServiceName,
      }),
    },
  });

  return data;
}

export async function updateUserProfile({
  firstName,
  lastName,
  email,
  phoneNumber,
  currentPassword = null,
  newPassword = null,
  confirmPassword = null,
}) {
  const body = {
    firstName,
    lastName,
    email,
    phoneNumber,
  };
  if (currentPassword != null && currentPassword != "") {
    body["currentPassword"] = currentPassword;
  }
  if (newPassword != null && newPassword != "") {
    body["newPassword"] = newPassword;
  }
  if (confirmPassword != null && confirmPassword != "") {
    body["confirmPassword"] = confirmPassword;
  }

  const token = localStorage.getItem("token");
  const data = await fetchFromAPI({
    endpoint: `/user/profile`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    options: {
      method: "PUT",
      body: JSON.stringify(body),
    },
  });

  return data;
}

export async function getOrders() {
  const token = localStorage.getItem("token");
  const data = await fetchFromAPI({
    endpoint: "/user/order/list",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function getDetailOrder(orderId) {
  const token = localStorage.getItem("token");
  const data = await fetchFromAPI({
    endpoint: `/user/order/track/${orderId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function getDestinations(keyword) {
  const token = localStorage.getItem("token");
  const data = await fetchFromAPI({
    endpoint: `/user/delivery/destinations/search?keyword=${keyword}&provider=komship`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function getDeliveryCost({ destinationId, weight }) {
  const token = localStorage.getItem("token");
  const data = await fetchFromAPI({
    endpoint: `/user/delivery/costs/calculate?destinationId=${destinationId}&weight=${weight}&provider=komship`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function getAllAddress() {
  const token = localStorage.getItem("token");
  const data = await fetchFromAPI({
    endpoint: `/user/address`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function addAddress({
  firstName,
  lastName,
  phone,
  province,
  city,
  district,
  subdistrict,
  postalCode,
  streetAddress,
  destinationId,
  destinationName,
  provider,
  addressName,
  addressLabel,
  isDefault,
}) {
  const token = localStorage.getItem("token");
  const data = await fetchFromAPI({
    endpoint: `/user/address`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    options: {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        phone,
        province,
        city,
        district,
        subdistrict,
        postalCode,
        streetAddress,
        destinationId,
        destinationName,
        provider,
        addressName,
        addressLabel,
        isDefault,
      }),
    },
  });

  return data;
}

export async function updateAddress(
  addressId,
  {
    firstName,
    lastName,
    phone,
    province,
    city,
    district,
    subdistrict,
    postalCode,
    streetAddress,
    destinationId,
    destinationName,
    provider,
    addressName,
    addressLabel,
    isDefault,
  }
) {
  const token = localStorage.getItem("token");
  const data = await fetchFromAPI({
    endpoint: `/user/address/${addressId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    options: {
      method: "PUT",
      body: JSON.stringify({
        firstName,
        lastName,
        phone,
        province,
        city,
        district,
        subdistrict,
        postalCode,
        streetAddress,
        destinationId,
        destinationName,
        provider,
        addressName,
        addressLabel,
        isDefault,
      }),
    },
  });

  return data;
}

export async function deleteAddress(addressId) {
  const token = localStorage.getItem("token");
  const data = await fetchFromAPI({
    endpoint: `/user/address/${addressId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    options: {
      method: "DELETE",
    },
  });

  return data;
}

export async function getAllChatCustomerSupport({ page = 1, size = 20 }) {
  const token = localStorage.getItem("token");
  const data = await fetchFromAPI({
    endpoint: `/user/support/tickets`,
    query: { page, size },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function createChatCustomerSupport({
  subject,
  description,
  category,
}) {
  const token = localStorage.getItem("token");
  const data = await fetchFromAPI({
    endpoint: `/user/support/ticket`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    options: {
      method: "POST",
      body: JSON.stringify({
        subject,
        description,
        category,
      }),
    },
  });

  return data;
}

export async function getDetailChatCustomerSupport(id) {
  const token = localStorage.getItem("token");
  const data = await fetchFromAPI({
    endpoint: `/user/support/ticket/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function sendMessageChatCustomerSupport(
  id,
  { message, productVariantIds }
) {
  const token = localStorage.getItem("token");
  const data = await fetchFromAPI({
    endpoint: `/user/support/ticket/${id}/message`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    options: {
      method: "POST",
      body: JSON.stringify({
        message,
        productVariantIds,
      }),
    },
  });

  return data;
}

export async function getAllDiscovery({ page = 1, size = 20 }) {
  const data = await fetchFromAPI({
    endpoint: `/public/discovery`,
    query: { page, size },
  });

  return data;
}

export async function getAllPromotion({ page = 1, size = 20 }) {
  const data = await fetchFromAPI({
    endpoint: "/public/promo",
    query: {
      page: 1,
      size: 20,
    },
  });

  return data;
}
