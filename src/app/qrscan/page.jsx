// components/QrScanner.js
"use client";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import QRScanner from "@/components/qrscan1";

export default function Page() {
  const [scannedResult, setScannedResult] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  const handleScan = (result) => {
    setScannedResult(result);
    setShowScanner(false);
  };

  return (
    <div>
      {showScanner ? (
        <div>
          <h1>QR Code Scanner</h1>
          <QRScanner onScan={handleScan} />
          {scannedResult && <p>Scanned Result: {scannedResult}</p>}
        </div>
      ) : (
        <div>
          <button
            onClick={() => {
              setShowScanner(true);
            }}
          >
            show
          </button>
          <div>{scannedResult}</div>
        </div>
      )}
    </div>
  );
}
/*
export default function Page() {
  const qrCodeRef = useRef(null);
  const html5QrCode = useRef(null);
  const [isScanning, setIsScanning] = useState(false); // State to manage scanning

  useEffect(() => {
    html5QrCode.current = new Html5Qrcode(qrCodeRef.current.id);

    const config = {
      fps: 10,
      qrbox: 250,
    };

    const startScanner = () => {
      html5QrCode.current
        .start(
          { facingMode: "environment" }, // Use the rear camera
          config,
          (decodedText, decodedResult) => {
            console.log(`Decoded text: ${decodedText}`, decodedResult);
            onScanResult(decodedText); // Handle scan result
          },
          (errorMessage) => {
            // Optionally handle errors during scanning
            console.error(`Error scanning: ${errorMessage}`);
          },
        )
        .catch((err) => {
          console.error(`Unable to start scanning: ${err}`);
        });
    };

    const stopScanner = () => {
      html5QrCode.current
        .stop()
        .then(() => {
          console.log("QR Code scanner stopped.");
          setIsScanning(false); // Update scanning state
        })
        .catch((err) => {
          console.error(`Error stopping the scanner: ${err}`);
        });
    };

    if (isScanning) {
      startScanner(); // Start scanner if scanning is true
    } else {
      stopScanner(); // Stop scanner if scanning is false
    }

    // Cleanup function
    return () => {
      stopScanner();
      html5QrCode.current
        .clear()
        .then(() => {
          console.log("QR Code scanner cleared during cleanup.");
        })
        .catch((err) => {
          console.error(`Error clearing the scanner: ${err}`);
        });
    };
  }, [isScanning]); // Depend on isScanning state

  return (
    <div>
      <div id="qr-reader" ref={qrCodeRef} style={{ width: "100%" }} />
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setIsScanning(true)}
          className="mr-2 rounded bg-blue-500 px-4 py-2 text-white"
        >
          Start Scanning
        </button>
        <button
          onClick={() => setIsScanning(false)}
          className="bg-red-500 rounded px-4 py-2 text-white"
        >
          Stop Scanning
        </button>
      </div>
    </div>
  );
}
*/
