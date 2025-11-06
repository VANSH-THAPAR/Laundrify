import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const errorStyle = {
  color: 'red',
  fontSize: '14px',
  marginTop: '5px',
};

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const loginData = {
        ...data,
        roomId: `${data.hostel}${data.roomNumber}`,
      };

      const response = await axios.post(`${backendUrl}/handlelogin`, loginData);
      const { token } = response.data;
      localStorage.setItem("jwt", token);
      navigate('/addLaundary');
    } catch (err) {
      console.error("Login error:", err);
      setError('root.serverError', {
        type: 'server',
        message: err.response?.data?.message || 'Login failed. Please check your credentials.',
      });
    }
  };

  // ✅ Handle Google Login success
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const googleEmail = decoded.email;
      const name = decoded.name;

      // Send to backend for Google login/signup handling
      const response = await axios.post(`${backendUrl}/googleauth`, {
        email: googleEmail,
        name,
      });

      const { token } = response.data;
      localStorage.setItem("jwt", token);
      navigate('/addLaundary');
    } catch (err) {
      console.error("Google Auth Error:", err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-gray-50 flex items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden">

        {/* Left Side: Form */}
        <div className="p-8 md:p-12">
          <h1 className="text-4xl font-bold text-red-700 text-center mb-2" style={{ fontFamily: "Bebas Neue" }}>
            Welcome Back!
          </h1>
          <p className="text-center text-gray-600 mb-8" style={{ fontFamily: "Poppins" }}>
            Log in to manage your laundry.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="hostel" className="block text-sm font-medium text-gray-700">Hostel</label>
                <select id="hostel" {...register("hostel")} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm">
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
                <input type="number" id="roomNumber" {...register("roomNumber", { required: "Room number is required" })} placeholder="e.g., 101" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                {errors.roomNumber && <p style={errorStyle}>{errors.roomNumber.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" {...register("email", { required: "Email is required" })} placeholder="example@gmail.com" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" id="password" {...register("password", { required: "Password is required" })} placeholder="••••••••" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              {errors.password && <p style={errorStyle}>{errors.password.message}</p>}
            </div>

            {errors.root?.serverError && <p style={errorStyle} className="text-center">{errors.root.serverError.message}</p>}

            <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-md text-white bg-red-600 hover:bg-red-700">
              {isSubmitting ? 'Logging In...' : 'Log In'}
            </button>

            <div className="flex justify-center mt-4">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => console.log('Google Login Failed')}
              />
            </div>

            <p className="text-center text-sm text-gray-600">
              Don't have an account? <Link to="/signup" className="font-medium text-red-600 hover:text-red-500">Sign Up</Link>
            </p>
          </form>
        </div>

        {/* Right Side: Image */}
        <div className="hidden md:block relative overflow-hidden">
          <img src="login_img.jpg" alt="Clean laundry" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Login;
