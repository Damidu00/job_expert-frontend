import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../../Components/Navbar";
import { User } from "lucide-react";
export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  let user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user._id : null;
  const [recentCvs, setRecentCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleEditCV = (id) => {
    navigate(`/addcvdetails/${id}`); // pass the CV id in the URL
  };
  useEffect(() => {
    const fetchRecentCvs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/cvuser/UserAllCv/${userId}`
        );
        setRecentCvs(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching recent CVs:", err);
        setError("Failed to load recent CVs.");
        setLoading(false);
      }
    };

    if (userId) {
      fetchRecentCvs();
    }
  }, [userId]);

  console.log(recentCvs);
  const handleViewCV = (cvId) => {
    navigate(`/cv/${cvId}`, { state: { userId } });
  };

  const handleCreateNewCV = () => {
    navigate("/addcvdetails", { state: { userId } });
  };

  // Format relative time (e.g., "2 days ago")
  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side - Main Dashboard Content */}
          <div className="w-full md:w-2/3 ">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="flex justify-center">
                <button
                  onClick={handleCreateNewCV}
                  className="flex items-center justify-center gap-2 bg-blue-100 text-blue-700 p-4 rounded-lg hover:bg-blue-200 transition duration-200"
                >
                  <CiSquarePlus size={24} />
                  <span>Create New CV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Recent Access CVs */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Recently Accessed CVs
              </h2>

              {recentCvs.length > 0 ? (
                <ul className="space-y-4">
                  {recentCvs.map((cv) => (
                    <li
                      key={cv._id}
                      className="flex items-center justify-between border border-gray-200 p-3 rounded-md hover:bg-gray-50"
                    >
                      <div
                        className="flex items-center space-x-4 cursor-pointer"
                        onClick={() => handleViewCV(cv._id)}
                      >
                        {cv.profileImage ? (
                          <img
                            src={cv.profileImage}
                            alt={`${cv.firstName} ${cv.lastName}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                        <h3 className="text-md font-medium text-gray-800">
                          {cv.firstName} {cv.lastName}
                        </h3>
                      </div>
                      <button
                        onClick={() => handleEditCV(cv._id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No recent CVs found.</p>
              )}
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-md shadow-sm m-3">
              <div className="bg-green-50 border-l-4 border-green-400 text-green-800 p-4 rounded-md shadow-sm">
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m0-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                  Tips for Creating a Great CV:
                </h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Keep your CV concise—ideally 1–2 pages.</li>
                  <li>
                    Use action verbs (e.g., "Developed", "Led", "Achieved").
                  </li>
                  <li>Tailor your CV to each job you apply for.</li>
                  <li>Highlight achievements, not just responsibilities.</li>
                  <li>
                    Use a clean, readable layout and consistent formatting.
                  </li>
                  <li>Include only relevant skills and experiences.</li>
                  <li>
                    Proofread thoroughly to avoid typos and grammar mistakes.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* CV Tips Section */}
        </div>
      </div>
    </div>
  );
}
