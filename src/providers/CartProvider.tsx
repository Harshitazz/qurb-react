'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  
} from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import {
  addToCart,
  checkAvailability,
  removeFromCart,
  updateCartWithOffers,
} from '../lib/cartUtils';
import { calculateOffers } from '../lib/offerUtils'
import { toast } from 'react-toastify';
import type { CartItem, Product } from '../types/index';

interface CartContextType {
  cartItems: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number, isOffer?: boolean) => void;
  clearCart: () => void;
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSaving: boolean;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}?category=all`
          
        );
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const applyOffers = (items: CartItem[]) => {
    const offerItems = calculateOffers(items, products);
    return updateCartWithOffers(items, offerItems);
  };

  const addItem = async (product: Product) => {
   

    const availabilityCheck = checkAvailability(product.id, cartItems, products);
    if (!availabilityCheck.success) {
      toast.error(availabilityCheck.message);
      return;
    }

    const updatedItems = addToCart(cartItems, product);
    const itemsWithOffers = applyOffers(updatedItems);

    setCartItems(itemsWithOffers);
    toast.success(`Added ${product.name} to cart`);
  };

  const removeItem = async (productId: number, isOffer = false) => {

    const updatedItems = removeFromCart(cartItems, productId, isOffer);
    const itemsWithOffers = applyOffers(updatedItems);

    setCartItems(itemsWithOffers);
    toast.success('Item removed from cart');
  };

  const clearCart = async () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        clearCart,
        loading,
        searchQuery,
        setSearchQuery,
        isSaving,
        products,
        setProducts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
