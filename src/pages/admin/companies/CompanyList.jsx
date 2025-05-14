import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaBuilding, 
  FaSearch, 
  FaFilter, 
  FaGlobe, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaPhone, 
  FaIndustry,
  FaFilePdf
} from 'react-icons/fa';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { useAuth } from '../../../context/AuthContext';

export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    industry: '',
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
    
    const loadCompanies = async () => {
      // Only fetch companies if the user is authenticated and is an admin
      if (isAuthenticated() && isAdmin()) {
        try {
          setLoading(true);
          const response = await axios.get('http://localhost:5000/api/companies/get', {
            withCredentials: true,
            cancelToken: source.token
          });
          setCompanies(response.data);
        } catch (error) {
          // Ignore canceled requests and 401 errors during logout
          if (axios.isCancel(error)) {
            console.log('Request canceled:', error.message);
          } else if (error.response && error.response.status === 401) {
            // Don't log during unmount - it might be a logout
            if (isAuthenticated()) {
              console.log('User not authenticated, redirecting to login...');
            }
            // Let the AuthContext interceptor handle the redirect
          } else {
            console.error('Error fetching companies:', error);
            toast.error('Failed to fetch companies. Please try again.');
          }
        } finally {
          setLoading(false);
        }
      } else {
        // If not authenticated or not admin, don't try to fetch
        setLoading(false);
      }
    };

    loadCompanies();

    // Clean up function to cancel pending requests when component unmounts or dependencies change
    return () => {
      if (source) {
        source.cancel('Component unmounted or dependencies changed');
      }
    };
  }, [isAuthenticated, isAdmin]);

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company? All associated jobs will also be affected.')) {
      try {
        // Create a cancel token for this operation
        const source = createCancelToken();
        
        await axios.delete(`http://localhost:5000/api/companies/delete/${companyId}`, {
          withCredentials: true,
          cancelToken: source.token
        });
        toast.success('Company deleted successfully');
        
        // Instead of making a new request, update the local state
        setCompanies(prevCompanies => prevCompanies.filter(company => company._id !== companyId));
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
          console.error('Error deleting company:', error);
          toast.error('Failed to delete company. Please try again.');
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
      industry: '',
    });
    setSearchTerm('');
  };

  // Get unique industries for filter dropdown
  const industries = [...new Set(companies.map(company => company.industry).filter(Boolean))];

  const filteredCompanies = companies.filter(company => {
    // Apply text search
    const searchMatch = !searchTerm || 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.description && company.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.location && company.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Apply industry filter
    const industryMatch = !filters.industry || company.industry === filters.industry;
    
    return searchMatch && industryMatch;
  });
   //genarate company reprot ....
  const generateCompanyReport = () => {
    try {
      // Check if we have companies to report
      if (!filteredCompanies || filteredCompanies.length === 0) {
        toast.error('No companies available to generate report');
        return;
      }

      // Create new document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text('Companies Report', 15, 15);
      
      // Add metadata
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 25);
      doc.text(`Total Companies: ${filteredCompanies.length}`, 15, 30);

      // Prepare table details
      const tableData = filteredCompanies.map(company => [
        company?.name || 'N/A',
        company?.industry || 'N/A',
        company?.location || 'N/A',
        company?.contactEmail || 'N/A',
        company?.contactPhone || 'N/A',
        (company?.website || 'N/A').toString()
      ]);

      // Generate table using autoTable
      autoTable(doc, {
        startY: 35,
        head: [['Company Name', 'Industry', 'Location', 'Email', 'Phone', 'Website']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [63, 81, 181],
          textColor: 255,
          fontSize: 10
        },
        bodyStyles: {
          fontSize: 9
        },
        margin: { top: 35 },
        didDrawPage: function(data) {
          // Add page number
          const pageSize = doc.internal.pageSize;
          const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          doc.text(`Page ${data.pageCount}`, data.settings.margin.left, pageHeight - 10);
        }
      });

      // Save the PDF
      const fileName = `Companies_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      toast.success('Report generated successfully!');

    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report: ' + error.message);
    }
  };

  // Add a loading state for the report generation
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Updated button click handler
  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      await generateCompanyReport();
    } finally {
      setIsGeneratingReport(false);
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
        <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Updated report button with loading state */}
          <button
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
            className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${
              isGeneratingReport ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            title="Generate PDF Report"
          >
            <FaFilePdf className="text-lg" />
            <span>
              {isGeneratingReport ? 'Generating...' : 'Generate Report'}
            </span>
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search companies..."
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
            to="/admin/companies/add" 
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FaPlus />
            <span>Add Company</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <select
                name="industry"
                value={filters.industry}
                onChange={handleFilterChange}
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
      ) : filteredCompanies.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
            <FaBuilding className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filters.industry
              ? 'No companies match your search criteria. Try adjusting your filters.'
              : 'Add your first company to get started.'}
          </p>
          {searchTerm || filters.industry ? (
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Reset Filters
            </button>
          ) : (
            <Link 
              to="/admin/companies/add" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <FaPlus className="-ml-1 mr-2 h-5 w-5" />
              Add Company
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
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
              
              {/* Card Footer */}
              <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-3 border-t">
                <Link 
                  to={`/admin/companies/edit/${company._id}`} 
                  className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-full transition-colors"
                  title="Edit Company"
                >
                  <FaEdit className="h-5 w-5" />
                </Link>
                <button 
                  onClick={() => handleDeleteCompany(company._id)} 
                  className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete Company"
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