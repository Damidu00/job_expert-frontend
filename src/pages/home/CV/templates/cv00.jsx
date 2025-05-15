import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Navbar from "../../../../Components/Navbar";

export default function CV() {
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
    const input = document.getElementById("cv-content");
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("CV.pdf");
  };

  if (cvLoading === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="animate-spin text-4xl text-blue-500">Loading...</span>
      </div>
    );
  }

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
      <Navbar />
      <div className="bg-white min-h-screen flex justify-center items-start pt-10">
        <div className="w-[210mm] ">
          {/* 🔵 Download Button */}
          <button
            onClick={handleDownloadPDF}
            className="absolute top-20 right-10 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded shadow-md transition"
          >
            Download CV
          </button>

          {/* 📄 CV Content */}
          <div
            id="cv-content"
            className="w-[210mm] h-[297mm] bg-white shadow-lg rounded-lg overflow-hidden"
          >
            {/* Header and Profile Section */}
            <div className="bg-yellow-50 p-8">
              <div className="mb-4">
                <h1 className="text-4xl font-bold text-gray-800">{`${user.firstName} ${user.lastName}`}</h1>
                <h2 className="text-xl font-semibold text-gray-600">
                  {experience[0]?.jobTitle || "Job Title"}
                </h2>
              </div>
              <div className="relative mb-4">
                <hr className="border-t-2 border-gray-300" />
                <div className="absolute top-[-5px] left-0 w-10 h-1 bg-gray-800"></div>
                <div className="absolute top-[-5px] right-0 w-10 h-1 bg-gray-800"></div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <FaPhone className="mr-2 text-blue-500" /> {user.phone}
                    </li>
                    <li className="flex items-center">
                      <FaEnvelope className="mr-2 text-blue-500" /> {user.email}
                    </li>
                    <li className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-blue-500" />{" "}
                      {user.Address}
                    </li>
                    <li className="flex items-center">
                      <a
                        href={user.linkedinURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-500"
                      >
                        <FaLinkedin className="mr-2" /> LinkedIn
                      </a>
                    </li>
                    <li className="flex items-center">
                      <a
                        href={user.githubURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-500"
                      >
                        <FaGithub className="mr-2" /> GitHub
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    PROFILE
                  </h2>
                  <p className="text-gray-600">{user.shortBio}</p>
                </div>
              </div>
            </div>

            {/* Main Body */}
            <div className="grid grid-cols-2 gap-8 p-8 relative">
              <div className="absolute -top-52 bottom-0 left-1/2 w-[1px] bg-gray-300"></div>

              {/* Left Column */}
              <div className="pr-4">
                <section className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    SKILLS
                  </h2>
                  <ul className="list-disc pl-6 text-gray-600 space-y-1">
                    {skills.map((skill, index) => (
                      <li key={index}>
                        <strong>{skill.category}:</strong> {skill.items}
                      </li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    EDUCATION
                  </h2>
                  <ul className="space-y-4 text-gray-600">
                    {education.map((edu, index) => (
                      <li key={index}>
                        <h3 className="font-semibold">{edu.degree}</h3>
                        <p>
                          {edu.school} |{" "}
                          {new Date(edu.startDate).toLocaleDateString()} -{" "}
                          {new Date(edu.endDate).toLocaleDateString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h2 className="text-xl font-bold text-gray-800 mb-2 mt-5">
                    Projects
                  </h2>
                  <ul className="space-y-4 text-gray-600">
                    {projects.map((project, index) => (
                      <li key={index}>
                        <h3 className="font-semibold text-gray-800">
                          {project.title}
                        </h3>
                        <p>{project.description}</p>
                        <p className="text-sm">
                          <strong>Tech Stack:</strong>{" "}
                          {project.techStack?.join(", ")}
                        </p>
                        <p>
                          <a
                            href={project.githubLink}
                            target="_blank"
                            className="text-blue-600 underline"
                          >
                            GitHub
                          </a>{" "}
                          |{" "}
                          <a
                            href={project.liveDemo}
                            target="_blank"
                            className="text-blue-600 underline"
                          >
                            Live Demo
                          </a>
                        </p>
                        <p className="text-xs text-gray-500">
                          Created on:{" "}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Right Column */}
              <div className="pl-4">
                <section>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    EXPERIENCE
                  </h2>
                  <ul className="space-y-4">
                    {experience.map((exp, index) => (
                      <li key={index}>
                        <h3 className="font-semibold text-gray-800">
                          {exp.jobTitle}
                        </h3>
                        <p className="text-gray-600">
                          {exp.company} |{" "}
                          {new Date(exp.startDate).toLocaleDateString()} -{" "}
                          {exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString()
                            : "Present"}
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 space-y-1">
                          {exp.description.split("\n").map((desc, idx) => (
                            <li key={idx}>{desc}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h2 className="text-xl font-bold text-gray-800 mb-2 mt-5">
                    References
                  </h2>
                  <ul className="space-y-4">
                    {referees.map((ref, index) => (
                      <li key={index}>
                        <h3 className="font-semibold text-gray-800">
                          {ref.FirstName} {ref.LastName}
                        </h3>
                        <p className="text-gray-600">
                          {ref.position} at {ref.workingPlace}
                        </p>
                        <p className="text-gray-600">{ref.location}</p>
                        <p className="text-gray-600">Phone: {ref.phone}</p>
                        <p className="text-gray-600">Type: {ref.refType}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
