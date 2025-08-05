import { useState } from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter , Routes, Route, Link } from 'react-router-dom';
import AddLaundary from './pages/AddLaundary';
import Home from './pages/Home';
import SignUp from './pages/SignUp';

function App() {

  return (
    <>
      <BrowserRouter>
      <div className='pt-20'>
        <Navbar/>
      </div>
        <Routes>
          <Route path = '/' element={<Home/>}  />
          <Route path = '/addLaundary' element={<AddLaundary/>}  />
          <Route path = '/signup' element={<SignUp/>}  />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App