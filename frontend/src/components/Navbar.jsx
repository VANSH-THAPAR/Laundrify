import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

// --- SVG Icons (No external library needed) ---
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for JWT token on component mount
    const token = localStorage.getItem("jwt");
    setIsLoggedIn(!!token);

    // Add scroll listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setMenuOpen(false);
    navigate('/signup'); // Redirect to signup/login page after logout
  };

  const navLinkClass = ({ isActive }) =>
    `relative py-2 text-lg font-medium transition-colors duration-300 ease-in-out ${
      isActive ? 'text-red-500' : 'text-white hover:text-red-400'
    } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-red-500 after:transition-all after:duration-300 ${
      isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block py-3 text-xl font-medium transition-colors duration-200 ${
      isActive ? 'text-red-500' : 'text-white hover:text-red-400'
    }`;


  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 bg-zinc-900 transition-shadow duration-300 ease-in-out ${
        isScrolled || menuOpen ? 'shadow-lg' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <NavLink to="/" className="flex-shrink-0">
            <img src="/Logo.png" alt="Laundrify" className='h-12 w-auto' />
          </NavLink>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center space-x-10" style={{ fontFamily: "Bebas Neue" }}>
            <li><NavLink to="/addLaundary" className={navLinkClass}>Add Laundry</NavLink></li>
            <li><NavLink to="/track" className={navLinkClass}>Track</NavLink></li>
            <li><NavLink to="/dummy" className={navLinkClass}>Dummy</NavLink></li>
            {!isLoggedIn && (
              <li><NavLink to="/signup" className={navLinkClass}>Sign Up</NavLink></li>
            )}
            {isLoggedIn && (
              <li>
                <button 
                  onClick={handleLogout} 
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold transition"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none text-white">
              {menuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div 
        className={`md:hidden bg-zinc-900 overflow-hidden transition-all duration-500 ease-in-out ${
          menuOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <ul className="px-6 pb-6 space-y-3 text-center" style={{ fontFamily: "Bebas Neue" }}>
          <li><NavLink to="/addLaundary" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>Add Laundry</NavLink></li>
          <li><NavLink to="/track" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>Track</NavLink></li>
          <li><NavLink to="/dummy" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>Dummy</NavLink></li>
          {!isLoggedIn && (
            <li><NavLink to="/signup" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>Sign Up</NavLink></li>
          )}
          {isLoggedIn && (
            <li className="pt-4">
              <button 
                onClick={handleLogout} 
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold transition"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;