import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import PrivateRoute from './PrivateRoute';

const router = createBrowserRouter([
  {
    path: '/login',
    lazy: () => import('../features/auth/LoginPage').then((m) => ({ Component: m.default })),
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/', element: <Navigate to="/catalog" replace /> },
          {
            path: '/catalog',
            lazy: () => import('../features/products/catalog/CatalogPage').then((m) => ({ Component: m.default })),
          },
          {
            path: '/product/:id',
            lazy: () => import('../features/products/product-detail/ProductDetailPage').then((m) => ({ Component: m.default })),
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/catalog" replace /> },
]);

function PageLoader() {
  return <p role="status" className="page-loader">Loading...</p>;
}

export default function AppRoutes() {
  return <RouterProvider router={router} fallbackElement={<PageLoader />} />;
}
