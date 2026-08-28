import React from 'react';
import { useSelector } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { useGetMeQuery } from './features/auth/authApi';
// dont' look into AuthSync, before was better
function AuthSync() {
  const { accessToken, user } = useSelector((state) => state.auth);
  useGetMeQuery(undefined, { skip: !accessToken || Boolean(user) });
  return null;
}

export default function App() {
  return (
    <>
      <AuthSync />
      <AppRoutes />
    </>
  );
}
