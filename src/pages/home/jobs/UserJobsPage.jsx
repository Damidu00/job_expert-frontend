import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaRegClock, FaUserGraduate, FaCheck, FaSearch, FaFilter } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import Navbar from '../../../Components/Navbar';

const UserJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingJob, setProcessingJob] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    jobType: '',
    experienceLevel: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/jobs/get');
      setJobs(response.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async (jobId) => {
    if (!user) {
      toast.error('Please log in to perform this action');
      return;
    }

    try {
      setProcessingJob(jobId);
      
      const response = await axios.post(
        `http://localhost:5000/api/jobs/accept/${jobId}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update the job in the local state
        setJobs(
          jobs.map(job => {
            if (job._id === jobId) {
              const updatedJob = { ...job };
              
              updatedJob.positionsFilled = (updatedJob.positionsFilled || 0) + 1;
              updatedJob.userAccepted = true;
              
              // Update status if all positions are filled
              if (updatedJob.positionsFilled >= updatedJob.numberOfPositions) {
                updatedJob.status = 'Filled';
              }
              
              return updatedJob;
            }
            return job;
          })
        );
        
        toast.success('Job accepted successfully!');
      }
    } catch (error) {
      console.error('Error accepting job:', error);
      toast.error(error.response?.data?.message || 'Failed to accept job');
    } finally {
      setProcessingJob(null);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      jobType: '',
      experienceLevel: ''
    });
    setSearchTerm('');
  };

  // Get unique values for filters
  const jobTypes = [...new Set(jobs.filter(job => job?.jobType).map(job => job.jobType))];
  const experienceLevels = [...new Set(jobs.filter(job => job?.experienceLevel).map(job => job.experienceLevel))];

  // Filter jobs based on search term and filters
  const filteredJobs = jobs.filter(job => {
    if (!job) return false;
    
    // Search term filter
    const searchFields = [
      job.title,
      job.company?.name || job.company,
      job.location,
      job.jobType,
      job.experienceLevel,
      job.description
    ].map(field => field ? field.toString().toLowerCase() : '');
    
    const searchMatch = !searchTerm || searchFields.some(field => field.includes(searchTerm.toLowerCase()));
    
    // Job type filter
    const jobTypeMatch = !filters.jobType || job.jobType === filters.jobType;
    
    // Experience level filter
    const experienceLevelMatch = !filters.experienceLevel || job.experienceLevel === filters.experienceLevel;
    
    return searchMatch && jobTypeMatch && experienceLevelMatch;
  });

  return (
    <div>
      <Navbar />
      
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
              Browse Available Jobs
            </h1>
            
            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search jobs by title, company, location..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FaFilter className="text-gray-500" />
                <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              </button>
            </div>
            
            {/* Filters */}
            {showFilters && (
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Type
                    </label>
                    <select
                      name="jobType"
                      value={filters.jobType}
                      onChange={handleFilterChange}
                      className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">All Job Types</option>
                      {jobTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience Level
                    </label>
                    <select
                      name="experienceLevel"
                      value={filters.experienceLevel}
                      onChange={handleFilterChange}
                      className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">All Experience Levels</option>
                      {experienceLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Job Listings */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
                <FaBriefcase className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filters.jobType || filters.experienceLevel
                  ? 'No jobs match your search criteria. Try adjusting your filters.'
                  : 'There are no jobs available at the moment.'}
              </p>
              {(searchTerm || filters.jobType || filters.experienceLevel) && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <div key={job._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4">
                    <h2 className="text-xl font-bold text-white">{job.title}</h2>
                    <div className="flex items-center mt-2 text-indigo-100">
                      <FaBuilding className="mr-2" />
                      <span>{job.company?.name || job.company}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <FaMapMarkerAlt className="text-indigo-500 mr-2" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaBriefcase className="text-indigo-500 mr-2" />
                        <span>{job.jobType}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaUserGraduate className="text-indigo-500 mr-2" />
                        <span>{job.experienceLevel}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaRegClock className="text-indigo-500 mr-2" />
                        <span>
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
                    
                    <div className="flex items-center justify-between mt-2 text-sm text-gray-500 border-t border-gray-200 pt-4">
                      <span>Status: <span className={`font-medium ${job.status === 'Filled' ? 'text-red-600' : 'text-green-600'}`}>
                        {job.status}
                      </span></span>
                      <span>Positions: {job.positionsFilled || 0}/{job.numberOfPositions}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <Link 
                        to={`/jobs/${job._id}`} 
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        View Details
                      </Link>

                      {job.userAccepted ? (
                        <span className="px-4 py-2 bg-green-100 text-green-800 rounded-md font-medium">Accepted</span>
                      ) : (
                        <button
                          onClick={() => handleAcceptJob(job._id)}
                          disabled={processingJob === job._id || job.status === 'Filled'}
                          className={`flex items-center px-3 py-2 rounded-md ${
                            processingJob === job._id
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : job.status === 'Filled'
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          <FaCheck className="mr-1" /> Accept
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserJobsPage; 