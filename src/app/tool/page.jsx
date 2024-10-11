"use client";
import UserAuth from "@/components/auth";
import { PageCard } from "@/components/card";
import { CommonInput } from "@/components/input";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { CustomModal } from "@/components/modal";
import { API_URL, ASSET_URL } from "@/utils/constant";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { useMediaQuery } from "react-responsive";
import NewTool from "@/components/newtool";

export default function Page() {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });
  const router = useRouter();

  const [showDropdown, setShowDropdown] = useState(false);
  const [tools, setTools] = useState([]);
  const [filteredTools, setFileredTools] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [modalAdd, setModalAdd] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const fetch_tool = async () => {
    const apiurl = `${API_URL}/fetchtool`;
    const response = await axios.get(apiurl);

    if (response.status === 200) {
      const data = response.data;
      const tools = data["tools"];
      setTools(tools);
      setFileredTools(tools);
    }
    setRefresh(false);
  };

  const search_tool = () => {
    const filtered_tool = tools.filter((item) => {
      const desc =
        item["description"] &&
        item["description"].toLowerCase().includes(keyword.toLowerCase());

      return desc;
    });

    setFileredTools(filtered_tool);
  };

  useEffect(() => {
    fetch_tool();
  }, []);

  useEffect(() => {
    search_tool();
  }, [keyword]);

  useEffect(() => {
    if (refresh) {
      fetch_tool();
    }
  }, [refresh]);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <UserAuth>
      <div className="relative">
        <div className="absolute z-0 h-full w-full">
          <DefaultLayout>
            <div className="mb-3 flex items-center justify-between">
              <div className=" text-xl font-bold">Tool</div>

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
                      <div
                        className="text-md text-gray-800 block w-full cursor-default px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white"
                        onClick={() => {
                          toggleDropdown();
                          setModalAdd(true);
                        }}
                      >
                        Add Tool
                      </div>
                      <div
                        className="text-md text-gray-800 block w-full cursor-default px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white"
                        onClick={() => {
                          //router.push("barcode");
                        }}
                      >
                        Print Barcode
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <PageCard>
              <div>
                <div className="relative">
                  <div className="z-10 mb-3 w-full sm:w-1/2">
                    <CommonInput
                      placeholder={"Search"}
                      input={keyword}
                      onInputChange={(val) => {
                        setKeyword(val);
                      }}
                    ></CommonInput>
                  </div>
                </div>
                {!isSmallScreen ? (
                  <div className="">
                    <table className="min-w-full ">
                      <thead>
                        <tr className="bg-strokedark text-white">
                          <th>No</th>
                          <th>Description</th>
                          <th>Image</th>
                          <th>Category</th>
                          <th>Quantity</th>
                          <th>Unit</th>
                          <th>Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTools.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td className="p-1 text-center">{index + 1}</td>
                              <td className="p-1 ">{item["description"]}</td>
                              <td className="p-1 text-center">
                                <img
                                  className="h-20"
                                  src={`${ASSET_URL}/${item["image_url"]}`}
                                />
                              </td>
                              <td className="p-1 text-center">
                                {item["category"]}
                              </td>
                              <td className="p-1 text-center">
                                {item["quantity"]}
                              </td>
                              <td className="p-1 text-center">
                                {item["unit"]}
                              </td>
                              <td className="p-1 text-center">{`${item["location"]} ${item["detail_location"]}`}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-3">
                    {filteredTools.map((item, index) => {
                      return (
                        <div className="py-1" key={index} onClick={() => {}}>
                          <div className="p-2 shadow-sm">
                            <div>{item["description"]}</div>
                            <img
                              className="h-20"
                              src={`${ASSET_URL}/${item["image_url"]}`}
                            />
                            <div className="mt-2 text-xs font-bold">
                              Category
                            </div>
                            <div>{item["category"]}</div>
                            <div className="mt-2 text-xs font-bold">
                              Location
                            </div>
                            <div>{`${item["location"]} ${item["detail_location"]}`}</div>
                            <div className="mt-2 text-xs font-bold">
                              Quantity
                            </div>
                            <div className="flex justify-between">
                              <div>{item["quantity"]}</div>
                              <div>{item["unit"]}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </PageCard>
          </DefaultLayout>
        </div>

        <CustomModal
          isVisible={modalAdd}
          isSmallWidth="md"
          onClose={() => {
            setModalAdd(false);
          }}
        >
          <NewTool
            onClose={(val) => {
              setModalAdd(val);
              setRefresh(true);
            }}
          />
        </CustomModal>
      </div>
    </UserAuth>
  );
}
