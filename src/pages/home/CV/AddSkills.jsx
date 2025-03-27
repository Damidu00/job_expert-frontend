import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast'; // Import React Hot Toast
import { CiCirclePlus } from 'react-icons/ci';
import { useLocation } from 'react-router-dom';

export default function AddSkills({ onClose }) {
  const location = useLocation();
  let user = JSON.parse(localStorage.getItem('user')); // Convert string to object
  const userId = user ? user._id : null; // Now we can access _id
  console.log("userId -> " + userId);
  const [formFields, setFormFields] = useState([{ category: '', items: '' }]);

  const handleFormChange = (event, index) => {
    const data = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  };

  const addFields = () => {
    setFormFields([...formFields, { category: '', items: '' }]);
  };

  const validateInput = () => {
    for (let field of formFields) {
      if (!field.category.trim()) {
        toast.error('Category is required!');
        return false;
      }
      if (!/^[a-zA-Z ]+$/.test(field.category)) {
        toast.error('Category should contain only letters and spaces!');
        return false;
      }
      if (!field.items.trim()) {
        toast.error('Skills (items) are required!');
        return false;
      }

    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    const postData = {
      userId,
      cvId: 'cv02',
      skills: formFields,
    };

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/skills/`, postData);
      toast.success('Skills added successfully!');
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add skills. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formFields.map((form, index) => (
        <div key={index} className="flex flex-col gap-4">
          <input
            type="text"
            name="category"
            placeholder="Programming *"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={form.category}
            onChange={(event) => handleFormChange(event, index)}
            required
          />

          <div className="pl-8">
            <input
              type="text"
              name="items"
              placeholder="java, c, c++"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={form.items}
              onChange={(event) => handleFormChange(event, index)}
            />
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <CiCirclePlus
          className="bg-gray-200 text-5xl rounded-full m-2 hover:bg-gray-50 text-blue-300 hover:text-blue-700 hover:scale-120 cursor-pointer"
          onClick={addFields}
        />
      </div>

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

