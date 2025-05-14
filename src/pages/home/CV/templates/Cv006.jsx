import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Navbar from "../../../../Components/Navbar";

function Cv006() {
  const location = useLocation();
  const userId = location.state?.userId;
  const [cvLoading, setCvLoading] = useState("loading");
  const [cvData, setCvData] = useState(null);
  const cvRef = React.useRef();
  const cvUserId = localStorage.getItem("cvUserId");

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        console.error("User ID is missing from navigation state.");
        setCvLoading("error");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/cvuser/getUsers/${cvUserId}`
        );
        const data = response.data;

        setCvData({
          user: data,
          skills: data.skills || [],
          education: data.details || [],
          experience: data.experiences || [],
          projects: data.projects || [],
          referees: data.referees || [],
          certification: data.certificates || [],
        });

        setCvLoading("loaded");
      } catch (error) {
        console.error("Error fetching CV data:", error);
        setCvLoading("error");
      }
    };

    fetchData();
  }, [cvUserId]);

  const handleDownloadPDF = async () => {
    const input = cvRef.current;
    if (!input) return;
    const canvas = await html2canvas(input, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Always scale the image to fit exactly one page
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

    pdf.save(
      `${cvData?.user?.firstName || "User"}_${
        cvData?.user?.lastName || "CV"
      }_CV.pdf`
    );
  };

  if (cvLoading === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (cvLoading === "error") {
    return (
      <div className="flex justify-center items-center h-screen">
        Error loading CV data.
      </div>
    );
  }

  const {
    user,
    skills,
    education,
    experience,
    projects,
    referees,
    certificates,
  } = cvData;

  // Group skills by category for better organization
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category] = [...acc[skill.category], ...skill.items];
    return acc;
  }, {});

  return (
    <div>
      <Navbar/>
    <div className="relative font-sans">
      {/* Floating Download Button */}
      <button
        onClick={handleDownloadPDF}
        className="fixed top-20 right-10 z-50 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 print:hidden"
      >
        Download as PDF
      </button>

      <div
        ref={cvRef}
        className="cv-container max-w-4xl mx-auto my-5 shadow-lg"
      >
        {/* Header Section */}
        <div className="header bg-indigo-900 text-white p-8 flex items-center">
          <div className="profile-photo w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-200 mr-8">
            {cvData?.user && (
              <div className="w-full h-full bg-gray-200">
                <img
                  src={cvData.user.profilePhoto || "/api/placeholder/400/400"}
                  alt={`${cvData.user.firstName} ${cvData.user.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="header-content">
            <h1 className="text-3xl font-light mb-1">
              {user && `${user.firstName} ${user.lastName}`}
            </h1>
            <p className="text-indigo-200 text-sm tracking-wider mb-3">
              {education && education[0]?.degree
                ? education[0].degree.toUpperCase()
                : "UNDERGRADUATE BSC (HONS) IN IT"}
            </p>

            <div className="contact-info flex flex-wrap text-xs">
              <div className="contact-item flex items-center mr-6 mb-2">
                <i className="fas fa-envelope mr-2 text-indigo-300"></i>
                <span>{user && user.email}</span>
              </div>
              <div className="contact-item flex items-center mr-6 mb-2">
                <i className="fas fa-phone mr-2 text-indigo-300"></i>
                <span>{user && user.phone}</span>
              </div>
              <div className="contact-item flex items-center mr-6 mb-2">
                <i className="fas fa-map-marker-alt mr-2 text-indigo-300"></i>
                <span>{user && user.Address}</span>
              </div>
              <div className="contact-item flex items-center mb-2">
                <i className="fab fa-github mr-2 text-indigo-300"></i>
                <span>{(user && user.githubURL) || "Not available"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="content bg-white p-8 grid grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="col-span-8">
            <div className="profile mb-8">
              <h2 className="section-title text-lg font-semibold text-indigo-800 mb-3 pb-2 border-b border-indigo-100">
                PROFILE
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {user && user.shortBio}
              </p>
            </div>

            <div className="experience mb-8">
              <h2 className="section-title text-lg font-semibold text-indigo-800 mb-3 pb-2 border-b border-indigo-100">
                WORK EXPERIENCE
              </h2>

              {experience.map((exp) => (
                <div className="job-item mb-5" key={exp._id}>
                  <div className="flex justify-between mb-1">
                    <h3 className="text-base font-medium text-gray-800">
                      {exp.jobTitle}
                    </h3>
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                      {exp.startDate.slice(0, 10).substring(0, 4)} -{" "}
                      {exp.endDate
                        ? exp.endDate.slice(0, 10).substring(0, 4)
                        : "Present"}
                    </span>
                  </div>
                  <h4 className="text-sm text-indigo-600 mb-2">
                    {exp.company}
                  </h4>
                  <p className="text-xs text-gray-600">{exp.description}</p>
                </div>
              ))}
            </div>

            <div className="projects mb-8">
              <h2 className="section-title text-lg font-semibold text-indigo-800 mb-3 pb-2 border-b border-indigo-100">
                PROJECTS
              </h2>

              {projects.map((project) => (
                <div className="project-item mb-5" key={project._id}>
                  <h3 className="text-base font-medium text-gray-800 mb-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-600">{project.description}</p>
                </div>
              ))}
            </div>

            <div className="education">
              <h2 className="section-title text-lg font-semibold text-indigo-800 mb-3 pb-2 border-b border-indigo-100">
                EDUCATION
              </h2>

              {education.map((edu) => (
                <div className="edu-item mb-4" key={edu._id}>
                  <div className="flex justify-between mb-1">
                    <h3 className="text-base font-medium text-gray-800">
                      {edu.degree}
                    </h3>
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                      {edu.startDate.slice(0, 10).substring(0, 4)} -{" "}
                      {edu.endDate.slice(0, 10).substring(0, 4)}
                    </span>
                  </div>
                  <h4 className="text-sm text-indigo-600">
                    {edu.school} - {edu.eduLevel}
                  </h4>
                </div>
              ))}
            </div>
            <div className="certification mb-8">
              <h2 className="section-title text-lg font-semibold text-indigo-800 mb-3 pb-2 border-b border-indigo-100">
                CERTIFICATES
              </h2>

              {Array.isArray(certificates) &&
                certificates.map((certificate) => (
                  <div
                    className="certification-item mb-4"
                    key={certificate._id}
                  >
                    <h3 className="text-base font-medium text-gray-800">
                      {certificate.instituteName}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {certificate.certificateName}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-4">
            <div className="skills mb-8">
              <h2 className="section-title text-lg font-semibold text-indigo-800 mb-3 pb-2 border-b border-indigo-100">
                TECHNICAL SKILLS
              </h2>

              {Object.entries(groupedSkills).map(([category, items]) => (
                <div className="skill-category mb-4" key={category}>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    {category}
                  </h3>
                  <div className="skills-list flex flex-wrap">
                    {items.map((skill, index) => (
                      <span
                        key={index}
                        className="skill-tag bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded mr-2 mb-2"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="referees mb-8">
              <h2 className="section-title text-lg font-semibold text-indigo-800 mb-3 pb-2 border-b border-indigo-100">
                REFERENCES
              </h2>

              {referees.map((referee) => (
                <div className="referee-item mb-4" key={referee._id}>
                  <h3 className="text-sm font-medium text-gray-700">
                    {`${referee.FirstName} ${referee.LastName}`}
                  </h3>
                  <p className="text-xs text-indigo-600">
                    {referee.position} at {referee.workingPlace}
                  </p>
                  <p className="text-xs text-gray-500">{referee.phone}</p>
                </div>
              ))}
            </div> 
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Cv006;
