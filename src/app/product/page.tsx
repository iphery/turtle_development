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
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoInformationCircle } from "react-icons/io5";
import { MdClear } from "react-icons/md";

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
type ImageFile = File | null;

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearch, setCurrentSearch] = useState("");
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
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

  const [filePreview, setFilePreview] = useState();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [modalAdd, setModalAdd] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const fetch_product = async () => {
    const apiUrl = `${API_URL}/product1?page=${currentPage}&keyword=${currentSearch}`;
    // const apiUrl = `${API_URL}/product`;
    console.log(apiUrl);
    const response = await axios.get(apiUrl);

    if (response.status == 200) {
      const data = response.data;
      // const products = response.data["products"];
      setProducts(data.products);
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

  const [showScanner, setShowScanner] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [scanResult, setScanResult] = useState("");

  if (showScanner) {
    return (
      <QRScanner1
        onScanResult={(val: any) => {
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
        onResult={async (src: any) => {
          const blob = dataURLtoBlob(src);
          const file = new File([blob], "image.jpg", { type: blob.type });
          console.log(file.size / 1024 / 1024, "MB");
          try {
            if (!file) return;
            const compressedFile = await compressImage(file, {
              maxSizeMB: 0.5, // Compress to 0.5MB
              maxWidthOrHeight: 1024, // Max width/height of 1024px
            });
            console.log(compressedFile.size / 1024 / 1024, "MB");

            // setCompressedImage(compressedFile);
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
      <div className="relative">
        <div className="absolute z-0 h-full w-full">
          <DefaultLayout>
            <Breadcrumb pageName="Product" />

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
                        {userLevel && parseInt(userLevel) <= 1 ? (
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
                              setFilePreview(undefined);
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

              <div className="px-5">
                <div className="overflow-x-auto  ">
                  <table className="w-full">
                    <thead className="border-b border-t border-bodydark1">
                      <tr className="select-none">
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Barcode</th>

                        <th className="p-3 text-left">Category</th>
                        <th className="p-3 text-left">Stock</th>
                        <th className="p-3 text-left">Unit</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {products.map((item: Product, key) => {
                        return (
                          <tr
                            key={key}
                            className={`border-b border-bodydark1 ${parseInt(userLevel) <= 2 ? "hover:cursor-pointer hover:text-strokedark" : "select-none"} `}
                            onClick={() => {
                              if (parseInt(userLevel) <= 2) {
                                router.push(`/product/${item["id_product"]}`);
                              }
                            }}
                          >
                            <td className="p-3 text-left">
                              <div className="">{item.description}</div>
                            </td>
                            <td className=" p-3 text-left ">
                              <div className="overflow-wrap: break-word w-[100px]">
                                {" "}
                                {item.barcode}
                              </div>
                            </td>
                            <td className="p-3 text-left">
                              <div className="">
                                {item.category
                                  ? item.category.toUpperCase()
                                  : ""}
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <div className="">{item.available_quantity}</div>
                            </td>
                            <td className="p-3 text-left">
                              <div className="">
                                {item.unit ? item.unit.toUpperCase() : ""}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {!onload && products.length == 0 && (
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
};

export default Products;
