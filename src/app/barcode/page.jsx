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

export default function Page() {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const router = useRouter();
  const [modalAdd, setModalAdd] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [selectedCheckbox, setSelectedCheckbox] = useState("");

  const fetch_product = async () => {
    const apiUrl = `${API_URL}/barcode`;
    const response = await axios.get(apiUrl);

    if (response.status == 200) {
      const products = response.data["products"];
      setProducts(products);
      setFilteredProducts(products);
      console.log(products);
    }
  };

  const search_product = () => {
    const filterData = products.filter((item) => {
      const desc =
        item["description"] &&
        item["description"].toLowerCase().includes(keyword.toLowerCase());

      return desc;
    });
    setFilteredProducts(filterData);
  };

  const update_checkbox = (id) => {
    const newdata = [...products];
    const index = newdata.findIndex((product) => product.id_product === id);
    //console.log(newdata[index].checked);
    if (index !== -1) {
      // Update the item at the found index
      newdata[index] = {
        ...newdata[index],
        checked: !newdata[index].checked,
      };
      setProducts(newdata);
      //setFilteredProducts(newdata);
      console.log(newdata);
    }
    setSelectedCheckbox("");
  };

  useEffect(() => {
    fetch_product();
  }, []);

  useEffect(() => {
    update_checkbox(selectedCheckbox);
    if (selectedCheckbox != "") {
      console.log(selectedCheckbox);
      update_checkbox(selectedCheckbox);
    }
  }, [selectedCheckbox]);

  useEffect(() => {
    if (refresh) {
      fetch_product();
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    search_product();
  }, [keyword, selectedCheckbox]);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const [showScanner, setShowScanner] = useState(false);

  return (
    <UserAuth>
      {!showScanner ? (
        <div className="relative">
          <div className="absolute z-0 h-full w-full">
            <DefaultLayout>
              <div className="mb-3 flex items-center justify-between">
                <div className=" text-xl font-bold">Barcode</div>

                <div className="relative z-20">
                  <button
                    onClick={() => {
                      const filterData = products.filter((item) => {
                        const checked = item.checked;

                        return checked;
                      });

                      localStorage.setItem(
                        "barcodetoprint",
                        JSON.stringify(filterData),
                      );

                      router.push("/barcode/print");
                    }}
                    className="rounded-md bg-strokedark px-3 py-1 text-white"
                  >
                    <div className="flex items-center justify-start">
                      <div>Print</div>
                    </div>
                  </button>
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
                            <th>Barcode</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Option</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((item, index) => {
                            return (
                              <tr key={index} className=" ">
                                <td className="p-1 text-center">{index + 1}</td>
                                <td className="p-1 text-center">
                                  {item["barcode"]}
                                </td>
                                <td className="p-1">{item["description"]}</td>

                                <td className="p-1 text-center">
                                  {item["category"]}
                                </td>
                                <td className="p-1 text-center">
                                  <input
                                    type="checkbox"
                                    checked={item["checked"]}
                                    onChange={() => {
                                      console.log("hehe");
                                      setSelectedCheckbox(item["id_product"]);
                                    }}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                  />
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
                              <div>{item["id_product"]}</div>
                              <div>{item["barcode"]}</div>
                              <div>{item["description"]}</div>
                              <div>{item["category"]}</div>
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
              showScanner={() => {
                setShowScanner(true);
              }}
              onClose={(val) => {
                setModalAdd(val);
                setRefresh(true);
              }}
              scanResult={scanResult}
            />
          </CustomModal>
        </div>
      ) : (
        <SearchScanner
          onScanResult={(val) => {
            setScanResult(val);
          }}
          exit={() => {
            setShowScanner(false);
          }}
        ></SearchScanner>
      )}
    </UserAuth>
  );
}
