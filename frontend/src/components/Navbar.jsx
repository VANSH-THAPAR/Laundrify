import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-zinc-900 to bg-zinc-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-400 hover:text-indigo-500 transition">
          <img src="/Logo.png" alt="Laundrify" className='h-10 w-auto' />
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-8 text-xl font-medium"  style={{ fontFamily: "Bebas Neue" }}>
          <li><Link to="/addLaundary" className="hover:text-red-500">Add Laundry</Link></li>
          <li><Link to="/signup" className="hover:text-red-500">Sign Up</Link></li>
          <li><Link to="/track" className="hover:text-red-500">Track</Link></li>
          <li><Link to="/dummy" className="hover:text-red-500">Dummy</Link></li>
        </ul>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <ul className="md:hidden px-4 pb-4 space-y-4 text-xl font-medium bg-zinc-900" style={{ fontFamily: "Bebas Neue" }}>
          <li><Link to="/addLaundary" className="block hover:text-indigo-400" onClick={() => setMenuOpen(false)}>Add Laundry</Link></li>
          <li><Link to="/signup" className="block hover:text-indigo-400" onClick={() => setMenuOpen(false)}>Sign Up</Link></li>
          <li><Link to="/track" className="block hover:text-indigo-400" onClick={() => setMenuOpen(false)}>Track</Link></li>
          <li><Link to="/dummy" className="block hover:text-indigo-400" onClick={() => setMenuOpen(false)}>Dummy</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
