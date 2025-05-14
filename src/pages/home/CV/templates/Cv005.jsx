import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Navbar from "../../../../Components/Navbar";

function Cv005() {
  const location = useLocation();
  const userId = location.state?.userId;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const cvRef = React.useRef();
  const cvUserId = localStorage.getItem("cvUserId");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError("User ID is missing from navigation state.");
        setLoading(false);
        return;
      }

      try {
        // Make a single API request to get all user CV data
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cvuser/getUsers/${cvUserId}`);
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching CV data:', err);
        setError("Failed to load CV data. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleDownloadPDF = async () => {
    const input = cvRef.current;
    if (!input) return;
    
    try {
      // Show loading indicator
      setLoading(true);
      
      const canvas = await html2canvas(input, { 
        scale: 2, 
        useCORS: true,
        logging: false,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Scale the image to fit the page
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
      pdf.save(`${userData?.firstName || 'User'}_${userData?.lastName || 'CV'}_CV.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
        <span className="ml-3 text-gray-700">Loading your CV...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-red-600 text-xl mb-4">⚠️ {error}</div>
        <button 
          onClick={() => window.history.back()} 
          className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-700">No CV data found.</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="relative font-sans">
        {/* Floating Download Button */}
        <button
          onClick={handleDownloadPDF}
          className="fixed top-20 right-10 z-50 bg-rose-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-rose-700 transition duration-300 print:hidden flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download as PDF
        </button>

        <div ref={cvRef} className="cv-container flex max-w-4xl bg-gray-100 justify-between mx-auto my-5 shadow-lg">
          {/* Main Content - Left Side */}
          <div className="main-content flex-1 bg-white p-8">
            <div className="header mb-8 text-center">
              <h1 className="name text-3xl font-light tracking-wider text-rose-700 mb-2">
                {userData.firstName.toUpperCase()} {userData.lastName.toUpperCase()}
              </h1>
              <p className="position text-sm text-gray-500 uppercase tracking-widest mb-4">
                {userData.details && userData.details[0]?.degree || "Professional"}
              </p>
              <div className="divider w-24 h-1 bg-rose-300 mx-auto"></div>
            </div>

            <div className="about mb-10">
              <h2 className="section-title relative text-lg font-semibold text-rose-700 mb-4 pl-4 border-l-4 border-rose-400">
                ABOUT ME
              </h2>
              <p className="text-sm leading-relaxed text-gray-600">
                {userData.shortBio}
              </p>
            </div>

            <div className="experience mb-10">
              <h2 className="section-title relative text-lg font-semibold text-rose-700 mb-4 pl-4 border-l-4 border-rose-400">
                WORK EXPERIENCE
              </h2>

              {userData.experiences && userData.experiences.length > 0 ? (
                userData.experiences.map((exp, index) => (
                  <div className="job-item mb-6" key={exp._id || index}>
                    <div className="flex justify-between mb-1">
                      <h3 className="font-medium text-gray-800">{exp.jobTitle}</h3>
                      <span className="text-xs text-rose-600 italic">
                        {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}
                      </span>
                    </div>
                    <h4 className="text-sm text-gray-500 mb-2">
                      {exp.company}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {exp.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No work experience listed.</p>
              )}
            </div>

            <div className="education mb-10">
              <h2 className="section-title relative text-lg font-semibold text-rose-700 mb-4 pl-4 border-l-4 border-rose-400">
                EDUCATION
              </h2>

              {userData.details && userData.details.length > 0 ? (
                userData.details.map((edu, index) => (
                  <div className="edu-item mb-4" key={edu._id || index}>
                    <div className="flex justify-between mb-1">
                      <h3 className="font-medium text-gray-800">{edu.degree}</h3>
                      <span className="text-xs text-rose-600 italic">
                        {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : "Present"}
                      </span>
                    </div>
                    <h4 className="text-sm text-gray-500">
                      {edu.school} - {edu.eduLevel}
                    </h4>
                    {edu.description && (
                      <p className="text-xs text-gray-600 mt-1">{edu.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No education details listed.</p>
              )}
            </div>
            
            <div className="projects mb-10">
              <h2 className="section-title relative text-lg font-semibold text-rose-700 mb-4 pl-4 border-l-4 border-rose-400">
                PROJECTS
              </h2>

              {userData.projects && userData.projects.length > 0 ? (
                userData.projects.map((project, index) => (
                  <div className="project-item mb-4" key={project._id || index}>
                    <div className="mb-1">
                      <h3 className="font-medium text-gray-800">{project.title}</h3>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      {project.description}
                    </p>
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.techStack.map((tech, i) => (
                          <span key={i} className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3 mt-2">
                      {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-xs text-rose-600 hover:underline">
                          GitHub
                        </a>
                      )}
                      {project.liveDemo && (
                        <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="text-xs text-rose-600 hover:underline">
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No projects listed.</p>
              )}
            </div>

            {userData.certificates && userData.certificates.length > 0 && (
              <div className="certificates mb-10">
                <h2 className="section-title relative text-lg font-semibold text-rose-700 mb-4 pl-4 border-l-4 border-rose-400">
                  CERTIFICATIONS
                </h2>
                
                {userData.certificates.map((cert, index) => (
                  <div className="cert-item mb-3" key={index}>
                    <h3 className="font-medium text-gray-800">{cert.certificateName}</h3>
                    <p className="text-sm text-gray-500">{cert.instituteName}</p>
                    {cert.Link && (
                      <a href={cert.Link} target="_blank" rel="noopener noreferrer" className="text-xs text-rose-600 hover:underline">
                        View Certificate
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile - Right Side */}
          <div className="profile w-72 bg-rose-800 text-gray-100 flex flex-col items-center py-8 px-6">
            <div className="profile-photo w-32 h-32 rounded-full overflow-hidden border-4 border-white mb-6">
              <div className="w-full h-full bg-gray-300">
                <img
                  src={userData.profilePhoto || "/api/placeholder/400/400"}
                  alt={`${userData.firstName} ${userData.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="contact-info w-full mb-8">
              <div className="contact-item flex items-center mb-4">
                <div className="icon w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-300">PHONE</p>
                  <p className="text-sm">{userData.phone}</p>
                </div>
              </div>

              <div className="contact-item flex items-center mb-4">
                <div className="icon w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-300">EMAIL</p>
                  <p className="text-sm">{userData.email}</p>
                </div>
              </div>

              <div className="contact-item flex items-center mb-4">
                <div className="icon w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-300">LOCATION</p>
                  <p className="text-sm">{userData.Address}</p>
                </div>
              </div>

              {userData.githubURL && (
                <div className="contact-item flex items-center mb-4">
                  <div className="icon w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-300">GITHUB</p>
                    <p className="text-sm overflow-hidden text-ellipsis">{userData.githubURL}</p>
                  </div>
                </div>
              )}

              {userData.linkedinURL && (
                <div className="contact-item flex items-center">
                  <div className="icon w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-300">LINKEDIN</p>
                    <p className="text-sm overflow-hidden text-ellipsis">{userData.linkedinURL}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="skills w-full mb-8">
              <h2 className="text-lg font-semibold mb-4 text-center">SKILLS</h2>

              {userData.skills && userData.skills.length > 0 ? (
                userData.skills.map((skillGroup, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="text-sm font-medium mb-2 text-rose-200">{skillGroup.category}</h3>
                    {skillGroup.items.map((skill, i) => (
                      <div className="skill-item mb-3" key={i}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">{skill}</span>
                          <span className="text-xs">{85 + (i % 3) * 5}%</span>
                        </div>
                        <div className="w-full h-1 bg-rose-900 rounded">
                          <div
                            className="h-full bg-rose-300 rounded"
                            style={{ width: `${85 + (i % 3) * 5}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-gray-300 italic">No skills listed.</p>
              )}
            </div>

            {userData.referees && userData.referees.length > 0 && (
              <div className="referees w-full">
                <h2 className="text-lg font-semibold mb-4 text-center">REFERENCES</h2>

                <div className="reference-list">
                  {userData.referees.map((referee, index) => (
                    <div className="referee-item mb-4" key={index}>
                      <h3 className="text-sm font-medium text-rose-200">{`${referee.FirstName} ${referee.LastName}`}</h3>
                      <p className="text-xs">{referee.position}</p>
                      <p className="text-xs">{referee.workingPlace}</p>
                      <p className="text-xs text-gray-300">{referee.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cv005;