import React from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SignUp = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${backendUrl}/handlesignup`, data);
      const token = response.data.token;
      localStorage.setItem("jwt", token);
      console.log("User signed up successfully:", data);

      // ✅ Redirect to /addLaundary
      navigate('/addLaundary');
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default SignUp;
