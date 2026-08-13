import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsByCategoryQuery, useGetCategoriesQuery } from './productsApi';

const DEFAULT_CATEGORY = 'smartphones';

export default function CatalogPage() {
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [sortBy, setSortBy] = useState('title');
  const [order, setOrder] = useState('asc');

  const { data: categoriesData } = useGetCategoriesQuery();
  const { data, isLoading, isError } = useGetProductsByCategoryQuery({
    category,
    sortBy,
    order,
  });

  if (isLoading) return <p>Загрузка...</p>;
  if (isError) return <p>Не удалось загрузить товары</p>;

  return (
    <div className="catalog-page">
      <div className="catalog-filters">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {(categoriesData || []).map((cat) => (
            <option key={cat.slug || cat} value={cat.slug || cat}>
              {cat.name || cat}
            </option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="title">По названию</option>
          <option value="price">По цене</option>
          <option value="rating">По рейтингу</option>
        </select>
        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">По возрастанию</option>
          <option value="desc">По убыванию</option>
        </select>
      </div>

      <div className="catalog-grid">
        {data?.products?.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="catalog-card"
          >
            <img src={product.thumbnail} alt={product.title} />
            <h3>{product.title}</h3>
            <p>{product.price} $</p>
          </Link>
        ))}
      </div>
    </div>
  );
}