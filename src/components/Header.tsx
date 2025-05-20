import { Link, useLocation } from "react-router-dom";
import { useCart } from "../providers/CartProvider";
import { useWishlist } from "../providers/WishlistProvider";
import { useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { BsShopWindow } from "react-icons/bs";
import SearchBar from "./SearchBar";
import Wishlist from "./Wishlist";
import type { CartItem } from "../types";

const Header: React.FC = () => {
  const location = useLocation();
  const { cartItems, setSearchQuery } = useCart();
  const { wishlistItems } = useWishlist();
  const [showWishlist, setShowWishlist] = useState(false);

  const itemCount = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  const wishlistItemCount = wishlistItems.length;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleWishlistDropdown = () => {
    setShowWishlist((prev) => !prev);
  };

  return (
    <header className="lg:mx-4">
      <div className="container mx-auto sm:px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/"
            className="lg:text-2xl sm:text-xl text-sm font-bold font-almarai text-gray-700 hidden sm:block"
          >
            GROCERIES
          </Link>
        </div>

        <SearchBar onSearch={handleSearch} />

        <div className="flex items-center space-x-6">
          <div className="relative cursor-pointer">
            <button
              className="flex items-center text-gray-700 hover:text-red-400"
              onClick={toggleWishlistDropdown}
              aria-label="Wishlist"
            >
              <AiFillHeart className="h-8 w-8 m-1" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-400 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistItemCount}
                </span>
              )}
            </button>

            {showWishlist && (
              <Wishlist wishlistItems={wishlistItems} setShowWishlist={setShowWishlist} />
            )}
          </div>

          

          {location.pathname === "/" ? (
            <Link to="/checkout" className="relative flex items-center">
              <img
                src="/cart.svg"
                alt="Cart"
                width={32}
                height={32}
                className="m-1 text-gray-600"
              />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs">
                  {itemCount}
                </span>
              )}
            </Link>
          ) : (
            <Link to="/" className="flex items-center text-gray-700">
              <BsShopWindow className="h-8 w-8 mr-1" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
