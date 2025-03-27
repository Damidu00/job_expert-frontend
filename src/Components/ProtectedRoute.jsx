import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, isAdmin, isCompany, user } = useAuth();
    const location = useLocation();

    // If not logged in, redirect to login
    if (!isAuthenticated()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If on root path and user is admin, redirect to admin dashboard
    if (location.pathname === '/' && user?.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    // If on root path and user is company, redirect to company dashboard
    if (location.pathname === '/' && user?.role === 'company') {
        return <Navigate to="/company/dashboard" replace />;
    }

    // If specific roles are required for this route
    if (allowedRoles.length > 0) {
        const hasAllowedRole = allowedRoles.some(role => {
            switch (role) {
                case 'admin':
                    return isAdmin();
                case 'company':
                    return isCompany();
                case 'user':
                    return !isAdmin() && !isCompany();
                default:
                    return false;
            }
        });

        if (!hasAllowedRole) {
            // Redirect to appropriate dashboard based on role
            if (isAdmin()) {
                return <Navigate to="/admin" replace />;
            } else if (isCompany()) {
                return <Navigate to="/company/dashboard" replace />;
            } else {
                // Redirect regular users to homepage
                return <Navigate to="/" replace />;
            }
        }
    }

    return children;
}; 