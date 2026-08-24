import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import authReducer from '../features/auth/authSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import cartReducer from '../features/cart/cartSlice';
import uiReducer from '../features/ui/uiSlice';
import '../features/auth/authApi';
import '../features/products/productsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    ui: uiReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
