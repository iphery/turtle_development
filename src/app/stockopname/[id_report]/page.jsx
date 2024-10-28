"use client";
import UserAuth from "@/components/auth";
import { CommonButtonFull } from "@/components/button";
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

export default function Page({ params }) {
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

  const fetch_data = async () => {
    const apiUrl = `${API_URL}/fetchdetailstockopname`;
    const response = await axios.post(apiUrl, {
      idReport: params.id_report,
      uid: localStorage.getItem("userUid"),
    });
    if (response.status === 200) {
      const result = response.data;
      const initial = JSON.parse(result["initial_data"]);
      setInitialSO(initial);
      setFilteredInitial(initial);
      setDataSO(result["result"][0]);
      const invitation = result["invitation"];
      const user = result["user"];
      console.log(user);
      setUser(user[0]);
      if (user.length > 0) {
        console.log("sudah join");
        if (user[0].status_join == "0") {
          //invite
          setStatusInvite(false);
          setStatusJoin(false);
        } else {
          setStatusInvite(true);
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

  return (
    <UserAuth>
      <div className="relative">
        <div className="absolute z-0 h-full w-full">
          <DefaultLayout>
            {statusInvite && !isLead ? (
              <div className="md mb-5 border  p-2 shadow">
                <div className="flex justify-between">
                  <div>You are invited to be a member of this stock opname</div>

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
            )}

            <div className="mb-3 flex items-center justify-between">
              <div className=" text-xl font-bold">Stock Opname Detail</div>

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
                        onClick={() => {}}
                      >
                        Adjustment
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
                </div>

                <div className="mr-5"></div>
                <div className="w-full">
                  <div className="flex justify-between"></div>
                </div>
              </div>
            </PageCard>
            <div className="mb-5"></div>
            <PageCard>
              <div className="mb-3 w-full sm:w-1/2">
                <CommonInput
                  placeholder={"Search item"}
                  input={keyword}
                  onInputChange={(val) => {
                    setKeyword(val);
                  }}
                ></CommonInput>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-strokedark text-white">
                    <tr>
                      <th className="p-1">Item</th>
                      <th className="p-1">Quantity</th>
                      <th className="p-1">Actual</th>
                      <th className="p-1">Diff</th>
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
                          <td className="p-1 text-center">{item["diff"]}</td>
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
                    item["diff"] = item["balance"] - selectedActual;
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
      </div>
    </UserAuth>
  );
}
