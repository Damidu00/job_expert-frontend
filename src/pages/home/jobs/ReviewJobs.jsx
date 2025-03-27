import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaBriefcase, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaFilter, FaSearch } from 'react-icons/fa';

export default function ReviewJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'Pending',
    jobType: '',
    experienceLevel: '',
    location: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is logged in and is admin
    const checkAdminStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          withCredentials: true
        });
        if (response.data.user.role === 'admin') {
          setIsAdmin(true);
          fetchJobs();
        } else {
          toast.error('You do not have permission to access this page');
          navigate('/jobs');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast.error('Please log in to access this page');
        navigate('/login');
      }
    };
    
    checkAdminStatus();
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/jobs/get', {
        withCredentials: true
      });
      
      // Filter jobs based on status
      let filteredJobs = response.data;
      if (filters.status) {
        filteredJobs = filteredJobs.filter(job => job.status === filters.status);
      }
      
      setJobs(filteredJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (status) => {
    setFilters(prev => ({
      ...prev,
      status
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: 'Pending',
      jobType: '',
      experienceLevel: '',
      location: ''
    });
    setSearchTerm('');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Apply filters and search
  const filteredJobs = jobs.filter(job => {
    // Apply status filter
    if (filters.status && job.status !== filters.status) {
      return false;
    }
    
    // Apply job type filter
    if (filters.jobType && job.jobType !== filters.jobType) {
      return false;
    }
    
    // Apply experience level filter
    if (filters.experienceLevel && job.experienceLevel !== filters.experienceLevel) {
      return false;
    }
    
    // Apply location filter
    if (filters.location && !job.location.includes(filters.location)) {
      return false;
    }
    
    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        job.title.toLowerCase().includes(searchLower) ||
        job.company?.name.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const handleReviewJob = async (jobId, decision, comment = '') => {
    try {
      const response = await axios.post(`http://localhost:5000/api/jobs/admin/review/${jobId}`, {
        decision,
        comment
      }, {
        withCredentials: true
      });
      
      toast.success(`Job ${decision === 'Approved' ? 'approved' : 'rejected'} successfully`);
      fetchJobs(); // Refresh jobs list
    } catch (error) {
      console.error('Error reviewing job:', error);
      toast.error(error.response?.data?.message || 'Failed to review job. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-500">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-10">
          <p className="text-gray-500">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Review Jobs</h1>
        <p className="mt-2 text-gray-600">Review and manage job listings</p>
      </div>
      
      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <FaFilter className="text-indigo-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Status Tabs */}
          <div className="col-span-1 md:col-span-5">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {['Pending', 'Approved', 'Rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      filters.status === status
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Search */}
          <div className="col-span-1 md:col-span-2">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search jobs..."
              />
            </div>
          </div>
          
          {/* Job Type Filter */}
          <div>
            <select
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Temporary">Temporary</option>
            </select>
          </div>
          
          {/* Experience Level Filter */}
          <div>
            <select
              name="experienceLevel"
              value={filters.experienceLevel}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Experience Levels</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="Executive">Executive</option>
            </select>
          </div>
          
          {/* Reset Filters */}
          <div className="flex items-center">
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Job Listings */}
      <div className="mt-8 space-y-6">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-10 bg-white shadow-md rounded-lg">
            <p className="text-gray-500">No jobs found matching your criteria.</p>
          </div>
        ) : (
          filteredJobs.map(job => (
            <div key={job._id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-5">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div className="flex-1">
                    <Link to={`/jobs/${job._id}`} className="text-xl font-bold text-indigo-600 hover:text-indigo-800">
                      {job.title}
                    </Link>
                    <p className="mt-1 text-sm text-gray-500">{job.company?.name}</p>
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaMapMarkerAlt className="mr-1 text-indigo-400" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaBriefcase className="mr-1 text-indigo-400" />
                        {job.jobType}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaMoneyBillWave className="mr-1 text-indigo-400" />
                        {job.salary}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaClock className="mr-1 text-indigo-400" />
                        Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {job.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-6 flex flex-col space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium 
                      ${job.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                        job.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {job.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      Posted on {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {/* Admin Review Controls - only show for pending jobs */}
                {job.status === 'Pending' && (
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={() => handleReviewJob(job._id, 'Rejected', 'Does not meet our quality standards')}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleReviewJob(job._id, 'Approved')}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 