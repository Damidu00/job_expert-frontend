import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function EditCompany() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    location: '',
    website: '',
    logo: '',
    contactEmail: '',
    contactPhone: ''
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/companies/get/${id}`, {
          withCredentials: true
        });
        
        const company = response.data;
        setFormData({
          name: company.name || '',
          description: company.description || '',
          industry: company.industry || '',
          location: company.location || '',
          website: company.website || '',
          logo: company.logo || '',
          contactEmail: company.contactEmail || '',
          contactPhone: company.contactPhone || ''
        });
      } catch (error) {
        console.error('Error fetching company:', error);
        toast.error('Failed to load company details. Please try again.');
        navigate('/admin/companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id, navigate]);

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
    if (!formData.name || !formData.description || !formData.industry || 
        !formData.location || !formData.contactEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      await axios.put(`http://localhost:5000/api/companies/update/${id}`, formData, {
        withCredentials: true
      });
      
      toast.success('Company updated successfully!');
      navigate('/admin/companies');
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error(error.response?.data?.message || 'Failed to update company. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="spinner"></div>
        <p className="mt-2 text-gray-500">Loading company details...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Company</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Update company information</p>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Company Name */}
            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Company Name*
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            {/* Industry */}
            <div className="sm:col-span-3">
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Industry*
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="industry"
                  id="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
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

            {/* Website */}
            <div className="sm:col-span-3">
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <div className="mt-1">
                <input
                  type="url"
                  name="website"
                  id="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Contact Email */}
            <div className="sm:col-span-3">
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                Contact Email*
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="contactEmail"
                  id="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div className="sm:col-span-3">
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                Contact Phone
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="contactPhone"
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Logo URL */}
            <div className="sm:col-span-6">
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                Logo URL
              </label>
              <div className="mt-1">
                <input
                  type="url"
                  name="logo"
                  id="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                URL to the company's logo image
              </p>
            </div>

            {/* Description */}
            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Company Description*
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
                Brief description of the company
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/companies')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 