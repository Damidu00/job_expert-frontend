import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { CiCirclePlus } from 'react-icons/ci';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AddCertifications({ onClose }) {
  const location = useLocation()
  let user = JSON.parse(localStorage.getItem('user')); // Convert string to object
  const userId = user ? user._id : null; // Now we can access _id
  console.log("userId -> " + userId);
  const [formFields, setFormFields] = useState([
    { instituteName: '', certificateName: '', Link: '' },
  ]);

  // Handle form field changes
  const handleFormChange = (event, index) => {
    const data = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  };

  // Add a new certification field
  const addFields = () => {
    setFormFields([...formFields, { instituteName: '', certificateName: '', Link: '' }]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      userId,
      cvId: 'cv02',
      certificates: formFields,
    };

    console.log(postData);

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/certificates/`, postData);

      toast.success("Certificate Details added")

      onClose(); // Close the dialog after successful submission
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to add certificate details")
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Render dynamic certification fields */}
      {formFields.map((form, index) => (
        <div key={index} className="flex flex-row gap-4">
          {/* Institute Name Input */}
          <input
            type="text"
            name="instituteName"
            placeholder="Institute Name:- SLIIT *"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={form.instituteName}
            onChange={(event) => handleFormChange(event, index)}
            required
          />

          {/* Certificate Name Input */}
          <input
            type="text"
            name="certificateName"
            placeholder="Certificate Name:- Machine Learning *"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={form.certificateName}
            onChange={(event) => handleFormChange(event, index)}
            required
          />

          {/* Certificate Link Input */}
          <input
            type="text"
            name="Link"
            placeholder="Certificate Link:- https://open.uom.lk/lms/mod/customcert/verify_certificate.php"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={form.Link}
            onChange={(event) => handleFormChange(event, index)}
            required
          />
        </div>
      ))}

      {/* Add New Certification Button */}
      <div className="flex justify-end">
        <CiCirclePlus
          className="bg-gray-200 text-5xl rounded-full m-2 hover:bg-gray-50 text-blue-300 hover:text-blue-700 hover:scale-120 cursor-pointer"
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