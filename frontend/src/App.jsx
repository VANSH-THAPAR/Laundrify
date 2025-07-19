import { useState } from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter , Routes, Route, Link } from 'react-router-dom';
import AddLaundary from './pages/AddLaundary';
import Home from './pages/Home';

function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path = '/' element={<Home/>}  />
          <Route path = '/addLaundary' element={<AddLaundary/>}  />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App