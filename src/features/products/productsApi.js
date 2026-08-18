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
    getCategories: builder.query({
      query: () => '/products/categories',
    }),
  }),
});

export const {
  useGetProductsByCategoryQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
} = productsApi;