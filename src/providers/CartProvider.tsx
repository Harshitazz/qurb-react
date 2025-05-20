'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,

} from 'react';
import type { ReactNode } from 'react';
import {
    addToCart,
    checkAvailability,
    removeFromCart,
    updateCartWithOffers,
} from '../lib/cartUtils';
import { calculateOffers } from '../lib/offerUtils'
import { toast } from 'react-toastify';
import type { CartItem, Product } from '../types/index';
import { getProductsByCategory } from '../services/api';

interface CartContextType {
    cartItems: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: number, isOffer?: boolean) => void;
    clearCart: () => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
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
    const [searchQuery, setSearchQuery] = useState('');
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProductsByCategory("all");
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);
    useEffect(() => {
        try {
            const savedWishlist = localStorage.getItem('CartItems');
            if (savedWishlist) {
                setCartItems(JSON.parse(savedWishlist));
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setIsHydrated(true); // ← Ensure we only render after hydration
        }
    }, []);
    useEffect(() => {
        if (isHydrated) {
            try {
                localStorage.setItem('CartItems', JSON.stringify(cartItems));
            } catch (error) {
                console.error('Error saving cart:', error);
            }
        }
    }, [cartItems, isHydrated]);

    if (!isHydrated) return null;
    
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
                searchQuery,
                setSearchQuery,
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
