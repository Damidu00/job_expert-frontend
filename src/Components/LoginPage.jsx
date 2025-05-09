import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function SignInForm() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "user",
    });

    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated, user } = useAuth();

    // Redirect already logged in users
    useEffect(() => {
        if (isAuthenticated()) {
            // If user is already logged in, redirect based on role
            if (user?.role === 'admin') {
                navigate('/admin');
            } else if (user?.role === 'company') {
                navigate('/company/dashboard');
            } else {
                navigate('/');
            }
        }
    }, [isAuthenticated, user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userData = await login(formData.email, formData.password, formData.role);
            
            // Get the intended destination or use role-based default
            const from = location.state?.from?.pathname;
            
            // Redirect based on role - always prioritize role-based destinations
            if (userData.role === 'admin') {
                navigate('/admin');
            } else if (userData.role === 'company') {
                navigate('/company/dashboard');
            } else {
                navigate(from || '/');
            }
        } catch (error) {
            console.error("Login Error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="flex h-screen">
                {/* Left side - Illustration */}
                <div className="hidden md:flex md:w-1/2 bg-white items-center justify-center p-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">
                            <span className="text-blue-500">Welcome to </span>
                            <span className="text-blue-600 font-extrabold tracking-wide">JobXpert</span>
                        </h1>
                        <p className="text-xl mb-8 text-black font-bold">Find your dream job with our platform</p>
                        <div className="flex justify-center">
                            <img 
                                src="https://img.freepik.com/free-vector/tablet-login-concept-illustration_114360-7963.jpg" 
                                alt="Login Illustration" 
                                className="w-[400px] h-auto rounded-lg object-contain"
                            />
                        </div>
                    </div>
                </div>

                {/* Right side - Login Form */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
                    <div className="bg-white p-8 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.25)] w-full max-w-md">
                        <h2 className="text-blue-500 text-4xl font-bold text-center mb-6">Sign In</h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block font-bold text-sm text-black mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full p-2 border rounded"
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-sm text-black mb-2">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    className="w-full p-2 border rounded"
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-sm text-black mb-2">Role</label>
                                <div className="flex space-x-3">
                                    {["admin", "user", "company"].map((role) => (
                                        <label key={role} className="flex items-center text-sm font-bold text-black">
                                            <input
                                                type="radio"
                                                name="role"
                                                value={role}
                                                checked={formData.role === role}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700">
                                Sign In
                            </button>

                            <button type="button" className="w-full flex items-center justify-center border py-2 rounded hover:bg-gray-200">
                                <FcGoogle className="mr-2 text-xl" />
                                Sign in with Google
                            </button>

                            <p className="text-center text-sm">
                                Don't have an account? <Link to="/signup" className="text-blue-600 font-bold">Sign Up</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}



