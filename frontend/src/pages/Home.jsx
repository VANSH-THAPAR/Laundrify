import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// NOTE FOR FONT AWESOME:
// Add this line to your public/index.html file inside the <head> section:
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// --- Child Component for Individual Laundry Cards ---
const LaundryCard = ({ item, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(item);
  const [isSaving, setIsSaving] = useState(false);

  const laundryItems = Object.keys(item).filter(key => typeof item[key] === 'number' && !["__v", "_id", "roomId"].includes(key));

  const handleQuantityChange = (itemName, amount) => {
    setEditedData(prevData => ({
      ...prevData,
      [itemName]: Math.max(0, (prevData[itemName] || 0) + amount),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.put(`${backendUrl}/laundry/${item._id}`, editedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdate(response.data.data); // Update the parent state with the new data
      setIsEditing(false);
      alert("Entry updated successfully!");
    } catch (err) {
      console.error("Error updating laundry entry:", err);
      alert("Failed to update entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData(item); // Revert any changes
    setIsEditing(false);
  };
  
  const formatLabel = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  const getClothesCount = (person) => Object.values(person).reduce((sum, value) => (typeof value === 'number' ? sum + value : sum), 0);

  // --- Display View ---
  if (!isEditing) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-5 border flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{item.personName}</h3>
            <p className="text-sm text-gray-500">Room: {item.roomId}</p>
          </div>
          <div className="flex items-center gap-4 text-lg">
            <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-blue-600 transition"><i className="fas fa-edit"></i></button>
            <button onClick={() => onDelete(item._id)} className="text-gray-500 hover:text-red-600 transition"><i className="fas fa-trash-alt"></i></button>
          </div>
        </div>
        <ul className="flex-grow space-y-1 mb-3">
          {Object.entries(item).filter(([key, value]) => typeof value === "number" && value > 0 && !["__v", "_id", "roomId"].includes(key)).map(([key, value]) => (
            <li key={key} className="flex justify-between text-sm text-gray-600 border-b py-1">
              <span className="capitalize">{formatLabel(key)}</span>
              <span className="font-semibold">{value}</span>
            </li>
          ))}
        </ul>
        <div className="border-t pt-3 mt-auto">
          <div className="flex justify-between items-center text-red-700 font-bold text-lg">
            <span>Total Items:</span>
            <span>{getClothesCount(item)}</span>
          </div>
        </div>
      </div>
    );
  }

  // --- Edit View ---
  return (
    <div className="bg-white shadow-2xl rounded-xl p-5 border-2 border-blue-500 flex flex-col ring-4 ring-blue-200">
      <h3 className="text-xl font-bold text-gray-800 mb-3">{item.personName} (Editing)</h3>
      <div className="flex-grow space-y-2 mb-4 overflow-y-auto max-h-64 pr-2">
        {laundryItems.map(itemName => (
          <div key={itemName} className="flex justify-between items-center">
            <span className="capitalize text-sm text-gray-600">{formatLabel(itemName)}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => handleQuantityChange(itemName, -1)} className="w-7 h-7 font-bold bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition flex items-center justify-center text-lg">−</button>
              <span className="w-10 text-center font-semibold">{editedData[itemName]}</span>
              <button onClick={() => handleQuantityChange(itemName, 1)} className="w-7 h-7 font-bold bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition flex items-center justify-center text-lg">+</button>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t pt-3 mt-auto flex gap-3">
        <button onClick={handleSave} disabled={isSaving} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition shadow-md disabled:bg-gray-400">
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        <button onClick={handleCancel} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition">
          Cancel
        </button>
      </div>
    </div>
  );
};


// --- Main Home Component ---
const Home = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [laundryData, setLaundryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLaundryData();
  }, [selectedDate]);

  const fetchLaundryData = () => {
    setIsLoading(true);
    axios
      .get(`${backendUrl}/home-laundry?date=${selectedDate}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      })
      .then((res) => setLaundryData(res.data))
      .catch((err) => {
        console.error("Error fetching laundry data:", err);
        setLaundryData([]);
      })
      .finally(() => setIsLoading(false));
  };

  const dailySummary = useMemo(() => {
    const combined = {};
    let totalCount = 0;
    laundryData.forEach((entry) => {
      Object.entries(entry).forEach(([key, value]) => {
        if (typeof value === "number" && !["__v", "_id", "roomId"].includes(key)) {
          combined[key] = (combined[key] || 0) + value;
          totalCount += value;
        }
      });
    });
    const slipItems = Object.entries(combined).filter(([, value]) => value > 0);
    return { slipItems, totalCount };
  }, [laundryData]);

  const handleDelete = async (laundryId) => {
    if (window.confirm("Are you sure you want to delete this laundry entry?")) {
      try {
        setLaundryData(laundryData.filter((item) => item._id !== laundryId)); // Optimistic UI update
        await axios.delete(`${backendUrl}/laundry/${laundryId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        alert("Entry deleted successfully!");
      } catch (err) {
        console.error("Error deleting laundry entry:", err);
        alert("Failed to delete entry. Please try again.");
        fetchLaundryData(); // Re-fetch data to revert optimistic update on error
      }
    }
  };

  const handleUpdate = (updatedItem) => {
    setLaundryData(laundryData.map(item => item._id === updatedItem._id ? updatedItem : item));
  };
  
  const formatLabel = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b">
          <h1 style={{ fontFamily: "Bebas Neue" }} className="tracking-wider text-4xl font-semibold text-red-700 mb-4 sm:mb-0">
            Laundry Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <label htmlFor="date" className="font-semibold text-gray-700">Select Date:</label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </header>

        {isLoading ? (
          <p className="text-center text-gray-500 text-lg">Loading records...</p>
        ) : laundryData.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-xl shadow-md border">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Laundry Found</h2>
            <p className="text-gray-500 mb-6">There are no laundry records for the selected date.</p>
            <button
              onClick={() => navigate('/addLaundary')}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition shadow-md"
            >
              Add New Laundry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {laundryData.map((item) => (
                <LaundryCard key={item._id} item={item} onUpdate={handleUpdate} onDelete={handleDelete} />
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-lg border sticky top-8">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">Daily Summary</h2>
                <ul className="space-y-2 mb-4">
                  {dailySummary.slipItems.map(([key, value]) => (
                    <li key={key} className="flex justify-between border-b py-1 text-gray-700">
                      <span className="capitalize">{formatLabel(key)}</span>
                      <span className="font-semibold">{value}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-right font-bold text-lg text-blue-800 border-t pt-2">
                  Total Clothes for the Day: {dailySummary.totalCount}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;