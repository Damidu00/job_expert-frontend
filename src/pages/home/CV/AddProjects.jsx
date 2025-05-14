import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CiCirclePlus } from 'react-icons/ci';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // Import react-hot-toast

export default function AddProjects({ onClose,cvData }) {
  const location = useLocation();
  let user = JSON.parse(localStorage.getItem('user')); // Convert string to object
  const userId = user ? user._id : null; // Now we can access _id
  console.log("userId -> " + userId);
  const [projects, setProjects] = useState([
    { title: '', description: '', githubLink: '', liveDemo: '', techStack: '' },
  ]);

  // Handle input changes
  const handleFormChange = (event, index) => {
    const { name, value } = event.target;
    const newProjects = [...projects];

    // If the description field is being updated, limit it to 250 characters
    if (name === "description" && value.length <= 250) {
      newProjects[index][name] = value;
    } else if (name !== "description") {
      newProjects[index][name] = value;
    }

    setProjects(newProjects);
  };

  // Add a new project field
  const addFields = () => {
    setProjects([
      ...projects,
      { title: '', description: '', githubLink: '', liveDemo: '', techStack: '' },
    ]);
  };
  useEffect(() => {
    if (cvData && Array.isArray(cvData.projects) && cvData.projects.length > 0) {
      setProjects(cvData.projects);
    }
  }, [cvData]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const cvUserId = localStorage.getItem("cvUserId");
    const postData = {
      projects: projects,
    };

    
  try {
    await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cvuser/updateProjects/${cvUserId}`, postData);

    toast.success('Projects added successfully!', {
      duration: 4000,
    });

    onClose(); // Close the dialog after successful submission
  } catch (error) {
    console.error('Error adding projects:', error.response ? error.response.data : error.message);

    toast.error('Failed to add projects. Please try again.', {
      duration: 4000,
    });
  }

  };

  // Helper function to get ordinal numbers
  const getOrdinal = (n) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Render project fields */}
      {projects.map((project, index) => (
        <div key={index} className="border p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{getOrdinal(index + 1)} Project Details</h3>
          <input
            type="text"
            name="title"
            placeholder="Project Title *"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={project.title}
            onChange={(event) => handleFormChange(event, index)}
            required
          />
          <textarea
            name="description"
            placeholder="Project Description *"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 mt-2 h-28 resize-none"
            value={project.description}
            onChange={(event) => handleFormChange(event, index)}
            required
          ></textarea>
          <p className="text-sm text-gray-500 mt-1">{project.description.length} / 250</p> {/* Display character count */}
          <input
            type="text"
            name="githubLink"
            placeholder="GitHub Link *"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 mt-2"
            value={project.githubLink}
            onChange={(event) => handleFormChange(event, index)}
            required
          />
          <input
            type="text"
            name="liveDemo"
            placeholder="Live Demo (Optional)"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 mt-2"
            value={project.liveDemo}
            onChange={(event) => handleFormChange(event, index)}
          />
          <input
            type="text"
            name="techStack"
            placeholder="Tech Stack (Comma Separated)"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 mt-2"
            value={project.techStack}
            onChange={(event) => handleFormChange(event, index)}
          />
        </div>
      ))}

      {/* Add New Project Button */}
      <div className="flex justify-end">
        <CiCirclePlus
          className="bg-gray-200 text-5xl rounded-full m-2 hover:bg-gray-50 text-blue-300 hover:text-blue-700 hover:scale-110 cursor-pointer"
          onClick={addFields}
        />
      </div>

      {/* Action Buttons */}
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
