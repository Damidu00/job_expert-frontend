import React, { useState } from 'react';
import axios from 'axios';
import { CiCirclePlus } from 'react-icons/ci';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast'; // Import React Hot Toast

export default function AddEducation({ onClose }) {
  const location = useLocation();
  let user = JSON.parse(localStorage.getItem('user')); // Convert string to object
  const userId = user ? user._id : null; // Now we can access _id
  console.log("userId -> " + userId);
  const [education, setEducation] = useState([
    { eduLevel: '', school: '', degree: '', startDate: '', endDate: '', description: '', charCount: 0 },
  ]);

  // Handle input changes
  const handleFormChange = (event, index) => {
    const { name, value } = event.target;
    const newEducation = [...education];
    
    // Limit character input to 250
    if (name === 'description' && value.length <= 250) {
      newEducation[index][name] = value;
      newEducation[index].charCount = value.length;
    } else if (name !== 'description') {
      newEducation[index][name] = value;
    }

    setEducation(newEducation);
  };

  // Add a new education field
  const addFields = () => {
    setEducation([...education, { eduLevel: '', school: '', degree: '', startDate: '', endDate: '', description: '', charCount: 0 }]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate description length (max 250 characters)
    const isDescriptionValid = education.every(edu => {
      return edu.description.length <= 250;
    });

    if (!isDescriptionValid) {
      toast.error('Description cannot exceed 250 characters');
      return;
    }

    const cvId = "cv02";

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/education/`, {
        userId,
        cvId,
        details: education,
      });
      toast.success('Education details saved successfully!');

      onClose(); 
    } catch (error) {
      console.error('Error saving education details:', error);
      toast.error('Failed to save education details. Please try again.');
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
      {/* Render education fields */}
      {education.map((edu, index) => (
        <div key={index} className="border p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{getOrdinal(index + 1)} Education Details</h3>
          <input
            type="text"
            name="eduLevel"
            placeholder="Education Level *"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={edu.eduLevel}
            onChange={(event) => handleFormChange(event, index)}
            required
          />
          <input
            type="text"
            name="school"
            placeholder="School/University *"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 mt-2"
            value={edu.school}
            onChange={(event) => handleFormChange(event, index)}
            required
          />
          <input
            type="text"
            name="degree"
            placeholder="Degree (if applicable)"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 mt-2"
            value={edu.degree}
            onChange={(event) => handleFormChange(event, index)}
          />
          <div className="flex flex-col gap-4 mt-2">
            <div>
              <span>Start Date *</span>
              <input
                type="date"
                name="startDate"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={edu.startDate}
                onChange={(event) => handleFormChange(event, index)}
                required
              />
            </div>
            <div>
              <span>End Date</span>
              <input
                type="date"
                name="endDate"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={edu.endDate}
                onChange={(event) => handleFormChange(event, index)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <textarea
              name="description"
              placeholder="Description (optional)"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 mt-2 h-28 resize-none"
              value={edu.description}
              onChange={(event) => handleFormChange(event, index)}
            ></textarea>
            <span className="text-sm text-gray-500 mt-2">{edu.charCount}/250</span>
          </div>
        </div>
      ))}

      {/* Add New Education Button */}
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

