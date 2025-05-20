import React, { useState } from "react";
import { calculateCartTotals } from "../lib/cartUtils";
import { useCart } from "../providers/CartProvider";
import { toast } from "react-toastify";


const CheckoutSummary: React.FC = () => {
  const { cartItems, clearCart ,products,setProducts} = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const { subtotal, discount, total } = calculateCartTotals(cartItems);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      // Create a shallow copy to avoid direct mutation (if using React state)
      const updatedProducts = [...products];
        //db implementation
      cartItems.forEach((cartItem) => {
        const productIndex = updatedProducts.findIndex(
          (p) => p.id === cartItem.productId
        );

        if (productIndex !== -1) {
          const product = updatedProducts[productIndex];

          const remainingQty =
            (product.available || 0) - cartItem.quantity;

          if (remainingQty < 0) {
            throw new Error(
              `Not enough stock for ${product.name}. Only ${product.available} left.`
            );
          }

          updatedProducts[productIndex] = {
            ...product,
            available: remainingQty,
          };
        }
      });

      // Update product state globally
      setProducts(updatedProducts);

      toast.success("Order placed successfully!");
      clearCart();

      
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(error.message || "Failed to process checkout");
          } else {
            toast.error("Failed to process checkout");
          }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="text-gray-400">
      <div className="m-4 pt-2 flex flex-col gap-2 border-t">
        <div className="flex justify-evenly p-4">
          <span className="font-semibold text-gray-600">Subtotal</span>
          <span>£{subtotal}</span>
        </div>

        <div className="flex justify-evenly border-t p-4">
          <span className="font-semibold text-gray-600">Discounts</span>
          <span>-£{discount}</span>
        </div>

        <div>
          <div className="flex justify-evenly border-t p-4">
            <span className="font-semibold text-gray-600">Total</span>
            <span>£{total}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleCheckout}
          disabled={isProcessing || cartItems.length === 0}
          className={`p-3 w-1/3 rounded-lg font-medium cursor-pointer ${
            isProcessing || cartItems.length === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-300 text-white hover:bg-green-400"
          } transition`}
        >
          {isProcessing ? "Processing..." : "Checkout"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutSummary;
