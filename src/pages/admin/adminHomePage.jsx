import React, { useState } from 'react'
import { Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom'
import JobList from './jobs/JobList'
import AddJob from './jobs/AddJob'
import EditJob from './jobs/EditJob'
import CompanyList from './companies/CompanyList'
import AddCompany from './companies/AddCompany'
import EditCompany from './companies/EditCompany'
import Dashboard from './Dashboard'
import { FaBriefcase, FaBuilding, FaChartLine, FaUsersCog, FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'

export default function AdminHomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth();

  const handleLogout = () => {
    // Use the logout function from AuthContext
    logout();
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for larger screens */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-indigo-800 transition duration-300 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 bg-indigo-900">
          <div className="flex items-center">
            <span className="text-xl font-bold text-white">Job-Xpert Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-indigo-200 lg:hidden hover:text-white focus:outline-none"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-5 px-2 space-y-1">
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-indigo-200 uppercase tracking-wider">
              Main
            </p>
            <Link
              to="/admin"
              className={`${
                location.pathname === '/admin'
                ? 'bg-indigo-900 text-white'
                : 'text-indigo-100 hover:bg-indigo-700'
              } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
            >
              <FaChartLine className="mr-3 h-5 w-5 text-indigo-300" />
              Dashboard
            </Link>
            <Link
              to="/admin/jobs"
              className={`${
                location.pathname.includes('/admin/jobs')
                ? 'bg-indigo-900 text-white'
                : 'text-indigo-100 hover:bg-indigo-700'
              } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
            >
              <FaBriefcase className="mr-3 h-5 w-5 text-indigo-300" />
              Job Management
            </Link>
            <Link
              to="/admin/companies"
              className={`${
                location.pathname.includes('/admin/companies')
                ? 'bg-indigo-900 text-white'
                : 'text-indigo-100 hover:bg-indigo-700'
              } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
            >
              <FaBuilding className="mr-3 h-5 w-5 text-indigo-300" />
              Company Management
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-indigo-700">
            <p className="px-3 text-xs font-semibold text-indigo-200 uppercase tracking-wider">
              Settings
            </p>
            <Link
              to="/admin/settings"
              className="text-indigo-100 hover:bg-indigo-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            >
              <FaCog className="mr-3 h-5 w-5 text-indigo-300" />
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left text-indigo-100 hover:bg-indigo-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            >
              <FaSignOutAlt className="mr-3 h-5 w-5 text-indigo-300" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm lg:static z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-500 lg:hidden hover:text-gray-900 focus:outline-none"
            >
              <FaBars className="w-6 h-6" />
            </button>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Profile"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Admin User</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/add" element={<AddJob />} />
            <Route path="/jobs/edit/:id" element={<EditJob />} />
            <Route path="/companies" element={<CompanyList />} />
            <Route path="/companies/add" element={<AddCompany />} />
            <Route path="/companies/edit/:id" element={<EditCompany />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
