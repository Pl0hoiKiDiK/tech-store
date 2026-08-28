import React, { useState } from 'react';
import FilterContent, { CATEGORIES } from '../FilterContent';
import MobileFilterPanel from '../MobileFilterPanel';
import { DesktopToolbar, MobileToolbar } from './Toolbar';
import ProductGrid from './ProductGrid';
import Pagination from './Pagination';
import useCatalogFilters from './useCatalogFilters';
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
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const {
        searchQuery,
        activeCategory,
        selectedBrands,
        brandSearch,
        setBrandSearch,
        sortBy,
        setSortBy,
        page,
        setPage,
        priceRange,
        priceBounds,
        setPriceRange,
        isLoading,
        isError,
        filteredBrands,
        filtered,
        toggleBrand,
        handleCategoryChange,
    } = useCatalogFilters();

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
            <nav className="breadcrumbs" aria-label="Breadcrumbs">
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
                <aside className="filter" aria-label="Product filters">
                    <FilterContent {...filterProps} isMobile={false} />
                </aside>

                <section className="products" aria-label="Product list">
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
                                sortBy={sortBy}
                                onSortChange={setSortBy}
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
