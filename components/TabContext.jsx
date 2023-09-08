import React, { useContext, useState } from 'react';

const TabContext = React.createContext();

export const useTab = () => {
    return useContext(TabContext);
};

export const TabProvider = ({ children }) => {
    const [tab, setTab] = useState("Libs");

    return (
        <TabContext.Provider value={{ tab, setTab }}>
            {children}
        </TabContext.Provider>
    );
};