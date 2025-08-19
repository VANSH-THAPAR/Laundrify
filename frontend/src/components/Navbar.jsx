import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// --- SVG Icons (No external library needed) ---
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const UserIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const ProfileIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const LogoutIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const LoginIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>;
const AddLaundryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14m-7-7h14"/></svg>;
const DisplayLaundryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;


// --- Profile Dropdown Component (For Desktop) ---
const ProfileDropdown = ({ isLoggedIn, handleLogout, username }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const DropdownItem = ({ to, onClick, children, className = "" }) => {
        const content = <div className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${className}`}>{children}</div>;
        return to ? <NavLink to={to} onClick={() => setIsOpen(false)} className="w-full text-left text-gray-700 hover:bg-red-50">{content}</NavLink> : 
                    <button onClick={() => { onClick(); setIsOpen(false); }} className="w-full text-left text-gray-700 hover:bg-red-50">{content}</button>;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none text-white rounded-full p-2 hover:bg-zinc-700 transition"><UserIcon /></button>
            <div className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-20 text-black overflow-hidden transition-all duration-200 ease-in-out transform ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <NavLink to="/profile" className="block px-4 py-3 border-b hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(false)}>
                    <p className="text-sm font-semibold text-gray-800 truncate" style={{fontFamily: "Poppins"}}>
                        {isLoggedIn ? <>Hi, <span className="text-red-600">{username}</span></> : "Welcome!"}
                    </p>
                    <p className="text-xs text-gray-500" style={{fontFamily: "Poppins"}}>
                        {isLoggedIn ? "View your profile" : "Please sign in"}
                    </p>
                </NavLink>
                <div className="py-1" style={{fontFamily: "Poppins"}}>
                    {isLoggedIn ? (
                        <>
                            <DropdownItem to="/profile"><ProfileIcon className="text-red-600"/> My Profile</DropdownItem>
                            <DropdownItem onClick={handleLogout} className="font-medium text-red-600"><LogoutIcon className="text-red-600"/> Logout</DropdownItem>
                        </>
                    ) : (
                        <>
                            <DropdownItem to="/signup"><UserIcon className="w-5 h-5 text-red-600" /> Sign Up</DropdownItem>
                            <DropdownItem to="/login"><LoginIcon className="text-red-600"/> Login</DropdownItem>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("User");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkLoginStatus = () => {
        const token = localStorage.getItem("jwt");
        if (token) {
            setIsLoggedIn(true);
            try {
                const decoded = jwtDecode(token);
                setUsername(decoded.name || "User");
            } catch (error) {
                console.error("Invalid token:", error);
                setUsername("User");
            }
        } else {
            setIsLoggedIn(false);
            setUsername("User");
        }
    };

    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    const handleKeyDown = (e) => { if (e.key === 'Escape') setMenuOpen(false); };

    checkLoginStatus();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [location]);
  
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setMenuOpen(false);
    navigate('/signup');
  };

  const navLinkClass = ({ isActive }) =>
    `relative py-2 text-lg tracking-wider font-medium transition-colors duration-300 ease-in-out ${
      isActive ? 'text-red-600' : 'text-white hover:text-red-500'
    } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-red-600 after:transition-all after:duration-300 ${
      isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-4 py-3 text-2xl font-semibold transition-colors duration-200 w-full rounded-lg px-4 ${
      isActive ? 'text-red-600 bg-zinc-800' : 'text-gray-300 hover:bg-zinc-800 hover:text-white'
    }`;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 bg-zinc-900 transition-shadow duration-300 ease-in-out ${isScrolled ? 'shadow-lg' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex-shrink-0"><img src="/Logo.png" alt="Laundrify" className='h-12 w-auto' /></NavLink>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-10" style={{ fontFamily: "Bebas Neue" }}>
              <ul className="flex items-center space-x-10">
                <li><NavLink to="/addLaundary" className={navLinkClass}>Add Laundry</NavLink></li>
                <li><NavLink to="/displayLaundary" className={navLinkClass}>Display Laundry</NavLink></li>
              </ul>
              <ProfileDropdown isLoggedIn={isLoggedIn} handleLogout={handleLogout} username={username} />
            </nav>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none text-white z-[60] relative"><MenuIcon /></button>
            </div>
          </div>
        </div>
      </header>

      {/* --- Mobile Menu Bottom Sheet --- */}
      <div onClick={() => setMenuOpen(false)} className={`md:hidden fixed inset-0 bg-black z-30 transition-opacity duration-300 ${menuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`}></div>
      
      <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 shadow-2xl z-40 transition-transform duration-300 ease-in-out rounded-t-2xl border-t border-zinc-700 ${menuOpen ? 'transform translate-y-0' : 'transform translate-y-full'}`}>
        <div className="p-4">
            <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mb-4"></div>
            <div className="text-center mb-6">
                <h2 className="text-white text-xl font-semibold" style={{ fontFamily: "Poppins" }}>
                    {isLoggedIn ? <>Hi, <span className="text-red-500">{username}</span></> : "Welcome!"}
                </h2>
                <p className="text-sm text-gray-400" style={{fontFamily: "Poppins"}}>
                    {isLoggedIn ? "Manage your laundry" : "Please sign in to continue"}
                </p>
            </div>
            <ul className="flex flex-col items-center justify-center space-y-2" style={{ fontFamily: "Bebas Neue" }}>
                <li><NavLink to="/addLaundary" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}><AddLaundryIcon /> Add Laundry</NavLink></li>
                <li><NavLink to="/displayLaundary" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}><DisplayLaundryIcon /> Display Laundry</NavLink></li>
                <li className="w-full border-t border-zinc-700 my-2"></li>
                {isLoggedIn ? (
                    <>
                        <li><NavLink to="/profile" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}><ProfileIcon /> My Profile</NavLink></li>
                        <li>
                          <button 
                            onClick={handleLogout} 
                            className="flex items-center gap-4 py-3 text-2xl font-semibold transition-colors duration-200 w-full rounded-lg px-4 text-red-500 hover:bg-zinc-800 hover:text-red-400"
                          >
                            <LogoutIcon /> Logout
                          </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><NavLink to="/signup" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}><UserIcon className="w-6 h-6" /> Sign Up</NavLink></li>
                        <li><NavLink to="/login" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}><LoginIcon /> Login</NavLink></li>
                    </>
                )}
            </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
