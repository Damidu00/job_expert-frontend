import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import fileUploadForSupaBase from "../../../utils/mediaUpload";

export default function AddAboutMe({ onClose }) {
  const location = useLocation();
  let user = JSON.parse(localStorage.getItem('user')); // Convert string to object
  const userId = user ? user._id : null; // Now we can access _id
  console.log("userId -> " + userId);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  // const [image, setImage] = useState(null);
  const [imageFiles,setImageFiles] = useState([])

  const validateName = (value) => /^[a-zA-Z\s]+$/.test(value); 
  const validatePhoneNumber = (value) => /^[0-9]{10,}$/.test(value);
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validateUrl = (value) => /^(https?:\/\/[^\s]+)$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const promisesArray = []
        
        for(let i=0; i<imageFiles.length; i++){
            promisesArray[i] = fileUploadForSupaBase(imageFiles[i])    
        }
        
        const imgUrls = await Promise.all(promisesArray)
        const profilePhotoURL = imgUrls[0]
        console.log(profilePhotoURL)


    

    if (!validateName(firstName) || !validateName(lastName)) {
      return toast.error("First and Last Name must contain only alphabets.");
    }
    if (!validateEmail(email)) {
      return toast.error("Invalid email format.");
    }
    if (!validatePhoneNumber(phoneNumber)) {
      return toast.error("Phone number must be at least 10 digits.");
    }
    if (linkedinUrl && !validateUrl(linkedinUrl)) {
      return toast.error("Invalid LinkedIn URL.");
    }
    if (githubUrl && !validateUrl(githubUrl)) {
      return toast.error("Invalid GitHub URL.");
    }
    // if (image) {
    //   const fileTypes = ["image/jpeg", "image/png", "image/jpg"];
    //   if (!fileTypes.includes(image.type)) {
    //     return toast.error("Profile photo must be a JPG or PNG file.");
    //   }
    //   if (image.size > 2 * 1024 * 1024) {
    //     return toast.error("Profile photo must be under 2MB.");
    //   }
    // }

    const details = {
      userId,
      cvId: "cv02",
      firstName,
      lastName,
      email,
      phone: phoneNumber,
      linkedinURL: linkedinUrl,
      githubURL: githubUrl,
      Address: address,
      shortBio: bio,
      profilePhoto : profilePhotoURL
    };

    try {
      await axios.post(import.meta.env.VITE_BACKEND_URL + `/api/cvuser/`, details)
        .then((res) => {
          onClose();
          console.log(res.data)
          toast.success("Your Details Added")
        })
        .catch(() => {
          console.log(res.data)
          toast.error("Error adding user details.");
          
        });
    } catch (error) {
      console.error(error);
      alert("Failed to add details. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="First Name"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
          value={firstName}
          onChange={(e) => validateName(e.target.value) && setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
          value={lastName}
          onChange={(e) => validateName(e.target.value) && setLastName(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="LinkedIn URL"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setLinkedinUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="GitHub URL"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setGithubUrl(e.target.value)}
        />
      </div>

      <input
        type="text"
        placeholder="Address"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        required
        onChange={(e) => setAddress(e.target.value)}
      />

      <textarea
        placeholder="Short Bio (max 250 characters)"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 h-28 resize-none"
        required
        value={bio}
        onChange={(e) => e.target.value.length <= 250 && setBio(e.target.value)}
      ></textarea>
      <p className="text-sm text-gray-500">{bio.length}/250 characters</p>

      <input
        type="file"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        accept="image/png, image/jpeg, image/jpg"
        onChange={(e) => setImageFiles(e.target.files)}
      />

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Save
        </button>
      </div>
    </form>
  );
}

