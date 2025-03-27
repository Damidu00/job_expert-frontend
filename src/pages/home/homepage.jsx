import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import SelectTemplate from './CV/SelectTemplate'
import AddAboutMe from './CV/AddAboutMe'
import AddSkills from './CV/AddSkills'
import AddCertifications from './CV/AddCertifications'
import Addreferees from './CV/Addreferees'
import AddEducation from './CV/AddEducation'
import AddExperience from './CV/AddExperience'
import AddProjects from './CV/AddProjects'
import AddCVDetails from './CV/AddCVDetails'
import Cv00 from '../home/CV/templates/cv00'
import Cv01 from './CV/templates/cv01'
import Cv02 from './CV/templates/cv02'
import UserJobsPage from './jobs/UserJobsPage'
import JobDetail from './jobs/JobDetail'
import Navbar from '../../Components/Navbar'
import { useAuth } from '../../context/AuthContext'

const LandingPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Welcome to Job-Xpert{user && `, ${user.fullname}`}
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Find your dream job or build your perfect CV
          </p>
          
          <div className="mt-10 flex justify-center gap-6">
            <a
              href="/jobs"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Browse Jobs
            </a>
            <a
              href="/cvdashboard"
              className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create CV
            </a>
          </div>
        </div>
        
        <div className="mt-16 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              What would you like to do today?
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Explore the features of Job-Xpert
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Find Jobs</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  Browse through our curated list of job postings from top companies.
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Create a CV</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  Build a professional CV with our easy-to-use templates and tools.
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Apply for Jobs</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  Submit applications directly through our platform with just a few clicks.
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Track Applications</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  Keep track of all your job applications in one place.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is an admin, redirect to admin dashboard
    if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'company') {
      navigate('/company/dashboard');
    }
  }, [user, navigate]);
  
  return (
    <div>
        <Navbar />
        <LandingPage />
    </div>
  )
}
