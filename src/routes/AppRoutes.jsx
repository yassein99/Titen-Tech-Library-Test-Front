import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProtectedRoute from './ProtectedRoute';

const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const Register = lazy(() => import('../pages/auth/register'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const UserDashboard = lazy(() => import('../pages/user/Dashboard'));
//const Userbook = lazy(() => import('../pages/user/BooksPage'));
const HomePage = lazy(() => import('../pages/Home/HomePage'));

const AppRoutes = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={isAuthenticated ? 
          <Navigate to={role === 'Admin' ? '/admin' : '/user'} /> : 
          <LoginPage />} 
        />
        <Route path="/register" element={isAuthenticated ? 
          <Navigate to={role === 'Admin' ? '/admin' : '/user'} /> : 
          <Register />} 
        />
        
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/user/*" element={<UserDashboard />} />
        </Route>
        
      
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;