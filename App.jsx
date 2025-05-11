import { useState } from 'react'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './components/Home';

function App() {

  return (
    <>
      <Router>
        <ToastContainer />
        <Navbar />
          <Routes>
            <Route path='/' element={<Home/>}/>
          </Routes>
      </Router>
    </>
  )
}

export default App
