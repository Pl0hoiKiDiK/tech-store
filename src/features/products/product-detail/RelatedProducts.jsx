import React from 'react';
import { Link } from 'react-router-dom';
import likeIcon from '../../../assets/icons/like-icon.svg';
import './RelatedProducts.css';

export default function RelatedProducts({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="related-section">
      <h2 className="related-title">Related Products</h2>
      <ul className="related-row">
        {products.map((item) => (
          <li className="related-card" key={item.id}>
            <button className="related-card__like" type="button" aria-label={`Add ${item.title} to wishlist`}>
              <img src={likeIcon} alt="" />
            </button>
            <Link to={`/product/${item.id}`}>
              <img src={item.thumbnail} alt={item.title} className="related-card__image" />
            </Link>
            <div className="related-card__info">
              <Link to={`/product/${item.id}`} className="related-card__title">
                {item.title}
              </Link>
              <p className="related-card__price">{item.price} $</p>
            </div>
            <Link to={`/product/${item.id}`} className="related-card__button">
              Buy Now
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}