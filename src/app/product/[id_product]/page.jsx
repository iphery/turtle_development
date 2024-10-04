"use client";
import { useEffect, useState } from "react";
import UserAuth from "@/components/auth";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import { API_URL, IMAGE_URL } from "@/utils/constant";
import { PageCard } from "@/components/card";
import { CommonInput } from "@/components/input";
import { IoMdArrowDropdown } from "react-icons/io";
import Link from "next/link";
import { CustomModal } from "@/components/modal";
import EditProduct from "@/components/editproduct";
import EditPicture from "@/components/editpicture";
import { SearchScanner } from "@/components/searchscanner";

export default function Page({ params }) {
  const [detail, setDetail] = useState({});

  const [startDate, setStartDate] = useState(
    get_first_date().toISOString().substring(0, 10),
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().substring(0, 10),
  );

  const [stockData, setStockData] = useState([]);
  const [scanResult, setScanResult] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const fetch_data = async () => {
    const apiurl = `${API_URL}/fetchdetailproduct`;
    const response = await axios.post(apiurl, { idProduct: params.id_product });

    if (response.status == 200) {
      const data = response.data["details"][0];
      setDetail(data);
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
  }, [startDate, endDate]);

  useEffect(() => {
    if (refresh) {
      fetch_data();
      setRefresh(false);
    }
  }, [refresh]);

  const [modalEdit, setModalEdit] = useState(false);
  const [modalPicture, setModalPicture] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <UserAuth>
      {!showScanner ? (
        <div className="relative">
          <div className="absolute z-0 h-full w-full">
            <DefaultLayout>
              <div className="mb-3 flex items-center justify-between">
                <div className=" text-xl font-bold">Product Detail</div>

                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="rounded-md bg-strokedark px-3 py-1 text-white"
                  >
                    <div className="flex items-center justify-start">
                      <IoMdArrowDropdown />
                      <div>Option</div>
                    </div>
                  </button>
                  {showDropdown && (
                    <div className="divide-gray-100 absolute right-0 mt-2 w-56 divide-y rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <div
                          className="text-md text-gray-800 block w-full cursor-default px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white"
                          onClick={() => {
                            toggleDropdown();
                            setModalEdit(true);
                          }}
                        >
                          Edit Product
                        </div>

                        <div
                          className="text-md text-gray-800 block w-full cursor-default px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white"
                          onClick={() => {
                            toggleDropdown();
                            setModalPicture(true);
                          }}
                        >
                          Update Picture
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <PageCard>
                <div className="flex justify-evenly">
                  <div className="w-full">
                    <div className="mb-2 flex justify-evenly">
                      <div className="w-full">Description</div>
                      <div className="w-full ">{detail.description}</div>
                    </div>
                    <div className="mb-2 flex justify-evenly">
                      <div className="w-full">Barcode</div>
                      <div className="w-full ">{detail.barcode}</div>
                    </div>
                    <div className="mb-2 flex justify-evenly">
                      <div className="w-full">Unit</div>
                      <div className="w-full ">{detail.unit}</div>
                    </div>
                    <div className="mb-2 flex justify-evenly">
                      <div className="w-full">Category</div>
                      <div className="w-full ">{detail.category}</div>
                    </div>
                  </div>
                  <div className="flex w-full justify-center">
                    <img
                      src={`${IMAGE_URL}/${detail.image_url}`}
                      alt=""
                      className="h-40"
                    />
                  </div>
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
          </div>
          <CustomModal
            isVisible={modalEdit}
            isSmallWidth="md"
            onClose={(val) => {
              setModalEdit(val);
            }}
          >
            <EditProduct
              data={detail}
              showScanner={() => {
                setShowScanner(true);
                console.log("hahah");
              }}
              scanResult={scanResult}
              onClose={(val) => {
                setModalEdit(val);
                setRefresh(true);
              }}
            ></EditProduct>
          </CustomModal>
          <CustomModal
            isVisible={modalPicture}
            isSmallWidth="md"
            onClose={() => {
              setModalPicture(false);
            }}
          >
            {" "}
            <EditPicture
              data={detail}
              showScanner={() => {
                setShowScanner(true);
                console.log("hahah");
              }}
              scanResult={scanResult}
              onClose={(val) => {
                setModalPicture(val);
                setRefresh(true);
              }}
            ></EditPicture>
          </CustomModal>
        </div>
      ) : (
        <SearchScanner
          onScanResult={(val) => {
            setScanResult(val);
          }}
          exit={() => {
            setShowScanner(false);
          }}
        ></SearchScanner>
      )}
    </UserAuth>
  );
}
