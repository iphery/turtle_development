"use client";
import { useMediaQuery } from "react-responsive";
import UserAuth from "./auth";
import DefaultLayout from "./Layouts/DefaultLayout";
import CardDataStats from "./CardDataStats";
import { BsUpcScan } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QRScanner1 from "./qrscanner2";
import { API_URL } from "@/utils/constant";
import axios from "axios";
import { NotifyError } from "@/utils/notify";
import {
  formatDateLocal,
  formatDateLocal1,
  formatDateLocal2,
  getTodayLabel,
} from "@/utils/dateformat";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../app/firebase-config";
import { PageCard } from "./card";

export default function Dashboard() {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });
  const router = useRouter();
  const [showScanner, setShowScanner] = useState(false);
  const [scanProduct, setScanProduct] = useState("");
  const [loan, setLoan] = useState([]);
  const [trans, setTrans] = useState([]);
  const [transSum, setTransSum] = useState([]);

  const fetch_dashboard = async () => {
    const apiurl = `${API_URL}/fetchdashboard`;
    const response = await axios.get(apiurl);
    if (response.status === 200) {
      const result = response.data;
      setLoan(result["tools"]);
      setTrans(result["transactions"]);
      setTransSum(result["count"]);
      console.log(result["count"]);
    }
  };

  const find_product = async () => {
    console.log("prodse cari");
    const apiurl = `${API_URL}/findproduct`;
    const response = await axios.post(apiurl, { barcode: scanProduct });
    if (response.status === 200) {
      console.log(response.data);
      const error = response.data["error"];
      if (error == 1) {
        NotifyError("Product not found");
        setScanProduct("");
      } else {
        const id = response.data["id_product"];
        router.push(`/product/${id}`);
      }
    }
  };

  useEffect(() => {
    if (scanProduct != "") {
      console.log("cari server");
      find_product();
    }
  }, [scanProduct]);

  useEffect(() => {
    fetch_dashboard();
  }, []);

  const email = "iphery@gmail.com";
  useEffect(() => {
    if (!email) return;

    const unsubscribe = onSnapshot(
      doc(db, "dashboard", email),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data.update) {
            fetch_dashboard();
          } else {
            console.log("jangan update");
          }
          /*
            setStatus({
            update: data.update || false,
            update_at: data.update_at?.toDate() || null,
          });
          */
        }
      },
      (error) => console.error("Error:", error),
    );

    return () => unsubscribe();
  }, [email]);

  return (
    <>
      {!showScanner ? (
        <UserAuth>
          <DefaultLayout>
            <div>
              <div className="flex justify-start  ">
                <div
                  onClick={() => {
                    setShowScanner(true);
                  }}
                  className="cursor:default group mr-3 flex items-center justify-start border bg-white p-3 shadow-md"
                >
                  <BsUpcScan className="w-8" />
                  <div>Find product</div>
                </div>
                {/**
                <div className="flex items-center justify-start border bg-white p-3 shadow-md">
                  <BsUpcScan className="w-8" />
                  <div>Find tool</div>
                </div>
                 */}
              </div>
              <div className="mb-5"></div>
              <div>
                <PageCard>
                  <div
                    className={`mb-3 font-bold ${isSmallScreen ? "bg-strokedark p-1 text-white" : ""}`}
                  >
                    Today Stock Out
                  </div>

                  {!isSmallScreen ? (
                    <table className="w-full">
                      <thead className="bg-strokedark text-white">
                        <tr>
                          <th className="p-1">Date</th>
                          <th className="p-1">Description</th>
                          <th className="p-1">Quantity</th>
                          <th className="p-1">Unit</th>
                        </tr>
                      </thead>
                      {transSum.length > 0 ? (
                        <tbody>
                          {transSum.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td className="p-1 text-center">
                                  {getTodayLabel(item["date"])}
                                </td>
                                <td className="p-1">
                                  <div
                                    className="cursor-default hover:text-strokedark"
                                    onClick={() => {
                                      router.push(
                                        `/product/${item["id_product"]}`,
                                      );
                                    }}
                                  >
                                    {item["description"]}
                                  </div>
                                </td>
                                <td className="p-1 text-center">
                                  {item["quantity"]}
                                </td>
                                <td className="p-1 text-center">
                                  {item["unit"]}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      ) : (
                        <div className="p-3">No history found</div>
                      )}
                    </table>
                  ) : transSum.length > 0 ? (
                    transSum.map((item, index) => {
                      return (
                        <div className="mb-2" key={index}>
                          <div
                            className="p-3 shadow-md"
                            onClick={() => {
                              router.push(`/product/${item["id_product"]}`);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div> {getTodayLabel(item["date"])}</div>
                            </div>
                            <div className="text-sm font-bold">Description</div>
                            <div>{item["description"]}</div>
                            <div className="text-sm font-bold">Quantity</div>
                            <div className="flex items-center justify-between">
                              <div> {item["quantity"]}</div>
                              <div>{item["unit"]}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-1">No history found</div>
                  )}
                </PageCard>
                <div className="mt-5"></div>
                <PageCard>
                  <div
                    className={`mb-3 font-bold ${isSmallScreen ? "bg-strokedark p-1 text-white" : ""}`}
                  >
                    Outstanding Transaction
                  </div>

                  {!isSmallScreen ? (
                    <table className="w-full ">
                      <thead className="bg-strokedark text-white">
                        <tr>
                          <th className="p-1">Date</th>
                          <th className="p-1">Transaction ID</th>
                          <th className="p-1">Description</th>

                          <th className="p-1">Quantity</th>
                          <th className="p-1">Unit</th>
                          <th className="p-1">Peminjam</th>
                          <th className="p-1">Status</th>
                        </tr>
                      </thead>
                      {trans.length > 0 ? (
                        <tbody>
                          {trans.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td className="p-1 text-center">
                                  {getTodayLabel(item["date"])}
                                </td>
                                <td className="p-1 text-center">
                                  <div
                                    className="cursor-default hover:text-strokedark"
                                    onClick={() => {
                                      router.push(
                                        `/transaction/${item["id_transaction"]}`,
                                      );
                                    }}
                                  >
                                    {item["id_transaction"]}
                                  </div>
                                </td>
                                <td className="p-1">{item["description"]}</td>
                                <td className="p-1 text-center">
                                  {item["quantity"]}
                                </td>
                                <td className="p-1 text-center">
                                  {item["unit"]}
                                </td>
                                <td>{item["subject"]}</td>
                                <td className="p-1">
                                  {item["signed"] == 0 ? (
                                    <div className="bg-red px-1 text-sm text-white">
                                      Not signed
                                    </div>
                                  ) : (
                                    "Signed"
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      ) : (
                        <div className="p-3">No history found</div>
                      )}
                    </table>
                  ) : trans.length > 0 ? (
                    trans.map((item, index) => {
                      return (
                        <div className="mb-2" key={index}>
                          <div
                            className="p-3 shadow-md"
                            onClick={() => {
                              router.push(
                                `/transaction/${item["id_transaction"]}`,
                              );
                            }}
                          >
                            <div className="text-sm font-bold">Date</div>
                            <div className="flex items-center justify-between">
                              <div> {getTodayLabel(item["date"])}</div>
                              <div>{item["id_transaction"]}</div>
                            </div>
                            <div className="text-sm font-bold">Description</div>
                            <div>{item["description"]}</div>
                            <div className="text-sm font-bold">Quantity</div>
                            <div className="flex items-center justify-between">
                              <div> {item["quantity"]}</div>
                              <div>{item["unit"]}</div>
                            </div>
                            <div>Request by</div>
                            <div className="flex items-center justify-between">
                              <div> {item["subject"]}</div>
                              <div>
                                {" "}
                                {item["signed"] == 0 ? (
                                  <div className="bg-red px-1 text-sm text-white">
                                    Not signed
                                  </div>
                                ) : (
                                  "Signed"
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-1">No history found</div>
                  )}
                </PageCard>
                <div className="mt-5"></div>
                <PageCard>
                  <div
                    className={`mb-3 font-bold ${isSmallScreen ? "bg-strokedark p-1 text-white" : ""}`}
                  >
                    Unreturned Tool
                  </div>
                  {!isSmallScreen ? (
                    <table className="w-full">
                      <thead className="bg-strokedark text-white">
                        <tr>
                          <th className="p-1">Description</th>
                          <th className="p-1"> Date</th>
                          <th className="p-1">Quantity</th>
                          <th className="p-1">Unit</th>
                          <th className="p-1">Peminjam</th>
                        </tr>
                      </thead>
                      {loan.length > 0 ? (
                        <tbody>
                          {loan.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td className="p-1">
                                  {" "}
                                  <div
                                    className="cursor-default hover:text-strokedark"
                                    onClick={() => {
                                      router.push(`/tool/${item["id_asset"]}`);
                                    }}
                                  >
                                    {item["description"]}
                                  </div>
                                </td>
                                <td className="p-1 text-center">
                                  {formatDateLocal1(item["date"])}
                                </td>
                                <td className="p-1 text-center">
                                  {item["quantity"]}
                                </td>
                                <td className="p-1 text-center">
                                  {item["unit"]}
                                </td>
                                <td className="p-1">{item["subject"]}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      ) : (
                        <div className="p-3">No history found</div>
                      )}
                    </table>
                  ) : loan.length > 0 ? (
                    loan.map((item, index) => {
                      return (
                        <div className="mb-2" key={index}>
                          <div
                            className="p-3 shadow-md"
                            onClick={() => {
                              router.push(`/tool/${item["id_asset"]}`);
                            }}
                          >
                            <div className="text-sm font-bold">Date</div>
                            <div className="flex items-center justify-between">
                              <div> {getTodayLabel(item["date"])}</div>
                            </div>
                            <div className="text-sm font-bold">Description</div>
                            <div>{item["description"]}</div>
                            <div className="text-sm font-bold">Quantity</div>
                            <div className="flex items-center justify-between">
                              <div> {item["quantity"]}</div>
                              <div>{item["unit"]}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-1">No history found</div>
                  )}
                </PageCard>
              </div>
            </div>
          </DefaultLayout>
        </UserAuth>
      ) : (
        <QRScanner1
          onScanResult={(res) => {
            setShowScanner(false);
            setScanProduct(res);
          }}
        ></QRScanner1>
      )}
    </>
  );
}
