import { useState, useEffect } from 'react';
import { Post } from "../components/Post";
import { Home } from "./Home";
import { AddTask } from './AddTask';
import './LogedInAdmin.css';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

function LogedInAdmin() {
  const [showPost, setShowPost] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    // eslint-disable-next-line no-unused-vars
    window.onpopstate = function (event) {
       history.go(1);
   }
  }, []);

  const handleShowPost = () => {
    setShowPost(prevShowPost => !prevShowPost);
  };

  return (
    <div className='bg-gradient-to-r from-slate-100 to-slate-400 w-screen flex items-center justify-center scroll-smooth'>
      <div>
        <Navbar />
        <Home />
        <button 
          className='py-2.5 px-5 ml-[275px] me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
          onClick={handleShowPost}
        >
          Add a user
        </button>
        {showPost && <Post />}
        <AddTask />
      </div>
    </div>
  );
}

export default LogedInAdmin;