import { useNavigate } from 'react-router-dom';

import { useCart } from '../providers/CartProvider';
import CartItem from '../components/CartItem';
import CheckoutSummary from '../components/CheckoutSummary';
import type { CartItem as CartItemType } from '../types/index'; // adjust this import path if needed

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, products } = useCart();

 

  if (cartItems.length === 0 ) {
    return (
      <div className="text-center py-12 text-gray-700">
        <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Start adding items to your cart to see them here.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Start Shopping
        </button>
      </div>
    );
  }



  const groupedItems: CartItemType[] = [
    ...cartItems.filter((item) => !item.isOffer),
    ...cartItems.filter((item) => item.isOffer),
  ];

  return (
    <div className="mx-0 lg:mx-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-600">Checkout</h1>

      <div className="sm:w-[80%] flex flex-col gap-8 sm:m-10 sm:my-20">
        <div className="lg:col-span-2 gap-6 flex flex-col">
          {groupedItems.map((item, index) => (
            <CartItem
              key={`${item.productId}-${item.isOffer}-${index}`}
              item={item}
              products={products}
            />
          ))}
        </div>

        <div className="lg:col-span-1">
          <CheckoutSummary />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
