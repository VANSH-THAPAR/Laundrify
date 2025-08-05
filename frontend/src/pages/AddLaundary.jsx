import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AddLaundary = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, watch, reset, getValues } = useForm({
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
      scarves: 0, // Corrected from Scarves
    }
  });

  const allItems = watch();
  const laundryItems = Object.keys(allItems);

  const increment = (item) => {
    setValue(item, watch(item) + 1);
  };

  const decrement = (item) => {
    setValue(item, Math.max(0, watch(item) - 1));
  };

  const onSubmit = async (data) => {
    try {
      // Filter out items with a quantity of 0 before submitting
      const itemsToSubmit = Object.entries(data)
        .filter(([key, value]) => value > 0)
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});

      if (Object.keys(itemsToSubmit).length === 0) {
        alert("Please add at least one item to your laundry bag.");
        return;
      }

      const token = localStorage.getItem("jwt");
      const response = await axios.post(`${backendUrl}/handlelaundary`, itemsToSubmit, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Laundry submitted:", response.data);
      alert("Your laundry has been submitted successfully!");
      reset();
      navigate("/");
    } catch (err) {
      console.error("Error submitting laundry:", err);
      alert("Submission failed. Please try again.");
    }
  };

  const selectedItems = Object.entries(allItems).filter(([key, value]) => value > 0);
  const totalItems = selectedItems.reduce((total, [key, value]) => total + value, 0);

  const formatLabel = (key) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 style={{ fontFamily: "Bebas Neue" }} className="tracking-wider text-4xl sm:text-5xl font-semibold mb-8 text-center text-red-700">
          Add to Your Laundry Bag
        </h1>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4" style={{fontFamily: "Poppins"}}>Select Your Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {laundryItems.map((item) => (
                  <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <label className="w-1/2 text-gray-700 font-medium" style={{fontFamily: "Poppins"}}>{formatLabel(item)}</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => decrement(item)}
                        className="w-8 h-8 font-bold bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition flex items-center justify-center text-lg"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        {...register(item)}
                        value={watch(item)}
                        readOnly
                        className="w-16 text-center border border-gray-300 rounded-md py-1"
                      />
                      <button
                        type="button"
                        onClick={() => increment(item)}
                        className="w-8 h-8 font-bold bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition flex items-center justify-center text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-lg border sticky top-8">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4" style={{fontFamily: "Poppins"}}>Order Summary</h2>
                <div className="space-y-3 min-h-[150px]">
                  {selectedItems.length > 0 ? (
                    selectedItems.map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center text-gray-600">
                        <span className="font-medium">{formatLabel(key)}</span>
                        <span className="font-bold">x {value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-10">Your laundry bag is empty!</p>
                  )}
                </div>
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between items-center font-bold text-lg text-gray-800">
                    <span>Total Items</span>
                    <span>{totalItems}</span>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    style={{ fontFamily: "Poppins" }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition shadow-md font-semibold text-lg"
                  >
                    Submit Laundry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLaundary;