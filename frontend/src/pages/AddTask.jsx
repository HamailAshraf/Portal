import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Axios from 'axios';
import { UserContext } from "../context/UserContext";
import '../components/DropDown.css';
//import { DropDown } from "../components/DropDown";
// import { useNavigate } from 'react-router-dom';
// import { deleteUser } from "../components/Delete";
//import { addTask } from "../components/AddTaskId";

export const AddTask = () => {
    const [data, setData] = useState([]);
    const [isActive, setIsActive] = useState(false);
    const [id, setId] = useState(0);
    const { token } = useContext(UserContext);
    const {register, handleSubmit} = useForm();
   // const { role } = useContext(UserContext);

    const fetchData = async () => {
        try {
            const response = await Axios.get('http://localhost:3000/users/tasksshow', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(response.data);
        } catch (error) {
            console.log("Error fetching data2: ", error.message);
        }
    };
    

    const handleSearch = async (formData) => {
        try {
            const response = await Axios.patch(`http://localhost:3000/users/updatetask/${id}`, {
                task_name: formData.task, 
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Response', response.data);
            console.log('Form Submitted');
            fetchData();
            return response.data;
        } catch (error) {
            console.error("Error updating task:", error.message);
            throw error;
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    return (
        
        <div className="relative overflow-x-auto">
            <div className='max-w-md mx-auto'>
            <form className="flex items-center space-x-2" onSubmit={handleSubmit(handleSearch)}>
                <label>Task Name</label>
                <input 
                    className="flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 mb-2 dark:focus:border-blue-500"
                     type="text" 
                     // eslint-disable-next-line no-unused-vars
                     onClick={(e) => setIsActive(!isActive)}
                     {...register("task")}/>
                <input className='py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 mb-2 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700' type="submit" />
                <div className="dropdown">
                {isActive && (
                    <div className="dropdown-content">
                            {data.map((user) => ( 
                                // eslint-disable-next-line no-unused-vars
                                <div key={user.id} className="dropdown-item" onClick={(e) => {
                                    setId(user.id);
                                    console.log(user.id)}}>
                                {user.name}
                                
                                </div>))}
                    </div>
                    )}
                </div>
            </form>
            </div>
            {/* <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Task</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((user) => (
                        <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.id}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.name}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.task_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table> */}
            </div>
        
    );
};