import React, { useState } from 'react';
import { FaPlus, FaCheck } from 'react-icons/fa'; // Import both icons
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import AddAboutMe from './AddAboutMe';
import AddSkills from './AddSkills';
import AddCertifications from './AddCertifications';
import AddReferees from './Addreferees';
import AddEducation from './AddEducation';
import AddExperience from './AddExperience';
import AddProjects from './AddProjects';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../../Components/Navbar';

export default function AddCVDetails() {
  const location = useLocation()
  let user = JSON.parse(localStorage.getItem('user')); // Convert string to object
  const userId = user ? user._id : null; // Now we can access _id
  console.log(userId);
  const navigate = useNavigate()
  // State to manage the visibility of the dialog and the current component to render
  const [openDialog, setOpenDialog] = useState(false);
  const [currentComponent, setCurrentComponent] = useState(null);

  // State to track the completion status of each section
  const [completionStatus, setCompletionStatus] = useState({
    aboutMe: false,
    skills: false,
    certifications: false,
    referees: false,
    education: false,
    experience: false,
    projects: false,
  });

  // Function to open the dialog and set the component to render
  const handleOpenDialog = (componentName, component) => {
    setCurrentComponent({ name: componentName, component }); // Set the component and its name
    setOpenDialog(true); // Open the dialog
  };

  // Function to close the dialog and mark the section as completed
  const handleCloseDialog = (sectionName) => {
    if (sectionName) {
      // Mark the section as completed
      setCompletionStatus((prevStatus) => ({
        ...prevStatus,
        [sectionName]: true,
      }));
    }
    setCurrentComponent(null); // Reset the component
    setOpenDialog(false); // Close the dialog
  };

  const handleContinue = () => {
    navigate("/selecttemplate", { state: { userId: userId } });
  };

  return (
    <>
    <Navbar/>
    <div className="p-8 bg-gray-100 min-h-screen">
      
      <h1 className="text-6xl font-bold text-center text-blue-600 mb-8">
        Build Your CV
      </h1>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-4">
        {/* Add About Me */}
        <div
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-300"
          onClick={() => handleOpenDialog('aboutMe', <AddAboutMe onClose={() => handleCloseDialog('aboutMe')} />)}
        >
          <span className="text-lg font-medium text-gray-700">Add About Me</span>
          {completionStatus.aboutMe ? (
            <FaCheck className="text-xl text-green-500" />
          ) : (
            <FaPlus className="text-xl text-blue-500" />
          )}
        </div>

        {/* Add Skills */}
        <div
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-300"
          onClick={() => handleOpenDialog('skills', <AddSkills onClose={() => handleCloseDialog('skills')} />)}
        >
          <span className="text-lg font-medium text-gray-700">Add Skills</span>
          {completionStatus.skills ? (
            <FaCheck className="text-xl text-green-500" />
          ) : (
            <FaPlus className="text-xl text-blue-500" />
          )}
        </div>

        {/* Add Certificates */}
        <div
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-300"
          onClick={() =>
            handleOpenDialog('certifications', <AddCertifications onClose={() => handleCloseDialog('certifications')} />)
          }
        >
          <span className="text-lg font-medium text-gray-700">Add Certificates</span>
          {completionStatus.certifications ? (
            <FaCheck className="text-xl text-green-500" />
          ) : (
            <FaPlus className="text-xl text-blue-500" />
          )}
        </div>

        {/* Add Referees */}
        <div
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-300"
          onClick={() => handleOpenDialog('referees', <AddReferees onClose={() => handleCloseDialog('referees')} />)}
        >
          <span className="text-lg font-medium text-gray-700">Add Referees</span>
          {completionStatus.referees ? (
            <FaCheck className="text-xl text-green-500" />
          ) : (
            <FaPlus className="text-xl text-blue-500" />
          )}
        </div>

        {/* Add Education */}
        <div
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-300"
          onClick={() => handleOpenDialog('education', <AddEducation onClose={() => handleCloseDialog('education')} />)}
        >
          <span className="text-lg font-medium text-gray-700">Add Education</span>
          {completionStatus.education ? (
            <FaCheck className="text-xl text-green-500" />
          ) : (
            <FaPlus className="text-xl text-blue-500" />
          )}
        </div>

        {/* Add Experiences */}
        <div
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-300"
          onClick={() => handleOpenDialog('experience', <AddExperience onClose={() => handleCloseDialog('experience')} />)}
        >
          <span className="text-lg font-medium text-gray-700">Add Experiences</span>
          {completionStatus.experience ? (
            <FaCheck className="text-xl text-green-500" />
          ) : (
            <FaPlus className="text-xl text-blue-500" />
          )}
        </div>

        {/* Add Projects */}
        <div
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-300"
          onClick={() => handleOpenDialog('projects', <AddProjects onClose={() => handleCloseDialog('projects')} />)}
        >
          <span className="text-lg font-medium text-gray-700">Add Projects</span>
          {completionStatus.projects ? (
            <FaCheck className="text-xl text-green-500" />
          ) : (
            <FaPlus className="text-xl text-blue-500" />
          )}
        </div>
      </div>

      {/* MUI Dialog Box */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle className="text-2xl font-bold text-gray-800">
          {currentComponent?.name || 'Add Details'}
        </DialogTitle>
        <DialogContent>
          {/* Render the selected component inside the dialog */}
          {currentComponent?.component}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <div className=' absolute right-20 bottom-10'>
      <button className='p-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-700  '
      onClick={handleContinue}
      >Continue</button>
      </div>
      
    </div>
    </>
    
  );
}