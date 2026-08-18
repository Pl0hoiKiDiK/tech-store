import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsByCategoryQuery } from './productsApi';
import Accordion from '../../components/Accordion';
import Checkbox from '../../components/Checkbox';
import Select from '../../components/Select';
import likeIcon from '../../assets/icons/like-icon.svg';
import './catalog.css';

const CATEGORIES = [
  { slug: 'smartphones', label: 'Smartphones' },
  { slug: 'laptops', label: 'Laptops' },
  { slug: 'tablets', label: 'Tablets' },
  { slug: 'mobile-accessories', label: 'Mobile Accessories' },
];

const PAGE_SIZE = 9;
const EXTRA_FILTERS = ['Battery capacity', 'Screen type', 'Screen diagonal', 'Protection class', 'Built-in memory'];

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState('smartphones');
  const { data, isLoading, isError } = useGetProductsByCategoryQuery(activeCategory);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brandSearch, setBrandSearch] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [page, setPage] = useState(1);

  const allProducts = data?.products || [];

  const brands = useMemo(() => {
    const counts = {};
    allProducts.forEach((p) => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
  }, [allProducts]);

  const filteredBrands = brands.filter(([name]) =>
    name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setPage(1);
  };

  const handleCategoryChange = (slug) => {
    setActiveCategory(slug);
    setSelectedBrands([]);
    setPage(1);
  };

  const filtered = useMemo(() => {
    let result = allProducts;
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }
    return [...result].sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return b.rating - a.rating;
    });
  }, [allProducts, selectedBrands, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeCategoryLabel = CATEGORIES.find((c) => c.slug === activeCategory)?.label;

  if (isLoading) return <p className="catalog-status" role="status">Загрузка...</p>;
  if (isError) return <p className="catalog-status" role="alert">Не удалось загрузить товары</p>;

  return (
    <div className="catalog">
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        <span>Home</span>
        <ArrowIcon />
        <span>Catalog</span>
        <ArrowIcon />
        <span className="breadcrumbs__current" aria-current="page">{activeCategoryLabel}</span>
      </nav>

      <div className="catalog__body">
        <aside className="filter" aria-label="Фильтры товаров">
          <Accordion title="Category" defaultOpen>
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

          <Accordion title="Brand" defaultOpen>
            <div className="filter__search">
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

          {EXTRA_FILTERS.map((title) => (
            <Accordion title={title} key={title}>
              <p className="filter__placeholder">Нет данных для этой категории</p>
            </Accordion>
          ))}
        </aside>

        <section className="products" aria-label="Список товаров">
          <div className="products__toolbar">
            <p className="products__count">
              Selected Products: <span>{filtered.length}</span>
            </p>
            <Select
              value={sortBy}
              onChange={(val) => setSortBy(val)}
              options={[
                { value: 'rating', label: 'By rating' },
                { value: 'price', label: 'By price' },
                { value: 'title', label: 'By title' },
              ]}
            />
          </div>

          <ul className="products__grid">
            {pageItems.map((product) => (
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

          <nav className="pagination" aria-label="Пагинация">
            <button
              className="pagination__arrow"
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Предыдущая страница"
            >
              <ChevronIcon direction="left" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(0, 5)
              .map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`pagination__number ${num === page ? 'pagination__active' : ''}`}
                  onClick={() => setPage(num)}
                  aria-label={`Страница ${num}`}
                  aria-current={num === page ? 'page' : undefined}
                >
                  {num}
                </button>
              ))}
            <button
              className="pagination__arrow"
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Следующая страница"
            >
              <ChevronIcon direction="right" />
            </button>
          </nav>
        </section>
      </div>
    </div>
  );
}

function ArrowIcon({ color = '#A4A4A4' }) {
  return (
    <svg width="6" height="12" viewBox="0 0 6 12" fill="none" aria-hidden="true">
      <path d="M1 1L5 6L1 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon({ direction }) {
  const rotate = direction === 'left' ? 'rotate(180deg)' : 'none';
  return (
    <svg width="6" height="12" viewBox="0 0 6 12" fill="none" style={{ transform: rotate }} aria-hidden="true">
      <path d="M1 1L5 6L1 11" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}