import { FiX } from 'react-icons/fi';
import { useCart } from '../providers/CartProvider';
import { getAvailabilityBadge, parsePrice } from '../lib/cartUtils';
import type{ CartItem as CartItemType, Product } from '../types'; // Adjust import paths as needed

interface CartItemProps {
  item: CartItemType;
  products: Product[];
}

const CartItem: React.FC<CartItemProps> = ({ item, products }) => {
  const { addItem, removeItem ,cartItems} = useCart();
  const isOfferItem = item.isOffer;

  const getOfferLabel = () => {
    if (item.offerType === 'buy6get1') {
      return 'Free (Buy 6 Get 1)';
    }
    if (item.offerType === 'buy3get1coffee') {
      return 'Free (With 3 Croissants)';
    }
    return null;
  };
  const product = products?.find((p) => p.id === item.productId);

  const totalQuantityInCart = cartItems
  .filter((cartItem) => cartItem.productId === item.productId)
  .reduce((acc, curr) => acc + curr.quantity, 0);

// Calculate remaining quantity considering all cart quantities (offers included)
const remainingQty = (product?.available || 0) - totalQuantityInCart;


  return (
    <div className={`rounded-3xl shadow-md bg-white border ${isOfferItem ? 'bg-green-50' : ''}`}>
      <div className="flex items-center">
        <div className="relative h-24 w-24 mx-4">
          <img
            src={item.image || '/images/placeholder.jpg'}
            alt={item.name}
            className="object-contain h-full w-full"
          />
        </div>

        <div className="flex-grow text-gray-500">
          <h3 className="font-medium">{item.name}</h3>
          <div className="flex justify-between mt-1">
            {isOfferItem ? (
              <span className="text-green-600 font-medium text-sm">{getOfferLabel()}</span>
            ) : (
              <span>£{(parsePrice(item.price) * item.quantity).toFixed(2)}</span>
            )}
          </div>
        </div>

        <div className="flex items-center ml-4 lg:gap-30 sm:gap-10 gap-2 text-gray-700">
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="flex items-center">
              {!isOfferItem && (
                <div className="bg-red-400 w-6 h-6 cursor-pointer rounded-md flex items-center justify-center">
                  <button
                    onClick={() => removeItem(item.productId, item.isOffer)}
                    className="text-white hover:text-gray-200 font-bold"
                  >
                    -
                  </button>
                </div>
              )}

              <span className="sm:mx-3 mx-1 w-5 text-center">{item.quantity}</span>

              {!isOfferItem && (
                <div className="bg-green-400 w-6 h-6 cursor-pointer rounded-md flex items-center justify-center">
                  <button
                    onClick={() =>
                      addItem({
                        id: item.productId,
                        name: item.name,
                        price: item.price,
                        img: item.image,
                        available:1
                      })
                    }
                    className="text-white hover:text-gray-200 font-bold"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
            {!isOfferItem && <div>{getAvailabilityBadge(remainingQty)}</div>}
          </div>

          <div className="bg-green-400 w-6 h-6 cursor-pointer rounded-md flex items-center justify-center mx-4">
            <button
              onClick={() => removeItem(item.productId, item.isOffer)}
              className="text-white hover:text-gray-200 font-bold"
            >
              <FiX />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
