import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { UIProvider } from './state/ui';

const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const CollectionsIndex = lazy(() => import('./pages/Collections').then((m) => ({ default: m.CollectionsIndex })));
const CollectionDetail = lazy(() => import('./pages/Collections').then((m) => ({ default: m.CollectionDetail })));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const About = lazy(() => import('./pages/About'));
const JournalIndex = lazy(() => import('./pages/Journal').then((m) => ({ default: m.JournalIndex })));
const JournalArticle = lazy(() => import('./pages/Journal').then((m) => ({ default: m.JournalArticle })));
const Faq = lazy(() => import('./pages/Faq'));
const Contact = lazy(() => import('./pages/Contact'));
const DemoInfo = lazy(() => import('./pages/DemoInfo'));
const Legal = lazy(() => import('./pages/Legal'));
const NotFound = lazy(() => import('./pages/NotFound'));

export function App() {
  return (
    <UIProvider>
      <Suspense fallback={<div className="page-loading" role="status">Loading…</div>}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="collections" element={<CollectionsIndex />} />
            <Route path="collections/:slug" element={<CollectionDetail />} />
            <Route path="products/:slug" element={<ProductPage />} />
            <Route path="cart" element={<Cart />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:reference" element={<OrderDetail />} />
            <Route path="about" element={<About />} />
            <Route path="journal" element={<JournalIndex />} />
            <Route path="journal/:slug" element={<JournalArticle />} />
            <Route path="faq" element={<Faq />} />
            <Route path="contact" element={<Contact />} />
            <Route path="demo" element={<DemoInfo />} />
            <Route path="legal/:slug" element={<Legal />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </UIProvider>
  );
}
