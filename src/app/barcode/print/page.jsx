"use client";
import { API_URL } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import { QRCodeCanvas } from "qrcode.react";

export default function barcode() {
  const items = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];

  const itemsPerRow = 6; // Number of items per row

  return (
    <div>
      <div
        onClick={() => {
          const newdata = [...list, "z"];
          console.log(newdata);
          setList(newdata);
        }}
      >
        tambah
      </div>

      <div className="grid grid-cols-5 gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-center  p-2 text-white"
          >
            <QRCodeCanvas value={"aan"} />
            <div>aa</div>
          </div>
        ))}
      </div>
    </div>
  );
}
