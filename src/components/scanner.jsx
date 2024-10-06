// components/QrScanner.js
import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export const Scanner = ({ onExit, onScanResult }) => {
  const qrCodeRef = useRef(null);
  const html5QrCode = useRef(null);

  const exit = () => {
    html5QrCode.current.stop();
    onExit();
  };

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

            // Call the onScanResult callback with the scanned text
            onScanResult(decodedText);
            exit();
          },
          (errorMessage) => {
            // Optionally handle errors during scanning
          },
        )
        .catch((err) => {
          console.error(`Unable to start scanning: ${err}`);
        });
    };

    startScanner(); // Start the scanner on component mount

    return () => {
      // Cleanup function to stop and clear the scanner
      html5QrCode.current
        .stop()
        .then(() => {
          console.log("QR Code scanner stopped during cleanup.");
        })
        .catch((err) => {
          console.error(`Error stopping the scanner: ${err}`);
        });

      html5QrCode.current
        .clear()
        .then(() => {
          console.log("QR Code scanner cleared during cleanup.");
        })
        .catch((err) => {
          console.error(`Error clearing the scanner: ${err}`);
        });
    };
  }, []);

  return (
    <div>
      <div id="qr-reader" ref={qrCodeRef} style={{ width: "100%" }} />
      <div onClick={onExit}>exit</div>
    </div>
  );
};
