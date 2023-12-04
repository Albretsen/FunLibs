// Create a context
import React, { createContext, useState, useContext } from 'react';

const SharedParamsContext = createContext();

// Context provider component
export const SharedParamsProvider = ({ children }) => {
    const [sharedParams, setSharedParams] = useState({ category: 'All', sort: 'newest' });

    return (
        <SharedParamsContext.Provider value={{ sharedParams, setSharedParams }}>
            {children}
        </SharedParamsContext.Provider>
    );
};

// Hook to use the context
export const useSharedParams = () => useContext(SharedParamsContext);