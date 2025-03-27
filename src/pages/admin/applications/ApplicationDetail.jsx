import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaUserCircle, FaEnvelope, FaPhone, FaBriefcase, FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaCheck, FaTimes, FaArrowLeft } from 'react-icons/fa';

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        withCredentials: true
      });
      
      if (response.data.user && response.data.user.role === 'admin') {
        setIsAdmin(true);
        fetchApplicationDetail();
      } else {
        toast.error('Admin access required');
        navigate('/');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      toast.error('Please log in to access admin panel');
      navigate('/login');
    }
  };

  const fetchApplicationDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/applications/${id}`, {
        withCredentials: true
      });
      setApplication(response.data);
    } catch (error) {
      console.error('Error fetching application details:', error);
      toast.error('Failed to fetch application details');
      navigate('/admin/applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationStatus = async (newStatus) => {
    try {
      setProcessing(true);
      await axios.put(`http://localhost:5000/api/applications/${id}/status`, 
        { status: newStatus },
        { withCredentials: true }
      );
      
      // Update the local state to reflect the change
      setApplication(prevApplication => ({ ...prevApplication, status: newStatus }));
      toast.success(`Application ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Application Not Found</h2>
          <p className="text-gray-700 mb-6">The application you are looking for does not exist or you don't have permission to view it.</p>
          <Link 
            to="/admin/applications" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link to="/admin/applications" className="inline-flex items-center text-indigo-600 hover:text-indigo-900">
              <FaArrowLeft className="mr-2" />
              Back to Applications
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">Application Details</h1>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            application.status === 'Approved' ? 'bg-green-100 text-green-800' : 
            application.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
            'bg-yellow-100 text-yellow-800'
          }`}>
            {application.status}
          </div>
        </div>
        
        {/* Application information */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 bg-indigo-500 text-white">
            <h2 className="text-xl font-bold">
              Application for: {application.job?.title || 'Unknown Job'}
            </h2>
            <p className="text-indigo-100 mt-1">
              Submitted on: {formatDate(application.createdAt)}
            </p>
          </div>
          
          {/* Applicant Information */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Applicant Information</h3>
            <div className="flex items-start space-x-4">
              <FaUserCircle className="w-16 h-16 text-indigo-600" />
              <div>
                <h4 className="text-xl font-medium text-gray-900">{application.user?.fullname || 'Unknown User'}</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <FaEnvelope className="mr-2 text-indigo-500" />
                    {application.user?.email || 'No email provided'}
                  </div>
                  {application.user?.phoneNumber && (
                    <div className="flex items-center text-gray-600">
                      <FaPhone className="mr-2 text-indigo-500" />
                      {application.user.phoneNumber}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Job Information */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Job Information</h3>
            {application.job ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-4">
                    <FaBriefcase className="mr-2 text-indigo-500" />
                    <div>
                      <p className="text-sm text-gray-500">Job Title</p>
                      <p className="font-medium text-gray-900">{application.job.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    <FaBuilding className="mr-2 text-indigo-500" />
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium text-gray-900">{application.job.company?.name || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-4">
                    <FaMapMarkerAlt className="mr-2 text-indigo-500" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{application.job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    <FaCalendarAlt className="mr-2 text-indigo-500" />
                    <div>
                      <p className="text-sm text-gray-500">Application Deadline</p>
                      <p className="font-medium text-gray-900">
                        {new Date(application.job.applicationDeadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 italic">Job information is not available</p>
            )}
          </div>
          
          {/* Cover Letter */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cover Letter</h3>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-gray-700 whitespace-pre-wrap">{application.coverLetter || 'No cover letter provided'}</p>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        {application.status === 'Pending' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Application Actions</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => handleApplicationStatus('Approved')}
                disabled={processing}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaCheck className="mr-2" />
                Approve Application
              </button>
              <button
                onClick={() => handleApplicationStatus('Rejected')}
                disabled={processing}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaTimes className="mr-2" />
                Reject Application
              </button>
            </div>
          </div>
        )}
        
        {/* Application History */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Application Timeline</h3>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-l-4 border-indigo-500">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <FaUserCircle className="text-indigo-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                  <p className="text-sm text-gray-500">{formatDate(application.createdAt)}</p>
                </div>
              </div>
            </div>
            
            {application.status !== 'Pending' && (
              <div className={`p-4 border-l-4 ${
                application.status === 'Approved' ? 'border-green-500' : 'border-red-500'
              }`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      application.status === 'Approved' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {application.status === 'Approved' ? (
                        <FaCheck className="text-green-600" />
                      ) : (
                        <FaTimes className="text-red-600" />
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      Application {application.status}
                    </p>
                    <p className="text-sm text-gray-500">
                      {application.updatedAt ? formatDate(application.updatedAt) : 'Date not recorded'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 