'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'react-toastify';
import type { Product } from '../types'; // Adjust the import path as needed

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => boolean;
  removeFromWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => boolean;
  isProductWishlisted: (productId: number) => boolean;
  clearWishlist: () => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlistItems]);

  const addToWishlist = (product: Product): boolean => {
    const isInWishlist = wishlistItems.some(item => item.id === product.id);

    if (isInWishlist) {
      return true;
    }

    setWishlistItems(prev => [...prev, product]);
    toast.success(`Added ${product.name} to wishlist`);
    return true;
  };

  const removeFromWishlist = (productId: number): boolean => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
    toast.success('Item removed from wishlist');
    return true;
  };

  const toggleWishlist = (product: Product): boolean => {
    const isInWishlist = wishlistItems.some(item => item.id === product.id);

    if (isInWishlist) {
      return removeFromWishlist(product.id);
    } else {
      return addToWishlist(product);
    }
  };

  const isProductWishlisted = (productId: number): boolean => {
    return wishlistItems.some(item => item.id === productId);
  };

  const clearWishlist = (): boolean => {
    setWishlistItems([]);
    toast.success('Wishlist cleared');
    return true;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isProductWishlisted,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
