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
      /*
      cookie({ res }, "uid", userCredential.user.uid, {
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/", // Make it available across the whole site
        httpOnly: true, // Prevents JavaScript from accessing the cookie
        secure: true,
        //secure: process.env.NODE_ENV === 'production', // Use Secure in production
        sameSite: "Strict", // Prevents CSRF attacks
      });
*/
      nookies.set(null, "uid", userCredential.user.uid, {
        maxAge: 60, //7 * 24 * 60 * 60, // 30 days
        path: "/",
      });
      window.location.reload();
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    setOnloadLogin(false);
  };

  return (
    <div className="flex flex min-h-screen items-center justify-center bg-strokedark">
      <div className="w-full  p-1 sm:w-1/3">
        <div className="mb-5 bg-strokedark text-center text-2xl text-white">
          Logbook
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
            >
              <HiOutlineMail className="h-7 w-7"></HiOutlineMail>
            </CommonInputIcon>
            <div className="mb-5" />
            <CommonInputIcon
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
            >
              <HiLockClosed className="h-7 w-7" />
            </CommonInputIcon>
            <div className="mb-10" />
            <div className="w-full">
              <CommonButtonFull
                label={"Login"}
                onClick={proceed_login}
                onload={onloadLogin}
                disabled={disabledLogin}
              />
            </div>
            <div className="mt-3 text-center text-white">
              Don't have account ?
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
    /*
    <>
      <div className="flex min-h-screen items-center justify-center bg-boxdark-2 p-10">
        <div className="flex w-full flex-col justify-center border">
          <div>aa</div>
          <div className="flex w-full rounded-sm border border-strokedark bg-boxdark shadow-default sm:w-1/3">
            <div className="w-full p-4 sm:p-12.5 ">
              <h2 className="mb-9 text-2xl font-bold text-black  text-white sm:text-title-xl2">
                Login
              </h2>

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
              >
                <HiOutlineMail className="h-7 w-7"></HiOutlineMail>
              </CommonInputIcon>
              <div className="mb-5" />
              <CommonInputIcon
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
              >
                <HiLockClosed className="h-7 w-7" />
              </CommonInputIcon>
              <div className="mb-10" />
              <div className="w-full">
                <CommonButtonFull
                  label={"Login"}
                  onClick={proceed_login}
                  onload={onloadLogin}
                  disabled={disabledLogin}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
    */
  );
};

export default SignIn;
