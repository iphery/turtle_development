"use client";
import React, { useContext, useState } from "react";
import { CommonInput, CommonInputIcon } from "@/components/input";
import { HiLockClosed, HiOutlineMail } from "react-icons/hi";
import { CommonButtonFull } from "@/components/button";
import { API_URL } from "@/utils/constant";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/app/firebase-config";
import { useProvider } from "@/app/appcontext";
import nookies from "nookies";
import { useRouter } from "next/navigation";
import { ErrorMessage } from "@/utils/errorfirebase";

const SignUp = () => {
  const { setUser } = useProvider();
  const router = useRouter();
  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [inputError, setInputError] = useState([false, false, false]);
  const [onSubmit, setOnSubmit] = useState(false);

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
        <div className="mb-5 flex items-center justify-center">
          <div>
            <img src="/images/logo/logo-icon.svg" />
          </div>
          <div className="mx-1"></div>
          <div className="text-2xl text-white">mipa</div>
        </div>
        <div className="flex  w-full rounded-sm border border-strokedark bg-boxdark  shadow-default">
          <div className=" w-full p-5">
            <h1 className="mb-9 text-xl  text-black  text-white "></h1>
            <CommonInput
              placeholder={"Enter your name"}
              type={"text"}
              error={inputError[0]}
              errorMessage={"Required"}
              onInputChange={(val) => {
                setInputData((prev) => ({ ...prev, name: val }));
              }}
              onKeyChange={() => {
                const newdata = [...inputError];
                newdata[0] = false;
                setInputError(newdata);
              }}
            ></CommonInput>
            <div className="mb-5" />
            <CommonInput
              placeholder={"Enter your email"}
              type={"text"}
              error={inputError[1]}
              errorMessage={"Required"}
              onInputChange={(val) => {
                setInputData((prev) => ({ ...prev, email: val }));
              }}
              onKeyChange={() => {
                const newdata = [...inputError];
                newdata[1] = false;
                setInputError(newdata);
              }}
            ></CommonInput>
            <div className="mb-5" />
            <CommonInput
              placeholder={"Enter your password"}
              type={"password"}
              error={inputError[2]}
              errorMessage={"Required"}
              onInputChange={(val) => {
                setInputData((prev) => ({ ...prev, password: val }));
              }}
              onKeyChange={() => {
                const newdata = [...inputError];
                newdata[2] = false;
                setInputError(newdata);
              }}
            ></CommonInput>
            <div className="mb-10" />
            <div className="w-full">
              <CommonButtonFull
                label={"Register"}
                onClick={async (e) => {
                  e.preventDefault();
                  setOnSubmit(true);

                  const newdata = [...inputError];
                  let localError = [false, false, false];
                  if (inputData.name == "") {
                    newdata[0] = true;
                    setInputError(newdata);
                    localError[0] = true;
                  } else {
                    newdata[0] = false;
                    setInputError(newdata);
                    localError[0] = false;
                  }

                  if (inputData.email == "") {
                    newdata[1] = true;
                    setInputError(newdata);
                    localError[1] = true;
                  } else {
                    newdata[1] = false;
                    setInputError(newdata);
                    localError[1] = false;
                  }

                  if (inputData.password == "") {
                    newdata[2] = true;
                    setInputError(newdata);
                    localError[2] = true;
                  } else {
                    newdata[2] = false;
                    setInputError(newdata);
                    localError[2] = false;
                  }

                  if (!localError.includes(true)) {
                    console.log("good to go");
                  }
                  try {
                    const userCredential = await createUserWithEmailAndPassword(
                      auth,
                      inputData.email,
                      inputData.password,
                    );
                    console.log(userCredential.user);
                    const apiurl = `${API_URL}/register`;
                    const response = await axios.post(apiurl, {
                      data: inputData,
                      uid: userCredential.user.uid,
                    });

                    if (response.status == 200) {
                      router.push("/");
                    }
                  } catch (error) {
                    ErrorMessage(error.code);
                  }
                  setOnSubmit(false);
                }}
                onload={onSubmit}
                disabled={onSubmit}
              />
            </div>
            <div className="mt-3 text-center text-white">
              Already have account ?
              <span
                className="ml-2 cursor-default hover:text-primary"
                onClick={() => {
                  router.push("/");
                }}
              >
                {"Login "}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
