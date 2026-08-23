import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import PrivateRoute from './PrivateRoute';

const LoginPage = lazy(() => import('../features/auth/LoginPage'));
const CatalogPage = lazy(() => import('../features/products/catalog/CatalogPage'));
const ProductDetailPage = lazy(() => import('../features/products/product-detail/ProductDetailPage'));

function PageLoader() {
  return <p role="status" className="page-loader">Loading...</p>;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/catalog" replace />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/catalog" replace />} />
      </Routes>
    </Suspense>
  );
}