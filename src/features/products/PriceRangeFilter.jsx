import React, { useState, useEffect } from 'react';
import './price-range.css';

export default function PriceRangeFilter({ min, max, value, onChange }) {
  const [localMin, setLocalMin] = useState(value?.min ?? min);
  const [localMax, setLocalMax] = useState(value?.max ?? max);

  useEffect(() => {
    setLocalMin(value?.min ?? min);
    setLocalMax(value?.max ?? max);
  }, [value, min, max]);

  const commit = (nextMin, nextMax) => {
    setLocalMin(nextMin);
    setLocalMax(nextMax);
    onChange({ min: nextMin, max: nextMax });
  };

  const handleMinSlider = (e) => {
    const val = Math.min(Number(e.target.value), localMax - 1);
    commit(val, localMax);
  };

  const handleMaxSlider = (e) => {
    const val = Math.max(Number(e.target.value), localMin + 1);
    commit(localMin, val);
  };

  const handleMinInput = (e) => {
    const val = Math.min(Math.max(Number(e.target.value), min), localMax - 1);
    commit(val, localMax);
  };

  const handleMaxInput = (e) => {
    const val = Math.max(Math.min(Number(e.target.value), max), localMin + 1);
    commit(localMin, val);
  };

  const minPercent = ((localMin - min) / (max - min)) * 100;
  const maxPercent = ((localMax - min) / (max - min)) * 100;

  return (
    <div className="price-filter">
      <div className="price-filter__inputs">
        <div className="price-filter__field">
          <span className="price-filter__label">From</span>
          <input
            type="number"
            className="price-filter__input"
            value={localMin}
            min={min}
            max={max}
            onChange={handleMinInput}
            aria-label="Minimum price"
          />
        </div>

        <span className="price-filter__dash" aria-hidden="true" />

        <div className="price-filter__field">
          <span className="price-filter__label">To</span>
          <input
            type="number"
            className="price-filter__input"
            value={localMax}
            min={min}
            max={max}
            onChange={handleMaxInput}
            aria-label="Maximum price"
          />
        </div>
      </div>

      <div className="price-filter__slider">
        <div className="price-filter__track" />
        <div
          className="price-filter__range"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />
        <input
          type="range"
          className="price-filter__thumb price-filter__thumb--min"
          min={min}
          max={max}
          value={localMin}
          onChange={handleMinSlider}
          aria-label="Minimum price slider"
        />
        <input
          type="range"
          className="price-filter__thumb price-filter__thumb--max"
          min={min}
          max={max}
          value={localMax}
          onChange={handleMaxSlider}
          aria-label="Maximum price slider"
        />
      </div>
    </div>
  );
}