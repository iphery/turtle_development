"use client";
import { useEffect, useState } from "react";
import UserAuth from "@/components/auth";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import { API_URL } from "@/utils/constant";
import { PageCard } from "@/components/card";
import { CommonInput } from "@/components/input";

export default function Page({ params }) {
  const [detail, setDetail] = useState({});

  const [startDate, setStartDate] = useState(
    get_first_date().toISOString().substring(0, 10),
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().substring(0, 10),
  );

  const [stockData, setStockData] = useState([]);

  const fetch_data = async () => {
    const apiurl = `${API_URL}/fetchdetailproduct`;
    const response = await axios.post(apiurl, { idProduct: params.id_product });

    if (response.status == 200) {
      const data = response.data["details"][0];
      setDetail((prev) => ({
        ...prev,
        id_product: data["id_product"],
        description: data["description"],
        unit: data["unit"],
      }));
    }
  };

  const fetch_stock_data = async () => {
    console.log("excdf");
    const apiUrl = `${API_URL}/fetchstockcard`;
    const response = await axios.post(apiUrl, {
      idProduct: params.id_product,
      startDate: startDate,
      endDate: endDate,
    });

    if (response.status == 200) {
      const array = response.data["response"];
      const reverseArray = [...array].reverse();
      setStockData(reverseArray);
    }
  };

  function get_first_date() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }
  useEffect(() => {
    fetch_data();
    fetch_stock_data();
    console.log(params.id_product);
  }, []);

  useEffect(() => {
    fetch_stock_data();
    console.log("hahfd");
  }, [startDate, endDate]);

  return (
    <UserAuth>
      <DefaultLayout>
        <div className="mb-3 flex items-center justify-start">
          <div>Product Detail</div>
        </div>
        <PageCard>
          <div className="flex justify-evenly">
            <div className="w-full">
              <div className="flex justify-evenly">
                <div className="w-full">Code</div>
                <div className="w-full ">{detail.id_product}</div>
              </div>
              <div className="flex justify-evenly">
                <div className="w-full">Description</div>
                <div className="w-full ">{detail.description}</div>
              </div>
              <div className="flex justify-evenly">
                <div className="w-full">Unit</div>
                <div className="w-full ">{detail.unit}</div>
              </div>
            </div>
            <div className="w-full"></div>
          </div>
        </PageCard>
        <div className="p-3"></div>
        <PageCard>
          <div className="flex flex-row ">
            <div>
              <div className="mb-2 text-sm ">From</div>
              <CommonInput
                type={"date"}
                input={startDate}
                onInputChange={(val) => {
                  const datestart = new Date(val);
                  const dateend = new Date(endDate);
                  if (datestart > dateend) {
                    setEndDate(val);
                  }
                  setStartDate(val);
                }}
              ></CommonInput>
            </div>
            <div className="ml-2"></div>
            <div>
              <div className="mb-2 text-sm ">To</div>
              <CommonInput
                type={"date"}
                input={endDate}
                onInputChange={(val) => {
                  const datestart = new Date(startDate);
                  const dateend = new Date(val);
                  if (datestart > dateend) {
                    setStartDate(val);
                  }
                  setEndDate(val);
                }}
              ></CommonInput>
            </div>
          </div>
          <div className="mb-5"></div>
          <table className="w-full">
            <thead>
              <tr className="bg-strokedark text-white">
                <th className="w-1/7">Date</th>
                <th className="w-1/7">In</th>
                <th className="w-1/7">Out</th>
                <th className="w-1/7">Balance</th>
                <th className="w-1/7">From/To</th>
              </tr>
            </thead>
            <tbody>
              {stockData.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="p-1">
                      {index == stockData.length - 1
                        ? "Before date"
                        : item["date"]}
                    </td>
                    <td className="p-1 text-center">
                      {index == stockData.length - 1 ? "" : item["in"]}
                    </td>
                    <td className="p-1 text-center">
                      {index == stockData.length - 1 ? "" : item["out"]}
                    </td>
                    <td className="p-1 text-center">{item["balance"]}</td>
                    <td className="p-1">{item["subject"]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </PageCard>
      </DefaultLayout>
    </UserAuth>
  );
}
