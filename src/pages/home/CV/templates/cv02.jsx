import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  FaUserCircle,
  FaPhone,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaTasks,
  FaBook,
  FaBriefcase,
  FaProjectDiagram,
  FaUserCheck,
  FaDownload,
  FaExchangeAlt,
} from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Navbar from "../../../../Components/Navbar";

export default function Cv02() {
  const location = useLocation();
  const userId = location.state?.userId;
  const [cvLoading, setCvLoading] = useState("loading");
  const [cvData, setCvData] = useState(null);
  const [activeTemplate, setActiveTemplate] = useState("modern"); // Default template
  const cvRef = useRef();
  const cvUserId = localStorage.getItem("cvUserId");

  useEffect(() => {
    const fetchData = async () => {
      if (!cvUserId) {
        console.error("User ID is missing.");
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

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      // Improve quality for PDF export
      logging: false,
      letterRendering: true,
    });

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

    pdf.save(`${cvData.user.firstName}_${cvData.user.lastName}_CV.pdf`);
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
    certification,
  } = cvData;

  // Process skills into grouped format
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category] = [...acc[skill.category], ...skill.items];
    return acc;
  }, {});

  return (
    <div>
      <Navbar />
      <div className="relative font-sans">
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
          <div className="bg-white shadow-lg max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white shadow-lg max-w-4xl mx-auto">
              {/* Header */}
              <div className="bg-blue-600 text-white p-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  {/* Profile Photo */}
                  {user.profilePhoto && (
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-200 mb-4 md:mb-0 md:mr-8">
                      <img
                        src={user.profilePhoto}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* User Info */}
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold">
                      {user.firstName} {user.lastName}
                    </h1>
                    <h2 className="text-xl mt-2">
                      {user.jobTitle || "Professional"}
                    </h2>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-4 md:mt-0 text-sm">
                    <div className="flex items-center my-1">
                      <FaEnvelope className="mr-2" /> {user.email}
                    </div>
                    <div className="flex items-center my-1">
                      <FaPhone className="mr-2" /> {user.phone}
                    </div>
                    <div className="flex items-center my-1">
                      <FaMapMarkerAlt className="mr-2" />{" "}
                      {user.address || "Location"}
                    </div>
                    {user.github && (
                      <div className="flex items-center my-1">
                        <FaGithub className="mr-2" /> {user.github}
                      </div>
                    )}
                    {user.linkedin && (
                      <div className="flex items-center my-1">
                        <FaLinkedin className="mr-2" /> {user.linkedin}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <p>{user.bio || "Professional summary"}</p>
                </div>
              </div>{" "}
            </div>
            {/* Main Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="md:col-span-1">
                  {/* Skills */}
                  {Object.keys(groupedSkills).length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-4 text-blue-600 flex items-center">
                        <FaTasks className="mr-2" /> Skills
                      </h3>
                      {Object.entries(groupedSkills).map(
                        ([category, items]) => (
                          <div key={category} className="mb-4">
                            <h4 className="font-semibold text-gray-700">
                              {category}
                            </h4>
                            <div className="flex flex-wrap mt-2">
                              {items.map((skill, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mr-2 mb-2"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {/* Education */}
                  {education.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-4 text-blue-600 flex items-center">
                        <FaBook className="mr-2" /> Education
                      </h3>
                      {education.map((edu, index) => (
                        <div key={index} className="mb-4">
                          <h4 className="font-semibold">{edu.school}</h4>
                          <p className="text-gray-700">{edu.degree}</p>
                          <p className="text-sm text-gray-600">
                            {edu.startDate} - {edu.endDate}
                          </p>
                          <p className="text-sm mt-1">{edu.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Certifications */}
                  {certification.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-4 text-blue-600 flex items-center">
                        <FaUserCheck className="mr-2" /> Certifications
                      </h3>
                      {certification.map((cert, index) => (
                        <div key={index} className="mb-3">
                          <h4 className="font-semibold">
                            {cert.instituteName}
                          </h4>
                          <p className="text-gray-700">
                            {cert.certificateName}
                          </p>
                          <p className="text-sm text-gray-600">{cert.Link}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {experience.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4 text-blue-600 flex items-center">
                      <FaBriefcase className="mr-2" /> Experience
                    </h3>
                    {experience.map((exp, index) => (
                      <div key={index} className="mb-4">
                        <h4 className="font-semibold">{exp.company}</h4>
                        <p className="text-gray-700">{exp.position}</p>
                        <p className="text-sm text-gray-600">
                          {exp.startDate} - {exp.endDate}
                        </p>
                        <p className="text-sm mt-1">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4 text-blue-600 flex items-center">
                      <FaProjectDiagram className="mr-2" /> Projects
                    </h3>
                    {projects.map((project, index) => (
                      <div key={index} className="mb-4">
                        <h4 className="font-semibold">{project.title}</h4>
                        <p className="text-gray-700">{project.description}</p>
                        <div className="text-sm text-blue-600 mt-1">
                          {project.githubLink && (
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mr-4 underline"
                            >
                              GitHub
                            </a>
                          )}
                          {project.liveDemo && (
                            <a
                              href={project.liveDemo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline"
                            >
                              Live Demo
                            </a>
                          )}
                        </div>
                        {project.techStack?.length > 0 && (
                          <div className="flex flex-wrap mt-2">
                            {project.techStack.map((tech, i) => (
                              <span
                                key={i}
                                className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full mr-2 mb-2"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Referees */}
                {referees.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-blue-600 flex items-center">
                      <FaUserCircle className="mr-2" /> References
                    </h3>
                    <ul className="space-y-4">
                      {referees.map((ref, index) => (
                        <li key={index}>
                          <h4 className="font-semibold text-gray-800">
                            {ref.FirstName} {ref.LastName}
                          </h4>
                          <p className="text-gray-700">
                            {ref.position} at {ref.workingPlace}
                          </p>
                          <p className="text-sm text-gray-600">{ref.phone}</p>
                          <p className="text-sm text-gray-600">
                            {ref.location}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
