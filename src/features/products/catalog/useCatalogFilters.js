import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetProductsByCategoryQuery, useSearchProductsQuery } from '../productsApi';

export default function useCatalogFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q')?.trim() || '';

  const [activeCategory, setActiveCategory] = useState('smartphones');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brandSearch, setBrandSearch] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState(null);

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useGetProductsByCategoryQuery(activeCategory, { skip: Boolean(searchQuery) });

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useSearchProductsQuery(searchQuery, { skip: !searchQuery });

  const data = searchQuery ? searchData : categoryData;
  const isLoading = searchQuery ? isSearchLoading : isCategoryLoading;
  const isError = searchQuery ? isSearchError : isCategoryError;
  const allProducts = data?.products || [];

  useEffect(() => { setPage(1); }, [searchQuery, activeCategory]);

  const priceBounds = useMemo(() => {
    if (allProducts.length === 0) return { min: 0, max: 1000 };
    const prices = allProducts.map((p) => p.price);
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [allProducts]);

  useEffect(() => { setPriceRange(priceBounds); }, [priceBounds.min, priceBounds.max]);

  const brands = useMemo(() => {
    const counts = {};
    allProducts.forEach((p) => { counts[p.brand] = (counts[p.brand] || 0) + 1; });
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
    if (searchQuery) setSearchParams({});
  };

  const filtered = useMemo(() => {
    let result = allProducts;
    if (selectedBrands.length > 0) result = result.filter((p) => selectedBrands.includes(p.brand));
    if (priceRange) result = result.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);
    return [...result].sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return b.rating - a.rating;
    });
  }, [allProducts, selectedBrands, priceRange, sortBy]);

  return {
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
    brands,
    filteredBrands,
    filtered,
    toggleBrand,
    handleCategoryChange,
  };
}
