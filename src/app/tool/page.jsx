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
import QRScanner1 from "@/components/qrscanner2";
import Camera1 from "@/components/camera1";
import { dataURLtoBlob } from "@/utils/dataurltofile";
import { compressImage } from "@/utils/compressimage";

export default function Page() {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });
  const router = useRouter();

  const [showDropdown, setShowDropdown] = useState(false);
  const [tools, setTools] = useState([]);
  const [filteredTools, setFileredTools] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [modalAdd, setModalAdd] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [inputData, setInputData] = useState({
    barcode: "",
    description: "",
    quantity: "",
    unit: "",
    category: "",
    location: "",
    detail_location: "",
    note: "",
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");

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

  useEffect(() => {
    console.log("hahaha scrolling");
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
          console.log(src);
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
                          setInputData({
                            barcode: "",
                            description: "",
                            quantity: "",
                            unit: "",
                            category: "",
                            location: "",
                            detail_location: "",
                            note: "",
                          });
                          setFile(null);
                          setFilePreview(null);
                          toggleDropdown();
                          setModalAdd(true);
                        }}
                      >
                        Add Tool
                      </div>

                      <div
                        className="text-md text-gray-800 block w-full cursor-default px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white"
                        onClick={() => {
                          router.push("barcode");
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
                            <tr
                              key={index}
                              onClick={() => {
                                router.push(`/tool/${item["id_asset"]}`);
                              }}
                              className=" hover:bg-bodydark"
                            >
                              <td className="p-1 text-center">{index + 1}</td>
                              <td className="p-1 ">{item["description"]}</td>
                              <td className="p-1 text-center">
                                {item["image_url"] != "" ? (
                                  <img
                                    className="h-20"
                                    src={`${ASSET_URL}/${item["image_url"]}`}
                                  />
                                ) : (
                                  <></>
                                )}
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
                              <td className="p-1 ">{`${item["location"]} ${item["detail_location"] == null ? "" : item["detail_location"]}`}</td>
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
                        <div
                          className="py-1"
                          key={index}
                          onClick={() => {
                            router.push(`/tool/${item["id_asset"]}`);
                          }}
                        >
                          <div className="p-2 shadow-sm">
                            <div>{item["description"]}</div>
                            {item["image_url"] != "" ? (
                              <img
                                className="h-20"
                                src={`${ASSET_URL}/${item["image_url"]}`}
                              />
                            ) : (
                              <></>
                            )}
                            <div className="mt-2 text-xs font-bold">
                              Category
                            </div>
                            <div>{item["category"]}</div>
                            <div className="mt-2 text-xs font-bold">
                              Location
                            </div>
                            <div>{`${item["location"]} ${item["detail_location"] != null ? item["detail_location"] : ""}`}</div>
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
            inputData={inputData}
            setInputData={setInputData}
            file={file}
            setFile={setFile}
            filePreview={filePreview}
            setFilePreview={setFilePreview}
            onClose={(val) => {
              setModalAdd(val);
              setRefresh(true);
            }}
            showScanner={() => {
              //  localStorage.setItem("tempNewTool", "");
              setShowScanner(true);
            }}
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
