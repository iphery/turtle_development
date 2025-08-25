"use client";

import React, { useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useState } from "react";
import { API_URL } from "@/utils/constant";
import axios from "axios";
import { CommonButton, CommonButtonFull } from "@/components/button";
import { TextLoader } from "@/components/loader";
import {
  formatDateLocal1,
  formatDateLocal2,
  shortDate,
} from "@/utils/dateformat";

export default function Page({ params }) {
  const [trimmedDataURL, setTrimmedDataURL] = useState([]);
  const sigCanvas = useRef(null);

  const canvasContainer = useRef(null);

  const clear = () => sigCanvas.current.clear();

  const save = async () => {
    if (sigCanvas.current.isEmpty()) {
      console.log("kosong");
      setError(true);
    } else {
      setError(false);
      setOnSubmit(true);
      const base64Signature = sigCanvas.current
        .getTrimmedCanvas()
        .toDataURL("image/png");
      //console.log(base64Signature);
      const now = new Date();
      const array = { image: base64Signature, timestamp: now.toLocaleString() };
      console.log(array);
      setTrimmedDataURL((prev) => [...prev, array]);

      const apiurl = `${API_URL}/transactionsigned`;
      const response = await axios.post(apiurl, {
        token: params.token,
        signature: base64Signature,
      });
      if (response.status == 200) {
        window.location.reload();
      }
      setOnSubmit(false);
    }

    //setSignatureText(base64Signature);
  };

  useEffect(() => {
    if (!onSubmit && !onload) {
      const resizeCanvas = () => {
        const canvasWidth = canvasContainer.current.offsetWidth;
        sigCanvas.current.clear();
        sigCanvas.current.getCanvas().width = canvasWidth;
        sigCanvas.current.getCanvas().height = 200;
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      return () => window.removeEventListener("resize", resizeCanvas);
    }
  }, []);

  useEffect(() => {
    console.log(trimmedDataURL);
    console.log(trimmedDataURL.length);
  }, [trimmedDataURL]);

  const [trans, setTrans] = useState({});
  const [detail, setDetail] = useState([]);
  const [onSubmit, setOnSubmit] = useState(false);
  const [error, setError] = useState(false);
  const [onload, setOnload] = useState(true);
  const [isDesktopScreen, setIsDesktopScreen] = useState(false);

  const fetch_data = async () => {
    const apiurl = `${API_URL}/fetchdetailbytoken`;
    const response = await axios.post(apiurl, {
      token: params.token,
    });
    if (response.status == 200) {
      console.log(response.data);
      const newtrans = response.data["transactions"][0];
      const newdetail = response.data["details"];
      setTrans(newtrans);
      setDetail(newdetail);
      console.log(newtrans);
      console.log(newdetail);
      setOnload(false);
    }
  };

  useEffect(() => {
    fetch_data();
    if (isDesktop()) {
      setIsDesktopScreen(true);
    } else {
      setIsDesktopScreen(false);
    }
  }, []);

  function isDesktop() {
    if (typeof navigator === "undefined") return false; // SSR-safe
    const ua = navigator.userAgent;

    // const isMobile =
    //   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isMobile = window.innerWidth <= 768;
    console.log(window.innerWidth);

    return !isMobile;
  }

  return (
    <div>
      {onSubmit || onload ? (
        <div className="flex min-h-screen items-center justify-center">
          <TextLoader color={"strokedark"} />
        </div>
      ) : (
        <div className={`${isDesktopScreen ? "grid grid-cols-3" : ""}`}>
          {isDesktopScreen && <div></div>}
          <div className={` overflow-y-auto p-2`}>
            <div className="flex justify-between">
              <div className="flex items-center justify-start">
                <img src="/images/logo/logo-icon.svg" className="h-4" />
                <i className="ml-1 text-sm">mipa</i>
              </div>

              <i className="text-sm">Logistic Team</i>
            </div>

            <div className="tex-xl mt-2 text-center font-bold">
              Serah Terima Barang
            </div>
            <div className="flex justify-center">
              <div className="text-center text-sm">{`No. ${trans.id_transaction}`}</div>
              <div className="ml-1 text-sm">{`| ${shortDate(trans.date)}`}</div>
            </div>
            <p className="mb-2 mt-4">
              Telah diserahkan barang-barang sebagai berikut:
            </p>
            <table className="w-full">
              <thead>
                <tr className="text-sm">
                  <th className="text-left">Item</th>
                  <th>Jumlah</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                {detail.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.description}</td>
                      <td className="p-1 text-center">{item.quantity}</td>
                      <td className="p-1 text-center">{item.unit}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="mb-10"></div>
            <div className="flex flex-row">
              <div className="">Note.</div>
              <div className="ml-2">{trans.note}</div>
            </div>
            <div className="my-3">{`Diterima oleh, ${trans.subject}`}</div>
            <div className="mb-3 flex justify-between">
              {trans.signed == "1" ? (
                <div>Paraf</div>
              ) : (
                <div>Mohon paraf disini</div>
              )}

              {trans.signed == "1" ? (
                <div className="text-sm">
                  {formatDateLocal2(trans.signed_at)}
                </div>
              ) : (
                <></>
              )}
            </div>
            {trans.signed == "1" ? (
              <div className="w-full border p-2 ">
                {" "}
                <img src={trans.signature} alt="" className="h-20 w-20" />
              </div>
            ) : (
              <>
                <div
                  ref={canvasContainer}
                  className="sigCanvasContainer mx-auto w-full max-w-lg"
                >
                  <SignatureCanvas
                    ref={sigCanvas}
                    penColor="black"
                    canvasProps={{
                      className: `sigCanvas w-full h-48 border ${error ? "border-danger" : "border-gray-500"}`,
                    }} // Tailwind CSS classes here
                  />
                </div>
                <div className="mb-5 flex justify-between">
                  <div className="cursor-default text-sm" onClick={clear}>
                    Hapus
                  </div>
                  {error ? (
                    <div className="text-sm text-danger">
                      Tidak boleh kosong
                    </div>
                  ) : (
                    <></>
                  )}
                </div>

                <CommonButtonFull
                  label={"Kirim"}
                  onload={onSubmit}
                  disabled={onSubmit}
                  onClick={save}
                ></CommonButtonFull>
                <div className="mb-10"></div>
              </>
            )}
          </div>
          {isDesktopScreen && <div></div>}
        </div>
      )}
    </div>
  );
}
