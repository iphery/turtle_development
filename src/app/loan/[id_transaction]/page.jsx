"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UserAuth from "@/components/auth";
import { PageCard } from "@/components/card";
import { ButtonLoader, CommonLoader } from "@/components/loader";
import { API_URL } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { CiLogin } from "react-icons/ci";
import { IoDocumentTextOutline } from "react-icons/io5";
import { formatDateLocal1, formatDateLocal2 } from "@/utils/dateformat";

export default function Page({ params }) {
  const [trans, setTrans] = useState({});
  const [detail, setDetail] = useState([]);
  const [onClose, setOnClose] = useState(false);
  const [onCloseAll, setOnCloseAll] = useState(false);
  const fetch_data = async () => {
    const apiurl = `${API_URL}/fetchdetailloan`;
    const response = await axios.post(apiurl, {
      idTransaction: params.id_transaction,
    });
    if (response.status == 200) {
      console.log(response.data);
      const newtrans = response.data["transactions"][0];
      const newdetail = response.data["details"];
      setTrans(newtrans);
      setDetail(newdetail);
      console.log(newtrans);
      console.log(newdetail);
    }
  };

  useEffect(() => {
    fetch_data();
  }, []);

  return (
    <UserAuth>
      <DefaultLayout>
        <div className="mb-3 text-xl font-bold">Loan Detail</div>
        <PageCard>
          <div className="mb-2 sm:mb-0 sm:flex sm:flex-row">
            <div className="w-full sm:w-1/2 ">
              <div className="mb-2 sm:flex sm:justify-evenly">
                <div className="w-full">No Transaction</div>
                <div className="w-full">{trans.id_transaction}</div>
              </div>
              <div className="mb-2 sm:flex sm:justify-evenly">
                <div className="w-full">Date</div>
                <div className="w-full">{formatDateLocal1(trans.date)}</div>
              </div>
              <div className="mb-2 sm:flex sm:justify-evenly">
                <div className="w-full">Issued</div>
                <div className="w-full">{trans.name}</div>
              </div>
              <div className="mb-2 sm:flex sm:justify-evenly">
                <div className="w-full">
                  {trans.type == "IN" ? "From" : "To"}
                </div>
                <div className="w-full">{trans.subject}</div>
              </div>
            </div>
            <div className="w-full sm:w-1/2">
              {trans.type == "OUT" ? (
                <div className="mb-2 sm:flex sm:justify-evenly">
                  <div className="w-full">Note</div>
                  <div className="w-full">{trans.note}</div>
                </div>
              ) : (
                <></>
              )}

              <div className="mb-2 sm:flex sm:justify-evenly">
                <div className="w-full items-center">Status</div>
                <div className="flex w-full items-center">
                  {trans.status == 1 ? (
                    <span className="rounded-md bg-red px-1 text-sm text-white">
                      Close
                    </span>
                  ) : (
                    <div className="flex items-center justify-start">
                      <span className="rounded-md bg-success px-1 text-sm text-white">
                        Open
                      </span>
                      <span
                        onClick={async () => {
                          setOnCloseAll(true);
                          const apiurl = `${API_URL}/closeallloan`;
                          const response = await axios.post(apiurl, {
                            idTransaction: params.id_transaction,
                            uid: localStorage.getItem("userUid"),
                          });

                          if (response.status === 200) {
                            console.log(response.data);
                          }
                          fetch_data();
                          setOnCloseAll(false);
                        }}
                        className="ml-2 cursor-default text-sm hover:text-red"
                      >
                        {onCloseAll ? <ButtonLoader /> : <>Close All</>}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </PageCard>
        <div className="mb-5"></div>
        <PageCard>
          <div className="p-2">
            <table className="w-full">
              <thead>
                <tr className="bg-strokedark text-white">
                  <th>No</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Status</th>
                  <th>Received By</th>
                </tr>
              </thead>
              <tbody>
                {detail.length > 0 &&
                  detail.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="p-1 text-center">{index + 1}</td>
                        <td className="p-1 ">{item["description"]}</td>
                        <td className="p-1 text-center">{item["quantity"]}</td>
                        <td className="p-1 text-center">{item["unit"]}</td>
                        <td className="p-1 text-center">
                          {item["status"] == 1 ? (
                            <div className="rounded-md bg-red px-1 text-center text-xs text-white">
                              Close
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <div className="rounded-md bg-success px-1 text-center text-sm text-white">
                                Open
                              </div>
                              {onClose ? (
                                <div className="ml-2">
                                  <CommonLoader />
                                </div>
                              ) : (
                                <div className="ml-2">
                                  <CiLogin
                                    className="h-6 w-6 hover:text-red"
                                    onClick={async () => {
                                      setOnClose(true);
                                      const apiurl = `${API_URL}/closeloan`;
                                      const response = await axios.post(
                                        apiurl,
                                        {
                                          idTransaction: params.id_transaction,
                                          idAsset: item["id_asset"],
                                          uid: localStorage.getItem("userUid"),
                                        },
                                      );

                                      if (response.status === 200) {
                                        console.log(response.data);
                                      }
                                      fetch_data();
                                      setOnClose(false);
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td>
                          {item.status == 1 ? (
                            <div className="flex flex-col text-center">
                              <span className="text-sm">{item.name}</span>
                              <span className="text-xs">
                                {formatDateLocal2(item.received_at)}
                              </span>
                            </div>
                          ) : (
                            <></>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </PageCard>
        <div className="mb-5"></div>

        {trans.type == "OUT" ? (
          <PageCard>
            <div className="sm:flex sm:justify-evenly">
              <div className="w-full">
                <div className="flex items-center justify-start">
                  <div>Signed at :</div>
                  <div className="ml-3">
                    {formatDateLocal2(trans.signed_at)}
                  </div>
                  <div
                    className="ml-3 hover:text-warning"
                    onClick={() => {
                      window.open(
                        `/receipt/${trans.token}`,
                        "_blank",
                        "noopener,noreferrer",
                      );
                    }}
                  >
                    <IoDocumentTextOutline />
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="flex justify-start">
                  <div>Signature :</div>
                  <div className="ml-3">
                    <img src={trans.signature} className="h-12" />
                  </div>
                </div>
              </div>
            </div>
          </PageCard>
        ) : (
          <></>
        )}
      </DefaultLayout>
    </UserAuth>
  );
}
