import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductByIdQuery, useGetProductsByCategoryQuery } from '../productsApi';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductSpecs from './ProductSpecs';
import ProductReviews from './ProductReviews';
import RelatedProducts from './RelatedProducts';
import './shared.css';

function ArrowIcon() {
  return (
    <svg width="6" height="12" viewBox="0 0 6 12" fill="none" aria-hidden="true">
      <path d="M1 1L5 6L1 11" stroke="#A4A4A4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, isLoading, isError } = useGetProductByIdQuery(id);

  const { data: relatedData } = useGetProductsByCategoryQuery(product?.category, {
    skip: !product,
  });

  const relatedProducts = useMemo(() => {
    if (!relatedData?.products) return [];
    return relatedData.products.filter((p) => p.id !== product?.id).slice(0, 4);
  }, [relatedData, product]);

  if (isLoading) return <p className="detail-status" role="status">Loading...</p>;
  if (isError || !product) return <p className="detail-status" role="alert">Product not found</p>;

  return (
    <div className="product-detail-page">
      <nav className="breadcrumbs" aria-label="Breadcrumbs">
        <Link to="/catalog">Catalog</Link>
        <ArrowIcon />
        <span>{product.category}</span>
        <ArrowIcon />
        <span className="breadcrumbs__current" aria-current="page">{product.title}</span>
      </nav>

      <section className="main-info">
        <ProductGallery images={product.images} title={product.title} />
        <ProductInfo product={product} />
      </section>

      <ProductSpecs product={product} />
      <ProductReviews product={product} />
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}