import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AddLaundary = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      bedsheet: 0,
      towel: 0,
      pillowCover: 0,
      salwar: 0,
      lower: 0,
      nikkar: 0,
      schoolPant: 0,
      civilPant: 0,
      jeans: 0,
      kurta: 0,
      tShirt: 0,
      schoolShirt: 0,
      civilShirt: 0,
      sweater: 0,
      jacket: 0,
      schoolSweater: 0,
      coat: 0,
      blanket: 0,
      Scarves: 0,
    }
  });

  const laundryItems = Object.keys(watch());

  const increment = (item) => {
    const value = watch(item);
    setValue(item, value + 1);
  };

  const decrement = (item) => {
    const value = watch(item);
    setValue(item, Math.max(0, value - 1));
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.post(`${backendUrl}/handlelaundary`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Laundry submitted:", response.data);
      reset(); // ✅ Reset all values
      navigate("/"); // ✅ Redirect to Home
    } catch (err) {
      console.error("Error submitting laundry:", err);
      alert("Submission failed. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border">
      <h1 className="text-2xl font-bold mb-6 text-center text-indigo-700">Laundry Submission</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {laundryItems.map((item) => (
          <div key={item} className="flex items-center justify-between">
            <label className="capitalize w-1/3 text-gray-700">{item.replace(/([A-Z])/g, " $1")}</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => decrement(item)}
                className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
              >
                −
              </button>
              <input
                type="number"
                {...register(item)}
                value={watch(item)}
                readOnly
                className="w-16 text-center border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={() => increment(item)}
                className="px-3 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition"
              >
                +
              </button>
            </div>
          </div>
        ))}
        <div className="text-center">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition shadow-md"
          >
            Submit Laundry
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLaundary;
