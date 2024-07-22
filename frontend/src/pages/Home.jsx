import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Axios from 'axios';
import { UserContext } from "../context/UserContext";
import { useNavigate } from 'react-router-dom';
import { deleteUser } from "../components/Delete";
import { getSearch } from "../components/GetSearch";

export const Home = () => {
    const [data, setData] = useState([]);
    const { token } = useContext(UserContext);
    const navigate = useNavigate();
    const {register, handleSubmit} = useForm();
    const { role } = useContext(UserContext);

    const fetchData = async () => {
        try {
            if (!token) {
                console.error("No token found");
                return;
            }
            const response = await Axios.get('http://localhost:3000/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Token in try: ", token);
            setData(response.data);
        } catch (error) {
            console.log("Error fetching data: ", error.message);
            console.log("Token in error: ", token);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteUser(id, token);
            setData(data.filter(user => user.id !== id));
        } catch (error) {
            console.log("Error deleting user: ", error.message);
        }
    };

    const handleSearch = async (formData) => {
        try {
            if (!formData.name || formData.name.length < 3) {
                fetchData();
                return;
            }
            console.log(formData);
            const userData = await getSearch(formData.name, token);
            setData(userData ? userData.map(item => ({ ...item })) : []); 
        } catch (error) {
            console.log("Error Fetching user: ", error.message);
        }
    };

    useEffect(() => {
        if(token){
            fetchData();
        }
    }, [token]);

    useEffect(() => {
        console.log('Stored Token 1:', localStorage.getItem('token'));
        console.log('Stored Role:', localStorage.getItem('role'));
        console.log('Stored Id:', localStorage.getItem('id'));
      }, []);
      
    return (
        
        <div className="mx-21 relative overflow-x-auto pt-5">
            <div className='max-w-md mx-auto'>
            <form className="flex items-center space-x-2" onChange={handleSubmit(handleSearch)}>
                <input className="flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 mb-2 dark:focus:border-blue-500" type="text" {...register("name")}/>
                {/* <input className='py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 mb-2 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700' type="submit" /> */}
            </form>
            </div>
            <div className="flex justify-center">
            <table className="w-50% rounded text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs w-full text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">First Name</th>
                        <th className="px-6 py-3">Last Name</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Gender</th>
                        <th className="px-6 py-3">Job Title</th>
                        {role === 1 && (<th className="px-6 py-3">Actions</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map((user) => (
                        <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.id}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.first_name}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.last_name}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.email}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.gender}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.job_title}</td>
                            {role === 1 && (<td>
                                <div className="flex space-x-2">
                                    <button
                                        className="text-blue-600 hover:underline"
                                        onClick={() => navigate(`/patch/${user.id}`)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="text-red-600 hover:underline"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
        
    );
};



// export const Home = () => {
//     //const [data] = CustomReactQuery('/api/users');
//     const [data, setData] = useState([]);
//    // const [loading, setLoading] = useState(false);
//    const {token} = useContext(UserContext);
   
//    const fetchData = async () => {
//     try {
//         const response = await Axios.get('http://localhost:3000/users', {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//             setData(response.data);
//     }
//     catch(error){
//         console.log("Error fetching data: ", error.message);
//         }
//    }


//     useEffect(() => {
//         fetchData();
//       }, []);
      
//       const memoizedData = useMemo(() => data, [data]);
      
//       const columns = useMemo(() => [
//         {
//             Header: "Id",
//             accessor: "id",
//         },
//         {
//             Header: "Name",
//             accessor: "name",
//         },
//         {
//             Header: "Email",
//             accessor: "email",
//         },
//         {
//             Header: "First Name",
//             accessor: "first_name",
//         },
//         {
//             Header: "Last Name",
//             accessor: "last_name",
//         },
//         {
//             Header: "Gender",
//             accessor: "gender",
//         },
//         {
//             Header: "Job Title",
//             accessor: "job_title",
//         },
//         {
//             Header: "Role Id",
//             accessor: "role_id",
//         },
//         {
//             Header: "Actions",
//             // eslint-disable-next-line react/prop-types
//             Cell: (
//                 <div className="flex space-x-2">
//                     <button
//                         className="text-blue-600 hover:underline"

//                     >
//                         Update
//                     </button>
//                     <button
//                         className="text-red-600 hover:underline"
//                     >
//                         Delete
//                     </button>
//                 </div>
//             ),
//         },
//       ], []);
      
//       const { getTableBodyProps, getTableProps, headerGroups, rows, prepareRow} = useTable({columns, data: memoizedData});
      
//       return (
//         <div className="relative overflow-x-auto">
//         <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" {...getTableProps()}>
//             <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//                 {headerGroups.map((headerGroup) => (
//                     <tr {...headerGroup.getHeaderGroupProps()}>
//                         {headerGroup.headers.map((column) => (
//                             <th className="px-6 py-3" {...column.getHeaderProps()}>
//                                 {column.render("Header")}
//                             </th>
//                         ))}
//                     </tr>
//                 ))}
//             </thead>
//             <tbody {...getTableBodyProps()}>
//                 {rows.map((row) => {
//                     prepareRow(row);
//                     return (
//                         <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" {...row.getRowProps()}>
//                             {row.cells.map((cell) => (
//                                 <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" {...cell.getCellProps()}>
//                                     {cell.render("Cell")}
//                                 </td>
//                             ))}
//                         </tr>
//                     );
//                 })}
//             </tbody>
//         </table>
//         </div>
//       );
// }

