"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PaginationDataButton from "@/components/pagination";
import { API_URL } from "@/utils/constant";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CommonInput } from "@/components/input";
import { IoMdArrowDropdown } from "react-icons/io";
import { CustomModal } from "@/components/modal";
import { ButtonLoader } from "@/components/loader";

interface Product {
  id: string;
  name: string;
  checked: boolean;
}

interface Period {
  label: string;
  value: number;
}

interface Order {
  label: string;
  value: string;
}

interface DataAnalysis {
  product_id: string;
  description: string;
  barcode: string;
  category: string;
  unit: string;
  current_stock: number;
  total_quantity_out: number;
  avg_daily_quantity_out: number;
  base_stock_required: number;
  buffer_stock: number;
  total_stock_required: number;
  recommended_purchase: number;
  stock_category: string;
  priority_level: string;
  last_in_date: string;
  days_since_last_in: string;
  start_date: string;
  end_date: string;
  days: number;
  buffer_percentage: number;
}

interface ProductAnalysis {
  id: string;
  name: string;
  unit: string;
  average_sales: number;
  pareto_status: string;
  buffer_stock: number;
  stock: number;
  is_selected: boolean;
  sp_type: string;
  sp_existing: boolean;
  recommended_order_quantity_in_unit: number;
  recommended_order_quantity_in_minimum_unit: number;
  order_unit: string;
  manufacturer: string;
  lock_supplier_id: number;
  lock_supplier_name: string;
  unit_conversion: number;
  input_order: number;
  recommended_supplier: Supplier[];
  lock_supplier: boolean;

  selected_supplier_rate: number; ///sudah include ppn
}

interface Supplier {
  name: string;
  rate: number;
  supplier: number;
}

interface ExistingSupplier {
  value: string;
  label: string;
}

interface SupplierOption {
  name: string;
  rate: number;
  supplier: number;
  checked: boolean;
  ppn_masukan: number;
}

interface Orders {
  groups: SubOrder[];
  lock_supplier_id: string;
  lock_supplier_name: string;
}

interface SubOrder {
  items: ProductAnalysis[];
  spType: string;
}

