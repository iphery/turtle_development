"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import { IMAGE_ASSET, API_URL } from "@/utils/constant";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UserAuth from "@/components/auth";
import { CommonInput } from "@/components/input";
import { HiOutlineSearch } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { GoAlert, GoChevronRight } from "react-icons/go";
import { CommonButton } from "@/components/button";
import { toast } from "react-toastify";
import { AlertMessage, NotifyError, NotifySuccess } from "@/utils/notify";
import Loader from "@/components/common/Loader";
import { CommonLoader, PageLoader } from "@/components/loader";
import { PageCard } from "@/components/card";
import { TbArrowsExchange2 } from "react-icons/tb";
import { IoWarningSharp } from "react-icons/io5";
import { IoMdRemoveCircle } from "react-icons/io";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { SearchScanner } from "@/components/searchscanner";

export default function PartsOut() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });
  const [loader, setLoader] = useState(true);
  const [detailData, setDetailData] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const [keywordAsset, setKeywordAsset] = useState("");

  const [tempItem, setTempItem] = useState("");
  const [tempIdPart, setTempIdPart] = useState("");
  const [tempQuantity, setTempQuantity] = useState("");
  const [tempAvailableQuantity, setTempAvailableQuantity] = useState(0);
  const [tempUnit, setTempUnit] = useState("");
  const [tempTypePart, setTempTypePart] = useState("");
  const focusTempQuantity = useRef();
  const focusKeyword = useRef();

  const [searchNotFound, setSearchNotFound] = useState(false);
  const [searchAssetNotFound, setSearchAssetNotFound] = useState(false);
  const [idService, setIdService] = useState("");
  const [dataAsset, setDataAsset] = useState({
    id_asset: "",
    deskripsi: "",
    manufacture: "",
    model: "",
    no: "",
    type: "",
    user: "",
  });

  ///dari sini
  //input, error, error message

  const [categoryTrans, setCategoryTrans] = useState("Umum");

  const [inputReceiver, setInputReceiver] = useState("");

  const [inputDate, setInputDate] = useState("");

  const [listOrder, setListOrder] = useState([]);

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [emptyListAlert, setEmptyListAlert] = useState(false);

  ///

  //const [lastPage, setLastPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [onSubmit, setOnSubmit] = useState(false);

  const [products, setProducts] = useState([]);
  const [filteredProduct, setFilteredProduct] = useState([]);

  const fetch_data = async () => {
    const apiUrl = `${API_URL}/stock`;
    const response = await axios.get(apiUrl);

    if (response.status == 200) {
      const product = response.data["products"];
      console.log(product);
      setProducts(product);
      setFilteredProduct(product);
    }
  };

  const search_product = () => {
    const filterData = products.filter((item) => {
      const arr_description =
        item["description"] &&
        item["description"].toLowerCase().includes(keyword.toLowerCase());

      return arr_description;
    });

    if (filterData.length == 0) {
      setSearchNotFound(true);
    } else {
      setSearchNotFound(false);
    }
    console.log(filterData);
    setFilteredProduct(filterData);
  };

  useEffect(() => {
    fetch_data();
  }, []);

  useEffect(() => {
    search_product();
  }, [keyword]);

  const [showButton, setShowButton] = useState(false);
  useEffect(() => {
    if (listOrder.length > 0) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [listOrder]);

  const save_data = async () => {
    console.log(listOrder);
    console.log(inputDataInfo);
    const user = localStorage.getItem("userUid");

    setOnSubmit(true);
    const newdataerror = [...inputDataInfoError];
    let localErrorInfo = [false, false, false];
    if (inputDataInfo.date == "") {
      newdataerror[0] = true;
      setInputDataInfoError(newdataerror);
      localErrorInfo[0] = true;
    } else {
      localErrorInfo[0] = false;
    }

    if (inputDataInfo.receiver == "") {
      newdataerror[1] = true;
      setInputDataInfoError(newdataerror);
      localErrorInfo[1] = true;
    } else {
      localErrorInfo[1] = false;
    }

    if (inputDataInfo.phone == "") {
      newdataerror[2] = true;
      setInputDataInfoError(newdataerror);
      localErrorInfo[2] = true;
    } else {
      localErrorInfo[2] = false;
    }

    if (inputDataInfo.note == "") {
      newdataerror[3] = true;
      setInputDataInfoError(newdataerror);
      localErrorInfo[3] = true;
    } else {
      localErrorInfo[3] = false;
    }

    if (!localErrorInfo.includes(true)) {
      const apiUrl = `${API_URL}/newstockout`;
      const response = await axios.post(apiUrl, {
        dataInfo: inputDataInfo,
        dataOrder: listOrder,
        uid: user,
      });

      if (response.status == 200) {
        console.log(response.data);
        //window.location.reload();
        router.push("/transaction");
      }
    }
    setOnSubmit(false);
  };

  const [inputDataInfo, setInputDataInfo] = useState({
    date: "",
    receiver: "",
    phone: "",
    note: "",
  });
  const [inputDataInfoError, setInputDataInfoError] = useState([
    false,
    false,
    false,
    false,
  ]);

  const [doScan, setDoScan] = useState(false);

  useEffect(() => {
    // This will trigger when 'result' is updated and focus on the input
    if (focusTempQuantity.current) {
      focusTempQuantity.current.focus();
    }
  }, [doScan]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <UserAuth>
      {!doScan ? (
        <div className="min-h-screen  ">
          <DefaultLayout>
            {!loader ? (
              <div className="flex items-center justify-center"></div>
            ) : (
              <div className="">
                <div className="mb-3 flex items-center justify-start">
                  <div
                    className="text-lg"
                    onClick={() => {
                      console.log(localStorage.getItem("userUid"));
                    }}
                  >
                    Stock Out
                  </div>
                </div>

                <PageCard>
                  <div className="flex flex-row justify-evenly">
                    <div className="w-full">
                      <div className="mb-2   sm:flex sm:justify-between ">
                        <div>Tanggal</div>
                        <div className="w-full sm:w-1/2">
                          <CommonInput
                            type={"date"}
                            input={inputDataInfo.date}
                            error={inputDataInfoError[0]}
                            errorMessage={"Required"}
                            onInputChange={(val) => {
                              setInputDataInfo((prev) => ({
                                ...prev,
                                date: val,
                              }));
                            }}
                            onChg={() => {
                              const newdata = [...inputDataInfoError];
                              newdata[0] = false;
                              setInputDataInfoError(newdata);
                            }}
                          ></CommonInput>
                        </div>
                      </div>
                      <div className="mb-2 sm:flex sm:justify-between ">
                        <div>Penerima</div>
                        <div className="w-full sm:w-1/2">
                          <CommonInput
                            type={"text"}
                            input={inputDataInfo.receiver}
                            error={inputDataInfoError[1]}
                            errorMessage={"Required"}
                            onInputChange={(val) => {
                              setInputDataInfo((prev) => ({
                                ...prev,
                                receiver: val,
                              }));
                            }}
                            onKeyChange={() => {
                              const newdata = [...inputDataInfoError];
                              newdata[1] = false;
                              setInputDataInfoError(newdata);
                            }}
                          ></CommonInput>
                        </div>
                      </div>
                      <div className="mb-2 sm:flex sm:justify-between ">
                        <div>No Telp (WA)</div>
                        <div className="w-full sm:w-1/2">
                          <CommonInput
                            type={"number"}
                            input={inputDataInfo.phone}
                            error={inputDataInfoError[2]}
                            errorMessage={"Required"}
                            onInputChange={(val) => {
                              setInputDataInfo((prev) => ({
                                ...prev,
                                phone: val,
                              }));
                            }}
                            onKeyChange={() => {
                              const newdata = [...inputDataInfoError];
                              newdata[2] = false;
                              setInputDataInfoError(newdata);
                            }}
                          ></CommonInput>
                        </div>
                      </div>
                      <div className="mb-2 sm:flex sm:justify-between ">
                        <div>Note</div>
                        <div className="w-full sm:w-1/2">
                          <CommonInput
                            input={inputDataInfo.note}
                            error={inputDataInfoError[3]}
                            errorMessage={"Required"}
                            onInputChange={(val) => {
                              setInputDataInfo((prev) => ({
                                ...prev,
                                note: val,
                              }));
                            }}
                            onKeyChange={() => {
                              const newdata = [...inputDataInfoError];
                              newdata[3] = false;
                              setInputDataInfoError(newdata);
                            }}
                          ></CommonInput>
                        </div>
                      </div>
                    </div>
                  </div>
                </PageCard>
                <div className="mb-5"></div>
                <PageCard>
                  <div className="flex-row sm:flex">
                    <div className="mb-2 flex flex-row items-center sm:mb-0 sm:w-full">
                      <div className="w-full">
                        <CommonInput
                          input={keyword}
                          type={"text"}
                          reference={focusKeyword}
                          onInputChange={(val) => {
                            //setKeyword(val);
                            //  fetch_data();
                            setKeyword(val);
                            setCurrentPage(1);
                          }}
                          placeholder={"Search"}
                        >
                          <HiOutlineSearch />
                        </CommonInput>
                      </div>
                      <div
                        className="ml-1"
                        onClick={() => {
                          //link to scanner
                          localStorage.setItem("searchitem", "");
                          setDoScan(true);
                        }}
                      >
                        <MdOutlineDocumentScanner className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="ml-3"></div>
                    <div className="mb-2 w-full sm:mb-0">
                      <CommonInput
                        placeholder={"Description"}
                        input={tempItem}
                        isDisabled={true}
                      ></CommonInput>
                    </div>

                    <div className="ml-3"></div>
                    <div className="sm: w-2/3 w-full">
                      <CommonInput
                        placeholder={"Enter quantity"}
                        input={tempQuantity}
                        type="number"
                        reference={focusTempQuantity}
                        onInputChange={(val) => {
                          setTempQuantity(val);
                        }}
                        onKeyChange={(event) => {
                          if (event.key == "Enter") {
                            console.log(tempAvailableQuantity);
                            console.log(tempQuantity);

                            if (
                              parseInt(tempQuantity) >
                              parseInt(tempAvailableQuantity)
                            ) {
                              console.log("tidak cukurp");
                              AlertMessage("Stock tidak cukup");
                            } else {
                              //cek jika exist
                              const newList = [...listOrder];
                              const findIndex = newList.findIndex(
                                (value) => value.id_part == tempIdPart,
                              );

                              if (findIndex != -1) {
                                const qty =
                                  parseInt(newList[findIndex].quantity) +
                                  parseInt(tempQuantity);

                                if (qty > tempAvailableQuantity) {
                                  AlertMessage("Stock tidak cukup");
                                } else {
                                  newList[findIndex].quantity = qty;
                                }

                                //exist
                              } else {
                                //not exist
                                const order = {
                                  id_part: tempIdPart,
                                  description: tempItem,
                                  type: tempTypePart,
                                  quantity: tempQuantity,
                                  unit: tempUnit,
                                };
                                newList.push(order);
                                setEmptyListAlert(false);
                              }

                              //setListOrder();
                              setListOrder(newList);
                            }
                            setTempItem("");
                            setTempQuantity("");
                            setTempUnit("");
                            setTempTypePart("");
                            focusKeyword.current.focus();
                            // console.log(listOrder);
                          }
                        }}
                      />
                    </div>
                  </div>

                  {emptyListAlert ? (
                    <div className="mt-5">
                      <div className="mb-5 flex flex-row items-center rounded-lg border p-2">
                        <GoAlert className="text-warning"></GoAlert>

                        <div className="ml-2 text-warning">
                          List ini tidak boleh kosong
                        </div>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}

                  <div>
                    {keyword.length >= 2 ? (
                      searchNotFound ? (
                        <div className="mt-3 flex items-center justify-start">
                          <IoWarningSharp className="text-warning" />
                          <div className="ml-2">Ups.. barang tidak ketemu</div>
                        </div>
                      ) : (
                        <div className=" py-2">
                          <div className="h-40 overflow-y-auto">
                            <table className="w-full">
                              <tbody className="">
                                {filteredProduct.map((item, index) => {
                                  return (
                                    <tr
                                      className={`cursor-default text-strokedark hover:bg-secondary  ${index % 2 === 0 ? "bg-gray" : "bg-white"}`}
                                      key={index}
                                      onClick={() => {
                                        console.log(item.id_product);

                                        setTempIdPart(item.id_product);
                                        setTempItem(item.description);
                                        setTempUnit(item.unit);
                                        setTempAvailableQuantity(
                                          item.available_quantity,
                                        );
                                        setTempTypePart(item.vendor_code);

                                        setKeyword("");
                                        if (focusTempQuantity.current) {
                                          focusTempQuantity.current.focus();
                                        }
                                      }}
                                    >
                                      <td className="w-1/5 ">
                                        {item["description"]}
                                      </td>

                                      <td className="w-1/5">
                                        {item["category"]}
                                      </td>
                                      <td className="w-1/5 text-center">
                                        {item["available_quantity"]}
                                      </td>
                                      <td className="w-1/5 text-center">
                                        {item["unit"]}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )
                    ) : (
                      <></>
                    )}
                  </div>

                  {showButton ? (
                    <>
                      <div className="mb-5"></div>
                      <table className="w-full">
                        <thead>
                          <tr className="bg-black text-white">
                            <th className="text-center">No</th>
                            <th className="text-center">Item</th>

                            <th className="text-center">Quantity</th>
                            <th className="text-center">Unit</th>
                            <th className="text-center">Opsi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {listOrder.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td className="py-2 text-center">
                                  {index + 1}
                                </td>
                                <td className="py-1">{item.description}</td>
                                <td className="py-1 text-center">
                                  {item.quantity}
                                </td>
                                <td className="py-1 text-center">
                                  {item.unit}
                                </td>

                                <td>
                                  <div
                                    className="flex justify-center py-1"
                                    onClick={() => {
                                      const foundIndex = listOrder.findIndex(
                                        (value) =>
                                          value.id_part == item.id_part,
                                      );

                                      const list = [...listOrder];
                                      list.splice(foundIndex, 1);
                                      setListOrder(list);
                                    }}
                                  >
                                    <div className="h-5 w-5">
                                      <IoMdRemoveCircle className="text-danger hover:text-strokedark" />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <div className="mb-20"></div>
                      <div className="flex justify-end">
                        <CommonButton
                          label={"Submit"}
                          onload={onSubmit}
                          disabled={onSubmit}
                          onClick={() => {
                            save_data();
                            //router.back();
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </PageCard>
              </div>
            )}
          </DefaultLayout>
        </div>
      ) : (
        <SearchScanner
          exit={() => {
            setDoScan(false);
          }}
          onScanResult={(result) => {
            console.log(result);
            const filterData = products.filter((item) => {
              const id_product =
                item["id_product"] && item["id_product"] === result;
              const code = item["code"] && item["code"] === result;

              return id_product || code;
            });
            setTempIdPart(filterData[0].id_product);
            setTempItem(filterData[0].description);
            setTempUnit(filterData[0].unit);
            setTempAvailableQuantity(filterData[0].available_quantity);
            setTempTypePart(filterData[0].vendor_code);

            setKeyword("");
            if (focusTempQuantity.current) {
              focusTempQuantity.current.focus();
            }
          }}
        />
      )}
    </UserAuth>
  );
}
