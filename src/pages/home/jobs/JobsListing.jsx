import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaBriefcase, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaSearch, FaFilter, FaUser } from 'react-icons/fa';

export default function JobsListing() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    jobType: '',
    experienceLevel: '',
    location: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/jobs/get');
      // Only show approved jobs to regular users
      const approvedJobs = response.data.filter(job => job.status === 'Approved');
      setJobs(approvedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs. Please try again.');
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
      jobType: '',
      experienceLevel: '',
      location: '',
    });
    setSearchTerm('');
  };

  // Filter jobs based on user selections
  const filteredJobs = jobs.filter(job => {
    // Apply text search
    const searchMatch = !searchTerm || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.company?.name && job.company.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Apply filters
    return (
      searchMatch &&
      (filters.jobType === '' || job.jobType === filters.jobType) &&
      (filters.experienceLevel === '' || job.experienceLevel === filters.experienceLevel) &&
      (filters.location === '' || job.location.toLowerCase().includes(filters.location.toLowerCase()))
    );
  });

  // Extract unique values for filters
  const locations = [...new Set(jobs.map(job => job.location))];
  const jobTypes = [...new Set(jobs.map(job => job.jobType))];
  const experienceLevels = [...new Set(jobs.map(job => job.experienceLevel))];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Jobs</h1>
          <p className="mt-2 text-gray-600">Find your dream job from our curated listings</p>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative w-full md:w-auto md:flex-grow md:max-w-md">
            <input
              type="text"
              placeholder="Search jobs..."
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
            
            {(filters.jobType !== '' || filters.experienceLevel !== '' || filters.location !== '' || searchTerm !== '') && (
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type
                </label>
                <select
                  id="jobType"
                  name="jobType"
                  value={filters.jobType}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">All Job Types</option>
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level
                </label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={filters.experienceLevel}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">All Experience Levels</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
            {(filters.jobType || filters.experienceLevel || filters.location || searchTerm) ? ' matching your criteria' : ''}
          </p>
        </div>
        
        {/* Job listings */}
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
              {searchTerm || filters.jobType || filters.experienceLevel || filters.location
                ? 'Try adjusting your search criteria or filters.'
                : 'There are no job listings available at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(job => (
              <div key={job._id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col transition-all hover:shadow-lg hover:translate-y-[-2px]">
                {/* Card Header */}
                <div className="p-4 bg-gradient-to-r from-indigo-500 to-indigo-600">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-bold text-white truncate">{job.title}</h2>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {job.jobType}
                    </span>
                  </div>
                  <div className="mt-1 text-indigo-100 text-sm truncate">
                    {job.company?.name || 'No company information'}
                  </div>
                </div>
                
                {/* Card Body */}
                <div className="p-4 flex-grow">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <FaMapMarkerAlt className="mr-2 text-gray-500" />
                      <span className="text-gray-600">{job.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FaMoneyBillWave className="mr-2 text-gray-500" />
                      <span className="text-gray-600">{job.salary}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FaBriefcase className="mr-2 text-gray-500" />
                      <span className="text-gray-600">{job.experienceLevel}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-gray-500" />
                        <span className="text-gray-600">
                          {new Date(job.applicationDeadline).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FaUser className="mr-1 text-gray-500" />
                        <span className="text-gray-600">
                          {job.positionsFilled}/{job.numberOfPositions}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-gray-700 line-clamp-2">
                    {job.description}
                  </div>
                </div>
                
                {/* Card Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="w-full block text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 