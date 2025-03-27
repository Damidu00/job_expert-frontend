import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaUserCircle, FaEnvelope, FaPhone, FaEye, FaCheck, FaTimes, FaFilter, FaSearch } from 'react-icons/fa';

export default function ApplicationsList() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    jobTitle: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
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
        fetchApplications();
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

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/applications/all', {
        withCredentials: true
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      jobTitle: '',
    });
    setSearchTerm('');
  };

  const handleApplicationStatus = async (applicationId, newStatus) => {
    try {
      setProcessing(true);
      await axios.put(`http://localhost:5000/api/applications/${applicationId}/status`, 
        { status: newStatus },
        { withCredentials: true }
      );
      
      // Update the local state to reflect the change
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      
      toast.success(`Application ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    } finally {
      setProcessing(false);
    }
  };

  // Filter applications based on filters and search term
  const filteredApplications = applications.filter(application => {
    const jobTitleMatch = !filters.jobTitle || 
      (application.job?.title && application.job.title.toLowerCase().includes(filters.jobTitle.toLowerCase()));
    
    const statusMatch = !filters.status || application.status === filters.status;
    
    const searchMatch = !searchTerm || 
      (application.user?.fullname && application.user.fullname.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (application.user?.email && application.user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (application.coverLetter && application.coverLetter.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return jobTitleMatch && statusMatch && searchMatch;
  });

  // Extract unique values for filter dropdowns
  const jobTitles = [...new Set(applications
    .filter(app => app.job?.title)
    .map(app => app.job.title)
  )];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Applications Management</h1>
          <p className="mt-2 text-gray-600">
            View and manage all applications for job postings
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative w-full md:w-auto md:flex-grow md:max-w-md">
            <input
              type="text"
              placeholder="Search by name, email or cover letter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaFilter className="text-gray-500" />
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
            
            {(filters.status !== '' || filters.jobTitle !== '' || searchTerm !== '') && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow mb-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <select
                  id="jobTitle"
                  name="jobTitle"
                  value={filters.jobTitle}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">All Job Titles</option>
                  {jobTitles.map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''} found
            {(filters.status || filters.jobTitle || searchTerm) ? ' matching your criteria' : ''}
          </p>
        </div>

        {/* Applications list */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
              <FaUserCircle className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filters.status || filters.jobTitle
                ? 'Try adjusting your search criteria or filters.'
                : 'There are no applications to display at the moment.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map(application => (
              <div key={application._id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Application header with status indicator */}
                <div className={`px-6 py-4 flex justify-between items-center border-l-4 ${
                  application.status === 'Approved' ? 'border-green-500 bg-green-50' : 
                  application.status === 'Rejected' ? 'border-red-500 bg-red-50' : 
                  'border-yellow-500 bg-yellow-50'
                }`}>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Application for: {application.job?.title || 'Unknown Job'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Submitted on: {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    application.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                    application.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {application.status}
                  </span>
                </div>
                
                {/* Applicant information */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="flex items-center space-x-3 mb-2 md:mb-0">
                      <FaUserCircle className="w-10 h-10 text-indigo-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{application.user?.fullname || 'Unknown User'}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaEnvelope className="mr-1" />
                            <span>{application.user?.email || 'No email'}</span>
                          </div>
                          {application.user?.phoneNumber && (
                            <div className="flex items-center">
                              <FaPhone className="mr-1" />
                              <span>{application.user.phoneNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/applications/${application._id}`}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FaEye className="mr-1" />
                        View Details
                      </Link>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Cover Letter</h5>
                    <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded border border-gray-200 max-h-32 overflow-y-auto">
                      {application.coverLetter || 'No cover letter provided'}
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                {application.status === 'Pending' && (
                  <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                    <button
                      onClick={() => handleApplicationStatus(application._id, 'Approved')}
                      disabled={processing}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaCheck className="mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleApplicationStatus(application._id, 'Rejected')}
                      disabled={processing}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaTimes className="mr-2" />
                      Reject
                    </button>
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