import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsByCategoryQuery } from './productsApi';
import Select from '../../components/Select';
import FilterContent, { CATEGORIES } from './FilterContent';
import MobileFilterPanel from './MobileFilterPanel';
import likeIcon from '../../assets/icons/like-icon.svg';
import filtersIcon from '../../assets/icons/filters-icon.svg';
import './catalog.css';

const PAGE_SIZE = 9;

export default function CatalogPage() {
    const [activeCategory, setActiveCategory] = useState('smartphones');
    const { data, isLoading, isError } = useGetProductsByCategoryQuery(activeCategory);

    const [selectedBrands, setSelectedBrands] = useState([]);
    const [brandSearch, setBrandSearch] = useState('');
    const [sortBy, setSortBy] = useState('rating');
    const [page, setPage] = useState(1);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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

    const filterProps = {
        activeCategory,
        handleCategoryChange,
        filteredBrands,
        selectedBrands,
        toggleBrand,
        brandSearch,
        setBrandSearch,
    };

    if (isLoading) return <p className="catalog-status" role="status">Loading...</p>;
    if (isError) return <p className="catalog-status" role="alert">Failed to load products</p>;

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
                    <FilterContent {...filterProps} />
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

                            <div className="mobile-controls">
                                <button
                                    type="button"
                                    className="mobile-controls__btn"
                                    onClick={() => setMobileFilterOpen((v) => !v)}
                                    aria-expanded={mobileFilterOpen}
                                >
                                    <span>Filters</span>
                                    <img src={filtersIcon} alt="" />
                                </button>
                                <button type="button" className="mobile-controls__btn">
                                    <span>By rating</span>
                                    <MobileArrowIcon />
                                </button>
                            </div>

                            <p className="mobile-results">
                                Products Result : <span>{filtered.length}</span>
                            </p>

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
                        </>
                    )}
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

function MobileArrowIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 9L12 15L18 9" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}