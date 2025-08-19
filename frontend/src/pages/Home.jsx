import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Droplets, Truck, CheckCircle } from 'lucide-react';

// --- SVG Icons for a polished look without extra libraries ---
const WashingMachineIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
    <path d="M12 12v8" />
    <path d="M16 16.5c0 1.38-1.12 2.5-2.5 2.5S11 17.88 11 16.5" />
    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
  </svg>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
    <div className="flex items-center justify-center h-16 w-16 mb-4 bg-red-100 rounded-full">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Poppins" }}>{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Home = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* ===== Hero Section ===== */}
      <section className="relative bg-zinc-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black opacity-80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <h1 style={{ fontFamily: "Bebas Neue" }} className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-wider">
            Laundry Day, <span className="text-red-500">Simplified.</span>
          </h1>
          <p style={{ fontFamily: "Poppins" }} className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-300">
            Say goodbye to lost clothes and wasted time. Submit, track, and manage your hostel laundry effortlessly.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/addLaundary"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/track"
              className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 border-2 border-white"
            >
              Track Your Laundry
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 style={{ fontFamily: "Bebas Neue" }} className="text-4xl font-bold tracking-wider text-gray-800">How It Works</h2>
          <p style={{ fontFamily: "Poppins" }} className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            A simple three-step process to handle all your laundry needs.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Droplets className="h-8 w-8 text-red-500" />}
              title="1. Submit Your Bag"
              description="Easily select your clothes and quantities through our simple submission form. No more paper slips!"
            />
            <FeatureCard
              icon={<Truck className="h-8 w-8 text-red-500" />}
              title="2. Live Tracking"
              description="Know exactly where your laundry is. Get real-time updates from washing to ready for pickup."
            />
            <FeatureCard
              icon={<CheckCircle className="h-8 w-8 text-red-500" />}
              title="3. Easy Pickup"
              description="Receive a notification the moment your fresh, clean laundry is ready. It's that simple."
            />
          </div>
        </div>
      </section>

      {/* ===== Interactive Demo Section ===== */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <WashingMachineIcon />
          <h2 style={{ fontFamily: "Bebas Neue" }} className="text-4xl font-bold tracking-wider text-gray-800 mt-4">
            Never Lose a Sock Again
          </h2>
          <p style={{ fontFamily: "Poppins" }} className="mt-4 text-lg text-gray-600">
            Our digital tracking system ensures every item you submit is accounted for. Check the status of your laundry in real-time.
          </p>
          <div className="mt-8 p-6 bg-gray-100 rounded-xl shadow-inner">
            <div className="flex items-center justify-between text-left">
              <div>
                <p className="font-semibold text-gray-700">Your T-Shirt</p>
                <p className="text-sm text-gray-500">Status Update: 2 mins ago</p>
              </div>
              <div className="bg-green-200 text-green-800 font-bold text-sm px-3 py-1 rounded-full">
                WASHING
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* ===== Final CTA Section ===== */}
      <section className="bg-zinc-800 py-20 px-4 text-center text-white">
         <h2 style={{ fontFamily: "Bebas Neue" }} className="text-4xl font-bold tracking-wider">
            Ready for a Simpler Laundry Day?
          </h2>
          <p style={{ fontFamily: "Poppins" }} className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
            Create an account and submit your first laundry bag in minutes.
          </p>
          <Link
              to="/signup"
              className="mt-8 inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-10 rounded-lg text-lg transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Sign Up Now
            </Link>
      </section>
    </div>
  );
};

export default Home;
