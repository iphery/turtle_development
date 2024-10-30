"use client";
import { createContext, useContext, useState } from "react";
const DataContext = createContext();

export function DataProvider({ children }) {
  const [user, setUser] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [keywordProduct, setKeywordProduct] = useState("");
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [keywordTool, setKeywordTool] = useState("");
  const [testHide, setTestHide] = useState(false);

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
        tools,
        setTools,
        filteredTools,
        setFilteredTools,
        keywordTool,
        setKeywordTool,
        testHide,
        setTestHide,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useProvider() {
  return useContext(DataContext);
}
