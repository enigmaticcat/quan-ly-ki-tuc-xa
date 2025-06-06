// admin/src/components/ProtectedRoute.jsx (Tạo file mới)
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('adminToken'); // Kiểm tra token

  if (!token) {
    // Nếu không có token, điều hướng về trang đăng nhập
    return <Navigate to="/" replace />;
  }

  // Nếu có token, cho phép render component con (các trang admin)
  return <Outlet />; 
};

export default ProtectedRoute;