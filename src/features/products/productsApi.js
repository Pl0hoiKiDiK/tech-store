import { api } from '../../app/api';

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProductsByCategory: builder.query({
      query: ({ category, sortBy = 'title', order = 'asc', limit = 12, skip = 0 }) =>
        `/products/category/${category}?sortBy=${sortBy}&order=${order}&limit=${limit}&skip=${skip}`,
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