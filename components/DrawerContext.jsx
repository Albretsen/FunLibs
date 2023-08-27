import React, { createContext, useContext, useState, useRef } from 'react';
import Drawer from './Drawer';

const DrawerContext = createContext();

export const useDrawer = () => {
    const context = useContext(DrawerContext);
    if (!context) {
        throw new Error("useDrawer must be used within a DrawerProvider");
    }
    return context;
};

export const DrawerProvider = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [drawerContent, setDrawerContent] = useState(null);
    const drawerRef = useRef();

    const openDrawer = (content) => {
        setDrawerContent(content);
        setIsVisible(true);
    };

    const closeDrawer = () => {
        drawerRef.current.closeDrawer(() => setIsVisible(false));
    };

    return (
        <DrawerContext.Provider value={{ openDrawer, closeDrawer, drawerRef }}>
            {children}
            <Drawer ref={drawerRef} isVisible={isVisible} closeDrawer={closeDrawer}>
            {drawerContent}
            </Drawer>
        </DrawerContext.Provider>
    );
};