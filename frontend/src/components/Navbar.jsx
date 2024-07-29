import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logout } from './LogOut';
import {RiMenu3Line, RiCloseLine} from 'react-icons/ri';
import './Navbar.css';

export const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const navigate = useNavigate();
  const moveOn = () => {
    navigate('/piechart');
  }
  const moveOnHome = () => {
    navigate('/loggedinadmin');
  }
  
  return (
    <div className='bg-black border-gray-200 dark:bg-gray-900 w-screen'>
  <div className='flex items-center justify-between p-4 max-w-screen-xl mx-auto'>
    <div className='flex items-center'>
      {!toggleMenu && (
        <RiMenu3Line
          color='#fff'
          size={27}
          onClick={() => setToggleMenu(true)}
          className='cursor-pointer'
        />
      )}
      <h1 className='text-white ml-4 logo' onClick={() => navigate('/loggedinadmin')}>Portal Logo</h1>
    </div>
    <div className='flex items-center'>
      <Logout />
    </div>
  </div>
  <div className={`navbar-menu-container ${toggleMenu ? 'active' : ''}`}>
    <div className='navbar-menu_container'>
      <RiCloseLine
        color='#000'
        size={24}
        onClick={() => setToggleMenu(false)}
        className='close-btn'
      />
      <div className='navbar-menu_container-links-sign'>
        <p className='text-white' onClick={() => moveOn()}>Dashboard</p>
        <p className='text-white' onClick={() => moveOnHome()} type='button'>Portal Home</p>
      </div>
    </div>
  </div>
</div>


  )
}