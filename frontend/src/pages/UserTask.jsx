import { useState, useContext, useEffect } from "react";
import Axios from 'axios';
import { UserContext } from "../context/UserContext";

export const UserTask = () => {
    const [data, setData] = useState([]);
    const { token, id } = useContext(UserContext);

    const fetchData = async () => {
        try {
            const response = await Axios.get(`http://localhost:3000/users/tasksshow/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(response.data);
        } catch (error) {
            console.log("Error fetching data: ", error.message);
        }
    };

    const handleComplete = async (taskId) => {
        try {
            const response = await Axios.patch(`http://localhost:3000/users/updatestate/${taskId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Response', response.data);
            console.log('Task Completed');
            fetchData();
        } catch (error) {
            console.error("Error updating task:", error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="usertask">
            <h2>Your tasks:</h2>
            {data.map((task) => (
                <div key={task.id}>
                    <p>{task.task_name}</p>
                    <button onClick={() => handleComplete(id)}>Completed?</button>
                </div>
            ))}
        </div>
    );
};
