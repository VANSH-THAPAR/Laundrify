import { useState } from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddLaundary from './pages/AddLaundary';
import DisplayLaundary from './pages/DisplayLaundary';
import SignUp from './pages/SignUp';
import ProtectedRoute from "./components/ProtectedRoute";
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="pt-18">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/displayLaundary' element={
            <ProtectedRoute>
              <DisplayLaundary />
            </ProtectedRoute>
          } />
          <Route path='/addLaundary' element={
            <ProtectedRoute>
              <AddLaundary />
            </ProtectedRoute>
          } />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;