import React from 'react'

const Navbar = () => {
  return (
    <div className='bg-zinc-800 text-white h-15 flex items-center'>
        <ul className='flex justify-evenly justify-items-center  min-w-screen' >
            <li>Home</li>
            <li>Complaint</li>
            <li>Laundrify</li>
            <li>Login</li>
            <li>Sign Up</li>
            <li>profile</li>
        </ul>
    </div>
  )
}

export default Navbar