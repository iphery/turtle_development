"use client";
import UserAuth from "@/components/auth";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Camera1 from "@/components/camera1";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { CustomModal } from "@/components/modal";
import NewProduct from "@/components/newproduct";
import PaginationDataButton from "@/components/pagination";
import QRScanner1 from "@/components/qrscanner2";
import { compressImage } from "@/utils/compressimage";
import { API_URL } from "@/utils/constant";
import { dataURLtoBlob } from "@/utils/dataurltofile";
import { formatDateLocal } from "@/utils/dateformat";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoInformationCircle } from "react-icons/io5";
import { MdClear } from "react-icons/md";
import { CommonInput } from "./input";
import { BsUpcScan } from "react-icons/bs";

interface Product {
  available_quantity: string;
  barcode: string;
  category: string;
  description: string;
  id_product: string;
  initial_stock: string;
  location: string;
  total_in: string;
  total_out: string;
  unit: string;
}

interface Outstanding {
  date: string;
  id_transaction: string;
  item_count: string;
  note: string;
  subject: string;
  total_pages: string;
}

interface Summary {
  available_quantity: string;
  id_product: string;
  description: string;
  barcode: string;
  category: string;
  total_quantity: string;
  unit: string;
}

const Dashboard1 = () => {
  const [currentSearch, setCurrentSearch] = useState("");
  const [currentStart, setCurrentStart] = useState("");
  const [currentEnd, setCurrentEnd] = useState("");
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  const [outstanding, setOutstanding] = useState<Outstanding[]>([]);
  const [summary, setSummary] = useState<Summary[]>([]);
  const [currentPageOutstanding, setCurrentPageOutstanding] = useState(1);
  const [totalPageOutstanding, setTotalPageOutstanding] = useState(0);
  const [currentPageSummary, setCurrentPageSummary] = useState(1);
  const [totalPageSummary, setTotalPageSummary] = useState(0);

  const [scanProduct, setScanProduct] = useState("");
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

  const [filePreview, setFilePreview] = useState();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [modalAdd, setModalAdd] = useState(false);
  const [startDate, setStartDate] = useState(
    get_first_date().toISOString().substring(0, 10),
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().substring(0, 10),
  );

  const fetch_transaction = async () => {
    const apiUrl = `${API_URL}/fetchdashboard1?page=${currentPageOutstanding}`;
    // const apiUrl = `${API_URL}/product`;
    console.log(apiUrl);
    const response = await axios.get(apiUrl);

    if (response.status == 200) {
      const data = response.data;

      setOutstanding(data.transactions);
      setTotalPageOutstanding(Number(data.transactions[0].total_pages));

      console.log(response.data);
    }
    setOnload(false);
  };

  const fetch_summary = async () => {
    const apiUrl = `${API_URL}/fetchdashboard2?page=${currentPageSummary}&keyword=${currentSearch}&start=${currentStart}&end=${currentEnd}`;
    // const apiUrl = `${API_URL}/product`;
    console.log(apiUrl);
    const response = await axios.get(apiUrl);

    if (response.status == 200) {
      const data = response.data;
      setSummary(data.result);
      if (data.result.length > 0) {
        setTotalPageSummary(data.result[0].total_pages);
      } else {
        setTotalPageSummary(0);
      }
      //setOutstanding(data.transactions);
      //setTotalPageOutstanding(Number(data.transactions[0].total_pages));

      console.log("ini data summary", response.data);
    }
    setOnload(false);
  };

  useEffect(() => {
    fetch_transaction();
    const userlevel = localStorage.getItem("userlevel") ?? "";

    setUserLevel(userlevel);
  }, [currentPageOutstanding]);

  useEffect(() => {
    fetch_summary();
  }, [currentPageSummary, currentSearch, currentStart, currentEnd]);

  useEffect(() => {
    // Cek dulu kalo udah di client
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const outstandingPage = params.get("out-page") || "1"; // Default ke halaman 1
      const summaryPage = params.get("sum-page") || "1"; // Default ke halaman 1
      const paramsSearch = params.get("q") || "";
      const currentstart =
        params.get("start") || get_first_date().toISOString().substring(0, 10);
      const currentend =
        params.get("end") || new Date().toISOString().substring(0, 10);
      setCurrentPageOutstanding(parseInt(outstandingPage));
      setCurrentPageSummary(parseInt(summaryPage));
      console.log("ini current", currentstart, currentend);
      setCurrentStart(currentstart);
      setCurrentEnd(currentend);

      setCurrentSearch(paramsSearch);
    }
  }, []);

  const goToPageOutstanding = (page: number) => {
    const params = new URLSearchParams(window.location.search);

    params.set("out-page", String(page));
    window.history.pushState({}, "", "?" + params.toString()); // Update URL tanpa reload
  };

  const goToPageSummary = (page: number) => {
    const params = new URLSearchParams(window.location.search);

    params.set("sum-page", String(page));
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
    params.set("sum-page", String(1));
    //setCurrentPage(1);
    window.history.pushState({}, "", "?" + params.toString()); // Update URL tanpa reload
  };

  const confirm_date = () => {
    const params = new URLSearchParams(window.location.search);

    params.set("sum-page", String(1));
    params.set("start", startDate);
    params.set("end", endDate);
    //setCurrentPage(1);
    setCurrentStart(startDate);
    setCurrentEnd(endDate);
    window.history.pushState({}, "", "?" + params.toString()); // Update URL tanpa reload
  };

  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  function get_first_date() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }

  const [showScanner, setShowScanner] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [scanResult, setScanResult] = useState("");

  if (showScanner) {
    return (
      <QRScanner1
        onScanResult={(res: any) => {
          setShowScanner(false);
          setScanProduct(res);
        }}
        exit={() => {
          setShowScanner(false);
        }}
      ></QRScanner1>
    );
  }
  return (
    <UserAuth>
      <div className="relative">
        <div className="absolute z-0 h-full w-full">
          <DefaultLayout>
            <Breadcrumb pageName="Dashboard" />

            <button
              onClick={() => {
                setShowScanner(true);
              }}
            >
              <div className="cursor:default group mb-5 mr-3 flex items-center justify-start border bg-white p-3 shadow-md">
                <BsUpcScan className="w-8" />
                <div>Find product</div>
              </div>
            </button>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="relative flex  items-center justify-between px-4 py-5 md:px-6 xl:px-7.5">
                <div className="py-2">Outstanding Transaction</div>
              </div>

              <div className="px-5">
                <div className="overflow-x-auto  ">
                  <table className="w-full">
                    <thead className="border-b border-t border-bodydark1">
                      <tr className="select-none">
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Date</th>

                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Item Count</th>
                        <th className="p-3 text-left">Remark</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {outstanding.map((item: Outstanding, key) => {
                        return (
                          <tr
                            key={key}
                            className="border-b border-bodydark1 hover:cursor-pointer hover:text-strokedark "
                            onClick={() => {
                              router.push(
                                `/transaction/${item.id_transaction}`,
                              );
                            }}
                          >
                            <td className="p-3 text-left">
                              <div className="">{item.id_transaction}</div>
                            </td>
                            <td className=" p-3 text-left ">
                              <div className="overflow-wrap: break-word w-[100px]">
                                {" "}
                                {formatDateLocal(item.date)}
                              </div>
                            </td>
                            <td className="p-3 text-left">
                              <div className="">{item.subject}</div>
                            </td>
                            <td className="p-3 text-left">
                              <div className="">{`${item.item_count} Item`}</div>
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
              {!onload && outstanding.length == 0 && (
                <div className="flex justify-center pb-10 pt-5">
                  Data tidak ditemukan
                </div>
              )}
              <PaginationDataButton
                currentPage={currentPageOutstanding}
                totalPage={totalPageOutstanding}
                setCurrentPage={setCurrentPageOutstanding}
                goToPage={goToPageOutstanding} // Pass goToPage sebagai props ke PaginationDataButton
              />
            </div>

            {parseInt(userLevel) <= 1 && (
              <div className="mt-5 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="relative flex  items-center justify-between px-4 py-5 md:px-6 xl:px-7.5">
                  <div className="py-2">Summary Stock Out</div>
                </div>
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
                  <div className="flex justify-center gap-2">
                    <input
                      className="border border-stroke px-1"
                      type={"date"}
                      value={startDate}
                      onChange={(e) => {
                        const val = e.target.value;
                        const datestart = new Date(val);
                        const dateend = new Date(endDate);
                        if (datestart > dateend) {
                          setEndDate(val);
                        }
                        setStartDate(val);
                      }}
                    />

                    <input
                      className="border border-stroke px-1"
                      type={"date"}
                      value={endDate}
                      onChange={(e) => {
                        const val = e.target.value;
                        const datestart = new Date(startDate);
                        const dateend = new Date(val);
                        if (datestart > dateend) {
                          setStartDate(val);
                        }
                        setEndDate(val);
                      }}
                    />
                    <button
                      className="border border-stroke px-1"
                      onClick={() => {
                        confirm_date();
                      }}
                    >
                      Filter
                    </button>
                  </div>
                </div>

                <div className="px-5">
                  <div className="overflow-x-auto  ">
                    <table className="w-full">
                      <thead className="border-b border-t border-bodydark1">
                        <tr className="select-none">
                          <th className="p-3 text-left">Item</th>
                          <th className="p-3 text-left">Available Stock</th>

                          <th className="p-3 text-left">Quantity Out</th>
                          <th className="p-3 text-left">Unit</th>
                          <th className="p-3 text-left">Category</th>
                        </tr>
                      </thead>
                      <tbody className="">
                        {summary.map((item: Summary, key) => {
                          return (
                            <tr
                              key={key}
                              className="border-b border-bodydark1 hover:cursor-pointer hover:text-strokedark "
                              onClick={() => {
                                router.push(`/product/${item.id_product}`);
                              }}
                            >
                              <td className="p-3 text-left">
                                <div className="">{item.description}</div>
                              </td>
                              <td className=" p-3 text-left ">
                                <div className="overflow-wrap: break-word w-[100px]">
                                  {" "}
                                  {item.available_quantity}
                                </div>
                              </td>
                              <td className="p-3 text-left">
                                <div className="">{item.total_quantity}</div>
                              </td>
                              <td className="p-3 text-left">
                                <div className="">
                                  {item.unit ? item.unit.toUpperCase() : ""}
                                </div>
                              </td>
                              <td className="p-3 text-left">
                                <div className="">
                                  {item.category
                                    ? item.category.toUpperCase()
                                    : ""}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                {!onload && summary.length == 0 && (
                  <div className="flex justify-center pb-10 pt-5">
                    Data tidak ditemukan
                  </div>
                )}
                <PaginationDataButton
                  currentPage={currentPageSummary}
                  totalPage={totalPageSummary}
                  setCurrentPage={setCurrentPageSummary}
                  goToPage={goToPageSummary} // Pass goToPage sebagai props ke PaginationDataButton
                />
              </div>
            )}
          </DefaultLayout>
        </div>
        <CustomModal
          isVisible={modalAdd}
          isSmallWidth={"md"}
          onClose={() => {
            setModalAdd(false);
          }}
        >
          <NewProduct
            inputData={inputData}
            setInputData={setInputData}
            file={file}
            setFile={setFile}
            filePreview={filePreview}
            setFilePreview={setFilePreview}
            showScanner={() => {
              localStorage.setItem("tempNewProduct", "");
              setShowScanner(true);
            }}
            onClose={(val: any) => {
              setModalAdd(val);
              // setRefresh(true);
            }}
            scanResult={scanResult}
            showCamera={() => {
              console.log("hsow ");
              setShowCamera(true);
            }}
            cameraResult={imageFile}
          />
        </CustomModal>
      </div>
    </UserAuth>
  );
};

export default Dashboard1;
