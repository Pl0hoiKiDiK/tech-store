import { createSlice } from '@reduxjs/toolkit';

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem('wishlist');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const initialState = {
  items: loadFromStorage(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.find((item) => item.id === product.id);
      if (exists) {
        state.items = state.items.filter((item) => item.id !== product.id);
      } else {
        state.items.push(product);
      }
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;