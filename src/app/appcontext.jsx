"use client";
import { createContext, useContext, useState } from "react";
const DataContext = createContext();

export function DataProvider({ children }) {
  const [user, setUser] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [keywordProduct, setKeywordProduct] = useState("");

  return (
    <DataContext.Provider
      value={{
        user,
        setUser,
        products,
        setProducts,
        filteredProducts,
        setFilteredProducts,
        keywordProduct,
        setKeywordProduct,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useProvider() {
  return useContext(DataContext);
}
