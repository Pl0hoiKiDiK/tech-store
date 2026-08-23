import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../features/wishlist/wishlistSlice';
import { showToast } from '../features/ui/uiSlice';
import HeartIcon from './HeartIcon';

export default function WishlistButton({ product, className = 'wishlist-btn', variant = 'icon' }) {
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

  const ariaLabel = isActive
    ? `Remove ${product.title} from wishlist`
    : `Add ${product.title} to wishlist`;

  return (
    <button
      type="button"
      className={`${className}${isActive && variant === 'icon' ? ` ${className}--active` : ''}`}
      onClick={handleClick}
      aria-label={variant === 'text' ? undefined : ariaLabel}
      aria-pressed={isActive}
    >
      {variant === 'text'
        ? (isActive ? 'Remove from Wishlist' : 'Add to Wishlist')
        : <HeartIcon active={isActive} />}
    </button>
  );
}
