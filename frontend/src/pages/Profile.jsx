// src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaUserCircle, 
  FaEnvelope, 
  FaHome, 
  FaCheckCircle, // Use this for 'Received'
  FaClock,       // Use this for 'Pending'
  FaExclamationCircle,
  FaSignOutAlt,
  FaSpinner
} from 'react-icons/fa';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [laundryHistory, setLaundryHistory] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      const token = localStorage.getItem('jwt');
      if (!token) {
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      try {
        const [profileResponse, laundryResponse] = await Promise.all([
          axios.get(`${backendUrl}/me`, config),
          axios.get(`${backendUrl}/profile-laundry`, config)
        ]);
        
        setUser(profileResponse.data);
        setLaundryHistory(laundryResponse.data);
        setError(null);

      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError('Failed to load profile data. Please try again.');
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('jwt');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center bg-gray-100">
        <FaSpinner className="animate-spin text-red-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Column 1: User Details Card (Unchanged) */}
        <div className="lg:col-span-1">
           <div className="bg-white rounded-2xl shadow-xl p-6 relative">
            <button 
              onClick={handleLogout}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
              title="Logout"
            >
              <FaSignOutAlt size={20} />
            </button>
            <div className="flex flex-col items-center">
              <FaUserCircle className="text-gray-300 mb-4" size={100} />
              <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: "Bebas Neue" }}>
                {user?.name}
              </h2>
              <div className="mt-4 w-full space-y-3 text-left">
                <p className="flex items-center text-gray-600" style={{ fontFamily: "Poppins" }}>
                  <FaEnvelope className="mr-3 text-red-600" />
                  {user?.email}
                </p>
                <p className="flex items-center text-gray-600" style={{ fontFamily: "Poppins" }}>
                  <FaHome className="mr-3 text-red-600" />
                  Room: <span className="font-semibold ml-1">{user?.roomId}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Laundry History */}
        <div className="lg:col-span-2">
          
          <h1 
            className="text-4xl font-bold text-red-700 mb-6" 
            style={{ fontFamily: "Bebas Neue" }}
          >
            Your Laundry History
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {!isLoading && !error && laundryHistory.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                No Laundry History Found
              </h3>
              <p className="text-gray-500 mb-6">
                You haven't added any laundry yet.
              </p>
              <Link
                to="/addLaundary"
                className="inline-block px-6 py-3 rounded-lg text-white bg-red-600 hover:bg-red-700 transition"
              >
                Add New Laundry
              </Link>
            </div>
          )}
          
          <div className="space-y-4">
            {/* ✅ MODIFICATION: Pass the index to determine status */}
            {laundryHistory.map((laundry, index) => {
              // The first item (index 0) is Pending, all others are Received.
              const status = (index === 0) ? "Pending" : "Received";
              
              return (
                <LaundryCard 
                  key={laundry._id} 
                  laundry={laundry} 
                  statusToShow={status} // Pass the calculated status as a prop
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ✅ FIXED: LaundryCard Component ---
// This card now uses the 'statusToShow' prop
const LaundryCard = ({ laundry, statusToShow }) => {
  // We no longer get 'status' from 'laundry'
  const { createdAt } = laundry;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formatLabel = (key) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  };
  
  const itemsArray = Object.entries(laundry)
    .filter(([key, value]) => 
      typeof value === 'number' && 
      value > 0 && 
      !['_id', 'roomId', '__v', 'userId'].includes(key) && // Added userId to filter
      key !== 'data'
    )
    .map(([key, value]) => ({ 
      name: formatLabel(key), 
      quantity: value 
    }));

  const totalItems = itemsArray.reduce((acc, item) => acc + item.quantity, 0);

  // ✅ MODIFICATION: Simplified status logic
  // Determine icon and color based on the prop
  const isReceived = statusToShow === 'Received';
  
  const StatusIcon = isReceived ? FaCheckCircle : FaClock;
  const statusColor = isReceived ? 'text-green-500' : 'text-yellow-500';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 transition hover:shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <div>
          <p className="text-sm font-medium text-gray-500">{formattedDate}</p>
          <p className="text-xl font-semibold text-gray-800 mt-1">
            Laundry: {totalItems} items
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {itemsArray.map(item => `${item.quantity}x ${item.name}`).join(', ')}
          </p>
        </div>
        
        {/* ✅ MODIFICATION: Display the status from the prop */}
        <div className={`flex items-center font-semibold text-lg ${statusColor} mt-4 sm:mt-0`}>
          <StatusIcon className="mr-2" />
          <span>{statusToShow}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;