import React, { useState } from 'react';
import './ProductGallery.css';

export default function ProductGallery({ images, title }) {
  const [mainImage, setMainImage] = useState(null);
  const activeImage = mainImage || images?.[0];

  return (
    <div className="main-info__gallery">
      <div className="gallery__thumbs">
        {images?.slice(0, 4).map((img, idx) => (
          <button
            key={idx}
            type="button"
            className="gallery__thumb-btn"
            onClick={() => setMainImage(img)}
            aria-label={`Show photo ${idx + 1}`}
          >
            <img src={img} alt={`${title}, photo ${idx + 1}`} className="gallery__thumb" />
          </button>
        ))}
      </div>
      <img src={activeImage} alt={title} className="gallery__main" />
    </div>
  );
}