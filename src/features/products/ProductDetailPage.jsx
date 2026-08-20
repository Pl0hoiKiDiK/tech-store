import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductByIdQuery, useGetProductsByCategoryQuery } from './productsApi';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../wishlist/wishlistSlice';
import { addToCart } from '../cart/cartSlice';
import likeIcon from '../../assets/icons/like-icon.svg';
import screenSizeIcon from '../../assets/icons/screensize-icon.svg';
import cpuIcon from '../../assets/icons/cpu-icon.svg';
import coresIcon from '../../assets/icons/cores-icon.svg';
import mainCameraIcon from '../../assets/icons/main-camera-icon.svg';
import frontCameraIcon from '../../assets/icons/front-camera-icon.svg';
import batteryIcon from '../../assets/icons/battery-icon.svg';
import deliveryTruckIcon from '../../assets/icons/delivery-truck-icon.svg';
import shopIcon from '../../assets/icons/shop-icon.svg';
import verifyIcon from '../../assets/icons/verify-icon.svg';
import fullStarIcon from '../../assets/icons/full-star.svg';
import halfStarIcon from '../../assets/icons/half-star.svg';
import emptyStarIcon from '../../assets/icons/empty-star.svg';
import './product-detail.css';

const COLOR_OPTIONS = ['#111111', '#8B5E3C', '#C0392B', '#D9C89E', '#B8C4C8'];
const STORAGE_OPTIONS = [
  { label: '64GB', status: 'available' },
  { label: '128GB', status: 'available' },
  { label: '256GB', status: 'selected' },
  { label: '512GB', status: 'available' },
  { label: '1TB', status: 'unavailable' },
];

function formatReviewDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month},${year}`;
}

function StarRow({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i += 1) {
    const diff = rating - (i - 1);
    let icon = emptyStarIcon;
    if (diff >= 1) icon = fullStarIcon;
    else if (diff >= 0.5) icon = halfStarIcon;
    stars.push(icon);
  }
  return (
    <div className="star-row" aria-hidden="true">
      {stars.map((icon, idx) => (
        <img key={idx} src={icon} alt="" className="star-row__icon" />
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, isLoading, isError } = useGetProductByIdQuery(id);

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState('256GB');
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [reviewsExpanded, setReviewsExpanded] = useState(false);

  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [mainImage, setMainImage] = useState(null);
  const [cartFeedback, setCartFeedback] = useState(false);

  const isInWishlist = product ? wishlistItems.some((item) => item.id === product.id) : false;
  const activeImage = mainImage || product?.images?.[0];

  const handleAddToCart = () => {
    dispatch(addToCart({ id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail }));
    setCartFeedback(true);
    setTimeout(() => setCartFeedback(false), 1500);
  };

  const { data: relatedData } = useGetProductsByCategoryQuery(product?.category, {
    skip: !product,
  });

  const relatedProducts = useMemo(() => {
    if (!relatedData?.products) return [];
    return relatedData.products.filter((p) => p.id !== product?.id).slice(0, 4);
  }, [relatedData, product]);

  const reviewStats = useMemo(() => {
    if (!product?.reviews) return [];
    const labels = ['Excellent', 'Good', 'Average', 'Below Average', 'Poor'];
    const counts = [0, 0, 0, 0, 0];
    product.reviews.forEach((r) => {
      const idx = 5 - r.rating;
      if (idx >= 0 && idx < 5) counts[idx] += 1;
    });
    const max = Math.max(...counts, 1);
    return labels.map((label, i) => ({
      label,
      count: counts[i],
      percent: (counts[i] / max) * 100,
    }));
  }, [product]);

  if (isLoading) return <p className="detail-status" role="status">Loading...</p>;
  if (isError || !product) return <p className="detail-status" role="alert">Product not found</p>;

  const originalPrice = product.discountPercentage
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  const visibleReviews = reviewsExpanded ? product.reviews : product.reviews?.slice(0, 3);
  const averageRating = Math.round((product.rating || 0) * 2) / 2;

  return (
    <div className="product-detail-page">
      <nav className="breadcrumbs" aria-label="Breadcrumbs">
        <Link to="/catalog">Catalog</Link>
        <ArrowIcon />
        <span>{product.category}</span>
        <ArrowIcon />
        <span className="breadcrumbs__current" aria-current="page">{product.title}</span>
      </nav>

      <section className="main-info">
        <div className="main-info__gallery">
          <div className="gallery__thumbs">
            {product.images?.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                type="button"
                className="gallery__thumb-btn"
                onClick={() => setMainImage(img)}
                aria-label={`Show photo ${idx + 1}`}
              >
                <img src={img} alt={`${product.title}, photo ${idx + 1}`} className="gallery__thumb" />
              </button>
            ))}
          </div>
          <img src={activeImage} alt={product.title} className="gallery__main" />
        </div>

        <div className="main-info__content">
          <div className="product-heading">
            <h1 className="product-heading__title">{product.title}</h1>
            <div className="product-heading__price">
              <span className="price-current">{product.price} $</span>
              {originalPrice && <span className="price-old">{originalPrice} $</span>}
            </div>
          </div>

          <div className="product-options">
            <div className="option-block">
              <p className="option-block__label">Select color:</p>
              <div className="color-list" role="radiogroup" aria-label="Color selection">
                {COLOR_OPTIONS.map((color, idx) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-swatch ${idx === selectedColor ? 'color-swatch--active' : ''}`}
                    style={{ backgroundColor: color }}
                    aria-label={`Color ${idx + 1}`}
                    aria-pressed={idx === selectedColor}
                    onClick={() => setSelectedColor(idx)}
                  />
                ))}
              </div>
            </div>

            <div className="option-block">
              <div className="storage-list" role="radiogroup" aria-label="Storage selection">
                {STORAGE_OPTIONS.map((opt) => {
                  const isSelected = opt.label === selectedStorage;
                  const isUnavailable = opt.status === 'unavailable';
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      className={`storage-btn ${isSelected ? 'storage-btn--selected' : ''} ${isUnavailable ? 'storage-btn--unavailable' : ''}`}
                      disabled={isUnavailable}
                      onClick={() => setSelectedStorage(opt.label)}
                      aria-pressed={isSelected}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <ul className="quick-specs">
              <QuickSpec icon={screenSizeIcon} label="Screen size" value={`${product.dimensions?.width || '—'}"`} />
              <QuickSpec icon={cpuIcon} label="CPU" value={product.brand} />
              <QuickSpec icon={coresIcon} label="Number of Cores" value="8" />
              <QuickSpec icon={mainCameraIcon} label="Main camera" value="48 MP" />
              <QuickSpec icon={frontCameraIcon} label="Front-camera" value="12 MP" />
              <QuickSpec icon={batteryIcon} label="Battery capacity" value="4000 mAh" />
            </ul>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="action-buttons">
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => dispatch(toggleWishlist({ id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail }))}
              aria-pressed={isInWishlist}
            >
              {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
            <button type="button" className="btn btn--filled" onClick={handleAddToCart}>
              {cartFeedback ? 'Added!' : 'Add to Cart'}
            </button>
          </div>

          <ul className="delivery-info">
            <DeliveryItem icon={deliveryTruckIcon} label="Free Delivery" value="1-2 day" />
            <DeliveryItem icon={shopIcon} label="In Stock" value="Today" />
            <DeliveryItem icon={verifyIcon} label="Guaranteed" value="1 year" />
          </ul>
        </div>
      </section>

      <section className="details-section">
        <div className="details-content">
          <h2 className="details-content__title">Details</h2>
          <p className="details-content__description">{product.description}</p>

          <div className="specs-groups">
            <SpecGroup
              title="General"
              items={[
                ['Brand', product.brand],
                ['Category', product.category],
                ['SKU', product.sku],
                ['Weight', `${product.weight} g`],
              ]}
            />
            {detailsExpanded && (
              <SpecGroup
                title="Shipping & Warranty"
                items={[
                  ['Warranty', product.warrantyInformation],
                  ['Shipping', product.shippingInformation],
                  ['Return policy', product.returnPolicy],
                  [
                    'Dimensions',
                    product.dimensions
                      ? `${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth} cm`
                      : '—',
                  ],
                ]}
              />
            )}
          </div>

          <button
            type="button"
            className="btn btn--expand"
            onClick={() => setDetailsExpanded((v) => !v)}
          >
            {detailsExpanded ? 'View Less' : 'View More'}
            <ExpandArrow expanded={detailsExpanded} />
          </button>
        </div>
      </section>

      <section className="reviews-section">
        <div className="reviews-top">
          <h2 className="reviews-title">Reviews</h2>

          <div className="overall-rating">
            <div className="rating-summary">
              <span className="rating-summary__score">{product.rating?.toFixed(1)}</span>
              <p className="rating-summary__count">{product.reviews?.length || 0} reviews</p>
              <StarRow rating={averageRating} />
            </div>

            <div className="rating-schedule">
              {reviewStats.map((stat) => (
                <div className="rating-schedule__row" key={stat.label}>
                  <span className="rating-schedule__label">{stat.label}</span>
                  <div className="rating-schedule__bar">
                    <div
                      className="rating-schedule__fill"
                      style={{ width: `${stat.percent}%` }}
                    />
                  </div>
                  <span className="rating-schedule__count">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="review-field">
            <span>Leave Comment</span>
          </div>
        </div>

        <div className="reviews-full">
          {visibleReviews?.map((review, idx) => (
            <div className="review-card" key={idx}>
              <img
                src={`https://i.pravatar.cc/56?u=${review.reviewerEmail}`}
                alt={review.reviewerName}
                className="review-card__avatar"
              />
              <div className="review-card__content">
                <div className="review-card__header">
                  <span className="review-card__name">{review.reviewerName}</span>
                  <StarRow rating={review.rating} />
                  <span className="review-card__date">{formatReviewDate(review.date)}</span>
                </div>
                <p className="review-card__text">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>

        {product.reviews?.length > 3 && (
          <button
            type="button"
            className="btn btn--expand btn--center"
            onClick={() => setReviewsExpanded((v) => !v)}
          >
            {reviewsExpanded ? 'View Less' : 'See More'}
            <ExpandArrow expanded={reviewsExpanded} />
          </button>
        )}
      </section>

      {relatedProducts.length > 0 && (
        <section className="related-section">
          <h2 className="related-title">Related Products</h2>
          <ul className="related-row">
            {relatedProducts.map((item) => (
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
      )}
    </div>
  );
}

function QuickSpec({ icon, label, value }) {
  return (
    <li className="quick-spec">
      <img src={icon} alt="" className="quick-spec__icon" />
      <div>
        <p className="quick-spec__label">{label}</p>
        <p className="quick-spec__value">{value}</p>
      </div>
    </li>
  );
}

function DeliveryItem({ icon, label, value }) {
  return (
    <li className="delivery-item">
      <span className="delivery-item__icon-wrap">
        <img src={icon} alt="" className="delivery-item__icon" />
      </span>
      <div>
        <p className="delivery-item__label">{label}</p>
        <p className="delivery-item__value">{value}</p>
      </div>
    </li>
  );
}

function SpecGroup({ title, items }) {
  return (
    <div className="spec-group">
      <h3 className="spec-group__title">{title}</h3>
      {items.map(([label, value]) => (
        <div className="spec-row" key={label}>
          <span className="spec-row__label">{label}</span>
          <span className="spec-row__value">{value}</span>
        </div>
      ))}
    </div>
  );
}

function ExpandArrow({ expanded }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
      aria-hidden="true"
    >
      <path d="M6 9L12 15L18 9" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="6" height="12" viewBox="0 0 6 12" fill="none" aria-hidden="true">
      <path d="M1 1L5 6L1 11" stroke="#A4A4A4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}