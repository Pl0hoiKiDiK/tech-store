import React, { useState } from 'react';
import './ProductSpecs.css';

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

export default function ProductSpecs({ product }) {
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  return (
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

        <button type="button" className="btn btn--expand" onClick={() => setDetailsExpanded((v) => !v)}>
          {detailsExpanded ? 'View Less' : 'View More'}
          <ExpandArrow expanded={detailsExpanded} />
        </button>
      </div>
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