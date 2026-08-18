import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import cartReducer from '../features/cart/cartSlice';
import { productsApi } from '../features/products/productsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
});