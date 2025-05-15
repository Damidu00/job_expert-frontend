import axios from "axios";
import React, { useEffect, useState } from "react";
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
} from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Navbar from "../../../../Components/Navbar";

export default function Cv01() {
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
        {/* Floating Download Button */}
        <button
          onClick={handleDownloadPDF}
          className="fixed top-20 right-10 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 print:hidden"
        >
          Download as PDF
        </button>
        <div
          ref={cvRef}
          className="w-[21cm] min-h-[29.7cm] mx-auto bg-white shadow-md p-6 print:p-0 print:shadow-none"
        >
          {/* Header */}
          <div className="flex items-center mb-6 bg-gray-800 text-white p-4 rounded-lg">
            {/* Profile Picture */}
            <div className="w-32 h-32 rounded-full overflow-hidden mr-6">
              <img
                src={user.profilePhoto}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name and Degree */}
            <div>
              <h1 className="text-2xl font-bold">{`${user.firstName} ${user.lastName}`}</h1>
              <p className="text-lg">Undergraduate BSc (Hons) in IT</p>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-row">
            {/* Left Section */}
            <div className="w-2/5 pr-4 bg-gray-100 p-4 rounded-lg print:break-inside-avoid mb-4">
              {/* About Me */}
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center leading-none">
                  <FaUserCircle
                    className="mr-2 text-black align-middle"
                    style={{ fontSize: 22, minWidth: 22, minHeight: 22 }}
                  />
                  <span className="align-middle">About Me</span>
                </h2>
                <p className="text-sm text-gray-600">{user.shortBio}</p>
              </div>

              {/* Contact */}
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center leading-none">
                  <FaUserCheck
                    className="mr-2 text-black align-middle"
                    style={{ fontSize: 22, minWidth: 22, minHeight: 22 }}
                  />
                  <span className="align-middle">Contact</span>
                </h2>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-center">
                    <FaPhone className="mr-2 text-black" /> {user.phone}
                  </li>
                  <li className="flex items-center">
                    <FaEnvelope className="mr-2 text-black" /> {user.email}
                  </li>
                  <li className="flex items-center">
                    <FaGithub className="mr-2 text-black" />{" "}
                    {user.githubURL || "Not available"}
                  </li>
                  <li className="flex items-center">
                    <FaLinkedin className="mr-2 text-black" />{" "}
                    {user.linkedinURL || "Not available"}
                  </li>
                  <li className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-black" />{" "}
                    {user.Address}
                  </li>
                </ul>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center leading-none">
                  <FaTasks
                    className="mr-2 text-black align-middle"
                    style={{ fontSize: 22, minWidth: 22, minHeight: 22 }}
                  />
                  <span className="align-middle">Skills</span>
                </h2>
                {skills.map((skill) => (
                  <div key={skill._id} className="mt-2">
                    <h3 className="text-base font-semibold text-gray-700">
                      {skill.category}
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {skill.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Referees */}
              <div className="print:break-after-page">
                <h2 className="text-lg font-bold text-gray-800 flex items-center leading-none">
                  <FaUserCheck
                    className="mr-2 text-black align-middle"
                    style={{ fontSize: 22, minWidth: 22, minHeight: 22 }}
                  />
                  <span className="align-middle">Referees</span>
                </h2>
                {referees.map((referee) => (
                  <div key={referee._id} className="mt-2">
                    <h3 className="text-base font-semibold text-gray-700">{`${referee.FirstName} ${referee.LastName}`}</h3>
                    <p className="text-sm text-gray-600">
                      <strong>{referee.position}</strong> -{" "}
                      {referee.workingPlace}
                    </p>
                    <p className="text-[13px] font-gray-400">{referee.phone}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Section */}
            <div className="w-3/5 pl-4 print:break-inside-avoid mb-4">
              {/* Education */}
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center leading-none">
                  <FaBook
                    className="mr-2 text-black align-middle"
                    style={{ fontSize: 22, minWidth: 22, minHeight: 22 }}
                  />
                  <span className="align-middle">Education</span>
                </h2>
                {education.map((edu) => (
                  <div key={edu._id} className="mt-2">
                    <h3 className="text-base font-semibold text-gray-700">
                      {edu.degree}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <strong>{edu.school}</strong> - {edu.eduLevel}
                      <br />
                      {edu.startDate.slice(0, 10)} - {edu.endDate.slice(0, 10)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Experience */}
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center leading-none">
                  <FaBriefcase
                    className="mr-2 text-black align-middle"
                    style={{ fontSize: 22, minWidth: 22, minHeight: 22 }}
                  />
                  <span className="align-middle">Experience</span>
                </h2>
                {experience.map((exp) => (
                  <div key={exp._id} className="mt-2">
                    <h3 className="text-base font-semibold text-gray-700">
                      {exp.jobTitle}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {/* Date Range */}
                      <strong>{exp.company}</strong>{" "}
                      <span className="text-[13px]">
                        ({exp.startDate.slice(0, 10)} -{" "}
                        {exp.endDate ? exp.endDate.slice(0, 10) : "Present"})
                      </span>
                      <br />
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Projects */}
              <div className="print:break-after-page">
                <h2 className="text-lg font-bold text-gray-800 flex items-center leading-none">
                  <FaProjectDiagram
                    className="mr-2 text-black align-middle"
                    style={{ fontSize: 22, minWidth: 22, minHeight: 22 }}
                  />
                  <span className="align-middle">Projects</span>
                </h2>
                {projects.map((project) => (
                  <div key={project._id} className="mt-2">
                    <h3 className="text-base font-semibold text-gray-700">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
              {/* Certifications */}
              <div className="print:break-after-page">
                <h2 className="text-lg font-bold text-gray-800 flex items-center leading-none">
                <FaBook
                    className="mr-2 text-black align-middle"
                    style={{ fontSize: 22, minWidth: 22, minHeight: 22 }}
                  />
                  <span className="align-middle">Certifications</span>
                </h2>
                <div className="mt-2">
                  {(certification || []).map((cert) => (
                    <div key={cert._id} className="mt-2">
                      <h3 className="text-base font-semibold text-gray-700">
                        {cert.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {cert.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Print CSS for page breaks */}
        <style>{`
        @media print {
          .print\:break-after-page { page-break-after: always; }
          .print\:break-inside-avoid { page-break-inside: avoid; }
          body { font-family: 'Inter', sans-serif !important; }
        }
      `}</style>
      </div>
    </div>
  );
}
