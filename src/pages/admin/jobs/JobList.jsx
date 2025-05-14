import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaBriefcase, FaMapMarkerAlt, FaRegCalendarAlt, FaBuilding } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    jobType: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const cancelSourceRef = useRef(null);

  // Create a new cancel token source
  const createCancelToken = () => {
    // Cancel any existing requests
    if (cancelSourceRef.current) {
      cancelSourceRef.current.cancel("New request initiated");
    }
    
    // Create a new cancel token source
    cancelSourceRef.current = axios.CancelToken.source();
    return cancelSourceRef.current;
  };

  useEffect(() => {
    // Create a cancel token source
    const source = createCancelToken();
    
    const loadJobs = async () => {
      // Only fetch jobs if the user is authenticated and is an admin
      if (isAuthenticated() && isAdmin()) {
        try {
          setLoading(true);
          const response = await axios.get('http://localhost:5000/api/jobs/admin', {
            withCredentials: true,
            cancelToken: source.token
          });
          setJobs(response.data);
        } catch (error) { 
          // Ignore canceled requests and  401 errors during logout
          if (axios.isCancel(error)) {
            console.log('Request canceled:', error.message);
          } else if (error.response && error.response.status === 401) {
            // Don't log during unmount - it might be a logout
            if (isAuthenticated()) {
              console.log('User not authenticated, redirecting to login...');
            }
            // Let the AuthContext interceptor handle the redirect
          } else {
            console.error('Error fetching jobs:', error);
            toast.error('Failed to fetch jobs. Please try again.');
          }
        } finally {
          setLoading(false);
        }
      } else {
        // If not authenticated or not admin, don't try to fetch
        setLoading(false);
      }
    };

    loadJobs();

    // Clean up function to cancel pending requests when component unmounts or dependencies change
    return () => {
      if (source) {
        source.cancel('Component unmounted or dependencies changed');
      }
    };
  }, [isAuthenticated, isAdmin]);

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        // Create a cancel token for this operation
        const source = createCancelToken();
        
        await axios.delete(`http://localhost:5000/api/jobs/delete/${jobId}`, {
          withCredentials: true,
          cancelToken: source.token
        });
        toast.success('Job deleted successfully');
        
        // Instead of making a new request, update the local state
        setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
      } catch (error) {
        // Only show error toast if the error is not a 401 (Unauthorized) or canceled
        if (axios.isCancel(error)) {
          console.log('Delete request canceled:', error.message);
        } else if (error.response && error.response.status === 401) {
          // Don't log during unmount - it might be a logout
          if (isAuthenticated()) {
            console.log('User not authenticated, redirecting to login...');
          }
          // Let the AuthContext interceptor handle the redirect
        } else {
          console.error('Error deleting job:', error);
          toast.error('Failed to delete job. Please try again.');
        }
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      jobType: '',
    });
    setSearchTerm('');
  };

  const filteredJobs = jobs.filter(job => {
    // Apply text search
    const searchMatch = !searchTerm || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.company?.name && job.company.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Apply status filter
    const statusMatch = !filters.status || job.status === filters.status;
    
    // Apply job type filter
    const jobTypeMatch = !filters.jobType || job.jobType === filters.jobType;
    
    return searchMatch && statusMatch && jobTypeMatch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Filled': return 'bg-purple-100 text-purple-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  // If not authenticated or not admin, don't render anything
  if (!isAuthenticated() || !isAdmin()) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FaFilter className="text-gray-500" />
            <span>Filters</span>
          </button>
          <Link 
            to="/admin/jobs/add" 
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FaPlus />
            <span>Add Job</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Filled">Filled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <select
                name="jobType"
                value={filters.jobType}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading and Empty State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
            <FaBriefcase className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filters.status || filters.jobType
              ? 'No jobs match your search criteria. Try adjusting your filters.'
              : 'Create your first job listing to get started.'}
          </p>
          {searchTerm || filters.status || filters.jobType ? (
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Reset Filters
            </button>
          ) : (
            <Link 
              to="/admin/jobs/add" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <FaPlus className="-ml-1 mr-2 h-5 w-5" />
              Add Job
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div key={job._id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
              {/* Card Header */}
              <div className="p-4 bg-gradient-to-r from-indigo-500 to-indigo-600">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-white truncate">{job.title}</h3>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </div>
                <div className="mt-1 text-indigo-100 text-sm truncate">
                  {job.company?.name || 'No company assigned'}
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-4 flex-grow">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <FaMapMarkerAlt className="mr-2 text-gray-500" />
                    <span className="text-gray-600">{job.location || 'Remote'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FaBriefcase className="mr-2 text-gray-500" />
                    <span className="text-gray-600">{job.jobType || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FaRegCalendarAlt className="mr-2 text-gray-500" />
                    <span className="text-gray-600">
                      {job.applicationDeadline 
                        ? new Date(job.applicationDeadline).toLocaleDateString() 
                        : 'No deadline'}
                    </span>
                  </div>
                </div>
                
                <div className="px-4 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-700">
                      <strong>Positions:</strong> {job.positionsFilled || 0}/{job.numberOfPositions}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${job.positionsFilled >= job.numberOfPositions ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-700'}`}>
                      {job.positionsFilled >= job.numberOfPositions ? 'Filled' : 'Open'}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-600 line-clamp-2">
                  {job.description || 'No description provided.'}
                </div>
              </div>
              
              {/* Card Footer */}
              <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-3 border-t">
                <Link 
                  to={`/admin/jobs/edit/${job._id}`} 
                  className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-full transition-colors"
                  title="Edit Job"
                >
                  <FaEdit className="h-5 w-5" />
                </Link>
                <button 
                  onClick={() => handleDeleteJob(job._id)} 
                  className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete Job"
                >
                  <FaTrash className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 