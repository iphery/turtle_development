"use client";
import React, { useState, ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DefaultLayout({
  children,
  //onload = false,
}: {
  children: React.ReactNode;
  //onload?: boolean;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col lg:ml-72.5">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className={`mx-auto  max-w-screen-2xl p-4 md:p-6 2xl:p-10`}>
              {children}
              {/* {onload ? (
                <div className="relative ">
                  {" "}
                  <div className="flex flex-row justify-center">
                    <div
                      className={`h-5 w-5 animate-spin rounded-full border-2 border-solid border-bodydark border-t-transparent`}
                    ></div>
                    <div className={`pl-2 text-bodydark`}>Memuat data..</div>
                  </div>
                </div>
              ) : (
                children
              )} */}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
