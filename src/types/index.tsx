// src/types/index.ts

export interface CartItem {
    productId: number;
    name: string;
    price: string;
    image: string;
    quantity: number;
    isOffer: boolean;
    offerType: string;
  }
  

  export interface Product {
  id: number;
  type?: string;
  name: string;
  description?: string;
  rating?: number;
  img: string;
  price: string; // e.g., "£0.85"
  available: number;
}
