"use client";
import UserAuth from "@/components/auth";
import { CommonButton, CommonButtonFull } from "@/components/button";
import { PageCard } from "@/components/card";
import { CommonInput, CommonInputNumber } from "@/components/input";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { ButtonLoader } from "@/components/loader";
import { CustomModal } from "@/components/modal";
import { API_URL } from "@/utils/constant";
import {
  formatDateLocal1,
  formatDateTime,
  getDateTime,
} from "@/utils/dateformat";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import {
  doc,
  onSnapshot,
  updateDoc,
  getDocs,
  collection,
  documentId,
} from "firebase/firestore";
import { db } from "@/app/firebase-config";
import { useMediaQuery } from "react-responsive";
import { NotifySuccess } from "@/utils/notify";

export default function Page({ params }) {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });

  const [showDropdown, setShowDropdown] = useState(false);
  const [initialSO, setInitialSO] = useState([]);
  const [dataSO, setDataSO] = useState({});
  const [filteredInitial, setFilteredInitial] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [selectedActual, setSelectedActual] = useState("");
  const [selectedIdProduct, setSelectedIdProduct] = useState("");
  const [modalActual, setModalActual] = useState(false);
  const [onSaving, setOnSaving] = useState(false);
  const [user, setUser] = useState({});
  const [statusJoin, setStatusJoin] = useState(false);
  const [statusInvite, setStatusInvite] = useState(false);
  const [acceptInvitation, setAcceptInvitation] = useState(false);
  const [isLead, setIsLead] = useState(false);
  const [modalMember, setModalMember] = useState(false);
  const [guest, setGuest] = useState([]);
  const [onSentInvitation, setOnSentInvitation] = useState([]);
  let email = "";
  let uid = "";
  const [opnameStatus, setOpnameStatus] = useState(false);

  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);

  const fetch_data = async () => {
    const apiUrl = `${API_URL}/fetchdetailstockopname`;
    const response = await axios.post(apiUrl, {
      idReport: params.id_report,
      uid: uid,
    });
    if (response.status === 200) {
      const result = response.data;
      const initial = JSON.parse(result["initial_data"]);
      setInitialSO(initial);
      setFilteredInitial(initial);
      setDataSO(result["result"][0]);
      const invitation = result["invitation"];
      const user = result["user"];
      setOpnameStatus(result["status_opname"]);
      setUser(user[0]);
      if (user.length > 0) {
        console.log("sudah join");
        if (user[0].status_join == 0) {
          //invite
          console.log(user[0].status_join);
          setStatusInvite(true);
          setStatusJoin(false);
        } else {
          setStatusInvite(false);
          setStatusJoin(true);
        }

        if (user[0].lead == 1) {
          setIsLead(true);
        } else {
          setIsLead(false);
        }
      } else {
        console.log("belum join");

        setStatusJoin(false);
        setStatusInvite(false);
        setIsLead(false);
      }

      setGuest(invitation);
      let arr = [];
      for (let i = 0; i < invitation.length; i++) {
        arr.push(false);
      }
      setOnSentInvitation(arr);
    }
  };

  useEffect(() => {
    email = localStorage.getItem("useremail");
    uid = localStorage.getItem("userUid");
    fetch_data();
  }, []);

  const hide_button = () => {
    if (selectedActual != "") {
      return false;
    } else {
      return true;
    }
  };

  const search_item = () => {
    const filterData = initialSO.filter((item) => {
      const desc =
        item["description"] &&
        item["description"].toLowerCase().includes(keyword.toLowerCase());

      const empty = item["created_by"] == "";
      return desc;
    });
    setFilteredInitial(filterData);
  };

  useEffect(() => {
    search_item();
  }, [keyword]);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    if (!email) return;

    const unsubscribe = onSnapshot(
      doc(db, "stockopname", email),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data.update) {
            fetch_data();
            update_firestore();
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

  const update_firestore = async () => {
    try {
      const docRef = doc(db, "stockopname", email);

      await updateDoc(docRef, {
        update: false,
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating field: ", error);
      return { success: false, error };
    }
  };

  const update_firestore_all_async = async () => {
    try {
      // Get reference to the stockopname collection
      const stockopnameRef = collection(db, "stockopname");

      // Get all documents in the collection
      const querySnapshot = await getDocs(stockopnameRef);
      //console.log(querySnapshot);

      // Array to store all update promises
      const updatePromises = [];

      // Loop through each document and update it
      querySnapshot.forEach((document) => {
        console.log(document.id);
        const docRef = doc(db, "stockopname", document.id);
        updatePromises.push(
          updateDoc(docRef, {
            update: true,
          }),
        );
      });

      // Wait for all updates to complete
      await Promise.all(updatePromises);

      return {
        success: true,
        updatedCount: querySnapshot.size,
      };
    } catch (error) {
      console.error("Error updating documents: ", error);
      return {
        success: false,
        error,
      };
    }
  };

  const update_progress = () => {
    const lists = [...initialSO];
    let complete = 0;
    let total = 0;
    lists.map((item, index) => {
      if (item["checked_name"] != "") {
        complete++;
      }
      total++;
      return;
    });
    setCompleted(complete);
    setTotal(total);
  };

  useEffect(() => {
    update_progress();
  }, [initialSO]);

  const wrong_id = () => {
    const filteredProducts = initialSO.filter(
      (product) => product.id_product === "7B50kD",
    );
    console.log(filteredProducts);
  };

  const update_list = async () => {
    const apiUrl = `${API_URL}/product`;
    const response = await axios.get(apiUrl);
    if (response.status == 200) {
      const product = response.data["products"];
      const so = [...initialSO];
      const combinedList = initialSO.map((initialItem) => {
        if (initialItem.checked_by != "") {
          initialItem.diff = initialItem.actual - initialItem.balance;
        }

        const matchedItem = product.find(
          (item) => item.id_product === initialItem.id_product,
        );

        return {
          ...initialItem,
          unit: matchedItem ? matchedItem.unit : "",
        };
      });
      console.log(combinedList);
      /*
      const combinedList = initialSO.map((initialItem) => {
        const matchedItem = product.find(
          (item) => item.id_product === initialItem.id_product,
        );
        return {
          ...initialItem, // Spread the current item from initialSO
          unit: matchedItem ? matchedItem.unit : "", // Add category, default to empty string if not found
        };
      });
      */

      /*
      const sortedCombinedList = combinedList.sort((a, b) => {
        // Compare categories; handle empty strings by placing them at the end
        if (a.category === "" && b.category === "") return 0; // Both are empty
        if (a.category === "") return 1; // a is empty, place it after b
        if (b.category === "") return -1; // b is empty, place it after a
        return a.category.localeCompare(b.category); // Compare alphabetically
      });
      console.log(sortedCombinedList);
*/

      const apiUrl = `${API_URL}/updateliststockopname`;
      const response2 = await axios.post(apiUrl, {
        idReport: params.id_report,
        data: JSON.stringify(combinedList),
      });
      if (response2.status === 200) {
        console.log("ok");
      }
    }
  };

  const [adjustmentList, setAdjustmentList] = useState([]);
  const [modalAdjustment, setModalAdjustment] = useState(false);
  const [onSubmitAdjustment, setOnSubmitAdjusment] = useState(false);

  const calc_adjusttment = async () => {
    const combinedList = initialSO
      .filter(
        (initialItem) =>
          initialItem.diff !== 0 && initialItem.description != "Kosong",
      )

      .map((initialItem) => {
        // Perform any other mapping or processing if needed
        return {
          // Spread existing properties or select specific ones
          ...initialItem,
          // Add or modify properties if necessary
        };
      });

    console.log(combinedList);
    setAdjustmentList(combinedList);
  };

  return (
    <UserAuth>
      <div className="relative">
        <div className="absolute z-0 h-full w-full">
          <DefaultLayout>
            {!isLead ? (
              statusInvite ? (
                <div className="md mb-5 border  p-2 shadow">
                  <div className="flex justify-between">
                    <div>
                      You are invited to be a member of this stock opname
                    </div>

                    {acceptInvitation ? (
                      <ButtonLoader />
                    ) : (
                      <div
                        onClick={async () => {
                          setAcceptInvitation(true);
                          const apiUrl = `${API_URL}/acceptinvitation`;
                          const response = await axios.post(apiUrl, {
                            uid: localStorage.getItem("userUid"),
                            idReport: params.id_report,
                          });
                          if (response.status == 200) {
                            fetch_data();
                          }
                          setAcceptInvitation(false);
                        }}
                        className="shadow-nd cursor-default border px-2 hover:bg-strokedark hover:text-white"
                      >
                        Accept
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}

            <div className="mb-3 flex items-center justify-between">
              <div className=" text-xl font-bold">Stock Opname Detail</div>
              {isLead == 1 && opnameStatus == 0 ? (
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
                              setModalMember(true);
                              setShowDropdown(false);
                            }}
                          >
                            Invite Member
                          </div>
                        ) : (
                          <></>
                        )}

                        <div
                          className="text-md text-gray-800 block w-full cursor-default px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white"
                          onClick={() => {
                            calc_adjusttment();
                            setModalAdjustment(true);
                            setShowDropdown(false);
                          }}
                        >
                          Adjustment
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
              <div className="flex justify-evenly">
                <div className="w-full">
                  <div className="flex justify-between">
                    <div>ID Report</div>
                    <div>{dataSO.id_report}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Date</div>
                    <div>{formatDateLocal1(dataSO.date)}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Issued By</div>
                    <div>{dataSO.name}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Status</div>
                    <div
                      className={`${opnameStatus == 0 ? "bg-success" : "bg-danger"} px-2 text-sm text-white`}
                    >{`${opnameStatus == 0 ? "Open" : "Close"}`}</div>
                  </div>
                </div>

                <div className="mr-5"></div>
                <div className="w-full">
                  <div className="flex justify-between">
                    <div className="w-full">Member</div>
                    <div className="w-full">
                      {guest.map((item, index) => {
                        if (item.join == 1) {
                          return <div key={index}>{item.name}</div>;
                        } else {
                          return <div key={index}></div>;
                        }
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </PageCard>
            <div className="mb-5"></div>
            <PageCard>
              <div className="mb-3  sm:flex  sm:items-center sm:justify-evenly">
                <div className="w-full">
                  <CommonInput
                    placeholder={"Search item"}
                    input={keyword}
                    onInputChange={(val) => {
                      setKeyword(val);
                    }}
                  ></CommonInput>
                </div>
                <div className="mb-3 mr-3"></div>
                <div className="w-full">
                  <div className="flex justify-end">
                    {`${completed} / ${total} completed (${Math.round((completed / total) * 100)}%)`}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-strokedark text-white">
                    <tr>
                      <th className="p-1">Item</th>

                      <th className="p-1">Quantity</th>
                      <th className="p-1">Actual</th>
                      <th className="p-1">Diff</th>
                      <th className="p-1">Unit</th>
                      <th className="p-1">Category</th>
                      <th className="w-30 p-1">Checked By</th>
                      <th className="w-30 p-1">Checked At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInitial.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className="p-1">{item["description"]}</td>
                          <td className="p-1 text-center">{item["balance"]}</td>
                          <td className="p-1 text-center">
                            {dataSO.status == 0 && statusJoin == 1 ? (
                              <p
                                className="cursor-default bg-bodydark text-white hover:text-danger"
                                onClick={() => {
                                  setModalActual(true);
                                  setSelectedActual("");
                                  setSelectedIdProduct(item["id_product"]);
                                }}
                              >
                                {item["actual"]}
                              </p>
                            ) : (
                              <p>{item["actual"]}</p>
                            )}
                          </td>
                          <td
                            className={`p-1 text-center ${parseInt(item["diff"]) < 0 ? "text-danger" : "text-success"}`}
                          >
                            {item["diff"]}
                          </td>
                          <td className="p-1 text-center">{item["unit"]}</td>

                          <td className="p-1 text-center">
                            {item["category"]}
                          </td>

                          <td className="p-1">{item["checked_name"]}</td>
                          <td className="p-1">
                            {item["checked_at"] != ""
                              ? formatDateTime(item["checked_at"])
                              : ""}
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
          onClose={() => {
            setModalActual(false);
          }}
          isVisible={modalActual}
          isSmallWidth="sm"
        >
          <CommonInputNumber
            type={"text"}
            placeholder={"Input number"}
            input={selectedActual}
            onInputChange={(val) => {
              setSelectedActual(val);
            }}
          ></CommonInputNumber>
          <div className="mt-5">
            <CommonButtonFull
              onload={onSaving}
              disabled={hide_button()}
              label={"Save"}
              onClick={async () => {
                setOnSaving(true);
                const lists = [...initialSO];

                lists.map((item, index) => {
                  if (item["id_product"] == selectedIdProduct) {
                    item["actual"] = selectedActual;
                    item["diff"] = selectedActual - item["balance"];
                    item["checked_at"] = getDateTime();
                    item["checked_by"] = localStorage.getItem("userUid");
                    item["checked_name"] = localStorage.getItem("username");

                    return;
                  }
                });

                const apiUrl = `${API_URL}/updateliststockopname`;
                const response = await axios.post(apiUrl, {
                  idReport: params.id_report,
                  data: JSON.stringify(lists),
                });
                if (response.status === 200) {
                  setModalActual(false);
                  //fetch_data();
                  update_firestore_all_async();
                }

                setOnSaving(false);
                setModalActual(false);
              }}
            ></CommonButtonFull>
          </div>
        </CustomModal>
        <CustomModal
          isVisible={modalMember}
          isSmallWidth="sm"
          onClose={() => {
            setModalMember(false);
          }}
        >
          {guest.map((item, index) => {
            return (
              <div key={index} className="mb-3">
                <div className="flex justify-between">
                  <p>{item["name"]}</p>
                  {item["status"] == 0 ? (
                    onSentInvitation[index] ? (
                      <ButtonLoader />
                    ) : (
                      <div
                        onClick={async () => {
                          const newdata = [...onSentInvitation];
                          newdata[index] = true;
                          setOnSentInvitation(newdata);

                          const apiUrl = `${API_URL}/sendinvitation`;
                          const response = await axios.post(apiUrl, {
                            uid: item["id"],
                            idReport: params.id_report,
                          });
                          if (response.status == 200) {
                            fetch_data();
                            setModalMember(false);
                          }
                          const newdatapost = [...onSentInvitation];
                          newdatapost[index] = false;
                          setOnSentInvitation(newdatapost);
                        }}
                        className="cursor-default border px-1 shadow-md hover:bg-bodydark hover:text-white"
                      >
                        Sent invitation
                      </div>
                    )
                  ) : (
                    <p>Invited</p>
                  )}
                </div>
              </div>
            );
          })}
        </CustomModal>
        <CustomModal
          isVisible={modalAdjustment}
          isSmallWidth="md"
          onClose={() => {
            setModalAdjustment(false);
          }}
        >
          <>
            <div className="mb-5 items-center   sm:flex sm:justify-between">
              <div
                className={`font-bold ${isSmallScreen ? "mb-5" : ""}`}
              >{`Found ${adjustmentList.length} items discrepency`}</div>
              <div className={`${isSmallScreen ? "flex justify-end" : ""}`}>
                {" "}
                <CommonButton
                  label={"Adjust Stock"}
                  disabled={onSubmitAdjustment}
                  onload={onSubmitAdjustment}
                  onClick={async () => {
                    setOnSubmitAdjusment(true);
                    const apiUrl = `${API_URL}/stockopnameadjust`;
                    const response = await axios.post(apiUrl, {
                      idReport: params.id_report,
                      uid: localStorage.getItem("userUid"),
                      list: adjustmentList,
                    });
                    if (response.status == 200) {
                      console.log("OK");
                      setModalAdjustment(false);
                      NotifySuccess("Stocks have been succesfully adjusted");
                      fetch_data();
                    }
                    setOnSubmitAdjusment(false);
                  }}
                />
              </div>
            </div>
            <hr className="" />
            <div className="oveflow-y-auto mt-5 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Unit</th>
                    <th>Quantity</th>
                    <th>Actual</th>
                    <th>Diff</th>
                  </tr>
                </thead>
                <tbody>
                  {adjustmentList.map((item, index) => {
                    let qty = 0;
                    if (parseInt(item["diff"]) > 0) {
                      qty = `+${item["diff"]}`;
                    } else {
                      qty = item["diff"];
                    }
                    return (
                      <tr key={index}>
                        <td className="">{item["description"]}</td>
                        <td className="text-center">{item["unit"]}</td>
                        <td className="text-center">{item["balance"]}</td>
                        <td className="text-center">{item["actual"]}</td>
                        <td
                          className={`text-center ${parseInt(item["diff"]) < 0 ? "text-danger" : "text-success"}`}
                        >
                          {qty}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        </CustomModal>
      </div>
    </UserAuth>
  );
}
