"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UserAuth from "@/components/auth";
import { CommonButton, CommonButtonFull } from "@/components/button";
import { PageCard } from "@/components/card";
import { ButtonLoader } from "@/components/loader";
import { CustomModal } from "@/components/modal";
import { API_URL } from "@/utils/constant";
import { formatDateLocal1, formatDateLocal2 } from "@/utils/dateformat";
import { NotifySuccess } from "@/utils/notify";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import {
  IoIosWarning,
  IoMdArrowDropdown,
  IoMdArrowDropleftCircle,
  IoMdArrowDroprightCircle,
} from "react-icons/io";
import { IoDocumentTextOutline } from "react-icons/io5";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function Page({ params }) {
  const router = useRouter();
  const [trans, setTrans] = useState({});
  const [detail, setDetail] = useState([]);
  const [resend, setResend] = useState(false);
  const [userlevel, setUserlevel] = useState(3);
  const [showDropdown, setShowDropdown] = useState(false);
  const [updatedList, setUpdatedList] = useState([]);
  const [addQuantity, setAddQuantity] = useState([]);
  const [histories, setHistories] = useState([]);
  const [editMode, setEditMode] = useState(false); //false berarti edit; true berarti retur
  const [modalVoid, setModalVoid] = useState(false);

  const fetch_data = async () => {
    const apiurl = `${API_URL}/fetchdetailtransaction`;
    const response = await axios.post(apiurl, {
      idTransaction: params.id_transaction,
    });
    if (response.status == 200) {
      const newtrans = response.data["transactions"][0];
      const newdetail = response.data["details"];
      setTrans(newtrans);
      setDetail(newdetail);
      setUpdatedList(newdetail);
      setHistories(response.data["histories"]);
      const newadd = [];
      const neweditabledetail = [];
      newdetail.map((item) => {
        newadd.push(false);
      });
      console.log("init");
      console.log(newtrans);
      setAddQuantity(newadd);
    }
  };

  const resend_message = async () => {
    setResend(true);
    const apiurl = `${API_URL}/resendmessage`;
    const response = await axios.post(apiurl, {
      term: "stockout",
      idTransaction: params.id_transaction,
    });
    if (response.status == 200) {
      NotifySuccess("Message sent !");
    }
    setResend(false);
  };

  useEffect(() => {
    setUserlevel(parseInt(localStorage.getItem("userlevel")));
    fetch_data();
  }, []);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const [modalEdit, setModalEdit] = useState(false);
  const [submitEdit, setSubmitEdit] = useState(false);
  const [submitDelete, setSubmitDelete] = useState(false);

  const recheck_stock = async (data) => {
    console.log(data);
    /*
    const apiUrl = `${API_URL}/stock`;
    const response = await axios.get(apiUrl);

    if (response.status == 200) {
      const product = response.data["products"];
    }
      */
  };

  const [sameArray, setSameArray] = useState(true);
  const is_data_equal = () => {
    let error = 0;
    let error_qty = 0;
    let qty = 0;
    const arr1 = detail;
    const arr2 = updatedList;
    arr1.map((item1) => {
      arr2.map((item2) => {
        if (item2.id_product === item1.id_product) {
          if (item2.quantity != item1.quantity) {
            error++;
          }

          if (item2.quantity == 0) {
            qty++;
          }
        }
      });
    });
    if (arr2.length == qty) {
      error_qty = 0;
    } else {
      error_qty = 1;
    }

    if (error > 0 && error_qty == 1) {
      return true;
    } else {
      return false;
    }

    //return error;
  };

  useEffect(() => {
    const isSame = is_data_equal();

    setSameArray(!isSame);
  }, [updatedList]);

  return (
    <UserAuth>
      <div className="relative">
        <div className="absolute z-0 h-full w-full">
          <DefaultLayout>
            <div className="mb-3 flex items-center justify-between">
              <div className=" text-xl font-bold">Transaction Detail</div>

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
                      {userlevel <= 2 && trans.signed == 0 ? (
                        <div
                          className="text-md text-gray-800 block w-full cursor-default px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white"
                          onClick={() => {
                            setUpdatedList(detail);
                            setModalEdit(true);
                            setEditMode(false);
                            toggleDropdown();
                          }}
                        >
                          Edit Transaction
                        </div>
                      ) : (
                        <></>
                      )}

                      {userlevel <= 2 && trans.signed == 1 ? (
                        <div
                          className="text-md text-gray-800 block w-full cursor-default px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white"
                          onClick={() => {
                            setUpdatedList(detail);
                            setModalEdit(true);
                            setEditMode(true);
                            toggleDropdown();
                          }}
                        >
                          Retur
                        </div>
                      ) : (
                        <></>
                      )}

                      {userlevel <= 1 ? (
                        <div
                          className="text-md text-gray-800 block w-full cursor-default px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white"
                          onClick={() => {
                            setModalVoid(true);
                            toggleDropdown();
                          }}
                        >
                          Void Transaction
                        </div>
                      ) : (
                        <></>
                      )}
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
                    <div className="w-full">{trans.date}</div>
                  </div>
                  <div className="mb-2 sm:flex sm:justify-evenly">
                    <div className="w-full">Type</div>
                    <div className="w-full">{trans.type}</div>
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
                    <div className="mb-2 sm:flex sm:justify-evenly">
                      <div className="w-full">RF No.</div>
                      <div className="w-full">{trans.note}</div>
                    </div>
                  )}
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
                    </tr>
                  </thead>
                  <tbody>
                    {detail.length > 0 &&
                      detail.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="p-1 text-center">{index + 1}</td>
                            <td className="p-1 ">{item["description"]}</td>
                            <td className="p-1 text-center">
                              {item["quantity"]}
                            </td>
                            <td className="p-1 text-center">{item["unit"]}</td>
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
                      <div className="ml-3">{trans.signed_at}</div>
                      {trans.signed == 0 ? (
                        parseInt(localStorage.getItem("userlevel")) <= 2 ? (
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
                          <></>
                        )
                      ) : parseInt(localStorage.getItem("userlevel")) <= 2 ? (
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
                      ) : (
                        <></>
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

            <div className="mb-5"></div>

            <PageCard>
              <div className="mb-3">Logs :</div>
              {histories.length > 0 &&
                histories.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="text-sm"
                    >{`${formatDateLocal2(item["created_at"])} : ${item["name"]} : ${item["action"]}`}</div>
                  );
                })}
            </PageCard>
          </DefaultLayout>
        </div>
        <CustomModal
          isVisible={modalEdit}
          onClose={() => {
            setModalEdit(false);
          }}
          isSmallWidth="md"
        >
          <div>
            <div className="mb-3 font-bold">
              {editMode ? "Retur Transaction" : "Edit Transaction"}
            </div>
            <div className="overflow y-auto overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-strokedark text-white">
                    <th
                      className="p-1"
                      onClick={() => {
                        console.log(detailEdit);
                      }}
                    >
                      Item
                    </th>
                    <th className="p-1">Unit</th>
                    <th className="p-1">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {updatedList.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="p-1">{item["description"]}</td>
                        <td className="p-1 text-center">{item["unit"]}</td>
                        <td className="p-1 text-center">
                          <div className="flex justify-center">
                            <div className="mr-3">
                              {" "}
                              <button
                                onClick={(e) => {
                                  //e.preventDefault();

                                  const newdata1 = updatedList.map((item) => ({
                                    ...item,
                                  }));

                                  // Check if quantity can be decremented
                                  if (parseInt(newdata1[index].quantity) > 0) {
                                    newdata1[index].quantity =
                                      parseInt(newdata1[index].quantity) - 1;
                                  }

                                  // Update the state of updatedList
                                  setUpdatedList(newdata1);
                                }}
                              >
                                <IoMdArrowDropleftCircle className="h-7 w-7" />
                              </button>
                            </div>
                            <div>{item["quantity"]}</div>
                            <div className="ml-3">
                              {" "}
                              <button
                                disabled={addQuantity[index]}
                                className={`${addQuantity[index] ? "text-bodydark" : ""}`}
                                onClick={async (e) => {
                                  e.preventDefault();
                                  const newArray = [...addQuantity];
                                  newArray[index] = true;
                                  setAddQuantity(newArray);

                                  const apiUrl = `${API_URL}/stockbyid`;
                                  const newdata = updatedList.map((item) => ({
                                    ...item,
                                  }));
                                  const response = await axios.post(apiUrl, {
                                    idProduct: newdata[index].id_product,
                                  });
                                  if (response.status == 200) {
                                    console.log(response.data);
                                    const stock = parseInt(
                                      response.data["stock"],
                                    );
                                    if (newdata[index].quantity < stock) {
                                      newdata[index].quantity =
                                        parseInt(newdata[index].quantity) + 1;
                                      setUpdatedList(newdata);
                                    }
                                  }

                                  newArray[index] = false;
                                  setAddQuantity(newArray);
                                }}
                              >
                                <IoMdArrowDroprightCircle className="h-7 w-7" />
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {sameArray ? (
              <div className="mt-3 text-sm">
                <i>Note. Please make at least 1 change to update</i>
              </div>
            ) : (
              <></>
            )}

            <div className="mb-5"></div>
            {sameArray ? (
              <></>
            ) : (
              <div className="flex justify-end">
                <CommonButton
                  disabled={submitEdit}
                  onload={submitEdit}
                  label={"Submitt"}
                  onClick={async (e) => {
                    e.preventDefault();
                    setSubmitEdit(true);
                    let apiUrl = "";
                    if (editMode == 0) {
                      apiUrl = `${API_URL}/updatetransaction`;
                    } else {
                      apiUrl = `${API_URL}/returtransaction`;
                    }

                    const response = await axios.post(apiUrl, {
                      list: updatedList,
                      uid: localStorage.getItem("userUid"),
                      idTransaction: params.id_transaction,
                    });

                    if (response.status === 200) {
                      setModalEdit(false);
                      fetch_data();
                      NotifySuccess(response.data["message"]);
                    }

                    setSubmitEdit(false);
                  }}
                ></CommonButton>
              </div>
            )}
          </div>
        </CustomModal>
        <CustomModal
          isVisible={modalVoid}
          onClose={() => {
            setModalVoid(false);
          }}
          isSmallWidth="sm"
        >
          <div className=" flex justify-center text-danger">
            <IoIosWarning className="h-12 w-12" />
          </div>
          <div className="mb-5">
            {`Are you sure to delete this transaction ? This is can't not be
            undone.`}
          </div>
          <div className="flex justify-end">
            {" "}
            <CommonButton
              label={"Yes, delete it."}
              onload={submitDelete}
              disabled={submitDelete}
              onClick={async (e) => {
                e.preventDefault();
                setSubmitDelete(true);
                const apiUrl = `${API_URL}/deletetransaction`;
                const response = await axios.post(apiUrl, {
                  idTransaction: params.id_transaction,
                });
                if (response.status == 200) {
                  NotifySuccess(response.data["message"]);
                  router.push("/transaction");
                }
                setSubmitDelete(false);
              }}
            ></CommonButton>
          </div>
        </CustomModal>
      </div>
    </UserAuth>
  );
}
