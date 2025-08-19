// SignUp.jsx

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const errorStyle = {
  color: 'red',
  fontSize: '14px',
  marginTop: '5px',
};

const SignUp = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("jwt"));

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${backendUrl}/handlesignup`, data);
      const { token } = response.data;
      localStorage.setItem("jwt", token);
      console.log("User signed up successfully:", data);
      navigate('/addLaundary');
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError('root.serverError', {
          type: 'server',
          message: err.response.data.message,
        });
      } else {
        setError('root.serverError', {
          type: 'server',
          message: 'An unexpected error occurred. Please try again.',
        });
      }
    }
  };

  if (isLoggedIn) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen">
              <h1 className="text-2xl">You are already logged in.</h1>
              <button onClick={() => { localStorage.removeItem('jwt'); setIsLoggedIn(false); }} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Logout</button>
          </div>
      )
  }

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-gray-50 flex items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        
        {/* Left Side: Image */}
        <div className="hidden md:block relative overflow-hidden">
          <img 
            src="/signup_img.jpg" 
            alt="Laundry baskets"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12">
          <h1 className="text-4xl font-bold text-red-700 text-center mb-2" style={{ fontFamily: "Bebas Neue" }}>
            Create Your Account
          </h1>
          <p className="text-center text-gray-600 mb-8" style={{fontFamily: "Poppins"}}>
            Join Laundrify and simplify your laundry day!
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="hostel" className="block text-sm font-medium text-gray-700">Hostel</label>
                <select id="hostel" {...register("hostel")} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500">
                  <option value="sarabhai">Sarabhai</option>
                  <option value="aryabhatta">Aryabhatta</option>
                  <option value="boseBoys">Bose Boys</option>
                  <option value="boseGirls">Bose Girls</option>
                  <option value="kalpana">Kalpana</option>
                  <option value="gargi">Gargi</option>
                  <option value="teresa">Teresa</option>
                </select>
              </div>
              <div>
                <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">Room No.</label>
                <input type="number" id="roomNumber" {...register("roomNumber", { required: "Room number is required" })} placeholder="e.g., 101" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
                {errors.roomNumber && <p style={errorStyle}>{errors.roomNumber.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="name" {...register("name", { required: "Name is required" })} placeholder="John Doe" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
              {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" id="password" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} placeholder="••••••••" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
              {errors.password && <p style={errorStyle}>{errors.password.message}</p>}
            </div>

            {errors.root?.serverError && <p style={errorStyle} className="text-center">{errors.root.serverError.message}</p>}

            <div>
              <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400">
                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
              </button>
            </div>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
