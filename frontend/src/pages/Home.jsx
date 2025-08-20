import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const DigitalSlipIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const RoommateSyncIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M12 8v4l2 2"/></svg>;


const HeroSection = ({ isLoggedIn }) => (
  <section className="relative bg-zinc-900 text-white overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black opacity-80"></div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
      <h1 style={{ fontFamily: "Bebas Neue" }} className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-wider">
        Hostel Laundry, <span className="text-red-500">Solved.</span>
      </h1>
      <p style={{ fontFamily: "Poppins" }} className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-300">
        Stop the laundry chaos. Combine slips with roommates, track every item, and never lose a sock again.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to={isLoggedIn ? "/addLaundary" : "/signup"}
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Get Started
        </Link>
        <Link
          to={isLoggedIn ? "/displayLaundary" : "/signup"}
          className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 border-2 border-white"
        >
          Display Laundry
        </Link>
      </div>
    </div>
  </section>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 text-left">
    <div className="flex items-center justify-center h-16 w-16 mb-5 bg-red-100 rounded-full">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Poppins" }}>{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const FeaturesSection = () => (
  <section className="py-20 px-4 bg-gray-50">
    <div className="max-w-7xl mx-auto text-center">
      <h2 style={{ fontFamily: "Bebas Neue" }} className="text-4xl font-bold tracking-wider text-gray-800">The End of Laundry Headaches</h2>
      <p style={{ fontFamily: "Poppins" }} className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
        Laundrify is built to solve the real problems of hostel laundry.
      </p>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<DigitalSlipIcon />}
          title="Effortless Digital Slips"
          description="Ditch the paper. Submit your laundry items digitally in seconds right from your phone. It's fast, easy, and accurate."
        />
        <FeatureCard
          icon={<RoommateSyncIcon />}
          title="Smart Roommate Sync"
          description="Automatically combine laundry slips with your roommates. One submission for the whole room, making it easy to manage shared laundry."
        />
        <FeatureCard
          icon={<HistoryIcon />}
          title="Never Lose a Garment"
          description="Every item is tracked. View your complete laundry history and totals in your personal profile to stay organized."
        />
      </div>
    </div>
  </section>
);

const InteractiveDemoSection = () => (
  <section className="bg-white py-20 px-4">
    <div className="max-w-4xl mx-auto text-center">
      <h2 style={{ fontFamily: "Bebas Neue" }} className="text-4xl font-bold tracking-wider text-gray-800 mt-4">
        No More "Whose Shirt Is This?"
      </h2>
      <p style={{ fontFamily: "Poppins" }} className="mt-4 text-lg text-gray-600">
        Our combined slip feature gives you a clear, itemized list for the entire room, ensuring everything is accounted for.
      </p>
      <div className="mt-8 p-6 bg-gray-100 rounded-xl shadow-inner text-left">
        <h4 className="font-bold text-lg mb-4 text-gray-700">Room 201 - Combined Slip</h4>
        <div className="space-y-2">
            <div className="flex justify-between p-3 bg-white rounded-md"><span>T-Shirts</span><span className="font-bold">5</span></div>
            <div className="flex justify-between p-3 bg-white rounded-md"><span>Jeans</span><span className="font-bold">3</span></div>
            <div className="flex justify-between p-3 bg-white rounded-md"><span>Towels</span><span className="font-bold">4</span></div>
        </div>
        <div className="text-right mt-4 font-bold text-red-600 text-lg border-t pt-3">
            Total Items: 12
        </div>
      </div>
    </div>
  </section>
);

const CallToActionSection = () => (
  <section className="bg-zinc-800 py-20 px-4 text-center text-white">
     <h2 style={{ fontFamily: "Bebas Neue" }} className="text-4xl font-bold tracking-wider">
        Ready for Stress-Free Laundry?
      </h2>
      <p style={{ fontFamily: "Poppins" }} className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
        Create an account and take control of your laundry today.
      </p>
      <Link
          to="/signup"
          className="mt-8 inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-10 rounded-lg text-lg transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Sign Up Now
        </Link>
  </section>
);

// --- Main Home Component ---
const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="bg-gray-50 text-gray-800">
      <HeroSection isLoggedIn={isLoggedIn} />
      <FeaturesSection />
      <InteractiveDemoSection />
      <CallToActionSection />
    </div>
  );
};

export default Home;
