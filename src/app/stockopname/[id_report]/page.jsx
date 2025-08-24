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
import { MdClear } from "react-icons/md";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useRouter } from "next/navigation";

export default function Page({ params }) {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });
  const router = useRouter();
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
  const [category, setCategory] = useState("APD");
  const [userLevel, setUserLevel] = useState("");

  const fetch_data = async () => {
    const apiUrl = `${API_URL}/fetchdetailstockopname`;
    const response = await axios.post(apiUrl, {
      idReport: params.id_report,
      uid: uid,
    });
    if (response.status === 200) {
      const result = response.data;
      console.log(result);
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
    const userlevel = localStorage.getItem("userlevel") ?? "";

    setUserLevel(userlevel);
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
      const descMatch =
        item["description"] &&
        item["description"].toLowerCase().includes(keyword.toLowerCase());

      const categoryMatch =
        !category || // Jika category kosong, tampilkan semua
        category === "all" || // Atau jika category adalah "all"
        (item["category"] &&
          item["category"].toLowerCase() === category.toLowerCase());

      return descMatch && categoryMatch;
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
            <Breadcrumb pageName="Product" />
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

            {/* <PageCard>
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
            </PageCard> */}

            <div className=" mb-5 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="relative flex  items-center justify-between border-b border-stroke px-4 py-5 md:px-6 xl:px-7.5">
                <div>Information</div>
                {isLead == 1 &&
                  opnameStatus == 0 &&
                  parseInt(userLevel) <= 1 && (
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
                            {parseInt(localStorage.getItem("userlevel")) <=
                            2 ? (
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
                  )}
              </div>
              <div className="p-5">
                <div className="justify-evenly sm:flex">
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
                    <div className="mt-3 flex justify-between">
                      <div>Progress</div>
                      <div>
                        {" "}
                        {`${completed} / ${total} completed (${Math.round((completed / total) * 100)}%)`}
                      </div>
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
              </div>
            </div>
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="relative flex  items-center justify-between px-4 py-5 md:px-6 xl:px-7.5">
                <div className="relative w-full">
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
                      placeholder="Type keyword..."
                      className="w-full bg-transparent py-2 pl-9 pr-4 font-medium focus:outline-none "
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
                <div className="w-full"></div>
              </div>

              <div className="px-5">
                <div className="overflow-x-auto  ">
                  <table className="w-full">
                    <thead className="border-b border-t border-bodydark1">
                      <tr className="select-none">
                        <th className="p-3 text-left">Item</th>
                        <th className="p-3 text-left">Quantity</th>

                        <th className="p-3 text-left">Actual</th>
                        <th className="p-3 text-left">Diff</th>
                        <th className="p-3 text-left">Category</th>
                        <th className="p-3 text-left">Recent Transaction</th>
                        <th className="p-3 text-left">Checked By</th>
                        <th className="p-3 text-left">Checked At</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {filteredInitial.map((item, key) => {
                        return (
                          <tr
                            key={key}
                            className="border-b border-bodydark1  hover:text-strokedark "
                          >
                            <td className="p-3 text-left hover:cursor-pointer">
                              <div
                                className=""
                                onClick={() => {
                                  router.push(`/product/${item["id_product"]}`);
                                }}
                              >
                                {item["description"]}
                              </div>
                            </td>
                            <td className=" p-3 text-center ">
                              <div className="overflow-wrap: break-word w-[100px]">
                                {item["balance"]}
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <div className="">
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
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <div className="">{item["diff"]}</div>
                            </td>
                            <td className="p-3 text-left">
                              <div className="">{item["category"]}</div>
                            </td>
                            <td className="p-3 text-center">
                              {item["has_recent_transaction"] &&
                              item["has_recent_transaction"] == 0 ? (
                                <></>
                              ) : (
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                  Y
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-left">
                              <div className="">{item["checked_name"]}</div>
                            </td>
                            <td className="p-3 text-left">
                              <div className="">
                                {" "}
                                {item["checked_at"] != ""
                                  ? formatDateTime(item["checked_at"])
                                  : ""}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* {!onload && outstanding.length == 0 && (
                <div className="flex justify-center pb-10 pt-5">
                  Data tidak ditemukan
                </div>
              )} */}
              {/* <PaginationDataButton
                currentPage={currentPageOutstanding}
                totalPage={totalPageOutstanding}
                setCurrentPage={setCurrentPageOutstanding}
                goToPage={goToPageOutstanding} // Pass goToPage sebagai props ke PaginationDataButton
              /> */}
            </div>

            {/* <PageCard>
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
                      <th>Recent Transaction</th>
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
                          <td className="p-1 text-center">
                            {item["has_recent_transaction"]}
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
            </PageCard> */}
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
