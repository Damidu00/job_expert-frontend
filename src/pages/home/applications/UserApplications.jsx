import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

const UserApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/jobs/my-applications', {
        withCredentials: true,
      });
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load your applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      withdrawn: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status] || statusClasses.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const withdrawApplication = async (applicationId) => {
    try {
      const confirmed = window.confirm('Are you sure you want to withdraw this application?');
      if (!confirmed) return;

      const response = await axios.post(
        `http://localhost:5000/api/jobs/withdraw-application/${applicationId}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Application withdrawn successfully');
        setApplications(applications.map(app => 
          app._id === applicationId ? { ...app, status: 'withdrawn' } : app
        ));
      }
    } catch (error) {
      console.error('Error withdrawing application:', error);
      toast.error('Failed to withdraw application');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">My Job Applications</h1>

      {applications.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-xl text-gray-600 mb-4">You haven't applied to any jobs yet.</p>
          <Link to="/jobs" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {applications.map((application) => (
            <div key={application._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {application.job.title}
                    </h2>
                    <div className="flex items-center mt-1">
                      <FaBuilding className="text-gray-500 mr-2" />
                      <span className="text-gray-700">{application.job.company}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <FaMapMarkerAlt className="text-gray-500 mr-2" />
                      <span className="text-gray-700">{application.job.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    {getStatusBadge(application.status)}
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <FaCalendarAlt className="mr-1" />
                      <span>Applied: {formatDate(application.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gray-50">
                <div className="flex justify-between items-center">
                  <Link 
                    to={`/jobs/${application.job._id}`} 
                    className="text-blue-600 hover:underline"
                  >
                    View Job Details
                  </Link>
                  
                  {application.status === 'pending' && (
                    <button
                      onClick={() => withdrawApplication(application._id)}
                      className="px-4 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100"
                    >
                      Withdraw Application
                    </button>
                  )}
                </div>
                
                {application.status === 'accepted' && (
                  <div className="mt-4 bg-green-50 text-green-800 p-3 rounded-md">
                    <p className="font-semibold">Congratulations! Your application has been accepted.</p>
                    <p className="text-sm mt-1">
                      Please check your email for further instructions from the employer.
                    </p>
                  </div>
                )}
                
                {application.status === 'rejected' && (
                  <div className="mt-4 bg-red-50 text-red-800 p-3 rounded-md">
                    <p className="font-semibold">Your application was not selected for this position.</p>
                    <p className="text-sm mt-1">
                      Don't be discouraged! Keep applying to find the right opportunity.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserApplications; 