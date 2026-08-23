import React from 'react';
import Accordion from '../../components/Accordion';
import Checkbox from '../../components/Checkbox';
import PriceRangeFilter from './PriceRangeFilter';
import searchIcon from '../../assets/icons/search-icon.svg';
import './FilterContent.css';

const CATEGORIES = [
  { slug: 'smartphones', label: 'Smartphones' },
  { slug: 'laptops', label: 'Laptops' },
  { slug: 'tablets', label: 'Tablets' },
  { slug: 'mobile-accessories', label: 'Mobile Accessories' },
];

const EXTRA_FILTERS = ['Battery capacity', 'Screen type', 'Screen diagonal', 'Protection class', 'Built-in memory'];

export { CATEGORIES, EXTRA_FILTERS };

export default function FilterContent({
  isMobile = false,
  activeCategory,
  handleCategoryChange,
  filteredBrands,
  selectedBrands,
  toggleBrand,
  brandSearch,
  setBrandSearch,
  priceRange,
  priceBounds,
  onPriceChange,
}) {
  const categoryAccordion = (
    <Accordion title="Category" defaultOpen key="category">
      <ul className="filter__list">
        {CATEGORIES.map((cat) => (
          <li key={cat.slug} className="filter__item">
            <label className="filter__item-label">
              <Checkbox
                checked={activeCategory === cat.slug}
                onChange={() => handleCategoryChange(cat.slug)}
                label={`Категория ${cat.label}`}
              />
              <span className="filter__brand-name">{cat.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </Accordion>
  );

  const brandAccordion = (
    <Accordion title="Brand" defaultOpen key="brand">
      <div className="filter__search">
        <img src={searchIcon} alt="" className="filter__search-icon" />
        <label htmlFor="brand-search-input" className="visually-hidden">
          Поиск бренда
        </label>
        <input
          id="brand-search-input"
          type="text"
          placeholder="Search"
          value={brandSearch}
          onChange={(e) => setBrandSearch(e.target.value)}
        />
      </div>
      <ul className="filter__list">
        {filteredBrands.map(([brand, count]) => (
          <li key={brand} className="filter__item">
            <label className="filter__item-label">
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                label={`Бренд ${brand}, ${count} товаров`}
              />
              <span className="filter__brand-name">{brand}</span>
              <span className="filter__brand-count">{count}</span>
            </label>
          </li>
        ))}
      </ul>
    </Accordion>
  );

  const priceAccordion = (
    <Accordion title="Price" defaultOpen key="price">
      <PriceRangeFilter
        min={priceBounds.min}
        max={priceBounds.max}
        value={priceRange}
        onChange={onPriceChange}
      />
    </Accordion>
  );

  const extraAccordions = EXTRA_FILTERS.map((title) => (
    <Accordion title={title} key={title}>
      <p className="filter__placeholder">Coming soon</p>
    </Accordion>
  ));

  const order = isMobile
    ? [priceAccordion, categoryAccordion, brandAccordion, ...extraAccordions]
    : [categoryAccordion, brandAccordion, priceAccordion, ...extraAccordions];

  return <>{order}</>;
}