"use client";
import UserAuth from "@/components/auth";
import { PageCard } from "@/components/card";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { API_URL } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

export default function Page({ params }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [initialSO, setInitialSO] = useState([]);
  const [dataSO, setDataSO] = useState({});

  const fetch_data = async () => {
    const apiUrl = `${API_URL}/fetchdetailstockopname`;
    const response = await axios.post(apiUrl, { idReport: params.id_report });
    if (response.status === 200) {
      const result = response.data;
      const initial = JSON.parse(result["initial_data"]);
      setInitialSO(initial);
      setDataSO(result["result"]);
      console.log(initial);
    }
  };

  useEffect(() => {
    fetch_data();
  }, []);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };
  return (
    <UserAuth>
      <div className="relative">
        <div className="absolute z-0 h-full w-full">
          <DefaultLayout>
            <div className="mb-3 flex items-center justify-between">
              <div className=" text-xl font-bold">Stock Opname Detail</div>

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
                      {parseInt(localStorage.getItem("userlevel")) <= 2 ? (
                        <div
                          className="text-md text-gray-800 block w-full cursor-default px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white"
                          onClick={() => {}}
                        >
                          Invite Member
                        </div>
                      ) : (
                        <></>
                      )}

                      <div
                        className="text-md text-gray-800 block w-full cursor-default px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white"
                        onClick={() => {}}
                      >
                        Adjustment
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <PageCard>
              <div className="flex justify-evenly">
                <div className="w-full">
                  <div className="flex justify-between">
                    <div
                      onClick={() => {
                        console.log(dataSO);
                      }}
                    >
                      ID Report
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            </PageCard>
            <div className="mb-5"></div>
            <PageCard>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-strokedark text-white">
                    <tr>
                      <th className="p-1">Item</th>
                      <th className="p-1">Quantity</th>
                      <th className="p-1">Actual</th>
                      <th className="p-1">Diff</th>
                      <th className="p-1">Checked By</th>
                      <th className="p-1">Checked At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {initialSO.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className="p-1">{item["description"]}</td>
                          <td className="p-1 text-center">{item["balance"]}</td>
                          <td className="p-1 text-center">{item["actual"]}</td>
                          <td className="p-1 text-center">{item["diff"]}</td>
                          <td className="p-1">{item["checker"]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </PageCard>
          </DefaultLayout>
        </div>
      </div>
    </UserAuth>
  );
}
