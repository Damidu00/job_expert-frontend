import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaCheck, FaTimes, FaUser, FaEnvelope, FaFileAlt, FaExternalLinkAlt } from 'react-icons/fa';

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [activeTab, setActiveTab] = useState('details');
  const [processing, setProcessing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    jobType: 'Full-time',
    experienceLevel: 'Entry level',
    numberOfPositions: 1,
    company: '',
    applicationDeadline: ''
  });

  useEffect(() => {
    fetchJobDetails();
    fetchCompanies();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/jobs/get/${id}`, {
        withCredentials: true
      });
      
      setJob(response.data);
      
      // Format the date for the form
      const deadlineDate = new Date(response.data.applicationDeadline);
      const formattedDeadline = deadlineDate.toISOString().split('T')[0];
      
      setFormData({
        title: response.data.title,
        description: response.data.description,
        requirements: response.data.requirements,
        salary: response.data.salary,
        location: response.data.location,
        jobType: response.data.jobType,
        experienceLevel: response.data.experienceLevel,
        numberOfPositions: response.data.numberOfPositions,
        company: response.data.company?._id || '',
        applicationDeadline: formattedDeadline
      });
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load job details. Please try again.');
      navigate('/admin/jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/companies/get', {
        withCredentials: true
      });
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to load companies. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'numberOfPositions' ? parseInt(value, 10) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setProcessing(true);
      const response = await axios.put(`http://localhost:5000/api/jobs/edit/${id}`, formData, {
        withCredentials: true
      });
      
      toast.success('Job updated successfully');
      navigate('/admin/jobs');
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error(error.response?.data?.message || 'Failed to update job. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleApplicationStatus = async (applicationId, status) => {
    try {
      setProcessing(true);
      const response = await axios.patch(
        `http://localhost:5000/api/jobs/applications/${id}/${applicationId}`, 
        { status },
        { withCredentials: true }
      );
      
      toast.success(`Application ${status.toLowerCase()} successfully`);
      fetchJobDetails(); // Refresh job details
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error(error.response?.data?.message || 'Failed to update application status. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/admin/jobs')}
              className="mr-4 text-gray-400 hover:text-gray-500"
              title="Back to jobs"
            >
              <FaArrowLeft />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTab === 'details' ? 'Edit Job' : 'Manage Applications'}
            </h2>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'details' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              Job Details
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'applications' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              Applications ({job?.applications?.length || 0})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'details' ? (
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <select
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select a company</option>
                {companies.map(company => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                Job Type
              </label>
              <select
                id="jobType"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="Entry level">Entry level</option>
                <option value="Mid level">Mid level</option>
                <option value="Senior">Senior</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                Salary
              </label>
              <input
                type="text"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g. $50,000 - $70,000"
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g. New York, NY"
              />
            </div>
            
            <div>
              <label htmlFor="numberOfPositions" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Positions
              </label>
              <input
                type="number"
                id="numberOfPositions"
                name="numberOfPositions"
                value={formData.numberOfPositions}
                onChange={handleChange}
                min="1"
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                id="applicationDeadline"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
              Job Requirements
            </label>
            <textarea
              id="requirements"
              name="requirements"
              rows="5"
              value={formData.requirements}
              onChange={handleChange}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/jobs')}
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {processing ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="px-6 py-4">
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Applications Summary</h3>
                <p className="text-sm text-gray-500">
                  Positions filled: {job.positionsFilled} / {job.numberOfPositions}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Total Applications: {job?.applications?.length || 0}</p>
                <p className="text-xs text-gray-500">
                  {job?.applications?.filter(app => app.status === 'Accepted').length || 0} Accepted
                  {' • '}
                  {job?.applications?.filter(app => app.status === 'Rejected').length || 0} Rejected
                  {' • '}
                  {job?.applications?.filter(app => app.status === 'Pending').length || 0} Pending
                </p>
              </div>
            </div>
          </div>
          
          {job?.applications?.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No applications have been submitted for this job yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {job.applications.map(application => (
                <div 
                  key={application._id} 
                  className={`border rounded-lg overflow-hidden ${
                    application.status === 'Accepted' ? 'border-green-200' : 
                    application.status === 'Rejected' ? 'border-red-200' : 
                    'border-gray-200'
                  }`}
                >
                  <div className={`px-4 py-3 ${
                    application.status === 'Accepted' ? 'bg-green-50' : 
                    application.status === 'Rejected' ? 'bg-red-50' : 
                    'bg-gray-50'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FaUser className="text-gray-400 mr-2" />
                        <span className="font-medium">{application.user?.fullname || 'Anonymous'}</span>
                        {application.user?.email && (
                          <div className="ml-4 flex items-center text-sm text-gray-500">
                            <FaEnvelope className="mr-1" />
                            <a href={`mailto:${application.user.email}`}>{application.user.email}</a>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          application.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                          application.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {application.status}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(application.appliedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Cover Letter</h4>
                      <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 whitespace-pre-line">
                        {application.coverLetter || 'No cover letter provided.'}
                      </div>
                    </div>
                    
                    {application.resume && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Resume Link</h4>
                        <a 
                          href={application.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          <FaFileAlt className="mr-1" />
                          View Resume
                          <FaExternalLinkAlt className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    )}
                    
                    {application.status === 'Pending' && (
                      <div className="mt-4 flex justify-end space-x-3">
                        <button
                          onClick={() => handleApplicationStatus(application._id, 'Rejected')}
                          disabled={processing}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent rounded text-xs font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          <FaTimes className="mr-1" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleApplicationStatus(application._id, 'Accepted')}
                          disabled={processing || job.positionsFilled >= job.numberOfPositions}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent rounded text-xs font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          <FaCheck className="mr-1" />
                          Accept
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 