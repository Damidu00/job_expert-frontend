// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";

// const UpdateProfile = ({ setOpen }) => {
//   const [input, setInput] = useState({
//     fullname: "",
//     email: "",
//     phoneNumber: "",
//     bio: "",
//     skills: "",
//     resume: null,
//   });

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem("access_token");
    
//         if (!token) {
//           toast.error("Unauthorized! Please log in again.");
//           return;
//         }
   
//         const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/users/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         });
         

       

//         if (response.data.success) {
//           const user = response.data.user;
//           setInput({
//             fullname: user.fullname || "",
//             email: user.email || "",
//             phoneNumber: user.phoneNumber || "",
//             bio: user.profile?.bio || "",
//             skills: user.profile?.skills?.join(", ") || "",
//             resume: user.profile?.resume || null,
//           });
//         }
//       } catch (error) {
//         // toast.error("Failed to load user data.");
//       }
//     };

//     fetchUser();
//   }, []);

//   const handleChange = (e) => {
//     setInput({ ...input, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     setInput({ ...input, resume: e.target.files[0] });
//     console.log(e.target.files[0]); // Log to check if the file is selected correctly
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       toast.error("Unauthorized! Please log in again.");
//       return;
//     }


//     const formDataToSend = new FormData();
//     formDataToSend.append("fullname", input.fullname);
//     formDataToSend.append("email", input.email);
//     formDataToSend.append("phoneNumber", input.phoneNumber);
//     formDataToSend.append("bio", input.bio);
//     formDataToSend.append("skills", input.skills);
//     if (input.resume) {
//       formDataToSend.append("resume", input.resume);
//     }

//     // Log the FormData to verify its contents
//     for (let pair of formDataToSend.entries()) {
//       console.log(pair[0], pair[1]);
//     }

//     try {
//       const response = await axios.post(
//         import.meta.env.VITE_BACKEND_URL + "/api/users/profile/update",
//         formDataToSend,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );

//       if (response.data.success) {
//         toast.success(response.data.message);
//         setOpen(false);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
//         {/* <button
//           onClick={() => setOpen(false)}
//           className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
//         >
//           &times;
//         </button> */}
//         <h2 className="text-2xl font-bold text-center mb-6">Update Profile</h2>
//         <form onSubmit={handleSubmit} encType="multipart/form-data">
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Full Name</label>
//             <input
//               type="text"
//               name="fullname"
//               value={input.fullname}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border rounded-md"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={input.email}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border rounded-md"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//             <input
//               type="text"
//               name="phoneNumber"
//               value={input.phoneNumber}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border rounded-md"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Bio</label>
//             <textarea
//               name="bio"
//               value={input.bio}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border rounded-md"
//             ></textarea>
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
//             <input
//               type="text"
//               name="skills"
//               value={input.skills}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border rounded-md"
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700">Upload Resume</label>
//             <input
//               type="file"
//               name="resume"
//               accept="application/pdf"
//               onChange={handleFileChange}
//               className="mt-1 block w-full text-sm text-gray-500"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
//           >
//             Update Profile
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateProfile;

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateProfile = ({ setOpen }) => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "",
  });
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          toast.error("Unauthorized! Please log in again.");
          return;
        }

        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (response.data.success) {
          const user = response.data.user;
          setInput({
            fullname: user.fullname || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || "",
            bio: user.profile?.bio || "",
            skills: user.profile?.skills?.join(", ") || "",
          });
        }
      } catch (error) {
        // toast.error("Failed to load user data.");
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Unauthorized! Please log in again.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("fullname", input.fullname);
    formDataToSend.append("email", input.email);
    formDataToSend.append("phoneNumber", input.phoneNumber);
    formDataToSend.append("bio", input.bio);
    formDataToSend.append("skills", input.skills);

    if (resume) {
      formDataToSend.append("resume", resume);
    }

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/users/profile/update",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Update Profile</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={input.fullname}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={input.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={input.bio}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
            <input
              type="text"
              name="skills"
              value={input.skills}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Upload Resume</label>
            <input
              type="file"
              name="resume"
              accept="application/pdf"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
