import axios from 'axios';
import React, { useEffect } from 'react';
import { CiSquarePlus } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../Components/Navbar';

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  let userId = ''
  let username = ''

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await axios.get(import.meta.env.VITE_BACKEND_URL + `/api/users/currentuser`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`, 
  //         },
  //       });
  //       console.log('Response Data:', response.data);
  //       userId = response.data.userId;
  //       username = response.data.username
  //     } catch (error) {
  //       console.error('Error fetching user:', error);
  //     }
  //   };

  //   if (token) {
  //     fetchUser();
  //   }
  // }, [token, navigate]);
  const handlenavigate = () => {
    navigate('/addcvdetails');
  }

  return (
    <>
    <Navbar/>
    <div className="bg-gray-200 h-screen w-full flex justify-center items-center">
      
      <div className="w-[900px] h-[600px] bg-gray-100 shadow-2xl">
        <div className="flex w-full h-[250px] justify-center items-center">
          <div className="bg-gray-300 w-[200px] h-[200px] hover:bg-gray-400 flex justify-center items-center text-8xl hover:text-blue-200 rounded-2xl"
          
          onClick={handlenavigate}
          
          >
            <CiSquarePlus />
          </div>
        </div>
      </div>
    </div>
    </>
    
  );
}