"use client";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";

export default function Page() {
  const [result, setResult] = useState(null);

  const handleScan = (data) => {
    if (data) {
      setResult(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div>
      <h1>QR & 2D Barcode Scanner</h1>
      <Scanner
        onDecode={handleScan}
        onError={handleError}
        style={{ width: "300px" }}
      />
      {result && <p>Scanned Result: {result}</p>}
    </div>
  );
}
