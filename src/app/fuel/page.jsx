"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UserAuth from "@/components/auth";
import { PageCard } from "@/components/card";
import { CommonInput } from "@/components/input";
import { API_URL } from "@/utils/constant";
import { formatDateLocal1 } from "@/utils/dateformat";
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
  const [fuels, setFuels] = useState([]);

  const fetch_data = async () => {
    const apiurl = `${API_URL}/fetchfuel`;
    const response = await axios.get(apiurl);
    if (response.status == 200) {
      console.log(response.data);
      const newtrans = response.data["transactions"];
      setFuels(newtrans);
      setFilteredTrans(newtrans);
    }
  };

  const search_data = () => {
    const filterData = fuels.filter((item) => {
      const id =
        item["id_asset"] &&
        item["id_asset"].toLowerCase().includes(keyword.toLowerCase());

      return id;
    });
    setFilteredTrans(filterData);
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

  return (
    <UserAuth>
      <DefaultLayout>
        <div className="mb-3 flex items-center justify-between">
          <div className=" text-xl font-bold">Fuel</div>
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
                </div>
              </div>
            )}
          </div>
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

          {!isSmallScreen ? (
            <div className="">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-strokedark text-white">
                    <th>No</th>

                    <th>ID</th>
                    <th>Date</th>
                    <th>Vehicle No</th>
                    <th>Last KM</th>
                    <th>Current KM</th>
                    <th>
                      <div className="flex flex-col">
                        <div>Amount</div>
                        <div>(Liter)</div>
                      </div>
                    </th>
                    <th>Ratio</th>
                    <th>Reported By</th>
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
                              ///detail
                            }}
                          >
                            {item["id_register"]}
                          </td>
                          <td className="px-1 py-2 text-center">
                            {formatDateLocal1(item["date"])}
                          </td>
                          <td
                            className="cursor-default px-1 py-2 hover:text-primary"
                            onClick={() => {
                              router.push(`/product/${item["id_product"]}`);
                            }}
                          >
                            {item["id_asset"]}
                          </td>
                          <td className="px-1 py-2 text-center">
                            {item["last_km"]}
                          </td>
                          <td className="px-1 py-2 text-center">
                            {item["current_km"]}
                          </td>

                          <td className="px-1 py-2 text-center">
                            {item["amount"]}
                          </td>
                          <td>
                            {`1/${
                              (item["current_km"] - item["last_km"]) /
                              item["amount"]
                            }`}
                          </td>
                          <td>{item["reported_by"]}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              {/*filteredTrans.length > 0 &&
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
                })*/}
            </div>
          )}
        </PageCard>
      </DefaultLayout>
    </UserAuth>
  );
}
