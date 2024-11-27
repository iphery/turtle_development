"use client";
import { useEffect, useState } from "react";
import UserAuth from "@/components/auth";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import { API_URL, IMAGE_URL } from "@/utils/constant";
import { PageCard } from "@/components/card";
import { CommonInput } from "@/components/input";
import { IoIosWarning, IoMdArrowDropdown } from "react-icons/io";
import Link from "next/link";
import { CustomModal } from "@/components/modal";
import EditProduct from "@/components/editproduct";
import EditPicture from "@/components/editpicture";
import { SearchScanner } from "@/components/searchscanner";
import { useMediaQuery } from "react-responsive";
import CameraPage from "../../../components/camera";
import Camera1 from "@/components/camera1";
import { dataURLtoBlob } from "@/utils/dataurltofile";
import { compressImage } from "@/utils/compressimage";
import QRScanner1 from "@/components/qrscanner2";
import { Lightbox } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css"; // Import default styles
import { Tooltip as ReactTooltip } from "react-tooltip";
import { CommonButton } from "@/components/button";
import { useRouter } from "next/navigation";
import { useProvider } from "@/app/appcontext";

export default function Page({ params }) {
  const router = useRouter();
  const [detail, setDetail] = useState({});
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });

  const [startDate, setStartDate] = useState(
    get_first_date().toISOString().substring(0, 10),
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().substring(0, 10),
  );
  const [openImage, setOpenImage] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [scanResult, setScanResult] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [inputData, setInputData] = useState({
    description: "",
    barcode: "",
    unit: "",
    category: "",
    initial_stock: "",
  });

  const {
    products,
    setProducts,
    filteredProducts,
    setFilteredProducts,
    keywordProduct,
    setKeywordProduct,
  } = useProvider();

  const [modalDelete, setModalDelete] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [onDelete, setOnDelete] = useState(false);

  //test new update
  const fetch_data = async () => {
    const apiurl = `${API_URL}/fetchdetailproduct`;
    const response = await axios.post(apiurl, { idProduct: params.id_product });
    console.log(params.id_product);
    if (response.status == 200) {
      const data = response.data["details"][0];
      setDetail(data);
      setInputData(data);
      console.log(data);
    }
  };

  const fetch_stock_data = async () => {
    console.log("excdf");
    const apiUrl = `${API_URL}/fetchstockcard`;
    const response = await axios.post(apiUrl, {
      idProduct: params.id_product,
      startDate: startDate,
      endDate: endDate,
    });

    if (response.status == 200) {
      const array = response.data["response"];
      const reverseArray = [...array].reverse();
      setStockData(reverseArray);
    }
  };

  const refresh_product = async () => {
    const apiUrl = `${API_URL}/product`;
    const response = await axios.get(apiUrl);

    if (response.status == 200) {
      const products = response.data["products"];
      setProducts(products);
      if (keywordProduct == "") {
        setFilteredProducts(products);
      } else {
        const filterData = products.filter((item) => {
          //  const desc = item["available_quantity"] < 0;

          const desc =
            item["description"] &&
            item["description"]
              .toLowerCase()
              .includes(keywordProduct.toLowerCase());

          return desc;
        });
        setFilteredProducts(filterData);
      }
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
                <div className=" text-xl font-bold">Product Detail</div>
                {localStorage.getItem("userlevel") <= 2 ? (
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
                              Edit Product
                            </div>
                          ) : (
                            <></>
                          )}

                          {parseInt(localStorage.getItem("userlevel")) <= 1 ? (
                            <div
                              className="text-md text-gray-800 block w-full cursor-default px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white"
                              onClick={() => {
                                setModalDelete(true);
                                toggleDropdown();
                              }}
                            >
                              Delete Product
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
                      <div className="w-1/3">Unit</div>
                      <div className="w-2/3 ">{detail.unit}</div>
                    </div>
                    <div className="mb-2 flex justify-evenly">
                      <div className="w-1/3">Category</div>
                      <div className="w-2/3 ">{detail.category}</div>
                    </div>
                    <div className="mb-2 flex justify-evenly">
                      <div className="w-1/3">Location</div>
                      <div className="w-2/3 ">{detail.location}</div>
                    </div>
                  </div>
                  {detail.image_url != "" ? (
                    <>
                      <div className="flex w-full justify-center">
                        <img
                          onClick={() => setOpenImage(true)}
                          data-tooltip-id="my-tooltip-1"
                          src={`${IMAGE_URL}/${detail.image_url}`}
                          alt="aaaa"
                          className="h-40"
                        />
                        <Lightbox
                          open={openImage}
                          close={() => setOpenImage(false)}
                          slides={[{ src: `${IMAGE_URL}/${detail.image_url}` }]} // Pass the single image as a slide
                        />
                      </div>
                      <ReactTooltip
                        id="my-tooltip-1"
                        place="bottom"
                        content="Click to preview image."
                      />
                    </>
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
                <div className=" h-75 overflow-auto">
                  <table className="w-full">
                    <thead className="sticky top-0">
                      <tr className="bg-strokedark text-white">
                        <th className="w-1/7">Date</th>
                        <th className="w-1/7">In</th>
                        <th className="w-1/7">Out</th>
                        <th className="w-1/7">Balance</th>
                        <th className="w-1/7">From/To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockData.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="p-1 text-center">
                              {index == stockData.length - 1
                                ? "Before date"
                                : item["date"]}
                            </td>
                            <td className="p-1 text-center">
                              {index == stockData.length - 1 ? "" : item["in"]}
                            </td>
                            <td className="p-1 text-center">
                              {index == stockData.length - 1 ? "" : item["out"]}
                            </td>
                            <td className="p-1 text-center">
                              {item["balance"]}
                            </td>
                            <td className="p-1 text-center">
                              {item["subject"]}
                            </td>
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
            <EditProduct
              idProduct={params.id_product}
              inputData={inputData}
              setInputData={setInputData}
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
            ></EditProduct>
          </CustomModal>
          <CustomModal
            isVisible={modalPicture}
            isSmallWidth="md"
            onClose={() => {
              setModalPicture(false);
            }}
          >
            {" "}
            <EditPicture
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
            ></EditPicture>
          </CustomModal>
          <CustomModal
            isVisible={modalDelete}
            isSmallWidth="sm"
            onClose={() => {
              setModalDelete(false);
            }}
          >
            <div>
              <div className="flex justify-center text-danger">
                <IoIosWarning className="h-15 w-15" />
              </div>
              <div className="flex justify-center font-bold">
                <h1>Are you sure want to delete ?</h1>
              </div>
              <div className="flex justify-center text-sm">
                <p> Please re-check the transaction.</p>
              </div>

              <div className="mt-10 flex justify-center">
                <CommonButton
                  label={"Ok, Delete"}
                  onload={onDelete}
                  disabled={onDelete}
                  onClick={async (e) => {
                    e.preventDefault();
                    setOnDelete(true);
                    const apiUrl = `${API_URL}/deleteproduct`;
                    const response = await axios.post(apiUrl, {
                      idProduct: params.id_product,
                    });
                    console.log(params.id_product);
                    if (response.status === 200) {
                      console.log(response.data);
                      refresh_product();
                      router.back();
                    }
                    setOnDelete(false);
                  }}
                />
              </div>
            </div>
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
            setPageMode(0);
            setShowScanner(false);
          }}
        ></QRScanner1>
      )}
    </UserAuth>
  );
}
