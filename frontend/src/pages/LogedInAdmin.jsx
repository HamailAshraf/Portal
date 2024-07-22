import { useState } from 'react';
import { Post } from "../components/Post";
import { Home } from "./Home";
import { AddTask } from './AddTask';
import { PieChart } from '../components/PieCHar';
import './LogedInAdmin.css';
import { Navbar } from '../components/Navbar';

function LogedInAdmin() {
  const [showPost, setShowPost] = useState(false);
    
  const handleShowPost = () => {
    {showPost ? setShowPost(false) : setShowPost(true);}
  };

  return (
    <div className='bg-gradient-to-r from-slate-100 to-slate-400 w-screen flex items-center justify-center scroll-smooth'>
      <div>
        <Navbar />
        <Home />
        <button className='py-2.5 px-5 ml-[275px] me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700' onClick={handleShowPost}>Add a user</button>
        {showPost && <Post />}
        <AddTask />
        <PieChart />
      </div>
    </div>
  );
}

export default LogedInAdmin;
