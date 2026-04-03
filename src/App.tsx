import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import GoldSchemes from './pages/GoldSchemes';
import ShippingReturns from './pages/ShippingReturns';
import JewelleryCare from './pages/JewelleryCare';
import ContactUs from './pages/ContactUs';
import MetalRateTracker from './components/MetalRateTracker';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/schemes" element={<GoldSchemes />} />
            <Route path="/shipping-returns" element={<ShippingReturns />} />
            <Route path="/jewellery-care" element={<JewelleryCare />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/rates" element={<div className="pt-20"><MetalRateTracker /></div>} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}
