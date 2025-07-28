import React, { useState, useEffect } from "react";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  });
  const [laundryData, setLaundryData] = useState([]);

  useEffect(() => {
    axios
      .get(`${backendUrl}/home-laundry?date=${selectedDate}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .then((res) => {
        setLaundryData(res.data);
        console.log(laundryData);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [selectedDate]);

  const getClothesCount = (person) => {
    let total = 0;
    Object.entries(person).forEach(([key, value]) => {
      if (
        key !== "personName" &&
        key !== "createdAt" &&
        key !== "_id" &&
        key !== "__v" &&
        key !== "roomId" &&
        typeof value === "number"
      ) {
        total += value;
      }
    });
    return total;
  };

  const getTotalClothes = () => {
    return laundryData.reduce(
      (sum, person) => sum + getClothesCount(person),
      0
    );
  };

  const getCombinedSlip = () => {
    const combined = {};
    laundryData.forEach((entry) => {
      Object.entries(entry).forEach(([key, value]) => {
        if (
          typeof value === "number" &&
          key !== "_id" &&
          key !== "__v" &&
          key !== "roomId"
        ) {
          combined[key] = (combined[key] || 0) + value;
        }
      });
    });
    return combined;
  };

  const renderLaundryItems = (person) => {
    return Object.entries(person)
      .filter(
        ([key, value]) =>
          typeof value === "number" &&
          value > 0 &&
          !["__v", "_id"].includes(key)
      )
      .map(([key, value]) => (
        <li key={key} className="flex justify-between border-b py-1">
          <span className="capitalize">{key}</span>
          <span className="font-semibold">{value}</span>
        </li>
      ));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Laundry Records</h2>

      {/* Date Selector */}
      <div className="mb-6">
        <label htmlFor="date" className="mr-2 font-semibold">
          Select Date:
        </label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>

      {laundryData.length === 0 ? (
        <p className="text-gray-600">No laundry records found for this date.</p>
      ) : (
        <>
          {/* User Entries */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {laundryData.map((item, index) => {
              const total = getClothesCount(item);
              return (
                <div
                  key={index}
                  className="bg-white shadow rounded-xl p-4 border"
                >
                  <h3 className="text-xl font-bold mb-1">
                    {item.personName}{" "}
                    <span className="text-sm text-gray-500">
                      (Room: {item.roomId})
                    </span>
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                  <ul className="mb-2">{renderLaundryItems(item)}</ul>
                  <div className="text-blue-700 font-semibold mt-2">
                    Total: {total} clothes
                  </div>
                </div>
              );
            })}
          </div>

          {/* Day's Total */}
          <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-xl text-green-900 text-lg font-semibold text-center">
            Total Clothes Collected on {selectedDate}: {getTotalClothes()}
          </div>

          {/* Combined Laundry Slip */}
          <div className="mt-8 p-6 bg-white border shadow rounded-xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Combined Laundry Slip for {selectedDate}
            </h3>
            <ul className="space-y-2 mb-4">
              {Object.entries(getCombinedSlip())
                .filter(
                  ([key, value]) =>
                    value > 0 && key !== "createdAt" && key !== "personName"
                )
                .map(([key, value]) => (
                  <li
                    key={key}
                    className="flex justify-between border-b py-1 text-gray-700"
                  >
                    <span className="capitalize">{key}</span>
                    <span className="font-semibold">{value}</span>
                  </li>
                ))}
            </ul>

            {/* Combined total */}
            <div className="text-right font-bold text-lg text-blue-800 border-t pt-2">
              Total Clothes in Combined Slip:{" "}
              {Object.entries(getCombinedSlip())
                .filter(
                  ([key, value]) =>
                    value > 0 && key !== "createdAt" && key !== "personName"
                )
                .reduce((sum, [, value]) => sum + value, 0)}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
