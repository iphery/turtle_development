"use client";
import { API_URL } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
//import QRCode from "qrcode.react";
//import { QRCodeCanvas } from "qrcode.react";
import { QRCode } from "react-qrcode-logo";

export default function Barcode() {
  const itemsPerRow = 4; // Number of items per row
  const [items, setItems] = useState([]);

  const fetch = () => {
    const data = localStorage.getItem("barcodetoprint");
    const parseData = JSON.parse(data);
    setItems(parseData);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-1">
      {items.map((item, index) => (
        <div key={index} className="flex items-center justify-center  p-1">
          <div className="flex flex-row bg-white p-2">
            <QRCode
              qrStyle="dots"
              size={100}
              logoPadding={2}
              removeQrCodeBehindLogo={true}
              logoImage="/images/logo/logo-icon.svg"
              value={`${item["barcode"]}`}
            />
            <div className="flex flex-col px-2 py-1">
              <div className=" text-xs font-bold text-black">Description</div>
              <div className="text-sm text-black">{item["description"]}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
