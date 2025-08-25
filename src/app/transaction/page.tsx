"use client";
import UserAuth from "@/components/auth";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { CommonButton } from "@/components/button";
import Camera1 from "@/components/camera1";
import { CommonInput } from "@/components/input";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { CustomModal } from "@/components/modal";
import NewProduct from "@/components/newproduct";
import PaginationDataButton from "@/components/pagination";
import QRScanner1 from "@/components/qrscanner2";
import { compressImage } from "@/utils/compressimage";
import { API_URL } from "@/utils/constant";
import { dataURLtoBlob } from "@/utils/dataurltofile";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { IoInformationCircle } from "react-icons/io5";
import { MdClear } from "react-icons/md";

interface Transaction {
  barcode: string;
  date: string;
  description: string;
  id_product: string;
  id_transaction: string;
  name: string;
  note: string;
  quantity: string;
  subject: string;
  type: string;
  unit: string;
}
type ImageFile = File | null;

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearch, setCurrentSearch] = useState("");
  const [keyword, setKeyword] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [onload, setOnload] = useState(true);
  const router = useRouter();
  const [userLevel, setUserLevel] = useState("");
  const [inputData, setInputData] = useState({
    description: "",
    barcode: "",
    unit: "",
    category: "",
    location: "",
    initial_stock: "",
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filePreview, setFilePreview] = useState();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [modalAdd, setModalAdd] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [modalPeriod, setModalPeriod] = useState(false);
  const [month, setMonth] = useState("");
  const [onDownload, setOnDownload] = useState(false);
  const [modalTransaction, setModalTransaction] = useState(false);
  const [onDownloadTransaction, setOnDownloadTransaction] = useState(false);

  const fetch_product = async () => {
    const apiUrl = `${API_URL}/fetchtransaction1?page=${currentPage}&keyword=${currentSearch}`;
    // const apiUrl = `${API_URL}/product`;
    console.log(apiUrl);
    const response = await axios.get(apiUrl);

    if (response.status == 200) {
      const data = response.data;
      // const products = response.data["products"];
      setTransactions(data.transactions);
      setTotalPage(data.totalPages);

      // setProducts(products);
      //setProductList(data.products);
      //setTotalPage(data.totalPages);
      // if (keywordProduct == "") {
      //   setFilteredProducts(products);
      // }

      //search_product();
      console.log(response.data);
    }
    setOnload(false);
  };

  useEffect(() => {
    fetch_product();
    const userlevel = localStorage.getItem("userlevel") ?? "";
    //if (userlevel) {
    setUserLevel(userlevel);
    //}
  }, [currentPage, currentSearch]);

  useEffect(() => {
    // Cek dulu kalo udah di client
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const paramsPage = params.get("page") || "1"; // Default ke halaman 1
      const paramsSearch = params.get("q") || "";
      setCurrentPage(parseInt(paramsPage));

      setCurrentSearch(paramsSearch);
    }
  }, []);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(window.location.search);

    params.set("page", String(page));
    window.history.pushState({}, "", "?" + params.toString()); // Update URL tanpa reload
  };

  const search_list = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      confirm_search_list();
    }
  };

  const confirm_search_list = () => {
    const params = new URLSearchParams(window.location.search);

    params.set("q", keyword);
    setCurrentSearch(keyword);
    params.set("page", String(1));
    setCurrentPage(1);
    window.history.pushState({}, "", "?" + params.toString()); // Update URL tanpa reload
  };

  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
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

  const donwload_transaction = async () => {
    setOnDownloadTransaction(true);
    const apiurl = `${API_URL}/downloadtransaction`;
    try {
      const response = await axios.post(apiurl, {
        start_date: startDate,
        end_date: endDate,
      });

      console.log(response.data);
      window.location.href =
        "https://mipa.farmaguru.cloud/download-daily-transaction";
    } catch (error) {
      console.log(error);
    }

    setOnDownloadTransaction(false);
    setModalTransaction(false);
  };

  return (
    <UserAuth>
      <div className="relative">
        <div className="absolute z-0 h-full w-full">
          <DefaultLayout>
            <Breadcrumb pageName="Transaction" />

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="relative flex  items-center justify-between px-4 py-5 md:px-6 xl:px-7.5">
                <div className="relative ">
                  <button className="absolute left-0 top-1/2 -translate-y-1/2">
                    <svg
                      className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                        fill=""
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                        fill=""
                      />
                    </svg>
                  </button>

                  <div className="relative">
                    <input
                      type="text"
                      value={keyword}
                      onChange={(val) => {
                        const value = val.target.value;
                        setKeyword(value); // Update the state
                      }}
                      placeholder="Type keyword and press enter.."
                      className="w-full bg-transparent py-2 pl-9 pr-4 font-medium focus:outline-none xl:w-125"
                      onKeyDown={search_list}
                    />
                  </div>
                  {/* </form> */}
                  {keyword.length > 3 && (
                    <div
                      className="absolute left-50 top-1/2 -translate-y-1/2 pl-2 hover:cursor-pointer hover:text-red"
                      onClick={() => {
                        setKeyword("");
                        //setClearKeyword(true);
                      }}
                    >
                      <MdClear />
                    </div>
                  )}
                </div>
                {parseInt(userLevel) <= 1 && (
                  <div className="">
                    <button
                      onClick={toggleDropdown}
                      className="inline-flex items-center justify-end gap-2.5 rounded-md bg-black px-5 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-4"
                    >
                      <span>
                        <svg
                          width="14"
                          height="8"
                          viewBox="0 0 14 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M0 0.5L7 7.5L14 0.5H0Z" fill="#EAE9FC" />
                        </svg>
                      </span>
                      Options
                    </button>
                    {showDropdown && (
                      <div className="divide-gray-100 absolute right-0 mt-2 w-56 divide-y rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          {userLevel && parseInt(userLevel) <= 1 && (
                            <div
                              className="text-md text-gray-800 block w-full cursor-default px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white"
                              onClick={() => {
                                router.push("/stockin");
                                toggleDropdown();
                              }}
                            >
                              Stock In
                            </div>
                          )}
                          {userLevel && parseInt(userLevel) <= 1 && (
                            <div
                              className="text-md text-gray-800 block w-full cursor-default px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white"
                              onClick={() => {
                                router.push("/stockout");
                                toggleDropdown();
                              }}
                            >
                              Stock Out
                            </div>
                          )}
                          {parseInt(userLevel) <= 1 && (
                            <button
                              className="text-md text-gray-800 block w-full px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white"
                              onClick={() => {
                                setShowDropdown(false);
                                setModalPeriod(true);
                              }}
                            >
                              Download Report
                            </button>
                          )}
                          {parseInt(userLevel) <= 1 && (
                            <button
                              className="text-md text-gray-800 block w-full px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white"
                              onClick={() => {
                                setShowDropdown(false);
                                setModalTransaction(true);
                              }}
                            >
                              Download Transaction
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="px-5">
                <div className="overflow-x-auto  ">
                  <table className="w-full">
                    <thead className="border-b border-t border-bodydark1">
                      <tr className="select-none">
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Date</th>

                        <th className="p-3 text-left">Description</th>
                        <th className="p-3 text-left">Barcode</th>
                        <th className="p-3 text-left">Quantity</th>
                        <th className="p-3 text-left">Unit</th>
                        <th className="p-3 text-left">Type</th>
                        <th className="p-3 text-left">From/To</th>
                        <th className="p-3 text-left">Note</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {transactions.map((item: Transaction, key) => {
                        return (
                          <tr
                            key={key}
                            className="border-b border-bodydark1 hover:cursor-pointer hover:text-strokedark "
                            onClick={() => {
                              router.push(
                                `/transaction/${item["id_transaction"]}`,
                              );
                            }}
                          >
                            <td className="p-3 text-left">
                              <div className="">{item.id_transaction}</div>
                            </td>
                            <td className=" p-3 text-left ">
                              <div className="overflow-wrap: break-word w-[100px]">
                                {" "}
                                {item.date}
                              </div>
                            </td>
                            <td className="p-3 text-left">
                              <div className="">{item.description}</div>
                            </td>
                            <td className="p-3 text-center">
                              <div className="">{item.barcode}</div>
                            </td>
                            <td className="p-3 text-center">
                              <div className="">{item.quantity}</div>
                            </td>
                            <td className="p-3 text-left">
                              <div className="">
                                {item.unit ? item.unit.toUpperCase() : ""}
                              </div>
                            </td>
                            <td className="p-3 text-left">
                              <div className="flex items-center justify-center">
                                <div className="text-sm"> {item["type"]}</div>
                                {item["type"] == "OUT" ? (
                                  <FiArrowUpRight className="text-danger" />
                                ) : (
                                  <FiArrowDownLeft className="text-success" />
                                )}
                              </div>
                            </td>
                            <td className="p-3 text-left">
                              <div className="">{item.subject}</div>
                            </td>
                            <td className="p-3 text-left">
                              <div className="">{item.note}</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {!onload && transactions.length == 0 && (
                <div className="flex justify-center pb-10 pt-5">
                  Data tidak ditemukan
                </div>
              )}
              <PaginationDataButton
                currentPage={currentPage}
                totalPage={totalPage}
                setCurrentPage={setCurrentPage}
                goToPage={goToPage} // Pass goToPage sebagai props ke PaginationDataButton
              />
            </div>
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
          <input
            className="border-gray-300 text-gray-700 w-full rounded-lg border px-4 py-2.5 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            type={"month"}
            value={month}
            onChange={(val: any) => {
              setMonth(val.target.value);
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
        <CustomModal
          isVisible={modalTransaction}
          isSmallWidth="sm"
          onClose={() => {
            setModalTransaction(false);
          }}
        >
          <div className="mb-5 font-bold">Periode</div>
          <div className="justify-evently mb-3 flex items-center">
            <div className="w-1/3">Start date</div>
            <div className="w-2/3">
              <input
                className="border-gray-300 text-gray-700 w-full rounded-lg border px-4 py-2.5 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                type={"date"}
                value={startDate}
                onChange={(e: any) => {
                  const val = e.target.value;
                  const datestart = new Date(val);
                  const dateend = new Date(endDate);
                  if (datestart > dateend) {
                    setEndDate(val);
                  }
                  setStartDate(val);
                }}
              />
            </div>
          </div>
          <div className="justify-evently mb-3 flex items-center">
            <div className="w-1/3">End date</div>
            <div className="w-2/3">
              <input
                className="border-gray-300 text-gray-700 w-full rounded-lg border px-4 py-2.5 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                type={"date"}
                value={endDate}
                onChange={(e: any) => {
                  const val = e.target.value;
                  const datestart = new Date(startDate);
                  const dateend = new Date(val);
                  if (datestart > dateend) {
                    setStartDate(val);
                  }
                  setEndDate(val);
                }}
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <CommonButton
              label={"Submit"}
              onload={onDownloadTransaction}
              disabled={onDownloadTransaction}
              onClick={donwload_transaction}
            />
          </div>
        </CustomModal>
      </div>
    </UserAuth>
  );
};

export default Products;
