import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define setUser function to update the user state
let setUserFunction = null;

// Function to set the setUser function
export const setUser = (func) => {
    setUserFunction = func;
}

export const authenticate = (data, next) => {
    if (window !== 'undefined') {
        // console.log('authenticate', response)
        sessionStorage.setItem('token', JSON.stringify(data.token));
        sessionStorage.setItem('user', JSON.stringify(data.user));
        if (setUserFunction) {
            setUser(data.user);
        }
        
    }
    next();
};

export const getToken = () => {
    if (window !== 'undefined') {
        if (sessionStorage.getItem('token')) {
            return JSON.parse(sessionStorage.getItem('token'));
        } else {
            return false;
        }
    }
};

// access user name from session storage
export const getUser = () => {
    if (window !== 'undefined') {
        if (sessionStorage.getItem('user')) {
            return JSON.parse(sessionStorage.getItem('user'));
        } else {
            return false;
        }
    }
};

// remove token from session storage
export const logout = next => {
    if (window !== 'undefined') {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    }
    // next();
    window.location.reload();
};

export const errMsg = (message = '') => toast.error(message, {
    position: toast.POSITION.BOTTOM_CENTER
});
export const successMsg = (message = '') => toast.success(message, {
    position: toast.POSITION.BOTTOM_CENTER
});