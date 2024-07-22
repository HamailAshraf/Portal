import Axios from 'axios';

export const addTask = async (id, updatedData, token) => {
    try {
        const response = await Axios.patch(`http://localhost:3000/users/updatetask/${id}`, {
            task_name: updatedData.task, 
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('Response', response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating task:", error.message);
        throw error;
    }
};
