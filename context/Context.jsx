"use client";
import { fetchFromAPI } from "@/service/api";
import { addToCart, applyVoucher, deleteFromCart, getCart, me, removeVoucher, updateQuantityCart } from "@/service/queries";
import { openCartModal } from "@/utlis/openCartModal";
import { openWistlistModal } from "@/utlis/openWishlist";
import { useRouter } from "next/compat/router";
import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";

const DataContext = React.createContext();

export const useContextElement = () => {
  return useContext(DataContext);
};

// Store debounce timers by ID
const debounceTimers = {};

/**
 * Debounce a function by ID.
 * @param {string|number} id - Unique identifier for the debounce instance.
 * @param {Function} func - Function to debounce.
 * @param {number} delay - Delay in milliseconds.
 */
function debounceById(id, func, delay = 1000) {
  if (debounceTimers[id]) {
    clearTimeout(debounceTimers[id]);
  }

  debounceTimers[id] = setTimeout(async () => {
    await func();
    delete debounceTimers[id]; // Optional: clean up timer after use
  }, delay);
}

export default function Context({ children }) {
  const router = useRouter();
  const [cartProducts, setCartProducts] = useState([]);
  const [eligibleVouchers, setEligibleVouchers] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [compareItem, setCompareItem] = useState([]);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [quickAddItem, setQuickAddItem] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [voucherCode, setVoucherCode] = useState(null);
  const [subTotalPrice, setSubTotalPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subtotal = cartProducts.reduce((accumulator, product) => {
      return accumulator + (product.quantity || 1) * (product.productVariantDto.price || 0);
    }, 0);
    setSubTotalPrice(subtotal);
    setTotalPrice(subtotal + discountPrice);
  }, [cartProducts, discountPrice]);

  const isAddedToCartProducts = (id) => {
    return cartProducts.some((elm) => elm.productVariantDto.productId == id);
  };

  const addProductToCart = async (product, variant = null, qty = 1, isModal = true) => {
    if (!isAddedToCartProducts(product.id)) {
      let productVariantDto = null;
      if (variant == null) {
        productVariantDto = product.variants[product.variants.length - 1];
      } else {
        productVariantDto = product.variants.find(item => item.volume == variant);
      }

      if (user != null) {
        try {
          const response = await addToCart({ productVariantId: productVariantDto.id, quantity: qty })
          setDataCart(response);
        } catch (error) {
          console.error('Failed to add to cart');
        }
      } else {
        const item = {
          ...product,
          productVariantDto,
          quantity: qty,
        };
        setCartProducts((prev) => [...prev, item]);
      }

      if (isModal) {
        openCartModal();
      }

    }
  };

  const removeProductFromCart = async (productId) => {
    if (user != null) {
      try {
        const cart = cartProducts.find(cart => cart.productVariantDto.productId == productId);
        const response = await deleteFromCart(cart.id);
        setDataCart(response);
      } catch (error) {
        console.error('Failed to delete from cart');
        alert(error);
      }
    } else {
      setCartProducts((pre) => [...pre.filter((elm) => elm.id != productId)]);
    }
  };

  const updateQuantity = (productId, qty) => {
    if (isAddedToCartProducts(productId)) {
      const cart = cartProducts.find(cart => cart.productVariantDto.productId == productId);
      debounceById(`u-qty-cart-${productId}`, async () => {
        const response = await updateQuantityCart(cart.id, qty);
        setDataCart(response);
      });
      setCartProducts((prev) =>
        prev.map((item) => (item.productVariantDto.productId == productId ? { ...item, quantity: qty } : item))
      );
    }
  };

  const applyVoucherCart = async (voucherCode) => {
    try {
      const response = await applyVoucher(voucherCode);
      setDataCart(response);
      toast.success(`Voucher apply successfully`);
    } catch (error) {
      toast.error(`Failed to apply voucher`);
    }
  }

  const removeVoucherCart = async () => {
    try {
      const response = await removeVoucher();
      setDataCart(response);
      toast.success(`Voucher removed successfully`);
    } catch (error) {
      toast.error(`Failed to remove voucher`);
    }
  }

  const addToWishlist = (id) => {
    if (!wishList.includes(id)) {
      setWishList((prev) => [...prev, id]);
      openWistlistModal();
    }
  };

  const removeFromWishlist = (id) => {
    if (wishList.includes(id)) {
      setWishList((prev) => prev.filter((elm) => elm != id));
    }
  };

  const addToCompareItem = (id) => {
    if (!compareItem.includes(id)) {
      setCompareItem((prev) => [...prev, id]);
    }
  };

  const removeFromCompareItem = (id) => {
    if (compareItem.includes(id)) {
      setCompareItem((prev) => prev.filter((elm) => elm != id));
    }
  };

  const isAddedtoWishlist = (id) => {
    return wishList.includes(id);
  };

  const isAddedtoCompareItem = (id) => {
    return compareItem.includes(id);
  };

  const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (token != null && user == null) {
      try {
        const responseMe = await me();
        setUser(responseMe);

        const responseCart = await getCart();
        setDataCart(responseCart);
      } catch (error) {
        console.info('not login yet.');
      }

    }
  }

  const getTotalWeightCart = () => {
    const totalWeight = cartProducts.reduce((sum, product) => sum + product.quantity, 0);
    return totalWeight;
  }

  const setDataCart = (response) => {
    setDiscountPrice(response['voucherDiscount'] == 0 ? 0 : -response['voucherDiscount']);
    setVoucherCode(response['voucherCode']);
    setCartProducts(response['orderItems']);
    if (response['recommendedProducts']) {
      setRecommendedProducts(response['recommendedProducts']);
    }
    if (response['eligibleVouchers']) {
      setEligibleVouchers(response['eligibleVouchers']);
    }
  }

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success(`You have been logged out successfully`);
  }

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartList"));
    if (items?.length) {
      setCartProducts(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartList", JSON.stringify(cartProducts));
  }, [cartProducts]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("wishlist"));
    if (items?.length) {
      setWishList(items);
    }
  }, []);

  useEffect(() => {
    getCurrentUser();
  }, []);


  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishList));
  }, [wishList]);

  const contextElement = {
    cartProducts,
    setCartProducts,
    recommendedProducts,
    setRecommendedProducts,
    totalPrice,
    subTotalPrice,
    voucherCode,
    addProductToCart,
    isAddedToCartProducts,
    removeProductFromCart,
    removeFromWishlist,
    addToWishlist,
    isAddedtoWishlist,
    quickViewItem,
    wishList,
    setQuickViewItem,
    quickAddItem,
    setQuickAddItem,
    addToCompareItem,
    isAddedtoCompareItem,
    removeFromCompareItem,
    compareItem,
    setCompareItem,
    updateQuantity,
    user,
    setUser,
    logout,
    getCurrentUser,
    applyVoucherCart,
    removeVoucherCart,
    discountPrice,
    eligibleVouchers,
    getTotalWeightCart
  };

  return (
    <DataContext.Provider value={contextElement}>
      {children}
    </DataContext.Provider>
  );
}
