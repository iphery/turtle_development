"use client";
import UserAuth from "@/components/auth";
import { CommonInput } from "@/components/input";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { API_URL } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";

export default function page() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [keyword, setKeyword] = useState("");

  const fetch_product = async () => {
    const apiUrl = `${API_URL}/product`;
    const response = await axios.get(apiUrl);

    if (response.status == 200) {
      const products = response.data["products"];
      setProducts(products);
      setFilteredProducts(products);
    }
  };

  const search_product = () => {
    const filterData = products.filter((item) => {
      const desc =
        item["description"] &&
        item["description"].toLowerCase().includes(keyword.toLowerCase());

      return desc;
    });
    setFilteredProducts(filterData);
  };

  useEffect(() => {
    fetch_product();
  }, []);

  useEffect(() => {
    search_product();
  }, [keyword]);

  return (
    <UserAuth>
      <DefaultLayout>
        <div>
          <div>
            <CommonInput
              placeholder={"Search"}
              input={keyword}
              onInputChange={(val) => {
                setKeyword(val);
              }}
            ></CommonInput>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                <th>No</th>
                <th>Description</th>
                <th>Unit</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item["description"]}</td>
                    <td>{item["unit"]}</td>
                    <td>{item["category"]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DefaultLayout>
    </UserAuth>
  );
}
