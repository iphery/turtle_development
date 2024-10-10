import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScanResult, exit }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode("reader");

    const startScanner = async () => {
      try {
        await scannerRef.current.start(
          { facingMode: "environment" },
          {
            fps: 20,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            onScanResult(decodedText);
            console.log(decodedText);
            exit();
            scannerRef.current.stop();
          },
          (error) => {
            console.error("QR code scanning error:", error);
          },
        );
      } catch (err) {
        console.error("Failed to start scanner:", err);
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current
          .stop()
          .catch((err) => console.error("Failed to stop scanner:", err));
      }
    };
  }, [onScanResult]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-strokedark">
      <div className="relative h-64 w-64">
        <div id="reader" className="h-full w-full overflow-hidden">
          {/* Custom styles to adjust video feed */}
          <style jsx global>{`
            #reader video {
              object-fit: cover;
              width: 100%;
              height: 100%;
              border: 2px solid #2e3a47 !important;
              background: none !important;
            }
          `}</style>
        </div>
        <div className="pointer-events-none absolute inset-0 border-0">
          <div className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-danger" />
          <div className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-danger" />
          <div className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-danger" />
          <div className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-danger" />
        </div>
      </div>
    </div>
  );
}
