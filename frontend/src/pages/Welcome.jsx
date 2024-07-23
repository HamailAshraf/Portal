import { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { useForm } from 'react-hook-form';
import { UserContext } from '../context/UserContext';
//import LogedInAdmin from '../pages/LogedInAdmin';
import { useNavigate } from 'react-router-dom';
//import LogedIn from '../pages/LogedIn';
import './Welcome.css';

export const Welcome = () => {
  const { register, handleSubmit } = useForm();
 // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {setToken, setRole, setId, token } = useContext(UserContext);
  const navigate = useNavigate();
  //const [role, setRole] = useState(0);
  console.log("Token on Welcome: ", token);
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    if (storedToken && storedRole) {
      setToken(JSON.parse(storedToken));
      setRole(storedRole);
    }
  }, [setToken]);

  const onSubmit = async (data) => {
    try {
      const response = await Axios.post('http://localhost:3000/login', data);
      setToken(response.data.token);
      setRole(response.data.role_id);
      setId(response.data.id);
    //  setIsLoggedIn(true);
      localStorage.setItem('token', JSON.stringify(response.data.token));
      localStorage.setItem('role', response.data.role_id);
      localStorage.setItem('id', response.data.id);
      if (response.data.role_id === 1) {
        navigate('/loggedinadmin');
      } else {
        navigate('/loggedinuser');
      }
    } catch (error) {
      setErrorMessage('Wrong Username or Name');
      console.error('Error logging in:', error);
    }
  };

  // if (isLoggedIn) {
  //   return role === 1 ? <LogedInAdmin /> : <LogedIn />;
  // }

  return (
    <div className='relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 my-20 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10'>
      <div className='w-full'>
        <div className='text-center'>
          <h1 className='text-3xl font-semibold text-gray-900'>Welcome.</h1>
          <p className='mt-2 text-gray-500'>Sign in below to access your account</p>
        </div> 
        <div className='mt-5'>
          <form onSubmit={handleSubmit(onSubmit)} className='Form'>
            <div className='relative mt-6'>
              <input className='peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none' placeholder="Email" type='email' {...register("email")} />
              <label className='pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800'>Email Address</label>
            </div>
            <div className='relative mt-6'>
              <input className='peer peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none' placeholder="Password" type='password' {...register("password")} />
              <label className='pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800'>Password</label>
            </div>
            <div className='my-6'>
            <button className='w-full rounded-md bg-black px-3 py-4 text-white focus:bg-gray-600 focus:outline-none' type='submit'>Submit</button>
            </div>
          </form>
        </div>
        {errorMessage && <h1 className='ErrorMsg'>{errorMessage}</h1>}
      </div>
    </div>
  );
}
