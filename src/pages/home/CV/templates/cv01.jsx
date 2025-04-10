import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaGithub, FaLinkedin, FaMapMarkerAlt } from 'react-icons/fa';

export default function Cv01() {
  const location = useLocation();
  const userId = location.state?.userId;
  const [cvLoading, setCvLoading] = useState('loading');
  const [cvData, setCvData] = useState(null);

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
          experienceRes,
          projectsRes,
          refereesRes,
        ] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cvuser/${userId}`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/skills/${userId}`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/education/${userId}`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/experience/${userId}`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/projects/${userId}`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/referees/${userId}`),
        ]);

        const user = cvUserRes.data;
        const skills = skillsRes.data.skills || [];
        const education = educationRes.data.details || [];
        const experience = experienceRes.data.experiences || [];
        const projects = projectsRes.data.projects || [];
        const referees = refereesRes.data.referees || [];

        setCvData({
          user,
          skills,
          education,
          experience,
          projects,
          referees,
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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (cvLoading === 'error') {
    return <div className="flex justify-center items-center h-screen">Error loading CV data.</div>;
  }

  const { user, skills, education, experience, projects, referees } = cvData;

  return (
    <div className="w-[21cm] min-h-[29.7cm] mx-auto bg-white shadow-md p-6 print:p-0 print:shadow-none">
      {/* Header */}
      <div className="flex items-center mb-6 bg-gray-800 text-white p-4 rounded-lg">
        {/* Profile Picture */}
        <div className="w-32 h-32 rounded-full overflow-hidden mr-6">
          <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
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
        <div className="w-2/5 pr-4 bg-gray-100 p-4 rounded-lg">
          {/* About Me */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800">About Me</h2>
            <p className="text-sm text-gray-600">{user.shortBio}</p>
          </div>

          {/* Contact */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800">Contact</h2>
            <ul className="space-y-1 text-sm text-gray-700">
              <li className="flex items-center">
                <FaPhone className="mr-2 text-blue-600" /> {user.phone}
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-blue-600" /> {user.email}
              </li>
              <li className="flex items-center">
                <FaGithub className="mr-2 text-blue-600" /> {user.githubURL || "N/A"}
              </li>
              <li className="flex items-center">
                <FaLinkedin className="mr-2 text-blue-600" /> {user.linkedinURL || "N/A"}
              </li>
              <li className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-600" /> {user.Address}
              </li>
            </ul>
          </div>

          {/* Skills */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800">Skills</h2>
            {skills.map((skill) => (
              <div key={skill._id} className="mt-2">
                <h3 className="text-base font-semibold text-gray-700">{skill.category}</h3>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {skill.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Referees */}
          <div>
            <h2 className="text-lg font-bold text-gray-800">Referees</h2>
            {referees.map((referee) => (
              <div key={referee._id} className="mt-2">
                <h3 className="text-base font-semibold text-gray-700">{`${referee.FirstName} ${referee.LastName}`}</h3>
                <p className="text-sm text-gray-600">
                  <strong>{referee.position}</strong> - {referee.workingPlace}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="w-3/5 pl-4">
          {/* Education */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800">Education</h2>
            {education.map((edu) => (
              <div key={edu._id} className="mt-2">
                <h3 className="text-base font-semibold text-gray-700">{edu.degree}</h3>
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
            <h2 className="text-lg font-bold text-gray-800">Experience</h2>
            {experience.map((exp) => (
              <div key={exp._id} className="mt-2">
                <h3 className="text-base font-semibold text-gray-700">{exp.jobTitle}</h3>
                <p className="text-sm text-gray-600">
                  <strong>{exp.company}</strong>
                  <br />
                  {exp.startDate.slice(0, 10)} - {exp.endDate.slice(0, 10)}
                  <br />
                  {exp.description}
                </p>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div>
            <h2 className="text-lg font-bold text-gray-800">Projects</h2>
            {projects.map((project) => (
              <div key={project._id} className="mt-2">
                <h3 className="text-base font-semibold text-gray-700">{project.title}</h3>
                <p className="text-sm text-gray-600">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}