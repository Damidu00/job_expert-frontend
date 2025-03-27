import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AddJob() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
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
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/companies/get', {
        withCredentials: true
      });
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to fetch companies. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.title || !formData.description || !formData.requirements || 
        !formData.salary || !formData.location || !formData.company || 
        !formData.applicationDeadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/jobs/create', formData, {
        withCredentials: true
      });
      
      toast.success('Job posted successfully!');
      navigate('/admin/jobs');
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error(error.response?.data?.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Job</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Fill in the details to create a new job listing</p>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Job Title */}
            <div className="sm:col-span-3">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Job Title*
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            {/* Salary */}
            <div className="sm:col-span-3">
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                Salary*
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="salary"
                  id="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                  placeholder="e.g. $50,000 - $70,000"
                />
              </div>
            </div>

            {/* Location */}
            <div className="sm:col-span-3">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location*
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            {/* Number of Positions */}
            <div className="sm:col-span-3">
              <label htmlFor="numberOfPositions" className="block text-sm font-medium text-gray-700">
                Number of Positions*
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="numberOfPositions"
                  id="numberOfPositions"
                  min="1"
                  value={formData.numberOfPositions}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            {/* Job Type */}
            <div className="sm:col-span-3">
              <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
                Job Type*
              </label>
              <div className="mt-1">
                <select
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            {/* Experience Level */}
            <div className="sm:col-span-3">
              <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">
                Experience Level*
              </label>
              <div className="mt-1">
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                >
                  <option value="Entry level">Entry level</option>
                  <option value="Mid level">Mid level</option>
                  <option value="Senior">Senior</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
            </div>

            {/* Company */}
            <div className="sm:col-span-3">
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company*
              </label>
              <div className="mt-1">
                <select
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select a company</option>
                  {companies.map(company => (
                    <option key={company._id} value={company._id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Application Deadline */}
            <div className="sm:col-span-3">
              <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700">
                Application Deadline*
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="applicationDeadline"
                  id="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Job Description*
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Provide a detailed description of the job.
              </p>
            </div>

            {/* Requirements */}
            <div className="sm:col-span-6">
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                Job Requirements*
              </label>
              <div className="mt-1">
                <textarea
                  id="requirements"
                  name="requirements"
                  rows={4}
                  value={formData.requirements}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                List the skills, qualifications, and experience required for this job.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/jobs')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 