import React, { createContext, useContext, useEffect, useState } from 'react';

// Create a context for dark mode
const DarkModeContext = createContext();

// Create a custom hook to use the dark mode context
export const useDarkMode = () => {
    return useContext(DarkModeContext);
};

// Create a provider component
export const DarkModeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    // Update local storage and body class on change
    useEffect(() => {
        localStorage.setItem('darkMode', isDarkMode);
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};
