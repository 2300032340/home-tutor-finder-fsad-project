import { useState } from 'react'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import TutorLoginPage from './components/TutorLoginPage';
import StudentLoginPage from './components/StudentLoginPage';
import TutorProfile from './components/TutorProfile';
import StudentRegistrationForm from './components/StudentRegistrationForm';
import TutorRegistrationForm from './components/TutorRegistrationForm';
import Home from './components/Home/Home';
import PostLists from './components/PostLists';
import CreatePostForm from './components/CreatePostForm';
import ProfilePage from './components/ViewTutorProfile';
import FindTutor from './components/FindTutor';

function App() {

  return (
    <Router>
      <ToastContainer />
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/tutor/login' element={<TutorLoginPage/>} />
        <Route path='/student/login' element={<StudentLoginPage/>} />
        <Route path='/student/registration' element={<StudentRegistrationForm/>}/>
        <Route path='/tutor/registration' element={<TutorRegistrationForm/>}/>
        <Route path='/profile' element={<TutorProfile/>} />
        <Route path='/post' element={<PostLists/>} />
        <Route path='/createpost' element={<CreatePostForm/>} />
        <Route path='/findTutor' element={<FindTutor/>} />
        <Route path="/tutor/viewprofile/:tutorId" element={<ProfilePage/>} />
      </Routes>
    </Router>
  )
}

export default App
