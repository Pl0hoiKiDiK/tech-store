import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetProductsByCategoryQuery, useSearchProductsQuery } from '../productsApi';
import FilterContent, { CATEGORIES } from '../FilterContent';
import MobileFilterPanel from '../MobileFilterPanel';
import { DesktopToolbar, MobileToolbar } from './Toolbar';
import ProductGrid from './ProductGrid';
import Pagination from './Pagination';
import './shared.css';

const PAGE_SIZE = 9;

function ArrowIcon({ color = '#A4A4A4' }) {
  return (
    <svg width="6" height="12" viewBox="0 0 6 12" fill="none" aria-hidden="true">
      <path d="M1 1L5 6L1 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q')?.trim() || '';

  const [activeCategory, setActiveCategory] = useState('smartphones');
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useGetProductsByCategoryQuery(activeCategory, {
    skip: Boolean(searchQuery),
  });
  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useSearchProductsQuery(searchQuery, {
    skip: !searchQuery,
  });

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brandSearch, setBrandSearch] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const data = searchQuery ? searchData : categoryData;
  const isLoading = searchQuery ? isSearchLoading : isCategoryLoading;
  const isError = searchQuery ? isSearchError : isCategoryError;
  const allProducts = data?.products || [];

  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeCategory]);

  const priceBounds = useMemo(() => {
    if (allProducts.length === 0) return { min: 0, max: 1000 };
    const prices = allProducts.map((p) => p.price);
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [allProducts]);

  const [priceRange, setPriceRange] = useState(null);

  useEffect(() => {
    setPriceRange(priceBounds);
  }, [priceBounds.min, priceBounds.max]);

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
    if (searchQuery) {
      setSearchParams({});
    }
  };

  const filtered = useMemo(() => {
    let result = allProducts;
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }
    if (priceRange) {
      result = result.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);
    }
    return [...result].sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return b.rating - a.rating;
    });
  }, [allProducts, selectedBrands, priceRange, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeCategoryLabel = CATEGORIES.find((c) => c.slug === activeCategory)?.label;

  const filterProps = {
    activeCategory,
    handleCategoryChange,
    filteredBrands,
    selectedBrands,
    toggleBrand,
    brandSearch,
    setBrandSearch,
    priceRange,
    priceBounds,
    onPriceChange: setPriceRange,
  };

  if (isLoading) return <p className="catalog-status" role="status">Loading...</p>;
  if (isError) return <p className="catalog-status" role="alert">Failed to load products</p>;

  return (
    <div className="catalog">
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        <span>Catalog</span>
        <ArrowIcon />
        {searchQuery ? (
          <span className="breadcrumbs__current" aria-current="page">
            Search: &quot;{searchQuery}&quot;
          </span>
        ) : (
          <span className="breadcrumbs__current" aria-current="page">{activeCategoryLabel}</span>
        )}
      </nav>

      <div className="catalog__body">
        <aside className="filter" aria-label="Фильтры товаров">
          <FilterContent {...filterProps} isMobile={false} />
        </aside>

        <section className="products" aria-label="Список товаров">
          {mobileFilterOpen ? (
            <MobileFilterPanel
              onClose={() => setMobileFilterOpen(false)}
              onApply={() => setMobileFilterOpen(false)}
              {...filterProps}
            />
          ) : (
            <>
              <DesktopToolbar count={filtered.length} sortBy={sortBy} onSortChange={setSortBy} />
              <MobileToolbar
                count={filtered.length}
                filterOpen={mobileFilterOpen}
                onFilterToggle={() => setMobileFilterOpen((v) => !v)}
              />
              {filtered.length === 0 ? (
                <p className="catalog-status" role="status">No products found</p>
              ) : (
                <ProductGrid products={pageItems} />
              )}
              {filtered.length > 0 && (
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
