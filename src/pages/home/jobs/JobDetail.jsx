import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt, FaUserTie, FaUserGraduate, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import Navbar from '../../../Components/Navbar';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [application, setApplication] = useState({
    coverLetter: '',
  });
  const [userApplication, setUserApplication] = useState(null);
  const [submittingApplication, setSubmittingApplication] = useState(false);
  const { user } = useAuth();
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    checkLoginStatus();
    checkApplicationStatus();
  }, [id]);

  useEffect(() => {
    if (isLoggedIn && job) {
      checkExistingApplication();
    }
  }, [isLoggedIn, job]);

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        withCredentials: true
      });
      
      if (response.data.user) {
        setIsLoggedIn(true);
        setUserId(response.data.user._id);
      }
    } catch (error) {
      console.log('User not logged in');
      setIsLoggedIn(false);
    }
  };

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/jobs/get/${id}`);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const checkExistingApplication = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/applications/job/${id}/user`, {
        withCredentials: true
      });
      
      if (response.data) {
        setUserApplication(response.data);
      }
    } catch (error) {
      // No existing application or error
      console.log('No existing application found');
    }
  };

  const checkApplicationStatus = async () => {
    if (!user) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/jobs/application-status/${id}`,
        { withCredentials: true }
      );
      setHasApplied(response.data.hasApplied);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleApplicationChange = (e) => {
    const { name, value } = e.target;
    setApplication({
      ...application,
      [name]: value
    });
  };

  const handleApply = () => {
    if (!isLoggedIn) {
      toast.error('Please login to apply for this job');
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }
    
    setShowApplicationForm(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    
    if (!application.coverLetter.trim()) {
      toast.error('Please provide a cover letter');
      return;
    }
    
    try {
      setSubmittingApplication(true);
      
      const response = await axios.post('http://localhost:5000/api/applications/create', {
        job: id,
        coverLetter: application.coverLetter
      }, {
        withCredentials: true
      });
      
      toast.success('Application submitted successfully!');
      setUserApplication(response.data);
      setShowApplicationForm(false);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmittingApplication(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const applyForJob = async () => {
    try {
      if (!user) {
        toast.error('Please log in to apply for this job');
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/jobs/apply/${id}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setHasApplied(true);
        toast.success('Application submitted successfully!');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      
      if (error.response?.status === 400 && error.response?.data?.message === 'Already applied') {
        toast.error('You have already applied for this job');
      } else {
        toast.error('Failed to apply for job');
      }
    }
  };

  const handleAcceptJob = async () => {
    try {
      if (!user) {
        toast.error('Please log in to perform this action');
        return;
      }

      setLoading(true);
      const response = await axios.post(
        `http://localhost:5000/api/jobs/accept/${id}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update the job in the local state
        const updatedJob = { ...job };
        
        updatedJob.positionsFilled = (updatedJob.positionsFilled || 0) + 1;
        updatedJob.userAccepted = true;
        
        // Update status if all positions are filled
        if (updatedJob.positionsFilled >= updatedJob.numberOfPositions) {
          updatedJob.status = 'Filled';
        }
        
        setJob(updatedJob);
        toast.success('Job accepted successfully!');
      }
    } catch (error) {
      console.error('Error accepting job:', error);
      toast.error(error.response?.data?.message || 'Failed to accept job');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'Job not found'}</p>
          <Link 
            to="/jobs" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const isJobFilled = job.positionsFilled >= job.numberOfPositions;
  const isDeadlinePassed = new Date(job.applicationDeadline) < new Date();
  const canApply = !isJobFilled && !isDeadlinePassed && job.status === 'Approved';
  const canTakeAction = !isJobFilled && job.status !== 'Filled';

  return (
    <div>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate('/jobs')} 
            className="flex items-center text-blue-600 hover:underline mb-6"
          >
            <FaArrowLeft className="mr-2" /> Back to Jobs
          </button>

          {/* Job Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-8 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold">{job.title}</h1>
                  <div className="mt-2 flex items-center">
                    <FaBuilding className="mr-2" />
                    <span>{job.company?.name || 'Company name not available'}</span>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-900 bg-opacity-30">
                  {job.jobType}
                </span>
              </div>
            </div>
            
            {/* Application status alerts */}
            {userApplication && (
              <div className={`px-6 py-3 border-b ${
                userApplication.status === 'Pending' ? 'bg-yellow-50 border-yellow-100 text-yellow-700' :
                userApplication.status === 'Approved' ? 'bg-green-50 border-green-100 text-green-700' :
                'bg-red-50 border-red-100 text-red-700'
              }`}>
                <div className="flex items-center">
                  <span className="text-sm font-medium">
                    Application Status: {userApplication.status}
                  </span>
                  {userApplication.status === 'Approved' && (
                    <span className="ml-auto text-sm font-medium">
                      You've been selected for this position! Check your email for further instructions.
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {!canApply && !userApplication && (
              <div className={`px-6 py-3 border-b ${
                isJobFilled ? 'bg-gray-50 border-gray-100 text-gray-700' :
                'bg-red-50 border-red-100 text-red-700'
              }`}>
                <div className="flex items-center">
                  <span className="text-sm font-medium">
                    {isJobFilled ? 'All positions filled' : 'Application deadline has passed'}
                  </span>
                </div>
              </div>
            )}
            
            {/* Job details */}
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-indigo-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaMoneyBillWave className="text-indigo-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Salary</p>
                      <p className="font-medium text-gray-900">{job.salary}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaUserTie className="text-indigo-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Experience Level</p>
                      <p className="font-medium text-gray-900">{job.experienceLevel}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-indigo-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Application Deadline</p>
                      <p className="font-medium text-gray-900">{formatDate(job.applicationDeadline)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <div className="prose max-w-none text-gray-700">
                  <p>{job.description}</p>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                <div className="prose max-w-none text-gray-700">
                  <p>{job.requirements}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <div className="text-sm">
                  <span className="text-gray-500">Positions: </span>
                  <span className="font-medium">{job.positionsFilled}/{job.numberOfPositions} filled</span>
                  <span className="ml-4 text-gray-500">Status: </span>
                  <span className={`font-medium ${job.status === 'Filled' ? 'text-red-600' : 'text-green-600'}`}>
                    {job.status}
                  </span>
                </div>
                
                {job.userAccepted ? (
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded">Job Accepted</span>
                ) : canTakeAction ? (
                  <button
                    onClick={handleAcceptJob}
                    disabled={loading}
                    className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <FaCheck className="mr-2" /> Accept Job
                  </button>
                ) : (
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded">
                    {isJobFilled ? 'All positions filled' : 'No longer available'}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Application form */}
          {showApplicationForm && (
            <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-100">
                <h2 className="text-xl font-bold text-indigo-700">Submit Your Application</h2>
              </div>
              <form onSubmit={handleSubmitApplication} className="px-6 py-6">
                <div className="mb-6">
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    rows="6"
                    value={application.coverLetter}
                    onChange={handleApplicationChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Why are you a good fit for this position?"
                    required
                  ></textarea>
                </div>
                
                <div className="flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingApplication}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                  >
                    {submittingApplication ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <Link 
              to="/jobs" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 