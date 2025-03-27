import { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {setAuthToken,removeAuthToken} from "../auth.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const isLoggingOut = useRef(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            // First try to get user from localStorage
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                
                // Only redirect if not already on the correct route
                const currentPath = location.pathname;
                
                // Skip redirect on login or signup pages
                if (currentPath !== '/login' && currentPath !== '/signup') {
                    // Redirect based on role if not already on correct dashboard
                    if (parsedUser.role === 'admin' && !currentPath.startsWith('/admin')) {
                        navigate('/admin');
                    } else if (parsedUser.role === 'company' && !currentPath.startsWith('/company')) {
                        navigate('/company/dashboard');
                    }
                }
            }
            
            // This helps set up axios interceptors once at app start
            setupAxiosInterceptors();
        } catch (error) {
            console.error('Error checking auth status:', error);
            localStorage.removeItem('user');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const setupAxiosInterceptors = () => {
        // Add response interceptor to handle 401 responses globally
        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    // If 401 Unauthorized and not during intentional logout
                    if (!isLoggingOut.current) {
                        console.log('Session expired, redirecting to login...');
                        localStorage.removeItem('user');
                        setUser(null);
                        navigate('/login');
                        toast.error('Session expired. Please log in again.');
                    } else {
                        // During intentional logout, just log the 401 but don't show toast or navigate
                        console.log('401 during logout - ignoring');
                    }
                }
                return Promise.reject(error);
            }
        );
    };

    const login = async (email, password, role) => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/users/login",
                { email, password, role },
                { withCredentials: true }
            );
            if (response.data.success) {
                console.log(response.data);
                const userData = response.data.user;
                setAuthToken(response.data.access_token);
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                toast.success(response.data.message);
                return userData;
            } else {
                throw new Error(response.data.message || "Login failed");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed";
            toast.error(errorMessage);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Set logging out flag to true
            isLoggingOut.current = true;
            console.log('🚫 Logout initiated, preventing 401 toasts');
            
            // First, clear user data locally to prevent race conditions with pending requests
            removeAuthToken();
            localStorage.removeItem('user');
            setUser(null);
            
            // Then make the API call to log out on the server
            // If this fails, the user is still logged out locally
            await axios.get("http://localhost:5000/api/users/logout", {
                withCredentials: true
            });
            
            toast.success("Logged out successfully");
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Even if API call fails, user is already logged out locally
            navigate('/login');
        } finally {
            // Reset the logging out flag after a delay
            setTimeout(() => {
                isLoggingOut.current = false;
                console.log('✅ Logout process completed, re-enabling 401 toasts');
            }, 1000);
        }
    };

    const isAuthenticated = () => {
        return !!user;
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };

    const isCompany = () => {
        return user?.role === 'company';
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isCompany
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 