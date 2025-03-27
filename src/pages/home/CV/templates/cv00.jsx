import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaGithub } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

export default function CV() {
  const location = useLocation();
  const [cvLoading, setCvLoading] = useState('loading');
  const [cvData, setCvData] = useState(null);

  const userId = location.state?.userId; // Safely extract userId

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        console.error("User ID is missing from navigation state.");
        setCvLoading('error');
        return;
      }

      try {
        const [
          cvUserRes,
          skillsRes,
          educationRes,
          experienceRes
        ] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cvuser/${userId}`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/skills/${userId}`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/education/${userId}`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/experience/${userId}`)
        ]);

        // Extract relevant data
        const user = cvUserRes.data;
        const skills = skillsRes.data.skills || [];
        const education = educationRes.data.details || [];
        const experience = experienceRes.data.experiences || [];

        // Set the CV data
        setCvData({
          user,
          skills,
          education,
          experience
        });
        setCvLoading('loaded');
      } catch (error) {
        console.error('Error fetching CV data:', error);
        setCvLoading('error');
      }
    };

    fetchData();
  }, [userId]);

  if (cvLoading === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="animate-spin text-4xl text-blue-500">Loading...</span>
      </div>
    );
  }

  if (cvLoading === 'error') {
    return <div className="text-red-500 text-center">Failed to load CV data.</div>;
  }

  const { user, skills, education, experience } = cvData;

  return (
    <div className="bg-white min-h-screen flex justify-center items-center ">
      {/* A4 Page Container */}
      <div className="w-[210mm] h-[297mm] bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header and Profile Section with Light Cream Background */}
        <div className="bg-yellow-50 p-8">
          {/* Name and Title */}
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-gray-800">{`${user.firstName} ${user.lastName}`}</h1>
            <h2 className="text-xl font-semibold text-gray-600">WEB DEVELOPER</h2>
          </div>

          {/* Horizontal Rule */}
          <div className="relative mb-4">
            <hr className="border-t-2 border-gray-300" />
            <div className="absolute top-[-5px] left-0 w-10 h-1 bg-gray-800"></div>
            <div className="absolute top-[-5px] right-0 w-10 h-1 bg-gray-800"></div>
          </div>

          {/* Grid Layout for Contact Info and Profile */}
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column: Contact Info */}
            <div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <FaPhone className="mr-2 text-blue-500" /> {user.phone}
                </li>
                <li className="flex items-center">
                  <FaEnvelope className="mr-2 text-blue-500" /> {user.email}
                </li>
                <li className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-500" /> {user.Address}
                </li>
                <li className="flex items-center">
                  <a href={user.linkedinURL} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500">
                    <FaLinkedin className="mr-2" /> LinkedIn
                  </a>
                </li>
                <li className="flex items-center">
                  <a href={user.githubURL} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500">
                    <FaGithub className="mr-2" /> GitHub
                  </a>
                </li>
              </ul>
            </div>

            {/* Right Column: Profile */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">PROFILE</h2>
              <p className="text-gray-600">{user.shortBio}</p>
            </div>
          </div>
        </div>

        {/* Two-Column Layout Below Profile Section */}
        <div className="grid grid-cols-2 gap-8 p-8 relative">
          {/* Divider Line Between Columns */}
          <div className="absolute -top-52 bottom-0 left-1/2 w-[1px] bg-gray-300"></div>

          {/* Left Column: Skills & Education */}
          <div className="pr-4">
            {/* Skills */}
            <section className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">SKILLS</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-1">
                {skills.map((skill, index) => (
                  <li key={index}>
                    <strong>{skill.category}:</strong> {skill.items}
                  </li>
                ))}
              </ul>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-2">EDUCATION</h2>
              <ul className="space-y-4 text-gray-600">
                {education.map((edu, index) => (
                  <li key={index}>
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p>{edu.school} | {new Date(edu.startDate).toLocaleDateString()} - {new Date(edu.endDate).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right Column: Experience */}
          <div className="pl-4">
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-2">EXPERIENCE</h2>
              <ul className="space-y-4">
                {experience.map((exp, index) => (
                  <li key={index}>
                    <h3 className="font-semibold text-gray-800">{exp.jobTitle}</h3>
                    <p className="text-gray-600">
                      {exp.company} | {new Date(exp.startDate).toLocaleDateString()} -{' '}
                      {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 space-y-1">
                      {exp.description.split('\n').map((desc, idx) => (
                        <li key={idx}>{desc}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}