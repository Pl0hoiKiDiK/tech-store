import React, { useMemo, useState } from 'react';
import fullStarIcon from '../../../assets/icons/full-star.svg';
import halfStarIcon from '../../../assets/icons/half-star.svg';
import emptyStarIcon from '../../../assets/icons/empty-star.svg';
import './ProductReviews.css';

function formatReviewDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month},${year}`;
}

export function StarRow({ rating }) {
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

export default function ProductReviews({ product }) {
  const [reviewsExpanded, setReviewsExpanded] = useState(false);

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

  const visibleReviews = reviewsExpanded ? product.reviews : product.reviews?.slice(0, 3);
  const averageRating = Math.round((product.rating || 0) * 2) / 2;

  return (
    <section className="reviews-section">
      <div className="reviews-top">
        <h2 className="reviews-title">Reviews</h2>

        <div className="overall-rating">
          <div className="rating-summary">
            <div className="rating-summary__score-wrap">
              <span className="rating-summary__score">{product.rating?.toFixed(1)}</span>
              <p className="rating-summary__count">{product.reviews?.length || 0} reviews</p>
            </div>
            <StarRow rating={averageRating} />
          </div>

          <div className="rating-schedule">
            {reviewStats.map((stat) => (
              <div className="rating-schedule__row" key={stat.label}>
                <span className="rating-schedule__label">{stat.label}</span>
                <div className="rating-schedule__bar">
                  <div className="rating-schedule__fill" style={{ width: `${stat.percent}%` }} />
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