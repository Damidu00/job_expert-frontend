import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaBriefcase, 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaRegClock, 
  FaUserGraduate, 
  FaIndustry,
  FaEnvelope,
  FaGlobe,
  FaPhone,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  console.log('Dashboard component mounted');
  // Jobs state
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobSearchTerm, setJobSearchTerm] = useState('');
  const [jobFilters, setJobFilters] = useState({
    status: '',
    jobType: '',
  });
  const [showJobFilters, setShowJobFilters] = useState(false);
  
  // Companies state
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [companySearchTerm, setCompanySearchTerm] = useState('');
  const [companyFilters, setCompanyFilters] = useState({
    industry: '',
  });
  const [showCompanyFilters, setShowCompanyFilters] = useState(false);
  
  const { isAuthenticated, isAdmin } = useAuth();

  // Fetch jobs
  useEffect(() => {
    let isMounted = true;
    const source = axios.CancelToken.source();
    
    const loadJobs = async () => {
      try {
        if (isAuthenticated() && isAdmin()) {
          setJobsLoading(true);
          
          console.log('Starting admin jobs API call...');
          const response = await axios.get('http://localhost:5000/api/jobs/admin', {
            withCredentials: true,
            cancelToken: source.token
          });
          
          console.log('Admin jobs API response:', response.data);
          
          if (isMounted) {
            if (response.data && Array.isArray(response.data)) {
              console.log(`Found ${response.data.length} admin jobs`);
              setJobs(response.data);
            } else {
              console.error('Expected array but got:', typeof response.data);
              setJobs([]);
            }
            setJobsLoading(false);
          }
        } else {
          if (isMounted) {
            setJobsLoading(false);
            setJobs([]);
          }
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Admin jobs request canceled:', error.message);
        } else {
          console.error('Error fetching admin jobs:', error);
          if (isMounted) {
            setJobs([]);
            setJobsLoading(false);
          }
        }
      }
    };

    loadJobs();

    return () => {
      isMounted = false;
      source.cancel('Component unmounted or dependencies changed');
    };
  }, [isAuthenticated, isAdmin]);

  // Fetch companies
  useEffect(() => {
    let isMounted = true;
    const source = axios.CancelToken.source();
    
    const loadCompanies = async () => {
      try {
        if (isAuthenticated() && isAdmin()) {
          setCompaniesLoading(true);
          
          console.log('Fetching companies...');
          const response = await axios.get('http://localhost:5000/api/companies/get', {
            withCredentials: true,
            cancelToken: source.token
          });
          
          console.log('Companies API response:', response.data);
          
          if (isMounted) {
            if (response.data && Array.isArray(response.data)) {
              console.log(`Found ${response.data.length} companies`);
              setCompanies(response.data);
            } else {
              console.error('Expected array of companies but got:', typeof response.data);
              setCompanies([]);
            }
            setCompaniesLoading(false);
          }
        } else {
          if (isMounted) {
            setCompaniesLoading(false);
            setCompanies([]);
          }
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Companies request canceled:', error.message);
        } else {
          console.error('Error fetching companies:', error);
          if (isMounted) {
            setCompanies([]);
            setCompaniesLoading(false);
          }
        }
      }
    };

    loadCompanies();

    return () => {
      isMounted = false;
      source.cancel('Component unmounted or dependencies changed');
    };
  }, [isAuthenticated, isAdmin]);

  // Jobs filter handlers
  const handleJobFilterChange = (e) => {
    const { name, value } = e.target;
    setJobFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetJobFilters = () => {
    setJobFilters({
      status: '',
      jobType: '',
    });
    setJobSearchTerm('');
  };

  // Companies filter handlers
  const handleCompanyFilterChange = (e) => {
    const { name, value } = e.target;
    setCompanyFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetCompanyFilters = () => {
    setCompanyFilters({
      industry: '',
    });
    setCompanySearchTerm('');
  };

  // Get mock jobs
  const getMockJobs = () => {
    return [
      {
        _id: 'mock1',
        title: 'Frontend Developer',
        description: 'We are looking for a skilled frontend developer with React experience.',
        location: 'New York',
        jobType: 'Full-time',
        status: 'Approved',
        applicationDeadline: new Date().toISOString(),
        numberOfPositions: 2,
        positionsFilled: 0,
        company: { name: 'Tech Corp' }
      },
      {
        _id: 'mock2',
        title: 'Backend Developer',
        description: 'Experienced Node.js developer needed for our growing team.',
        location: 'Remote',
        jobType: 'Contract',
        status: 'Pending',
        applicationDeadline: new Date().toISOString(),
        numberOfPositions: 1,
        positionsFilled: 0,
        company: { name: 'Software Solutions' }
      },
      {
        _id: 'mock3',
        title: 'UI/UX Designer',
        description: 'Creative designer with a portfolio of digital products required.',
        location: 'San Francisco',
        jobType: 'Part-time',
        status: 'Approved',
        applicationDeadline: new Date().toISOString(),
        numberOfPositions: 3,
        positionsFilled: 1,
        company: { name: 'Design World' }
      }
    ];
  };

  // Filter jobs - always provide jobs (real or mock)
  const getJobsToDisplay = () => {
    // If we have real jobs, filter them
    if (jobs.length > 0) {
      return jobs.filter(job => {
        // Skip null jobs
        if (!job) return false;
        
        // Apply text search if there's a search term
        const searchMatch = !jobSearchTerm || 
          (job.title && job.title.toLowerCase().includes(jobSearchTerm.toLowerCase())) ||
          (job.description && job.description.toLowerCase().includes(jobSearchTerm.toLowerCase())) ||
          (job.location && job.location.toLowerCase().includes(jobSearchTerm.toLowerCase())) ||
          (job.company?.name && job.company.name.toLowerCase().includes(jobSearchTerm.toLowerCase()));
        
        // Apply status filter if set
        const statusMatch = !jobFilters.status || job.status === jobFilters.status;
        
        // Apply job type filter if set
        const jobTypeMatch = !jobFilters.jobType || job.jobType === jobFilters.jobType;
        
        return searchMatch && statusMatch && jobTypeMatch;
      });
    }
    
    // Otherwise return mock jobs
    return getMockJobs();
  };

  const filteredJobs = getJobsToDisplay();

  // Get unique job types for filter dropdown
  const jobTypes = [...new Set(jobs.filter(job => job.jobType).map(job => job.jobType))];

  // Filter companies
  const filteredCompanies = companies.filter(company => {
    if (!company) return false;
    
    // Apply text search
    const searchMatch = !companySearchTerm || 
      company.name.toLowerCase().includes(companySearchTerm.toLowerCase()) ||
      (company.description && company.description.toLowerCase().includes(companySearchTerm.toLowerCase())) ||
      (company.location && company.location.toLowerCase().includes(companySearchTerm.toLowerCase()));
    
    // Apply industry filter
    const industryMatch = !companyFilters.industry || company.industry === companyFilters.industry;
    
    return searchMatch && industryMatch;
  });

  // Get unique industries for filter dropdown
  const industries = [...new Set(companies.filter(company => company?.industry).map(company => company.industry))];

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
    <div className="space-y-10">
      {/* Jobs Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Recent Jobs</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search jobs..."
                value={jobSearchTerm}
                onChange={(e) => setJobSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={() => setShowJobFilters(!showJobFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FaFilter className="text-gray-500" />
              <span>Filters</span>
            </button>
            <Link
              to="/admin/jobs"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FaBriefcase className="h-5 w-5" />
              <span>View All Jobs</span>
            </Link>
          </div>
        </div>

        {/* Job Filters */}
        {showJobFilters && (
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={jobFilters.status}
                  onChange={handleJobFilterChange}
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
                  value={jobFilters.jobType}
                  onChange={handleJobFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Types</option>
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={resetJobFilters}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Debug info */}
        {console.log('Rendering jobs section', {
          jobsLoading,
          jobsLength: jobs.length,
          filteredJobsLength: filteredJobs.length
        })}

        {/* Jobs Grid */}
        {jobsLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Show only the first 6 jobs */}
            {filteredJobs.slice(0, 6).map((job) => (
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
                      <FaRegClock className="mr-2 text-gray-500" />
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
              </div>
            ))}
          </div>
        )}

        {filteredJobs.length > 6 && (
          <div className="flex justify-center mt-4">
            <Link
              to="/admin/jobs"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View All {filteredJobs.length} Jobs
            </Link>
          </div>
        )}
      </div>

      {/* Companies Section */}
      <div className="space-y-6 mt-10 pt-10 border-t border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Recent Companies</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search companies..."
                value={companySearchTerm}
                onChange={(e) => setCompanySearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={() => setShowCompanyFilters(!showCompanyFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FaFilter className="text-gray-500" />
              <span>Filters</span>
            </button>
            <Link
              to="/admin/companies"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FaBuilding className="h-5 w-5" />
              <span>View All Companies</span>
            </Link>
          </div>
        </div>

        {/* Company Filters */}
        {showCompanyFilters && (
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <select
                  name="industry"
                  value={companyFilters.industry}
                  onChange={handleCompanyFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Industries</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={resetCompanyFilters}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Companies Grid */}
        {companiesLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
              <FaBuilding className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-500 mb-4">
              {companySearchTerm || companyFilters.industry
                ? 'No companies match your search criteria. Try adjusting your filters.'
                : 'There are no companies available at the moment.'}
            </p>
            {(companySearchTerm || companyFilters.industry) && (
              <button
                onClick={resetCompanyFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Show only the first 6 companies */}
            {filteredCompanies.slice(0, 6).map((company) => (
              <div key={company._id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
                {/* Card Header */}
                <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600">
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0 bg-white rounded-full p-1 shadow">
                      {company.logo ? (
                        <img className="h-full w-full rounded-full object-cover" src={company.logo} alt={company.name} />
                      ) : (
                        <div className="h-full w-full rounded-full bg-gray-100 flex items-center justify-center">
                          <FaBuilding className="text-indigo-500 h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-bold text-white truncate">{company.name}</h3>
                      <div className="mt-1 text-indigo-100 text-sm">
                        <div className="flex items-center">
                          <FaIndustry className="h-3 w-3 mr-1" />
                          <span>{company.industry || 'Industry not specified'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Card Body */}
                <div className="p-4 flex-grow">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <FaMapMarkerAlt className="mr-2 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600">{company.location || 'Location not specified'}</span>
                    </div>
                    {company.website && (
                      <div className="flex items-center text-sm">
                        <FaGlobe className="mr-2 text-gray-500 flex-shrink-0" />
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 truncate">
                          {company.website.replace(/(^\w+:|^)\/\//, '')}
                        </a>
                      </div>
                    )}
                    {company.contactEmail && (
                      <div className="flex items-center text-sm">
                        <FaEnvelope className="mr-2 text-gray-500 flex-shrink-0" />
                        <a href={`mailto:${company.contactEmail}`} className="text-gray-600 truncate">
                          {company.contactEmail}
                        </a>
                      </div>
                    )}
                    {company.contactPhone && (
                      <div className="flex items-center text-sm">
                        <FaPhone className="mr-2 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-600">{company.contactPhone}</span>
                      </div>
                    )}
                  </div>
                  
                  {company.description && (
                    <div className="mt-4 text-sm text-gray-600 line-clamp-2">
                      {company.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredCompanies.length > 6 && (
          <div className="flex justify-center mt-4">
            <Link
              to="/admin/companies"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View All {filteredCompanies.length} Companies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 