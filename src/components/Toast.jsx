import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideToast } from '../features/ui/uiSlice';
import './toast.css';

const TOAST_DURATION_MS = 3000;

export default function Toast() {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.ui.toast);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = setTimeout(() => {
      dispatch(hideToast());
    }, TOAST_DURATION_MS);

    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      {toast.message}
    </div>
  );
}
