import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DarkModeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const navigate = useNavigate()

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
        document.body.classList.toggle('dark-mode', !isDarkMode);
        localStorage.setItem('darkMode', !isDarkMode);
        navigate(0)
    };

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode') === 'true';
        if(savedMode) {
        document.body.classList.toggle('dark-mode', !isDarkMode);
        setIsDarkMode(savedMode);
        }
    }, []);

    return (
        <div className="toggle-container">
            <div className='title'>Dark Mode</div>
            <input 
                type="checkbox" 
                className="toggle-checkbox" 
                id="toggle" 
                checked={isDarkMode} 
                onChange={toggleDarkMode}
            />
            <label className="toggle-label" htmlFor="toggle">
                <span className="toggle-inner" />
                <span className="toggle-switch" />
            </label>
        </div>
    );
};

export default DarkModeToggle;
