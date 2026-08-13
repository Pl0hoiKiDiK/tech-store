import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery } from './productsApi';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useGetProductByIdQuery(id);

  if (isLoading) return <p>Загрузка...</p>;
  if (isError || !product) return <p>Товар не найден</p>;

  return (
    <div className="product-detail-page">
      <button onClick={() => navigate(-1)}>Назад</button>
      <div className="product-detail">
        <img src={product.thumbnail} alt={product.title} />
        <div className="product-info">
          <h1>{product.title}</h1>
          <p>{product.description}</p>
          <p>Цена: {product.price} $</p>
          <p>Рейтинг: {product.rating}</p>
          <p>В наличии: {product.stock}</p>
          <p>Бренд: {product.brand}</p>
          <p>Гарантия: {product.warrantyInformation}</p>
          <p>Доставка: {product.shippingInformation}</p>
        </div>
      </div>
    </div>
  );
}