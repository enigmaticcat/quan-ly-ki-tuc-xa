// front-end/src/context/AppContext.jsx
import { createContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';

export const AppContext = createContext(null);

const AppContextProvider = (props) => {
    const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));
    const [currentUser, setCurrentUser] = useState(() => {
        const userStr = localStorage.getItem('currentUser');
        try {
            return userStr ? JSON.parse(userStr) : null;
        } catch (parseError) { // Đổi tên biến 'e' thành 'parseError' hoặc dùng // eslint-disable-next-line no-unused-vars
            console.error("Failed to parse currentUser from localStorage on init:", parseError);
            return null;
        }
    });

    useEffect(() => {
        const handleStorageChange = (event) => { // Thêm 'event' nếu bạn muốn kiểm tra event.key
            if (event.key === 'userToken' || event.key === 'currentUser') { // Chỉ cập nhật nếu key liên quan thay đổi
                setUserToken(localStorage.getItem('userToken'));
                const userStr = localStorage.getItem('currentUser');
                try {
                    setCurrentUser(userStr ? JSON.parse(userStr) : null);
                } catch (parseError) { // Đổi tên biến 'e' thành 'parseError'
                    console.error("Failed to parse currentUser from localStorage on storage event:", parseError);
                    setCurrentUser(null);
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    
    const login = (userData, token) => {
        localStorage.setItem('userToken', token);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        setUserToken(token);
        setCurrentUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('currentUser');
        setUserToken(null);
        setCurrentUser(null);
    };

    const contextValue = {
        userToken,
        currentUser,
        login,
        logout,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
};

AppContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppContextProvider;