"use client";
import { createContext, useContext, useState } from "react";
const DataContext = createContext();

export function DataProvider({ children }) {
  const [user, setUser] = useState("");

  return (
    <DataContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useProvider() {
  return useContext(DataContext);
}
