import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineMail } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import { BsFillTelephoneFill } from 'react-icons/bs';
import UpdateProfile from './updateprofile';

const Profile = () => {
  const [user, setUser] = useState(null); // State to store user data
  const [open, setOpen] = useState(false); // Modal state
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('access_token'); // Get token from localStorage
        if (!token) {
          console.error('No authentication token found.');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/users/currentuser', {
          headers: { Authorization: `Bearer ${token}` }, // Send token
          withCredentials: true,
        });

        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Error fetching user data.</p>;

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg my-5 p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            {/* Profile Photo */}
            <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-300">
              <img
                src={user.profile.profilePhoto || 'https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg'}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2 font-bold">{user.fullname}</h1>
              <p className="text-gray-600">{user.profile.bio || 'No bio available'}</p>
            </div>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-full flex items-center gap-2 mt-4 sm:mt-0"
          >
            <FiEdit size={20} /> Edit
          </button>
        </div>

        {/* Contact Information */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <AiOutlineMail size={20} className="text-gray-500" />
            <span className="text-gray-600">{user.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <BsFillTelephoneFill size={20} className="text-gray-500" />
            <span className="text-gray-600">{user.phoneNumber}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Skills</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {user.profile.skills?.length > 0 ? (
              user.profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-500">NA</span>
            )}
          </div>
        </div>

        {/* Resume */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Resume</h2>
          {user.profile.resume ? (
            <a
              href={user.profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline cursor-pointer"
            >
              {user.profile.resumeOriginalName || 'Download Resume'}
            </a>
          ) : (
            <span className="text-gray-500">No resume uploaded</span>
          )}
        </div>
      </div>

      {/* Applied Jobs Section */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8 my-5">
        <h1 className="font-bold text-lg mb-4">Applied Jobs</h1>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Job Role</th>
              <th className="px-4 py-2">Company</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Mock Applied Jobs Data */}
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2">17-07-2024</td>
              <td className="px-4 py-2">Frontend Developer</td>
              <td className="px-4 py-2">Google</td>
              <td className="px-4 py-2">
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                  Selected
                </span>
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2">17-07-2024</td>
              <td className="px-4 py-2">Full Stack Developer</td>
              <td className="px-4 py-2">Microsoft</td>
              <td className="px-4 py-2">
                <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                  Pending
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Update Profile Dialog */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-1 rounded-lg shadow-md w-full max-w-lg relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <UpdateProfile setOpen={setOpen} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
