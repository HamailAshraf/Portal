import Axios from 'axios';

export const getSearch = async (name, token) => {
    try {
      const response = await Axios.get(`http://localhost:3000/users/${name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Response', response.data);
      return response.data;
    } catch (error) {
      console.log("Error fetching data: ", error.message);
     
       throw error;
    }
};

// import { useContext, useState } from 'react';
// import Axios from 'axios';
// import { UserContext } from '../context/UserContext';
// import { useTokenHandler } from '../utils/TokenHandler';
// import { Navigate } from 'react-router-dom';
// export const getSearch = () => {
//   const [data, setData] = useState(null);
//   const [search, setSearch] = useState('');
//   const { token } = useContext(UserContext);
//   const { handleTokenExpiration } = useTokenHandler();
//   const [isError, setIsError] = useState(false);

//   const fetchData = async () => {
//     try {
//       const response = await Axios.get(`http://localhost:3000/users/${search}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log("At first data is:", data);
//       setData(response.data[0]);
//       console.log('Response:', response.data);
//       console.log('Data:', data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       handleTokenExpiration(error);
//       setIsError(true);
//     }
//   };
//   if (isError) {
//     return <Navigate to="/" replace={true} />
//  }
//   const handleSearch = () => {
//     fetchData();
//   };

  
//   return (
//     <div className='bg-gradient-to-r from-slate-100 to-slate-400 h-screen w-screen flex items-center justify-center scroll-smooth'>
//       <div className='relative flex justify-center my-20'>
//         <input
//           className='peer block min-h-[auto] h-10 w-30% rounded border-0 bg-transparent px-3 py-[0.32rem] border-2 border-black leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0'
//           placeholder='Search Id'
//           onChange={(e) => {
//             setSearch(e.target.value);
//           }}
//         />
//         <button className=' ml-2 py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700' onClick={handleSearch}>Search</button>
//       </div>
//       <div>
//         <h2 className='mb-6 text-lg font-normal text-black-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400'>First Name: {data?.first_name}</h2>
//         <h2 className='mb-6 text-lg font-normal text-black-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400'>Last Name: {data?.last_name}</h2>
//         <h2 className='mb-6 text-lg font-normal text-black-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400'>Email: {data?.email}</h2>
//         <h2 className='mb-6 text-lg font-normal text-black-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400'>Gender: {data?.gender}</h2>
//         <h2 className='mb-6 text-lg font-normal text-black-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400'>Job Title: {data?.job_title}</h2>
//       </div>
//   </div>
//   );
// };

