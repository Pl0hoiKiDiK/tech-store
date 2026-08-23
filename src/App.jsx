import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { useGetMeQuery } from './features/auth/authApi';
import { setCredentials, logout } from './features/auth/authSlice';

export default function App() {
  const dispatch = useDispatch();
  const { accessToken, user } = useSelector((state) => state.auth);

  const { data, error } = useGetMeQuery(undefined, {
    skip: !accessToken || Boolean(user),
  });

  useEffect(() => {
    if (data) {
      dispatch(setCredentials({ user: data, accessToken }));
    }
    if (error) {
      dispatch(logout());
    }
  }, [data, error, accessToken, dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}