import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SignUp = () => {
  const navigate = useNavigate();
  const [username , setUserName] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(()=>{
    const token = localStorage.getItem('jwt');
    if(token){
      try{
        const decode = jwtDecode(token);
        setUserName(decode.name);
      }
      catch(err){
        console.log(err);
      }
    }
  },[])

  const LogOut = ()=>{
    localStorage.removeItem('jwt');
    setUserName(null);
  }

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${backendUrl}/handlesignup`, data);
      const token = response.data.token;
      localStorage.setItem("jwt", token);
      console.log("User signed up successfully:", data);
      // setUserName(token);
      // ✅ Redirect to /addLaundary
      navigate('/addLaundary');
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div>

      {
        username ? (
          <div className='flex flex-col items-center justify-evenly h-[50vh]'>
            <div className='flex'>
              <h1 className='text-6xl flex' style={{ fontFamily: '"Bebas Neue", sans-serif' }}>Hi,</h1>
              <h1 className='text-6xl flex text-red-700' style={{ fontFamily: '"Bebas Neue", sans-serif' }}>&nbsp;{username}</h1>
            </div>
          <h3 className='text-2xl' style={{ fontFamily: "Poppins" }} >You are already logged in</h3>
          <button style={{ fontFamily: "Poppins" }} className='border-2 rounded-lg h-10 w-25 text-xl font-semibold text-white bg-red-600' onClick={LogOut}>LogOut</button>
        </div>
        ):(
        <form onSubmit={handleSubmit(onSubmit)}>
          <select name="hostel" id="hostel" {...register("hostel")}>
            <option value="sarabhai">Sarabhai</option>
            <option value="aryabhatta">Aryabhatta</option>
            <option value="boseBoys">Bose Boys</option>
            <option value="boseGirls">Bose Girls</option>
            <option value="kalpana">Kalpana</option>
            <option value="gargi">Gargi</option>
          </select>
          <input type='number' {...register("roomNumber")} placeholder='Enter room number' />
          <input type="text" {...register("name")} placeholder='Enter your name' />
          <input type="password" {...register("password")} placeholder='Enter password' />

          <button type='submit'>Sign Up</button>
        </form>
        )}
    </div>
  );
};

export default SignUp;
