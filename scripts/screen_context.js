import React, { createContext, useState, useContext } from "react";

const ScreenContext = createContext();

export function ScreenProvider({ children }) {
  const [focusedScreen, setFocusedScreen] = useState(null);

  return (
    <ScreenContext.Provider value={{ focusedScreen, setFocusedScreen }}>
      {children}
    </ScreenContext.Provider>
  );
}

export function useFocusedScreen() {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error("useFocusedScreen must be used within a ScreenProvider");
  }
  return context;
}