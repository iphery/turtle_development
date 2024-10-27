"use client";
import UserAuth from "@/components/auth";
import { CommonButton, CommonButtonFull } from "@/components/button";
import { CommonInput } from "@/components/input";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { CustomModal } from "@/components/modal";
import { API_URL } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

export default function Page() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [modalNew, setModalNew] = useState(false);
  const [inputDate, setInputDate] = useState("");
  const [inputDateError, setInputDateError] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);
  const [dataSO, setDataSO] = useState([]);

  const fetch_stock_opname = async () => {
    const apiUrl = `${API_URL}/fetchstockopname`;
    const response = await axios.get(apiUrl);
    if (response.status === 200) {
      const result = response.data;
      setDataSO(result["result"]);
      console.log(result["result"]);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {}, []);
  return (
    <UserAuth>
      <div className="relative">
        <div className="absolute z-0 h-full w-full">
          <DefaultLayout>
            <div className="mb-3 flex items-center justify-between">
              <div className=" text-xl font-bold">Stock Opname</div>

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
                    <div
                      className="py-1"
                      onClick={() => {
                        toggleDropdown();
                        setModalNew(true);
                      }}
                    >
                      {parseInt(localStorage.getItem("userlevel")) <= 1 ? (
                        <div className="text-md text-gray-800 block w-full cursor-default px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:bg-black hover:text-white">
                          Create New
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DefaultLayout>
        </div>
        <CustomModal
          isVisible={modalNew}
          isSmallWidth="sm"
          onClose={() => {
            setModalNew(false);
          }}
        >
          <CommonInput
            type={"date"}
            input={inputDate}
            onInputChange={(val) => {
              setInputDate(val);
            }}
            errorMessage={"Required"}
            error={inputDateError}
            onChg={() => {
              setInputDateError(false);
            }}
          ></CommonInput>
          <div className="mt-5">
            <CommonButtonFull
              disabled={onSubmit}
              onload={onSubmit}
              label={"Create"}
              onClick={async () => {
                setOnSubmit(true);
                let localError = false;
                if (inputDate == "") {
                  localError = true;
                  setInputDateError(true);
                } else {
                  localError = false;
                  setInputDateError(false);
                  console.log("good to go");

                  const uid = localStorage.getItem("userUid");
                  const apiUrl = `${API_URL}/newstockopname`;
                  const response = await axios.post(apiUrl, {
                    date: inputDate,
                    uid: uid,
                  });
                  if (response.status === 200) {
                    setModalNew(false);
                    setInputDate("");
                    console.log(response.data);
                  }
                  setOnSubmit(false);
                }
              }}
            ></CommonButtonFull>
          </div>
        </CustomModal>
      </div>
    </UserAuth>
  );
}
