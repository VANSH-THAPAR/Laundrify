import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const errorStyle = {
  color: "red",
  fontSize: "14px",
  marginTop: "5px",
};

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUserName] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const decode = jwtDecode(token);
        setUserName(decode.name);
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  const LogOut = () => {
    localStorage.removeItem("jwt");
    setUserName(null);
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${backendUrl}/handlesignup`, data);
      const token = response.data.token;
      localStorage.setItem("jwt", token);
      console.log("User signed up successfully:", data);
      // setUserName(token);
      // ✅ Redirect to /addLaundary
      navigate("/addLaundary");
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="flex w-full min-h-screen justify-center items-center">
      {username ? (
        <div className="flex flex-col items-center justify-evenly h-[50vh]">
          <div className="flex">
            <h1
              className="text-6xl flex"
              style={{ fontFamily: '"Bebas Neue", sans-serif' }}
            >
              Hi,
            </h1>
            <h1
              className="text-6xl flex text-red-700"
              style={{ fontFamily: '"Bebas Neue", sans-serif' }}
            >
              &nbsp;{username}
            </h1>
          </div>
          <h3 className="text-2xl" style={{ fontFamily: "Poppins" }}>
            You are already logged in
          </h3>
          <button
            style={{ fontFamily: "Poppins" }}
            className="border-2 rounded-lg h-10 w-25 text-xl font-semibold text-white bg-red-600"
            onClick={LogOut}
          >
            LogOut
          </button>
        </div>
      ) : (
        <div className="flex flex-col pt-5 rounded-lg border-2 justify-center items-center">
          <h1 className="w-[100%] text-center text-4xl text-red-700" style={{fontFamily: "Bebas Neue"}} >Sign Up Form</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex h-110 w-80 flex-col justify-evenly items-start "
          >
            <div className="flex justify-evenly flex-col pl-5 gap-2" style={{fontFamily: "Poppins"}}>
              <h1 className="flex justify-start font-semibold">Select Hostel: </h1>
              <select
                name="hostel"
                id="hostel"
                {...register("hostel")}
                className="border-1 rounded-lg h-10 w-70"
              >
                <option value="sarabhai">Sarabhai</option>
                <option value="aryabhatta">Aryabhatta</option>
                <option value="boseBoys">Bose Boys</option>
                <option value="boseGirls">Bose Girls</option>
                <option value="kalpana">Kalpana</option>
                <option value="gargi">Gargi</option>
                <option value="gargi">Teresa</option>
              </select>
            </div>
            <div className="flex justify-evenly flex-col pl-5 gap-2" style={{fontFamily: "Poppins"}}>
              <h1 className="flex justify-start font-semibold">Enter Room Number:</h1>
              <input
                type="number"
                {...register("roomNumber", {
                  required: "Room number is required",
                })}
                className="border-1 rounded-lg h-10 w-70"
                placeholder="Enter room number"
              />
              {errors.roomNumber && (
                <p style={errorStyle}>{errors.roomNumber.message}</p>
              )}
            </div>
            <div className="flex justify-evenly flex-col pl-5 gap-2" style={{fontFamily: "Poppins"}}>
              <h1 className="flex justify-start font-semibold">Enter Your Name:</h1>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                placeholder="Enter your name"
                className="border-1 rounded-lg h-10 w-70"
                />
                {errors.name && (
                  <p style={errorStyle}>{errors.name.message}</p>
                )}
            </div>
            <div className="flex justify-evenly flex-col pl-5 gap-2" style={{fontFamily: "Poppins"}}> 
              <h1 className="flex  justify-start font-semibold">Enter Password:</h1>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                placeholder="Enter password"
                className="border-1 rounded-lg h-10 w-70"
              />
              {errors.password && (
                <p style={errorStyle}>{errors.password.message}</p>
              )}
            </div>
            <div className="w-full flex justify-center gap-2">
              <button
                type="submit"
                className="flex rounded-lg border-1 w-20 justify-center text-2xl bg-red-700 text-white"
                style={{fontFamily: "Bebas Neue"}}
                >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SignUp;
