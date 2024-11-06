"use client";
import { useEffect, useState } from "react";
import UserAuth from "@/components/auth";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import { API_URL, ASSET_URL, IMAGE_URL } from "@/utils/constant";
import { PageCard } from "@/components/card";
import { CommonInput } from "@/components/input";
import { IoMdArrowDropdown } from "react-icons/io";
import Link from "next/link";
import { CustomModal } from "@/components/modal";
import EditTool from "@/components/edittool";
import EditToolPicture from "@/components/edittoolpicture";
import { SearchScanner } from "@/components/searchscanner";
import { useMediaQuery } from "react-responsive";
import CameraPage from "../../../components/camera";
import Camera1 from "@/components/camera1";
import { dataURLtoBlob } from "@/utils/dataurltofile";
import { compressImage } from "@/utils/compressimage";
import QRScanner1 from "@/components/qrscanner2";
import { formatDateLocal1 } from "@/utils/dateformat";
import { useRouter } from "next/navigation";

export default function Page({ params }) {
  const [detail, setDetail] = useState({});
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });
  const router = useRouter();
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
  const [imageFile, setImageFile] = useState(null);
  const [inputData, setInputData] = useState({
    description: "",
    barcode: "",
    quantity: "",
    unit: "",
    category: "",
    location: "",
    detail_location: "",
    note: "",
  });

  const fetch_data = async () => {
    const apiurl = `${API_URL}/fetchdetailtool`;
    const response = await axios.post(apiurl, { idAsset: params.id_asset });

    if (response.status == 200) {
      const data = response.data["details"][0];
      setDetail(data);
      console.log(data);
      setInputData(detail);
    }
  };

  const fetch_stock_data = async () => {
    console.log("excdf");
    const apiUrl = `${API_URL}/fetchtoolcard`;
    const response = await axios.post(apiUrl, {
      idAsset: params.id_asset,
      startDate: startDate,
      endDate: endDate,
    });

    if (response.status == 200) {
      const array = response.data["response"];
      const reverseArray = [...array].reverse();
      console.log("ini dia");
      console.log(array);
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
  const [showCamera, setShowCamera] = useState(false);
  const [pageMode, setPageMode] = useState(0); //0 normal, 1 scanner, 2 camera

  useEffect(() => {
    setUserlevel(parseInt(localStorage.getItem("userlevel")));
    fetch_data();
  }, []);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  if (showCamera) {
    return (
      <Camera1
        onResult={async (src) => {
          const file = dataURLtoBlob(src);
          console.log(file.size / 1024 / 1024, "MB");
          try {
            const compressedFile = await compressImage(file, {
              maxSizeMB: 0.5, // Compress to 0.5MB
              maxWidthOrHeight: 1024, // Max width/height of 1024px
            });
            console.log(compressedFile.size / 1024 / 1024, "MB");

            setImageFile(compressedFile);
          } catch (error) {
            console.error("Failed to compress image:", error);
          }

          console.log(src);
        }}
        onComplete={() => {
          setShowCamera(false);
        }}
      />
    );
  }

  return (
    <UserAuth>
      {pageMode == 0 ? (
        <div className="relative">
          <div className="absolute z-0 h-full w-full">
            <DefaultLayout>
              <div className="mb-3 flex items-center justify-between">
                <div className=" text-xl font-bold">Tool Detail</div>
                {parseInt(localStorage.getItem("userlevel")) <= 2 ? (
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
                              onClick={() => {
                                setInputData(detail);
                                toggleDropdown();
                                setModalEdit(true);
                              }}
                            >
                              Edit Tool
                            </div>
                          ) : (
                            <></>
                          )}

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
                ) : (
                  <></>
                )}
              </div>

              <PageCard>
                <div className="flex flex-col sm:flex-row sm:justify-evenly">
                  <div className="w-full">
                    <div className="mb-2 flex justify-evenly">
                      <div className="w-1/3 ">Description</div>
                      <div className="w-2/3 ">{detail.description}</div>
                    </div>
                    <div className="mb-2 flex justify-evenly ">
                      <div className="w-1/3">Barcode</div>
                      <div className="w-2/3 ">{detail.barcode}</div>
                    </div>
                    <div className="mb-2 flex justify-evenly">
                      <div className="w-1/3">Quantity</div>
                      <div className="w-2/3 ">{detail.quantity}</div>
                    </div>
                    <div className="mb-2 flex justify-evenly">
                      <div className="w-1/3">Unit</div>
                      <div className="w-2/3 ">{detail.unit}</div>
                    </div>
                    <div className="mb-2 flex justify-evenly">
                      <div className="w-1/3">Category</div>
                      <div className="w-2/3 ">{detail.category}</div>
                    </div>
                    <div className="mb-2 flex justify-evenly">
                      <div className="w-1/3">Location</div>
                      <div className="w-2/3 ">{`${detail.location} ${detail.detail_location == "" ? "" : detail.detail_location}`}</div>
                    </div>
                    <div className="mb-2 flex justify-evenly">
                      <div className="w-1/3">Note</div>
                      <div className="w-2/3 ">{detail.note}</div>
                    </div>
                  </div>
                  {detail.image_url != "" ? (
                    <div className="flex w-full justify-center">
                      <img
                        src={`${ASSET_URL}/${detail.image_url}`}
                        alt=""
                        className="h-40"
                      />
                    </div>
                  ) : (
                    <></>
                  )}
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

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-strokedark text-white">
                        <th className="w-1/7">Date</th>
                        <th className="w-1/7">ID Transaction</th>
                        <th className="w-1/7">To</th>
                        <th className="w-1/7">Receive</th>
                        <th className="w-1/7">Quantity</th>
                        <th className="w-1/7">Status</th>
                        <th>QC</th>
                        <th>Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockData.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="p-1">
                              {formatDateLocal1(item["date"])}
                            </td>
                            <td className="cursor-default p-1 hover:text-strokedark">
                              <div
                                onClick={() => {
                                  router.push(
                                    `/loan/${item["id_transaction"]}`,
                                  );
                                }}
                              >
                                {item["id_transaction"]}
                              </div>
                            </td>
                            <td className="p-1">{item["subject"]}</td>
                            <td className="p-1">{item["receiver"]}</td>
                            <td className="p-1 text-center">
                              {item["quantity"]}
                            </td>
                            <td className="p-1">
                              <div
                                className={`${item["status"] == 1 ? "bg-red" : "bg-success"} px-1 text-center text-white`}
                              >{`${item["status"] == 1 ? "Close" : "Open"}`}</div>
                            </td>
                            <td className="p-1 text-center">{`${item["receive_status"] == 1 ? "OK" : item["receive_status"] == 2 ? "NOK" : ""}`}</td>
                            <td className="p-1">{item["remark"]}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
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
            <EditTool
              idAsset={params.id_asset}
              showScanner={() => {
                //setShowScanner(true);
                setPageMode(2);
                console.log("hahah");
              }}
              scanResult={scanResult}
              onClose={(val) => {
                setModalEdit(val);
                setRefresh(true);
              }}
              inputData={inputData}
              setInputData={setInputData}
            ></EditTool>
          </CustomModal>
          <CustomModal
            isVisible={modalPicture}
            isSmallWidth="md"
            onClose={() => {
              setModalPicture(false);
            }}
          >
            {" "}
            <EditToolPicture
              idAsset={params.id_asset}
              data={detail}
              showCamera={() => {
                console.log("hsow ");
                setShowCamera(true);
              }}
              onClose={(val) => {
                setModalPicture(val);
                setRefresh(true);
              }}
              cameraResult={imageFile}
            ></EditToolPicture>
          </CustomModal>
        </div>
      ) : pageMode == 1 ? (
        <CameraPage
          idProduct={params.id_product}
          onComplete={() => {
            setPageMode(0);
            setRefresh(true);
          }}
        ></CameraPage>
      ) : (
        <QRScanner1
          onScanResult={(val) => {
            setScanResult(val);
          }}
          exit={() => {
            console.log("close scanner");
            setShowScanner(false);
            setPageMode(0);
          }}
        ></QRScanner1>
      )}
    </UserAuth>
  );
}
