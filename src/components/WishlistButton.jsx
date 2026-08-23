import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../features/wishlist/wishlistSlice';
import { showToast } from '../features/ui/uiSlice';
import HeartIcon from './HeartIcon';

export default function WishlistButton({ product, className = 'wishlist-btn' }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isActive = wishlistItems.some((item) => item.id === product.id);

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    dispatch(toggleWishlist({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
    }));

    dispatch(showToast(isActive ? 'Removed from wishlist' : 'Added to wishlist'));
  };

  return (
    <button
      type="button"
      className={`${className}${isActive ? ` ${className}--active` : ''}`}
      onClick={handleClick}
      aria-label={isActive ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
      aria-pressed={isActive}
    >
      <HeartIcon active={isActive} />
    </button>
  );
}
