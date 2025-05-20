import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import { CartProvider } from './providers/CartProvider';
import { WishlistProvider } from './providers/WishlistProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import Home from './pages/Home';
import Checkout from './pages/Checkout'; // Example additional page

function App() {

  return (
      <Router>
        <CartProvider>
          <WishlistProvider>
            <Header />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/checkout" element={<Checkout />} />
              </Routes>
            </main>
            <ToastContainer position="bottom-right" />
          </WishlistProvider>
        </CartProvider>
      </Router>
  );
}

export default App;
