import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

export default function AddReferees({ onClose }) {
  const location = useLocation();
  let user = JSON.parse(localStorage.getItem('user')); // Convert string to object
  const userId = user?. _id || null; // Optional chaining prevents errors
  console.log("userId -> " + userId);

  const [referees, setReferees] = useState([
    { refType: 'male', FirstName: '', LastName: '', position: '', workingPlace: '', location: '', phone: '' },
    { refType: 'male', FirstName: '', LastName: '', position: '', workingPlace: '', location: '', phone: '' }
  ]);

  const handleChange = (index, field, value) => {
    const updatedReferees = [...referees];
    updatedReferees[index][field] = value;
    setReferees(updatedReferees);
  };

  const isValidPhone = (phone) => /^\d{10}$/.test(phone); // 10-digit validation

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let referee of referees) {
      if (!isValidPhone(referee.phone)) {
        toast.error("Phone number must be 10 digits.");
        return;
      }
    }

    const payload = {
      userId,
      cvId: "cv02", 
      referees
    };

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/referees/`, payload);
      toast.success("Referee Details Added");
      onClose(); // Close the dialog after successful submission
    } catch (error) {
      console.error('Error submitting referees:', error);
      toast.error("Failed to add referee details");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Render referee fields */}
      {referees.map((referee, index) => (
        <div key={index} className="p-6 border rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Referee {index + 1}</h3>
          <div className="flex items-center space-x-6 mb-4">
            {/* Gender Selection */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name={`refereeGender${index}`} // Unique name for each referee
                value="male"
                checked={referee.refType === 'male'}
                onChange={(e) => handleChange(index, 'refType', e.target.value)}
                className="hidden"
              />
              <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${referee.refType === 'male' ? 'bg-blue-600' : 'border-gray-400'}`}>
                {referee.refType === 'male' && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
              </div>
              <span className="text-gray-700">Male</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name={`refereeGender${index}`} // Unique name for each referee
                value="female"
                checked={referee.refType === 'female'}
                onChange={(e) => handleChange(index, 'refType', e.target.value)}
                className="hidden"
              />
              <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${referee.refType === 'female' ? 'bg-pink-500' : 'border-gray-400'}`}>
                {referee.refType === 'female' && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
              </div>
              <span className="text-gray-700">Female</span>
            </label>
          </div>

          {/* First Name and Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={referee.FirstName}
              onChange={(e) => handleChange(index, 'FirstName', e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={referee.LastName}
              onChange={(e) => handleChange(index, 'LastName', e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Position */}
          <input
            type="text"
            placeholder="Position"
            value={referee.position}
            onChange={(e) => handleChange(index, 'position', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 mt-3"
            required
          />

          {/* Working Place */}
          <input
            type="text"
            placeholder="Working Place"
            value={referee.workingPlace}
            onChange={(e) => handleChange(index, 'workingPlace', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 mt-3"
            required
          />

          {/* Location */}
          <input
            type="text"
            placeholder="Location"
            value={referee.location}
            onChange={(e) => handleChange(index, 'location', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 mt-3"
            required
          />

          {/* Phone */}
          <input
            type="text"
            placeholder="Phone"
            value={referee.phone}
            onChange={(e) => handleChange(index, 'phone', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 mt-3"
            required
          />
        </div>
      ))}

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
