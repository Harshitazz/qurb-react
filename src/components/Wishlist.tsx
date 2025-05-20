import React from 'react';
import type { Product } from '../types/index'; // adjust the import path

interface WishlistProps {
  wishlistItems: Product[];
  setShowWishlist: (show: boolean) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ wishlistItems, setShowWishlist }) => {
  return (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 z-50">
      <div className="px-4 py-2 border-b border-gray-100">
        <h3 className="font-semibold text-gray-700">Your Wishlist</h3>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="px-4 py-6 text-center text-gray-500">
          Your wishlist is empty
        </div>
      ) : (
        <>
          <div className="max-h-80 overflow-y-auto">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
              >
                <div className="relative w-12 h-12 flex-shrink-0">
                  <img
                    src={item.img || "/images/placeholder.jpg"}
                    alt={item.name}
                    style={{ objectFit: "cover" }}
                    className="rounded w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500">{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-2 border-t border-gray-100">
            <button
              onClick={() => setShowWishlist(false)}
              className="block w-full text-center text-sm text-green-600 hover:text-green-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;
