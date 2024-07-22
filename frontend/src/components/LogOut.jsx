import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export const Logout = () => {
    const navigate = useNavigate();
    const {setToken, setRole, setId, token} = useContext(UserContext);
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('id');

        setToken('');
        setRole(0);
        setId(0);

        navigate('/login');
    };
    //console.log('token is cleared: ', token);
    // useEffect(() => {
    //     handleLogout();
    // }, [navigate]);

    return (
        <div>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={handleLogout}>Log Out</button>
        </div>
    );
};
