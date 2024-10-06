"use client";
import React, { useContext, useState } from "react";
import { CommonInput, CommonInputIcon } from "@/components/input";
import { HiLockClosed, HiOutlineMail } from "react-icons/hi";
import { CommonButtonFull } from "@/components/button";
import { API_URL } from "@/utils/constant";
import axios from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase-config";
import { useProvider } from "@/app/appcontext";
import nookies from "nookies";
import { useRouter } from "next/navigation";
import { ErrorMessage } from "@/utils/errorfirebase";

const SignIn = () => {
  const [inputEmail, setInputEmail] = useState("");
  const [inputEmailError, setEmailError] = useState(false);
  const [inputEmailMessage, setEmailMessage] = useState("");

  const [inputPassword, setInputPassword] = useState("");
  const [inputPasswordError, setPasswordError] = useState(false);
  const [inputPasswordMessage, setPasswordMessage] = useState("");

  const [onloadLogin, setOnloadLogin] = useState(false);
  const [disabledLogin, setDisabledLogin] = useState(false);
  const { setUser } = useProvider();

  const router = useRouter();

  /*
  const fetch_data = async (uid) => {
    console.log("sini");
    console.log(uid);
    const apiUrl = `${API_URL}/fetchuser`;
    const response = await axios.post(apiUrl, {
      uid: uid,
    });

    if (response.status == 200) {
      console.log(response.data["data"]);
      localStorage.setItem("info", JSON.stringify(response.data["data"]));
      window.location.reload();
    }
    setOnloadLogin(false);
  };
  */
  const proceed_login = async () => {
    setOnloadLogin(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        inputEmail,
        inputPassword,
      );
      //setUser(userCredential.user.uid);
      // fetch_data(userCredential.user.uid);
      console.log(userCredential.user.uid);

      nookies.set(null, "uid", userCredential.user.uid, {
        maxAge: 60,
        path: "/",
      });
      window.location.reload();
    } catch (error) {
      //console.log(error.code);
      ErrorMessage(error.code);
    }
    setOnloadLogin(false);
  };

  return (
    <div className="flex flex min-h-screen items-center justify-center bg-strokedark">
      <div className="w-full  p-1 sm:w-1/3">
        <div className="mb-5 flex items-center justify-center">
          <div>
            <img src="/images/logo/logo-icon.svg" />
          </div>
          <div className="mx-1"></div>
          <div className="text-2xl text-white">Logbook</div>
        </div>

        <div className="flex  w-full rounded-sm border border-strokedark bg-boxdark  shadow-default">
          <div className=" w-full p-5">
            <h1 className="mb-9 text-xl  text-black  text-white "></h1>

            <CommonInputIcon
              placeholder={"Enter your email"}
              type={"text"}
              error={inputEmailError}
              errorMessage={inputEmailMessage}
              onInputChange={(val) => {
                setInputEmail(val);
              }}
              onKeyChange={() => {
                setEmailError(false);
              }}
            ></CommonInputIcon>
            <div className="mb-5" />
            <CommonInput
              placeholder={"Enter your password"}
              type={"password"}
              error={inputPasswordError}
              errorMessage={inputPasswordMessage}
              onInputChange={(val) => {
                setInputPassword(val);
              }}
              onKeyChange={() => {
                setPasswordError(false);
              }}
            ></CommonInput>
            <div className="mb-10" />
            <div className="w-full">
              <CommonButtonFull
                label={"Login"}
                onClick={proceed_login}
                onload={onloadLogin}
                disabled={disabledLogin}
                btnColor={"white"}
              />
            </div>
            <div className="mt-3 text-center text-white">
              {"Don't have account ?"}
              <span
                className="ml-2 cursor-default hover:text-primary"
                onClick={() => {
                  router.push("/signup");
                }}
              >
                {"Register"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
