"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UserAuth from "@/components/auth";
import { CommonButton } from "@/components/button";
import { PageCard } from "@/components/card";
import { CommonInput } from "@/components/input";
import { CustomModal } from "@/components/modal";
import { API_URL } from "@/utils/constant";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";
import { useMediaQuery } from "react-responsive";

export default function Page() {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });

  const [trans, setTrans] = useState([]);
  const [filteredTrans, setFilteredTrans] = useState([]);
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [modalPeriod, setModalPeriod] = useState(false);
  const [month, setMonth] = useState("");
  const [onDownload, setOnDownload] = useState(false);

  const fetch_data = async () => {
    const apiurl = `${API_URL}/fetchtransaction`;
    const response = await axios.get(apiurl);
    if (response.status == 200) {
      console.log(response.data);
      const newtrans = response.data["transactions"];
      setTrans(newtrans);
      setFilteredTrans(newtrans);
    }
  };

  const search_data = () => {
    const filterData = trans.filter((item) => {
      const desc =
        item["description"] &&
        item["description"].toLowerCase().includes(keyword.toLowerCase());

      const id =
        item["id_transaction"] &&
        item["id_transaction"].toLowerCase().includes(keyword.toLowerCase());

      return desc || id;
    });
    setFilteredTrans(filterData);
  };

  const donwload_report = async () => {
    setOnDownload(true);
    const apiurl = `${API_URL}/downloadreport`;
    try {
      const response = await axios.post(apiurl, {
        month: month,
      });

      console.log(response.data);
      window.location.href =
        "https://mipa.farmaguru.cloud/download-monthly-export";
    } catch (error) {
      console.log(error);
    }

    setOnDownload(false);
    setModalPeriod(false);
  };

  useEffect(() => {
    fetch_data();
  }, []);

  useEffect(() => {
    search_data();
  }, [keyword]);

  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const [userLevel, setUserLevel] = useState(3);
  useEffect(() => {
    setUserLevel(parseInt(localStorage.getItem("userlevel")));
  }, []);

  return (
    <UserAuth>
      <div className="relative">
        <div className="relative z-0">
          <DefaultLayout>
            <div className="mb-3 flex items-center justify-between">
              <div className=" text-xl font-bold">Transaction</div>
              {userLevel <= 2 ? (
                <div className="relative z-20">
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
                        <Link legacyBehavior href="/stockin">
                          <a className="text-md text-gray-800 block w-full px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white">
                            Stock In
                          </a>
                        </Link>
                        <Link legacyBehavior href="/stockout">
                          <a className="text-md text-gray-800 block w-full px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white">
                            Stock Out
                          </a>
                        </Link>
                        <button
                          className="text-md text-gray-800 block w-full px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white"
                          onClick={() => {
                            setShowDropdown(false);
                            setModalPeriod(true);
                          }}
                        >
                          Download Report
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>
            <PageCard>
              <div className="relative-z10">
                {" "}
                <div className="mb-3 w-full sm:w-1/2">
                  <CommonInput
                    placeholder={"Search"}
                    input={keyword}
                    onInputChange={(val) => {
                      setKeyword(val);
                    }}
                  ></CommonInput>
                </div>{" "}
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-strokedark text-white">
                      <th>No</th>

                      <th>ID</th>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Barcode</th>
                      <th>Quantity</th>
                      <th>Unit</th>
                      <th>Type</th>
                      <th>From/To</th>

                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrans.length > 0 &&
                      filteredTrans.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="p-1 text-center">{index + 1}</td>
                            <td
                              className="cursor-default p-1 text-center hover:text-primary"
                              onClick={() => {
                                router.push(
                                  `/transaction/${item["id_transaction"]}`,
                                );
                              }}
                            >
                              {item["id_transaction"]}
                            </td>
                            <td className="px-1 py-2 text-center">
                              {item["date"]}
                            </td>
                            <td
                              className="cursor-default px-1 py-2 hover:text-primary"
                              onClick={() => {
                                router.push(`/product/${item["id_product"]}`);
                              }}
                            >
                              {item["description"]}
                            </td>

                            <td className="px-1 py-2 text-center">
                              <div className="w-40"> {item["barcode"]}</div>
                            </td>
                            <td className="px-1 py-2 text-center">
                              {item["quantity"]}
                            </td>
                            <td className="px-1 py-2 text-center">
                              {item["unit"]}
                            </td>
                            <td className="px-1 py-2 text-center">
                              <div className="flex items-center justify-center">
                                <div className="text-sm"> {item["type"]}</div>
                                {item["type"] == "OUT" ? (
                                  <FiArrowUpRight className="text-danger" />
                                ) : (
                                  <FiArrowDownLeft className="text-success" />
                                )}
                              </div>
                            </td>
                            <td className="p-1 text-center">
                              {item["subject"]}
                            </td>
                            <td className="p-1 text-start">{item["note"]}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              {/**!isSmallScreen ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-strokedark text-white">
                    <th>No</th>

                    <th>ID</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Type</th>
                    <th>Created By</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrans.length > 0 &&
                    filteredTrans.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className="p-1 text-center">{index + 1}</td>
                          <td
                            className="cursor-default p-1 text-center hover:text-primary"
                            onClick={() => {
                              router.push(
                                `/transaction/${item["id_transaction"]}`,
                              );
                            }}
                          >
                            {item["id_transaction"]}
                          </td>
                          <td className="px-1 py-2 text-center">
                            {item["date"]}
                          </td>
                          <td
                            className="cursor-default px-1 py-2 hover:text-primary"
                            onClick={() => {
                              router.push(`/product/${item["id_product"]}`);
                            }}
                          >
                            {item["description"]}
                          </td>
                          <td className="px-1 py-2 text-center">
                            {item["quantity"]}
                          </td>
                          <td className="px-1 py-2 text-center">
                            {item["unit"]}
                          </td>
                          <td className="px-1 py-2 text-center">
                            <div className="flex items-center justify-center">
                              <div className="text-sm"> {item["type"]}</div>
                              {item["type"] == "OUT" ? (
                                <FiArrowUpRight className="text-danger" />
                              ) : (
                                <FiArrowDownLeft className="text-success" />
                              )}
                            </div>
                          </td>
                          <td>{item["name"]}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              {filteredTrans.length > 0 &&
                filteredTrans.map((item, index) => {
                  return (
                    <div key={index} className="py-2">
                      <div className="p-1 shadow-sm">
                        <div className="flex justify-between">
                          <div
                            onClick={() => {
                              router.push(
                                `/transaction/${item["id_transaction"]}`,
                              );
                            }}
                          >
                            {item["id_transaction"]}
                          </div>
                          <div>{item["date"]}</div>
                        </div>

                        <div
                          onClick={() => {
                            router.push(`/product/${item["id_product"]}`);
                          }}
                          className="font-bold"
                        >
                          {item["id_product"]}
                        </div>
                        <div>{item["description"]}</div>
                        <div className="flex justify-between">
                          <div className="flex items-center justify-center">
                            <div className="text-sm"> {item["type"]}</div>
                            {item["type"] == "OUT" ? (
                              <FiArrowUpRight className="text-danger" />
                            ) : (
                              <FiArrowDownLeft className="text-success" />
                            )}
                          </div>
                          <div className="">{`${item["quantity"]} ${item["unit"]}`}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )*/}
            </PageCard>
          </DefaultLayout>
        </div>
        <CustomModal
          isVisible={modalPeriod}
          isSmallWidth="sm"
          onClose={() => {
            setModalPeriod(false);
          }}
        >
          <div className="mb-3 font-bold">Pilih Periode</div>
          <CommonInput
            type={"month"}
            value={month}
            onInputChange={(val) => {
              setMonth(val);
            }}
          />

          <div className="mt-5 flex justify-end">
            <CommonButton
              label={"Submit"}
              onload={onDownload}
              disabled={onDownload}
              onClick={donwload_report}
            />
          </div>
        </CustomModal>
      </div>
    </UserAuth>
  );
}
