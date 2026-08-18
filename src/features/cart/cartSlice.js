import { createSlice } from '@reduxjs/toolkit';

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const initialState = {
  items: loadFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const exists = state.items.find((item) => item.id === product.id);
      if (exists) {
        exists.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
  },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;