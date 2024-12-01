import React from "react";
import "@/css/loader1.css";

export const ButtonLoader = ({ color }) => {
  return (
    <div className="flex flex-row justify-center">
      <div
        className={`h-5 w-5 animate-spin rounded-full border-2 border-solid border-${color} border-t-transparent`}
      ></div>
      <div className={`pl-2 text-${color}`}>Please wait..</div>
    </div>
  );
};

export const TextLoader = ({ color }) => {
  return (
    <div className="flex flex-row justify-center">
      <div
        className={`h-5 w-5 animate-spin rounded-full border-2 border-solid border-${color} border-t-transparent`}
      ></div>
      <div className={`pl-2 text-${color}`}>Please wait..</div>
    </div>
  );
};

export const CommonLoader = ({ color }) => {
  return (
    <div
      className={`h-4 w-4 animate-spin rounded-full border-2 border-solid border-${color} border-t-transparent`}
    ></div>
  );
};

export const PageLoader = ({ color }) => {
  return (
    <div className="flex  min-h-screen items-center justify-center ">
      <div className="relative h-10 w-10">
        <div
          className={`absolute inset-0 h-full w-full animate-spin rounded-full border-2 border-solid border-strokedark border-t-transparent`}
        ></div>

        <img
          src="/images/logo/logo-icon.svg"
          alt="Inside Loader"
          className="absolute inset-0 h-full w-full rounded-full  object-cover p-1"
        />
      </div>
    </div>
  );
};

export const PageLoader1 = ({ color = "#474bff" }) => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex justify-start">
        <div className="mr-10">
          <div className="text-2xl font-bold">M I P A</div>
          <i className="text-sm">"Manage your inventory, anytime, anywhere"</i>
        </div>
        <div className="spinner ">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
