import { useState, useEffect } from 'react';
import { UserContext } from './UserContext';

// eslint-disable-next-line react/prop-types
export const UserContextProvider = ({ children }) => {
    const [token, setToken] = useState('');
    const [role, setRole] = useState(0);
    const [id, setId] = useState(0);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        const storedId = localStorage.getItem('id');

        if (storedToken) {
            setToken(JSON.parse(storedToken));
        }
        if (storedRole) {
            setRole(Number(storedRole)); 
        }
        if (storedId) {
            setId(Number(storedId)); 
        }
    }, []);

    return (
        <UserContext.Provider value={{ token, setToken, role, setRole, id, setId }}>
            {children}
        </UserContext.Provider>
    );
};