const PurchaseAnalyze = () => {
  const router = useRouter();
  const [onload, setOnload] = useState(true);

  const [listAnalysis, setListAnalysis] = useState<DataAnalysis[]>([]);
  const [onAnalyze, setOnAnalyze] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [queryData, setQueryData] = useState({
    start_date: "",
    days: 0,
    buffer: 0,
    days_display: "",
    buffer_display: "",
  });
  const [userlevel, setUserLevel] = useState("");

  const [onDownload, setOnDownload] = useState(false);

  const [modalDeleteAnalysis, setModalDeleteAnalysis] = useState(false);
  const [onDeleteAnalysis, setOnDeleteAnalysis] = useState(false);
  const [currentSearch, setCurrentSearch] = useState("");

  const [totalPages, setTotalPages] = useState(1);

  const fetch_data = async () => {
    const apiUrl = `${API_URL}/getinventoryanalysis?page=${currentPage}&keywords=${currentSearch}`;

    try {
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        // const data = response.data;
        const list = response.data.data;

        setListAnalysis(list);
        setTotalPages(response.data.last_page);

        console.log(response.data);
      }

      setOnload(false);
    } catch (error) {}
  };

  const remove_data = async () => {
    const apiUrl = `${API_URL}/removeinventoryanalysis`;
    setOnDeleteAnalysis(true);
    try {
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        // const data = response.data;
        const list = response.data.data;

        setListAnalysis([]);
        setTotalPages(0);
        setModalDeleteAnalysis(false);
        // const supplier = response.data.data.suppliers;

        // if (data.length > 0) {
        //   setListAnalysis(data[0]);
        //   setCreatedBy(data[0].created_by);
        //   setOriginDataAnalysis(data[0].result);
        //   setFilteredDataAnalysis(data[0].result);
        //   filter_data(data[0].result);
        // }

        // let modifiedsupplier: ExistingSupplier[] = [];
        // supplier.map((sp: any) => {
        //   modifiedsupplier.push({ label: sp.name, value: sp.id });
        // });
        // setExistingSupplier(modifiedsupplier);

        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
    setOnDeleteAnalysis(false);
  };

  const donwload_report = async () => {
    setOnDownload(true);
    const apiurl = `${API_URL}/downloadinventoryanalysis`;
    try {
      const response = await axios.get(apiurl);

      console.log(response.data);
      window.location.href =
        "https://mipa.farmaguru.cloud/download-inventory-analysis";
    } catch (error) {
      console.log(error);
    }

    setOnDownload(false);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(window.location.search);

    params.set("page", String(page));
    window.history.pushState({}, "", "?" + params.toString()); // Update URL tanpa reload
  };

  const analysis_data1 = async () => {};

  const analysis_data = async () => {
    setOnAnalyze(true);
    const endDate = max_date();

    const apiUrl = `${API_URL}/inventoryanalysis`;

    const rawData = {
      start_date: queryData.start_date,
      end_date: endDate,
      buffer_percentage: queryData.buffer,
      days: queryData.days,
    };

    try {
      const response = await axios.post(apiUrl, rawData);

      if (response.status === 200) {
        const data = response.data.data;
        console.log(data);
        fetch_data();
      }
    } catch (error) {
      console.log(error);
    }
    setOnAnalyze(false);
  };

  const max_date = () => {
    const today = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);
    return today.toISOString().split("T")[0];
  };

  const search_list = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      confirm_search_list();
    }
  };

  const confirm_search_list = () => {
    const params = new URLSearchParams(window.location.search);

    setCurrentSearch(keyword);
    params.set("q", keyword);
    params.set("page", String(1));
    setCurrentPage(1);
    window.history.pushState({}, "", "?" + params.toString()); // Update URL tanpa reload
  };

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

  useEffect(() => {
    fetch_data();
    //console.log(currentMargin);
    const user = localStorage.getItem("userlevel") ?? "";
    setUserLevel(user);
  }, [currentPage, currentSearch]);

  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  if (parseInt(userlevel) > 1) {
    return (
      <DefaultLayout>
        <div></div>
      </DefaultLayout>
    );
  }

  return (
    <div className="relative">
      <div className="relative z-0">
        <DefaultLayout>
          <div className="mb-3 flex items-center justify-between">
            <div className=" text-xl font-bold">Analysis</div>

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
                        donwload_report();
                      }}
                    >
                      Download
                    </div>
                    <div
                      className="text-md text-gray-800 block w-full cursor-default px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white"
                      onClick={() => {
                        toggleDropdown();
                        setModalDeleteAnalysis(true);
                      }}
                    >
                      Reset Data
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {listAnalysis.length > 0 ? (
            <div className=" w-full rounded-sm border border-bodydark  shadow-default">
              <div className="p-3">
                {" "}
                <div className="mb-3 w-1/2">
                  <div className="flex justify-between">
                    <div>Start Date</div>
                    <div>{listAnalysis[0].start_date}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>End Date</div>
                    <div>{listAnalysis[0].end_date}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Days Required</div>
                    <div>{`${listAnalysis[0].days} days`}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Buffer Percentage</div>
                    <div>{`${listAnalysis[0].buffer_percentage} %`}</div>
                  </div>
                </div>
                <div className="z-10 mb-3 w-full sm:w-1/2">
                  <input
                    placeholder={"Search"}
                    value={keyword}
                    onChange={(val: any) => {
                      setKeyword(val.target.value);
                    }}
                    onKeyDown={search_list}
                    className={`w-full rounded-sm border-[1.5px] border-stroke bg-transparent  bg-white px-2 py-1 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                  />
                </div>
                <div>
                  {
                    <div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-strokedark text-white">
                              <th className="p-1">Description</th>

                              <th className="p-1">Barcode</th>
                              <th className="p-1">Category</th>
                              <th className="p-1">Unit</th>
                              <th className="p-1">Stok</th>
                              <th className="p-1">Quantity Out</th>
                              <th className="p-1">Daily Qty Out</th>
                              <th className="p-1">Stock Required</th>
                              <th className="p-1">Buffer Stock</th>
                              <th className="p-1">Total Stock Required</th>
                              <th className="p-1">Purchase Required</th>
                              <th className="p-1">Pareto</th>
                              <th className="p-1">Priority</th>
                              <th className="p-1">Last Stock In</th>
                              <th className="p-1">Inventory Age</th>
                            </tr>
                          </thead>
                          <tbody>
                            {listAnalysis.map((item, index) => {
                              return (
                                <tr key={index} className=" hover:bg-bodydark">
                                  <td className="p-1 text-left">
                                    {item.description}
                                  </td>
                                  <td className="p-1 text-center">
                                    {item.barcode}
                                  </td>
                                  <td className="p-1 text-center">
                                    {item.category
                                      ? item.category.toUpperCase()
                                      : ""}
                                  </td>
                                  <td className="p-1 text-center">
                                    {item.category
                                      ? item.unit.toUpperCase()
                                      : ""}
                                  </td>
                                  <td className="p-1 text-center">
                                    {item.current_stock}
                                  </td>
                                  <td className="p-1 text-center">
                                    {item.total_quantity_out}
                                  </td>
                                  <td className="p-1 text-center">
                                    {Math.round(item.avg_daily_quantity_out)}
                                  </td>
                                  <td className="p-1 text-center">
                                    {Math.round(item.base_stock_required)}
                                  </td>
                                  <td className="p-1 text-center">
                                    {Math.round(item.buffer_stock)}
                                  </td>
                                  <td className="p-1 text-center">
                                    {Math.round(item.total_stock_required)}
                                  </td>
                                  <td className="p-1 text-center">
                                    {Math.round(item.recommended_purchase)}
                                  </td>
                                  <td className="p-1 text-center">
                                    {item.stock_category}
                                  </td>
                                  <td className="p-1 text-center">
                                    {item.priority_level}
                                  </td>
                                  <td className="p-1 text-center">
                                    {item.last_in_date}
                                  </td>
                                  <td className="p-1 text-center">
                                    {item.days_since_last_in}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <PaginationDataButton
                        currentPage={currentPage}
                        totalPage={totalPages}
                        setCurrentPage={setCurrentPage}
                        goToPage={goToPage} // Pass goToPage sebagai props ke PaginationDataButton
                      />
                    </div>
                  }
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className=" w-full rounded-sm border border-bodydark  shadow-default">
                <div className="p-3">
                  <div className="w-1/2">
                    <div className="mb-3 flex justify-between">
                      <div>Start Date</div>
                      <div>
                        <input
                          value={queryData.start_date}
                          max={max_date()}
                          className={`w-full rounded-sm border-[1.5px] border-stroke bg-transparent  bg-white px-2 py-1 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                          type="date"
                          onChange={(val) => {
                            setQueryData((prev) => ({
                              ...prev,
                              start_date: val.target.value,
                            }));
                          }}
                        />
                      </div>
                    </div>
                    <div className="mb-3 flex justify-between">
                      <div>Days Required</div>
                      <div>
                        <input
                          className={`w-full rounded-sm border-[1.5px] border-stroke bg-transparent  bg-white px-2 py-1 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                          value={queryData.days_display}
                          type="text"
                          onChange={(val) => {
                            const value = val.target.value;
                            if (
                              value === "" ||
                              (/^\d+$/.test(value) && Number(value) <= 365)
                            ) {
                              setQueryData((prev) => ({
                                ...prev,
                                days: Number(value.replace(",", ".")),
                                days_display: value,
                              }));
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="mb-3 flex justify-between">
                      <div>Buffer Stock</div>
                      <div>
                        <input
                          className={`w-full rounded-sm border-[1.5px] border-stroke bg-transparent  bg-white px-2 py-1 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                          value={queryData.buffer_display}
                          onChange={(val) => {
                            const value = val.target.value;
                            if (
                              value === "" ||
                              (/^\d+$/.test(value) && Number(value) <= 20)
                            ) {
                              setQueryData((prev) => ({
                                ...prev,
                                buffer: Number(value.replace(",", ".")),
                                buffer_display: value,
                              }));
                            }
                          }}
                        />
                      </div>
                    </div>
                    {queryData.start_date &&
                    queryData.days &&
                    queryData.buffer ? (
                      <div className="flex justify-end">
                        <button
                          className="bg-primary p-2 text-white"
                          onClick={analysis_data}
                        >
                          {onAnalyze ? (
                            <div>
                              <ButtonLoader color={"bg-black"} />
                            </div>
                          ) : (
                            <span>Analyze</span>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DefaultLayout>
      </div>
      <CustomModal
        isVisible={modalDeleteAnalysis}
        isSmallWidth={"sm"}
        autoClose={true}
        onClose={() => {
          setModalDeleteAnalysis(false);
        }}
      >
        <div>
          <div className="mb-3">
            <div>Are you sure want to delete this analysis ?</div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              className="border-stroke bg-red px-2 py-1 text-white"
              onClick={() => {
                remove_data();
              }}
            >
              {onDeleteAnalysis ? (
                <ButtonLoader color={"bg-black"} />
              ) : (
                <span>Yes, Delete</span>
              )}
            </button>
            <button
              className="border-stroke px-2 py-1"
              onClick={() => {
                setModalDeleteAnalysis(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default PurchaseAnalyze;
