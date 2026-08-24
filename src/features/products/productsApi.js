import { api } from '../../app/api';

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProductsByCategory: builder.query({
      query: (category) => `/products/category/${category}?limit=0`,
      providesTags: ['Products'],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),
    searchProducts: builder.query({
      query: (searchQuery) => `/products/search?q=${encodeURIComponent(searchQuery)}`,
      providesTags: ['Products'],
    }),
  }),
});

export const {
  useGetProductsByCategoryQuery,
  useGetProductByIdQuery,
  useSearchProductsQuery,
} = productsApi;
