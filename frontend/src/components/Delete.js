import Axios from 'axios';
// import { useContext } from 'react';
// import { UserContext } from '../context/UserContext';

export const deleteUser = async (id, token) => {
  try {
    const response = await Axios.delete(`http://localhost:3000/users/${id}`, {
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



// import { useForm } from 'react-hook-form';
// import Axios from 'axios';
// import { useContext } from 'react';
// import { UserContext } from '../context/UserContext';


// //import { useState } from 'react';

// export const Delete = () => {
//   const {register, handleSubmit} = useForm();
//  // const [data, setData] = useState({});
//   const {token} = useContext(UserContext);
//   const onSubmiting = async (data) => {
//     try {
//         const response = await Axios.delete(`http://localhost:3000/users/${data.id}`,{
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//            console.log('Response', response.data);
//     }
//     catch(error){
//         console.log("Error fetching data: ", error.message);
//         }
//    }
//   return (
//     <div className='bg-gradient-to-r from-slate-100 to-slate-400 h-screen w-screen flex items-center justify-center scroll-smooth'>
//       <form  className='relative flex justify-center my-20' onSubmit={handleSubmit(onSubmiting)}>
//           <p className='mb-6 text-lg font-normal text-black-500 lg:text-xl sm:px-6 xl:px-18 dark:text-gray-400'>Enter Id</p>
//           <input className='peer block min-h-[auto] h-10 w-30% rounded border-0 bg-transparent px-3 py-[0.32rem] border-2 border-black leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0' type='number' {...register("id")}/>
//           <input className=' ml-2 py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700' type='submit'/>
//         </form>
//     </div>
//   )
// }
