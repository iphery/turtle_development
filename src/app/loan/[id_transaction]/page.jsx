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
import { CustomModal } from "@/components/modal";
import { IoIosWarning, IoMdArrowDropdown } from "react-icons/io";
import { CommonInput } from "@/components/input";
import { CommonButton } from "@/components/button";
import { NotifyError, NotifySuccess } from "@/utils/notify";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { FaWhatsapp } from "react-icons/fa";

export default function Page({ params }) {
  const [trans, setTrans] = useState({});
  const [detail, setDetail] = useState([]);
  const [onClose, setOnClose] = useState(false);
  const [onCloseAll, setOnCloseAll] = useState(false);
  const [modalClose, setModalClose] = useState(false);
  const [status, setStatus] = useState([]);
  const [uncompleted, setUncompleted] = useState([]);
  const [onSubmitUncompleted, setOnSubmitUncompleted] = useState(false);
  const [submitPermission, setSubmitPermission] = useState(false);
  const [resend, setResend] = useState(false);

  const fetch_data = async () => {
    const apiurl = `${API_URL}/fetchdetailloan`;
    const response = await axios.post(apiurl, {
      idTransaction: params.id_transaction,
    });
    if (response.status == 200) {
      console.log(response.data);
      const newtrans = response.data["transactions"][0];
      const newdetail = response.data["details"];
      const uncompleted = response.data["uncompleted"];
      setTrans(newtrans);
      setDetail(newdetail);
      setUncompleted(uncompleted);

      console.log("ahahah");
      let sts = [];

      for (let i = 0; i < uncompleted.length; i++) {
        sts.push({
          index: i,
          ok: false,
          nok: false,
          description: "",
          check_error: true,
          desc_error: false,
          idAsset: uncompleted[i]["id_asset"],
        });
      }

      console.log(sts);

      setStatus(sts);
    }
  };

  const validate_data = async (newdata) => {
    const result = newdata.some((item) => !item.check_error);
    setSubmitPermission(result);
  };

  useEffect(() => {
    fetch_data();
  }, []);

  useEffect(() => {
    if (modalClose) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup when modal is closed
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [modalClose]);

  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const resend_message = async () => {
    setResend(true);
    const apiurl = `${API_URL}/resendmessage`;
    const response = await axios.post(apiurl, {
      term: "loan",
      idTransaction: params.id_transaction,
    });
    if (response.status == 200) {
      NotifySuccess("Message sent !");
    }
    setResend(false);
  };
  return (
    <UserAuth>
      <div className="relative">
        <div className="absolute  z-0 h-full w-full">
          <DefaultLayout>
            <div className="mb-3 flex items-center justify-between">
              <div
                className="mb-3 text-xl font-bold"
                onClick={() => {
                  console.log(checkbox);
                }}
              >
                Loan Detail
              </div>
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
                          console.log(uncompleted.length);
                          if (uncompleted.length > 0) {
                            setModalClose(true);
                          } else {
                            NotifyError("All tools already received");
                          }

                          toggleDropdown();
                        }}
                      >
                        Receive Tool
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

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
                      <span
                        className={`px-1 text-center text-sm text-white ${trans.status == 1 ? "bg-red" : "bg-success"}`}
                      >
                        {`${trans.status == 1 ? "Close" : "Open"}`}
                      </span>
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
                            <td className="p-1 ">
                              <div>{item["description"]}</div>
                              {item["status"] == 1 ? (
                                <div>
                                  {item["receive_status"] == 1 ? (
                                    <div className="text-sm">Status : OK</div>
                                  ) : item["receive_status"] == 2 ? (
                                    <div className="flex items-center justify-start">
                                      <span className="text-sm">
                                        Status : NOK
                                      </span>
                                      <div className="text-warning">
                                        {" "}
                                        <IoIosWarning className="h-5 w-5" />
                                      </div>
                                    </div>
                                  ) : (
                                    <></>
                                  )}

                                  {item["receive_status"] == 2 ? (
                                    <p className="text-sm">{`Remark :${item["remark"]}`}</p>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              ) : (
                                <></>
                              )}
                            </td>
                            <td className="p-1 text-center">
                              {item["quantity"]}
                            </td>
                            <td className="p-1 text-center">{item["unit"]}</td>
                            <td className="p-1 text-center">
                              <div
                                className={` ${item["status"] == 1 ? "bg-red" : "bg-success"} px-1 text-center text-sm text-white`}
                              >
                                {`${item["status"] == 1 ? "Close" : "Open"}`}
                              </div>
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
                      <div className="mr-2">Signed at :</div>
                      {trans.signed == 0 ? (
                        resend ? (
                          <ButtonLoader />
                        ) : (
                          <>
                            <div
                              onClick={resend_message}
                              data-tooltip-id="my-tooltip-1"
                              className="cursor-default text-success hover:text-warning"
                            >
                              <FaWhatsapp />
                            </div>

                            <ReactTooltip
                              id="my-tooltip-1"
                              place="bottom"
                              content="Resend message to requestor"
                            />
                          </>
                        )
                      ) : (
                        <>
                          <div className="ml-3">
                            {formatDateLocal2(trans.signed_at)}
                          </div>
                          <div
                            className="ml-3 hover:text-warning"
                            onClick={() => {
                              window.open(
                                `/loanreceipt/${trans.token}`,
                                "_blank",
                                "noopener,noreferrer",
                              );
                            }}
                          >
                            <IoDocumentTextOutline />
                          </div>
                        </>
                      )}
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
        </div>
        <CustomModal
          onClose={() => {
            setModalClose(false);
          }}
          isVisible={modalClose}
          isSmallWidth="lg"
        >
          <table className="w-full">
            <thead className="bg-strokedark text-white">
              <tr>
                <th className="p-1">No</th>
                <th className="p-1">Item</th>

                <th className="p-1">Quantity</th>
                <th className="p-1">Unit</th>
                <th className="p-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {uncompleted.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="p-1 text-center">{index + 1}</td>
                    <td className="p-1">{item["description"]}</td>
                    <td className="p-1 text-center">{item["quantity"]}</td>
                    <td className="p-1 text-center">{item["unit"]}</td>
                    <td className="p-1 text-center">
                      <div className="flex items-center justify-center ">
                        <span className="mr-1">OK</span>
                        <input
                          type="checkbox"
                          checked={status[index].ok}
                          onChange={(e) => {
                            const value = e.target.checked;
                            const newdata = [...status];
                            newdata[index].ok = value;
                            if (value) {
                              newdata[index].nok = false;
                            }

                            status.map((item, index) => {
                              if (
                                (!item.ok && item.nok) ||
                                (item.ok && !item.nok)
                              ) {
                                newdata[index].check_error = false;
                              } else {
                                newdata[index].check_error = true;
                              }
                            });
                            validate_data(newdata);

                            setStatus(newdata);
                          }}
                        />
                        <div className="m-2"></div>
                        <span className="mr-1">NOK</span>
                        <input
                          type="checkbox"
                          checked={status[index].nok}
                          onChange={(e) => {
                            const value = e.target.checked;
                            const newdata = [...status];
                            newdata[index].nok = value;
                            if (value) {
                              newdata[index].ok = false;
                            }

                            status.map((item, index) => {
                              if (
                                (!item.ok && item.nok) ||
                                (item.ok && !item.nok)
                              ) {
                                newdata[index].check_error = false;
                              } else {
                                newdata[index].check_error = true;
                              }
                            });
                            validate_data(newdata);

                            setStatus(newdata);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="my-5"></div>
          {status.map((item, index) => {
            if (item.nok) {
              return (
                <div className="mt-3 " key={index}>
                  <div className="">
                    <div className="text-sm font-bold">
                      {detail[index].description}
                    </div>
                    <CommonInput
                      placeholder={"Write current condition"}
                      input={status[index].description}
                      onInputChange={(value) => {
                        const newdata = [...status];
                        newdata[index].description = value;
                        setStatus(newdata);
                      }}
                      error={status[index].desc_error}
                      onChg={() => {
                        const newdata = [...status];
                        newdata[index].desc_error = false;
                        setStatus(newdata);
                      }}
                    ></CommonInput>
                  </div>
                </div>
              );
            }
            return <div key={index}></div>;
          })}
          <div className="mt-10"></div>

          {submitPermission ? (
            <div className="flex justify-end">
              {" "}
              <CommonButton
                label={"Receive"}
                disabled={onSubmitUncompleted}
                onload={onSubmitUncompleted}
                onClick={async () => {
                  const newdata = [...status];

                  status.map((item, index) => {
                    if (item.nok && item.description == "") {
                      newdata[index].desc_error = true;
                    } else {
                      newdata[index].desc_error = false;
                    }
                  });
                  setStatus(newdata);
                  console.log(newdata);
                  const error_checking = newdata.every(
                    (item) => !item.desc_error,
                  );

                  if (error_checking) {
                    console.log("good to go");
                    setOnSubmitUncompleted(true);
                    const apiurl = `${API_URL}/receivedtool`;
                    const response = await axios.post(apiurl, {
                      idTransaction: params.id_transaction,
                      data: status,
                      uid: localStorage.getItem("userUid"),
                    });
                    if (response.status === 200) {
                      console.log(response.data);
                      setModalClose(false);
                      fetch_data();
                    }
                    setOnSubmitUncompleted(false);
                  }
                }}
              ></CommonButton>
            </div>
          ) : (
            <></>
          )}
        </CustomModal>
      </div>
    </UserAuth>
  );
}
