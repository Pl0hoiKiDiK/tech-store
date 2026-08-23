import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../cart/cartSlice';
import WishlistButton from '../../../components/WishlistButton';
import screenSizeIcon from '../../../assets/icons/screensize-icon.svg';
import cpuIcon from '../../../assets/icons/cpu-icon.svg';
import coresIcon from '../../../assets/icons/cores-icon.svg';
import mainCameraIcon from '../../../assets/icons/main-camera-icon.svg';
import frontCameraIcon from '../../../assets/icons/front-camera-icon.svg';
import batteryIcon from '../../../assets/icons/battery-icon.svg';
import deliveryTruckIcon from '../../../assets/icons/delivery-truck-icon.svg';
import shopIcon from '../../../assets/icons/shop-icon.svg';
import verifyIcon from '../../../assets/icons/verify-icon.svg';
import './ProductInfo.css';

const COLOR_OPTIONS = ['#111111', '#8B5E3C', '#C0392B', '#D9C89E', '#B8C4C8'];
const STORAGE_OPTIONS = [
    { label: '64GB', status: 'available' },
    { label: '128GB', status: 'available' },
    { label: '256GB', status: 'selected' },
    { label: '512GB', status: 'available' },
    { label: '1TB', status: 'unavailable' },
];

function QuickSpec({ icon, label, value }) {
    return (
        <li className="quick-spec">
            <img src={icon} alt="" className="quick-spec__icon" />
            <div>
                <p className="quick-spec__label">{label}</p>
                <p className="quick-spec__value">{value}</p>
            </div>
        </li>
    );
}

function DeliveryItem({ icon, label, value }) {
    return (
        <li className="delivery-item">
            <span className="delivery-item__icon-wrap">
                <img src={icon} alt="" className="delivery-item__icon" />
            </span>
            <div>
                <p className="delivery-item__label">{label}</p>
                <p className="delivery-item__value">{value}</p>
            </div>
        </li>
    );
}

export default function ProductInfo({ product }) {
    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedStorage, setSelectedStorage] = useState('256GB');
    const [shortDescExpanded, setShortDescExpanded] = useState(false);
    const [cartFeedback, setCartFeedback] = useState(false);
    const [isClamped, setIsClamped] = useState(false);
    const descRef = useRef(null);

    useEffect(() => {
        const el = descRef.current;
        if (el) {
            setIsClamped(el.scrollHeight > el.clientHeight);
        }
    }, [product.description]);

    const dispatch = useDispatch();
    const handleAddToCart = () => {
        dispatch(addToCart({ id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail }));
        setCartFeedback(true);
        setTimeout(() => setCartFeedback(false), 1500);
    };

    const originalPrice = product.discountPercentage
        ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
        : null;

    return (
        <div className="main-info__content">
            <div className="product-heading">
                <h1 className="product-heading__title">{product.title}</h1>
                <div className="product-heading__price">
                    <span className="price-current">{product.price} $</span>
                    {originalPrice && <span className="price-old">{originalPrice} $</span>}
                </div>
            </div>

            <div className="product-options">
                <div className="option-block option-block--color">
                    <p className="option-block__label">Select color:</p>
                    <div className="color-list" role="radiogroup" aria-label="Color selection">
                        {COLOR_OPTIONS.map((color, idx) => (
                            <button
                                key={color}
                                type="button"
                                className={`color-swatch ${idx === selectedColor ? 'color-swatch--active' : ''}`}
                                style={{ backgroundColor: color }}
                                aria-label={`Color ${idx + 1}`}
                                aria-pressed={idx === selectedColor}
                                onClick={() => setSelectedColor(idx)}
                            />
                        ))}
                    </div>
                </div>

                <div className="option-block">
                    <div className="storage-list" role="radiogroup" aria-label="Storage selection">
                        {STORAGE_OPTIONS.map((opt) => {
                            const isSelected = opt.label === selectedStorage;
                            const isUnavailable = opt.status === 'unavailable';
                            return (
                                <button
                                    key={opt.label}
                                    type="button"
                                    className={`storage-btn ${isSelected ? 'storage-btn--selected' : ''} ${isUnavailable ? 'storage-btn--unavailable' : ''}`}
                                    disabled={isUnavailable}
                                    onClick={() => setSelectedStorage(opt.label)}
                                    aria-pressed={isSelected}
                                >
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <ul className="quick-specs">
                    <QuickSpec icon={screenSizeIcon} label="Screen size" value={`${product.dimensions?.width || '—'}"`} />
                    <QuickSpec icon={cpuIcon} label="CPU" value={product.brand} />
                    <QuickSpec icon={coresIcon} label="Number of Cores" value="8" />
                    <QuickSpec icon={mainCameraIcon} label="Main camera" value="48 MP" />
                    <QuickSpec icon={frontCameraIcon} label="Front-camera" value="12 MP" />
                    <QuickSpec icon={batteryIcon} label="Battery capacity" value="4000 mAh" />
                </ul>
            </div>

            <div className="product-description-wrap">
                <p
                    ref={descRef}
                    className={`product-description ${!shortDescExpanded ? 'product-description--clamped' : ''}`}
                >
                    {product.description}
                </p>
                {isClamped && !shortDescExpanded && (
                    <button
                        type="button"
                        className="product-description__more"
                        onClick={() => setShortDescExpanded(true)}
                    >
                        more...
                    </button>
                )}
            </div>

            <div className="action-buttons">
                <WishlistButton product={product} className="btn btn--outline" variant="text" />
                <button type="button" className="btn btn--filled" onClick={handleAddToCart}>
                    {cartFeedback ? 'Added!' : 'Add to Cart'}
                </button>
            </div>

            <ul className="delivery-info">
                <DeliveryItem icon={deliveryTruckIcon} label="Free Delivery" value="1-2 day" />
                <DeliveryItem icon={shopIcon} label="In Stock" value="Today" />
                <DeliveryItem icon={verifyIcon} label="Guaranteed" value="1 year" />
            </ul>
        </div>
    );
}