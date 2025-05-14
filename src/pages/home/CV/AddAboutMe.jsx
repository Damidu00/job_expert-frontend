import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import fileUploadForSupaBase from "../../../utils/mediaUpload";

export default function AddAboutMe({ onClose, cvData }) {
  const location = useLocation();
  let user = JSON.parse(localStorage.getItem("user")); // Convert string to object
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
  const [imageFiles, setImageFiles] = useState([]);

  const validateName = (value) => /^[a-zA-Z\s]+$/.test(value);
  const validatePhoneNumber = (value) => /^[0-9]{10,}$/.test(value);
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validateUrl = (value) => /^(https?:\/\/[^\s]+)$/.test(value);
  useEffect(() => {
    if (cvData) {
      setFirstName(cvData.firstName || "");
      setLastName(cvData.lastName || "");
      setEmail(cvData.email || "");
      setPhoneNumber(cvData.phone || "");
      setLinkedinUrl(cvData.linkedinURL || "");
      setGithubUrl(cvData.githubURL || "");
      setAddress(cvData.Address || "");
      setBio(cvData.shortBio || "");
      // You can optionally handle displaying the existing profilePhoto here
    }
  }, [cvData]);
  const handleSubmit = async (e) => {
    e.preventDefault();

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

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("cvId", "cv02");
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone", phoneNumber);
    formData.append("linkedinURL", linkedinUrl);
    formData.append("githubURL", githubUrl);
    formData.append("Address", address);
    formData.append("shortBio", bio);
    if (imageFiles.length > 0) {
      formData.append("profilePhoto", imageFiles[0]);
    }

    try {
      let res;

      if (cvData && cvData._id) {
        const cvUserId = localStorage.getItem("cvUserId");

        res = await axios.put(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/cvuser/updateUser/${cvUserId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Your Details Updated");
      } else {
        res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/cvuser/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        localStorage.setItem("cvUserId", res.data.user._id);
        toast.success("Your Details Added");
      }

      console.log(res.data);
      onClose();
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Error saving CV details.");
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
          onChange={(e) =>
            validateName(e.target.value) && setFirstName(e.target.value)
          }
        />
        <input
          type="text"
          placeholder="Last Name"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
          value={lastName}
          onChange={(e) =>
            validateName(e.target.value) && setLastName(e.target.value)
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
          value={email}
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
          value={linkedinUrl}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setLinkedinUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="GitHub URL"
          value={githubUrl}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setGithubUrl(e.target.value)}
        />
      </div>

      <input
        type="text"
        placeholder="Address"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        required
        value={address}
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
