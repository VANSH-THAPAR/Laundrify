// import { useState } from 'react'
// import Navbar from './components/Navbar'
// import { BrowserRouter , Routes, Route, Link } from 'react-router-dom';
// import AddLaundary from './pages/AddLaundary';
// import DisplayLaundary from './pages/DisplayLaundary';
// import SignUp from './pages/SignUp';
// import ProtectedRoute from "./components/ProtectedRoute";
// import Home from './pages/Home';

// function App() {

//   return (
//     <>
//       <BrowserRouter>
//       {/* <div className='pt-20'> */}
//         <Navbar/>
//       {/* </div> */}
//         <Routes>
//           <Route path='/' element={
//             <Home/>
//           } />
//           <Route path = '/displayLaundary' element={
//             <ProtectedRoute>
//               <DisplayLaundary/>
//             </ProtectedRoute>
//             }  />
//           <Route path = '/addLaundary' element={
//             <ProtectedRoute>
//               <AddLaundary/>
//             </ProtectedRoute>
//             }  />
//           <Route path = '/signup' element={<SignUp/>}  />
//         </Routes>
//       </BrowserRouter>
//     </>
//   )
// }

// export default App
import { useState } from 'react';
import Navbar from './components/Navbar'; // Make sure this path is correct
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddLaundary from './pages/AddLaundary';
import DisplayLaundary from './pages/DisplayLaundary';
import SignUp from './pages/SignUp';
import ProtectedRoute from "./components/ProtectedRoute";
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      {/* 1. The Navbar is rendered here, outside the padded area. */}
      <Navbar />

      {/* 2. This <main> tag holds all your page content.
         The pt-20 class pushes everything inside it down,
         creating space for the fixed navbar above. */}
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
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;