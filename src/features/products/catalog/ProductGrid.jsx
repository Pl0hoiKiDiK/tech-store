import React from 'react';
import { Link } from 'react-router-dom';
import likeIcon from '../../../assets/icons/like-icon.svg';
import './ProductGrid.css';

export default function ProductGrid({ products }) {
  return (
    <ul className="products__grid">
      {products.map((product) => (
        <li className="product-card" key={product.id}>
          <button className="product-card__like" type="button" aria-label={`Добавить ${product.title} в избранное`}>
            <img src={likeIcon} alt="" />
          </button>
          <Link
            to={`/product/${product.id}`}
            className="product-card__image-link"
            aria-label={`Перейти к товару ${product.title}`}
          >
            <img src={product.thumbnail} alt={product.title} />
          </Link>
          <div className="product-card__info">
            <Link to={`/product/${product.id}`} className="product-card__title">
              {product.title}
            </Link>
            <p className="product-card__price">{product.price} $</p>
          </div>
          <Link to={`/product/${product.id}`} className="product-card__button">
            Buy Now
          </Link>
        </li>
      ))}
    </ul>
  );
}