"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UserAuth from "@/components/auth";
import { PageCard } from "@/components/card";
import { CommonInput } from "@/components/input";
import { API_URL } from "@/utils/constant";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";

export default function Page() {
  const [trans, setTrans] = useState([]);
  const [filteredTrans, setFilteredTrans] = useState([]);
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

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
          <div className="text-xl font-bold">Transaction</div>
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
                  <Link legacyBehavior href="/produk/tambah-produk">
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
          <div className="mb-3 w-full sm:w-1/2">
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
              <tr className="bg-strokedark text-white">
                <th>No</th>

                <th>ID</th>
                <th>Date</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Type</th>
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
                          router.push(`/transaction/${item["id_transaction"]}`);
                        }}
                      >
                        {item["id_transaction"]}
                      </td>
                      <td className="p-1 text-center">{item["date"]}</td>
                      <td
                        className="cursor-default p-1 hover:text-primary"
                        onClick={() => {
                          router.push(`/product/${item["id_product"]}`);
                        }}
                      >
                        {item["description"]}
                      </td>
                      <td className="p-1 text-center">{item["quantity"]}</td>
                      <td className="p-1 text-center">{item["unit"]}</td>
                      <td className="p-1 text-center">
                        <div className="flex items-center justify-center">
                          <div className="text-sm"> {item["type"]}</div>
                          {item["type"] == "OUT" ? (
                            <FiArrowUpRight className="text-danger" />
                          ) : (
                            <FiArrowDownLeft className="text-success" />
                          )}
                        </div>
                      </td>
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