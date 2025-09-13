import './App.css'
import { Routes, Route, Navigate } from 'react-router'

import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import useAuthUser from './hooks/useAuthUser.js';
import HomePage from './pages/HomePage.jsx';
import PageLoader from './components/PageLoader.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  

  if (isLoading) return <PageLoader/>;

  return (
     <div className="h-screen">
      <ToastContainer style={{ zIndex: 9999 }} position="top-right" autoClose={3000} />
       <Routes>
         <Route path="/" element={ isAuthenticated ? <HomePage/> : <Navigate to="/login"/> }/> 

         <Route path="/login" element={ !isAuthenticated ? <LoginPage/> : <Navigate to="/"/> }/> 
         <Route path="/register" element={ !isAuthenticated ? <RegisterPage/> : <Navigate to="/"/> }/> 

         <Route path="/profile" element={ isAuthenticated ? <ProfilePage/> : <Navigate to="/"/> }/> 

      </Routes>
     </div>
  )
}

export default App
