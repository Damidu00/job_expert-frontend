// import axios from "axios";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { Link, useNavigate } from "react-router-dom";

// export default function SignupForm() {
//     const [formData, setFormData] = useState({
//         fullname: "",
//         email: "",
//         phoneNumber: "",
//         password: "",
//         role: "user",
//         profilePhoto: null,
//     });

//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({ ...prevData, [name]: value }));
//     };

//     const handleFileChange = (e) => {
//         setFormData((prevData) => ({ ...prevData, profilePhoto: e.target.files[0] }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Check if any required fields are empty
//         if (!formData.fullname || !formData.email || !formData.phoneNumber || !formData.password) {
//             toast.error("Please fill in all required fields");
//             return;
//         }

//         // Validate phone number
//         if (formData.phoneNumber.length < 10) {
//             toast.error("Phone number must be at least 10 digits");
//             return;
//         }

//         const formDataToSend = new FormData();
//         formDataToSend.append("fullname", formData.fullname);
//         formDataToSend.append("email", formData.email);
//         formDataToSend.append("phoneNumber", formData.phoneNumber);
//         formDataToSend.append("password", formData.password);
//         formDataToSend.append("role", formData.role);
        
//         if (formData.profilePhoto) {
//             formDataToSend.append("file", formData.profilePhoto);
//         }

//         // Log the form data to make sure we have all values
//         console.log("Form values before sending:", {
//             fullname: formData.fullname,
//             email: formData.email,
//             phoneNumber: formData.phoneNumber,
//             password: formData.password ? "PROVIDED" : "MISSING",
//             role: formData.role
//         });

//         // Log form data entries to verify content
//         for (let pair of formDataToSend.entries()) {
//             console.log(pair[0] + ': ' + (pair[0] === 'password' ? '[HIDDEN]' : pair[1]));
//         }
        
//         try {            
//             const res = await axios.post(
//                 "http://localhost:5000/api/users/register",
//                 formDataToSend,
//                 {
//                     withCredentials: true,
//                 }
//             );

//             if (res.data.success) {
//                 toast.success(res.data.message);
//                 navigate("/login");
//             }
//         } catch (error) {
//             console.error(error);
//             const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
//             toast.error(errorMessage);
//             console.log("Error response data:", error.response?.data);
//         }
//     };

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
//             <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md">
//                 <h2 className="text-3xl font-bold text-center text-blue-500 mb-6">Sign Up</h2>
//                 <form onSubmit={handleSubmit} className="space-y-5">
//                     <div>
//                         <label className="block font-bold text-black text-sm mb-2">Full Name</label>
//                         <input
//                             type="text"
//                             name="fullname"
//                             required
//                             className="w-full p-2 border rounded"
//                             onChange={handleChange}
//                         />
//                     </div>

//                     <div>
//                         <label className="block font-bold text-black text-sm mb-2">Email</label>
//                         <input
//                             type="email"
//                             name="email"
//                             required
//                             className="w-full p-2 border rounded"
//                             onChange={handleChange}
//                         />
//                     </div>

//                     <div>
//                         <label className="block font-bold text-black text-sm mb-2">Phone Number</label>
//                         <input
//                             type="tel"
//                             name="phoneNumber"
//                             required
//                             className="w-full p-2 border rounded"
//                             onChange={handleChange}
//                         />
//                     </div>

//                     <div>
//                         <label className="block font-bold text-black text-sm mb-2">Password</label>
//                         <input
//                             type="password"
//                             name="password"
//                             required
//                             className="w-full p-2 border rounded"
//                             onChange={handleChange}
//                         />
//                     </div>

//                     <div>
//                         <label className="block font-bold text-black text-sm mb-2">Role</label>
//                         <div className="flex space-x-3">
//                             {["admin", "user", "company"].map((role) => (
//                                 <label key={role} className="flex items-center font-bold text-black text-sm">
//                                     <input
//                                         type="radio"
//                                         name="role"
//                                         value={role}
//                                         checked={formData.role === role}
//                                         onChange={handleChange}
//                                         className="mr-2"
//                                     />
//                                     {role.charAt(0).toUpperCase() + role.slice(1)}
//                                 </label>
//                             ))}
//                         </div>
//                     </div>

//                     <div>
//                         <label className="block font-bold text-black text-sm mb-2">Profile Photo</label>
//                         <input
//                             type="file"
//                             name="profilePhoto"
//                             accept="image/*"
//                             className="w-full p-2 border rounded mb-2"
//                             onChange={handleFileChange}
//                         />
//                     </div>

//                     <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 mb-2">
//                         Sign Up
//                     </button>

//                     <p className="text-center text-sm">
//                         Already have an account?{" "}
//                         <Link to="/login" className="text-blue-600 font-bold">
//                             Login
//                         </Link>
//                     </p>
//                 </form>
//             </div>
//         </div>
//     );
// }





import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function SignupForm() {
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "user",
        profilePhoto: null,
    });
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const validate = () => {
        let tempErrors = {};
        if (!formData.fullname.trim()) tempErrors.fullname = "Full name is required";
        if (!formData.email) {
            tempErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            tempErrors.email = "Invalid email format";
        }
        if (!formData.phoneNumber) {
            tempErrors.phoneNumber = "Phone number is required";
        } else if (!/^[0-9]+$/.test(formData.phoneNumber)) {
            tempErrors.phoneNumber = "Phone number must be numeric";
        }
        if (!formData.password) {
            tempErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            tempErrors.password = "Password must be at least 6 characters";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({ ...prevData, profilePhoto: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const formDataToSend = new FormData();
        formDataToSend.append("fullname", formData.fullname);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("phoneNumber", formData.phoneNumber);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("role", formData.role);
        
        if (formData.profilePhoto) {
            formDataToSend.append("file", formData.profilePhoto);
        }

        try {
            const res = await axios.post(
                import.meta.env.VITE_BACKEND_URL + `/api/users/register`,
                formDataToSend,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "An error occurred.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
            <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-blue-500 mb-6">Sign Up</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block font-bold text-black text-sm mb-2">Full Name</label>
                        <input type="text" name="fullname" className="w-full p-2 border rounded" onChange={handleChange} />
                        {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname}</p>}
                    </div>

                    <div>
                        <label className="block font-bold text-black text-sm mb-2">Email</label>
                        <input type="email" name="email" className="w-full p-2 border rounded" onChange={handleChange} />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block font-bold text-black text-sm mb-2">Phone Number</label>
                        <input type="tel" name="phoneNumber" className="w-full p-2 border rounded" onChange={handleChange} />
                        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                    </div>

                    <div>
                        <label className="block font-bold text-black text-sm mb-2">Password</label>
                        <input type="password" name="password" className="w-full p-2 border rounded" onChange={handleChange} />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block font-bold text-black text-sm mb-2">Role</label>
                        <div className="flex space-x-3">
                            {["admin", "user"].map((role) => (
                                <label key={role} className="flex items-center font-bold text-black text-sm">
                                    <input type="radio" name="role" value={role} checked={formData.role === role} onChange={handleChange} className="mr-2" />
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold text-black text-sm mb-2">Profile Photo</label>
                        <input type="file" name="profilePhoto" accept="image/*" className="w-full p-2 border rounded mb-2" onChange={handleFileChange} />
                    </div>

                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 mb-2">
                        Sign Up
                    </button>

                    <p className="text-center text-sm">
                        Already have an account? <Link to="/login" className="text-blue-600 font-bold">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

