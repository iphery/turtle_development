"use client";

import React, { useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useState } from "react";
import { API_URL } from "@/utils/constant";
import axios from "axios";
import { CommonButton, CommonButtonFull } from "@/components/button";
import { TextLoader } from "@/components/loader";

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
  }, []);

  return (
    <div>
      {onSubmit || onload ? (
        <div className="flex min-h-screen items-center justify-center">
          <TextLoader color={"strokedark"} />
        </div>
      ) : (
        <div className=" overflow-y-auto p-2">
          <div className="tex-xl text-center font-bold">Nota Barang</div>

          <div className="text-center text-sm">{trans.id_transaction}</div>
          <div className="text-sm">Tanggal :</div>
          <div className="mb-2">{trans.date}</div>
          <div className="text-sm">Kepada :</div>
          <div className="mb-2">{trans.subject}</div>
          <div className="text-sm">Note :</div>
          <div className="mb-2">{trans.note}</div>
          <table className="w-full">
            <thead>
              <tr className="text-sm">
                <th>Item</th>
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
          <div className="mb-3">Diserahkan oleh Sri pada 02-10-2024 11:00</div>
          <div className="mb-3 flex justify-between">
            <div>Penerima,</div>

            {trans.signed == "1" ? (
              <div className="text-sm">{trans.signed_at}</div>
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
                  Ulangi
                </div>
                {error ? (
                  <div className="text-sm text-danger">Tidak boleh kosong</div>
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
      )}
    </div>
  );
}
