"use client";
import UserAuth from "@/components/auth";
import { PageCard } from "@/components/card";
import { CommonInput } from "@/components/input";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { CustomModal } from "@/components/modal";
import { API_URL } from "@/utils/constant";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import NewProduct from "@/components/newproduct";
import { SearchScanner } from "@/components/searchscanner";
import { useMediaQuery } from "react-responsive";
import QRScanner from "@/components/qrscan1";
import QRScanner1 from "../../components/qrscanner2";
import Camera1 from "@/components/camera1";
import { dataURLtoBlob } from "@/utils/dataurltofile";
import { compressImage } from "@/utils/compressimage";
import { useProvider } from "../appcontext";

export default function Page() {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });
  const {
    products,
    setProducts,
    filteredProducts,
    setFilteredProducts,
    keywordProduct,
    setKeywordProduct,
  } = useProvider();

  const router = useRouter();
  const [modalAdd, setModalAdd] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState();

  const fetch_product = async () => {
    const apiUrl = `${API_URL}/product`;
    const response = await axios.get(apiUrl);

    if (response.status == 200) {
      const products = response.data["products"];
      setProducts(products);
      if (keywordProduct == "") {
        setFilteredProducts(products);
      }
      //setFilteredProducts(products);
      //search_product();
      // console.log(products);
    }
  };

  const search_product = () => {
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
  };

  useEffect(() => {
    fetch_product();
  }, []);

  useEffect(() => {
    if (refresh) {
      fetch_product();
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    search_product();
  }, [keywordProduct]);

  useEffect(() => {
    if (modalAdd) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup when modal is closed
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [modalAdd]);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const [showScanner, setShowScanner] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const [inputData, setInputData] = useState({
    description: "",
    barcode: "",
    unit: "",
    category: "",
    location: "",
    initial_stock: "",
  });

  if (showScanner) {
    return (
      <QRScanner1
        onScanResult={(val) => {
          setScanResult(val);
        }}
        exit={() => {
          setShowScanner(false);
        }}
      ></QRScanner1>
    );
  }

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

            // setCompressedImage(compressedFile);
            setImageFile(compressedFile);
            //const selectedFile = event.target.files[0];
            //setFile(selectedFile);
            //setFilePreview(URL.createObjectURL(selectedFile));
            // setFile(compressedFile);
            //setFilePreview(URL.createObjectURL(compressedFile));
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
      <div className="relative">
        <div className="absolute z-0 h-full w-full">
          <DefaultLayout>
            <div className="mb-3 flex items-center justify-between">
              <div className=" text-xl font-bold">Product</div>

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
                      {parseInt(localStorage.getItem("userlevel")) <= 1 ? (
                        <div
                          className="text-md text-gray-800 block w-full cursor-default px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white"
                          onClick={() => {
                            setInputData({
                              description: "",
                              barcode: "",
                              unit: "",
                              category: "",
                              location: "",
                              initial_stock: "",
                            });
                            setFile(null);
                            setFilePreview(null);
                            toggleDropdown();
                            setModalAdd(true);
                          }}
                        >
                          Add Product
                        </div>
                      ) : (
                        <></>
                      )}

                      <div
                        className="text-md text-gray-800 block w-full cursor-default px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white"
                        onClick={() => {
                          router.push("/productcode");
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
                      input={keywordProduct}
                      onInputChange={(val) => {
                        setKeywordProduct(val);
                      }}
                    ></CommonInput>
                  </div>
                </div>
                {!isSmallScreen ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-strokedark text-white">
                          <th>No</th>
                          <th>Description</th>

                          <th>Barcode</th>
                          <th>Quantity</th>
                          <th>Unit</th>
                          <th>Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((item, index) => {
                          return (
                            <tr
                              key={index}
                              onClick={() => {
                                router.push(`/product/${item["id_product"]}`);
                              }}
                              className=" hover:bg-bodydark"
                            >
                              <td className="p-1 text-center">{index + 1}</td>
                              <td className="p-1">{item["description"]}</td>
                              <td className="p-1 ">{item["barcode"]}</td>

                              <td className="p-1 text-center">
                                {item["available_quantity"]}
                              </td>
                              <td className="p-1 text-center">
                                {item["unit"]}
                              </td>
                              <td className="p-1 text-center">
                                {item["category"]}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-3">
                    {filteredProducts.map((item, index) => {
                      return (
                        <div
                          className="py-1"
                          key={index}
                          onClick={() => {
                            router.push(`/product/${item["id_product"]}`);
                          }}
                        >
                          <div className="p-2 shadow-sm">
                            <div>{item["description"]}</div>
                            <div className="mt-1 text-xs font-bold">
                              Barcode
                            </div>
                            <div>{item["barcode"]}</div>
                            <div className="mt-1 text-xs font-bold">
                              Category
                            </div>
                            <div>{item["category"]}</div>
                            <div className="mt-1 text-xs font-bold">
                              Available Quantity
                            </div>
                            <div className="flex justify-between">
                              <div>{item["available_quantity"]}</div>
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
            onClose={(val) => {
              setModalAdd(val);
              setRefresh(true);
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
}
