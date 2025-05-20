// src/lib/cartUtils.tsx

import type { JSX } from 'react';
import type { CartItem, Product } from '../types/index';

export const parsePrice = (priceStr: string): number =>
  parseFloat(priceStr.replace("£", "").trim()) || 0;

export const calculateCartTotals = (items: CartItem[]) => {
  const subtotal = items.reduce(
    (sum, item) => sum + parsePrice(item.price) * item.quantity,
    0
  );

  const discount = items
    .filter((item) => item.isOffer)
    .reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);

  const total = subtotal - discount;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
};

export const addToCart = (items: CartItem[], product: Product): CartItem[] => {
  const existingItem = items.find(
    (item) => item.productId === product.id && !item.isOffer
  );

  if (existingItem) {
    return items.map((item) =>
      item.productId === product.id && !item.isOffer
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    return [
      ...items,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.img,
        quantity: 1,
        isOffer: false,
        offerType: 'none',
      },
    ];
  }
};

export const removeFromCart = (
  items: CartItem[],
  productId: number,
  isOffer: boolean
): CartItem[] => {
  const existingItem = items.find(
    (item) => item.productId === productId && item.isOffer === isOffer
  );

  if (existingItem && existingItem.quantity > 1) {
    return items.map((item) =>
      item.productId === productId && item.isOffer === isOffer
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
  } else {
    return items.filter(
      (item) => !(item.productId === productId && item.isOffer === isOffer)
    );
  }
};

export const updateCartWithOffers = (
  currentItems: CartItem[],
  offerItems: CartItem[]
): CartItem[] => {
  const regularItems = currentItems.filter((item) => !item.isOffer);
  return [...regularItems, ...offerItems];
};

export const checkAvailability = (
  productId: number,
  cartItems: CartItem[],
  products: Product[],
  requestedQty = 1
): { success: boolean; available?: number; message?: string } => {
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return { success: false, message: 'Product not found' };
  }

  // Sum quantity of all items in cart with this productId (normal and offer)
  const totalInCart = cartItems
    .filter(item => item.productId === productId)
    .reduce((sum, item) => sum + item.quantity, 0);

  const totalQty = totalInCart + requestedQty;

  if (product.available && totalQty > product.available) {
    return {
      success: false,
      available: product.available,
      message: `Only ${product.available} item(s) available. You already have ${totalInCart} in your cart.`,
    };
  }

  return { success: true };
};

export const getAvailabilityBadge = (available: number): JSX.Element => {
  if (available >= 10) {
    return (
      <span className="inline-block bg-green-300 text-white text-xs px-3 py-1 rounded-full">
        Available
      </span>
    );
  }

  if (available > 0) {
    return (
      <span className="inline-block bg-orange-300 text-white text-xs px-3 py-1 rounded-full">
        Only {available} left
      </span>
    );
  }

  return (
    <span className="inline-block bg-red-300 text-white text-xs px-3 py-1 rounded-full">
      Out of stock
    </span>
  );
};
