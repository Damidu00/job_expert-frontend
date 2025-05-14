import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import HomePage from "./pages/home/homepage";
import AdminHomePage from "./pages/admin/AdminHomePage";
import LoginPage from "./Components/LoginPage";
import SignupPage from "./Components/SignupPage";
import Dashboard from "./pages/home/CV/Dashboard";
import UserJobsPage from "./pages/home/jobs/UserJobsPage";
import JobDetail from "./pages/home/jobs/JobDetail";
import './index.css'

// CV Components
import SelectTemplate from "./pages/home/CV/SelectTemplate";
import AddAboutMe from "./pages/home/CV/AddAboutMe";
import AddSkills from "./pages/home/CV/AddSkills";
import AddCertifications from "./pages/home/CV/AddCertifications";
import Addreferees from "./pages/home/CV/Addreferees";
import AddEducation from "./pages/home/CV/AddEducation";
import AddExperience from "./pages/home/CV/AddExperience";
import AddProjects from "./pages/home/CV/AddProjects";
import AddCVDetails from "./pages/home/CV/AddCVDetails";
import Cv00 from "./pages/home/CV/templates/cv00";
import Cv01 from "./pages/home/CV/templates/cv01";
import Cv02 from "./pages/home/CV/templates/cv02";
import Profile from './Components/profile';
import UserDetails from "./pages/admin/userDetails";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path='/profile' element={<Profile />} />
          <Route path="/userDetails" element={<UserDetails/>}/>
          
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminHomePage />
              </ProtectedRoute>
            }
          />
          
          {/* CV Routes */}
          <Route
            path="/selecttemplate"
            element={
              <ProtectedRoute>
                <SelectTemplate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addaboutme"
            element={
              <ProtectedRoute>
                <AddAboutMe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addskills"
            element={
              <ProtectedRoute>
                <AddSkills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addcertifications"
            element={
              <ProtectedRoute>
                <AddCertifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addreferees"
            element={
              <ProtectedRoute>
                <Addreferees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addeducations"
            element={
              <ProtectedRoute>
                <AddEducation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addexperiences"
            element={
              <ProtectedRoute>
                <AddExperience />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addprojects"
            element={
              <ProtectedRoute>
                <AddProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addcvdetails"
            element={
              <ProtectedRoute>
                <AddCVDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewtemplate/cv00"
            element={
              <ProtectedRoute>
                <Cv00 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewtemplate/cv01"
            element={
              <ProtectedRoute>
                <Cv01 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewtemplate/cv02"
            element={
              <ProtectedRoute>
                <Cv02 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cvdashboard"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Job Routes */}
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <UserJobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:jobId"
            element={
              <ProtectedRoute>
                <JobDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/dashboard"
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
