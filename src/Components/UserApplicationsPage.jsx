import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaEye, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import Navbar from './Navbar';

export default function UserApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        withCredentials: true
      });
      
      if (response.data.user) {
        setIsLoggedIn(true);
        fetchUserApplications();
      } else {
        toast.error('Please log in to view your applications');
        navigate('/login', { state: { from: '/applications' } });
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      toast.error('Please log in to view your applications');
      navigate('/login', { state: { from: '/applications' } });
    }
  };

  const fetchUserApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/applications/user', {
        withCredentials: true
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch your applications');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <FaCheckCircle className="text-green-500 mr-2" />;
      case 'Rejected':
        return <FaTimesCircle className="text-red-500 mr-2" />;
      default:
        return <FaClock className="text-yellow-500 mr-2" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Applications</h1>
          <p className="mt-2 text-gray-600">Track the status of your job applications</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
              <FaBriefcase className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-500 mb-6">
              You haven't applied for any jobs yet. Start exploring available positions and submit your first application!
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map(application => (
              <div key={application._id} className={`bg-white rounded-lg shadow overflow-hidden border-l-4 ${getStatusClass(application.status)}`}>
                <div className="px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getStatusIcon(application.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {application.job?.title || 'Unknown Position'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Applied on: {formatDate(application.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      application.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                      application.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {application.status}
                    </span>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <FaBuilding className="text-gray-500 mr-2" />
                      <span className="text-gray-700">
                        {application.job?.company?.name || 'Unknown Company'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-gray-500 mr-2" />
                      <span className="text-gray-700">
                        {application.job?.location || 'Location not specified'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <FaCalendarAlt className="inline mr-1" /> 
                      {application.job?.applicationDeadline 
                        ? `Deadline: ${formatDate(application.job.applicationDeadline)}` 
                        : 'No deadline specified'}
                    </div>
                    <Link
                      to={`/jobs/${application.job?._id}`}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FaEye className="mr-1" />
                      View Job
                    </Link>
                  </div>
                </div>
                
                {application.status === 'Approved' && (
                  <div className="px-6 py-3 bg-green-50 border-t border-green-200">
                    <p className="text-sm text-green-700 font-medium">
                      Congratulations! Your application has been approved. The employer may contact you soon.
                    </p>
                  </div>
                )}
                
                {application.status === 'Rejected' && (
                  <div className="px-6 py-3 bg-red-50 border-t border-red-200">
                    <p className="text-sm text-red-700 font-medium">
                      We're sorry, but your application was not selected for this position. Don't give up and keep applying!
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 