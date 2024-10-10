"use client";
import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
/*
const QRCodeScanner = () => {
  const [scanResult, setScanResult] = useState("");
  const [zoomApplied, setZoomApplied] = useState(false);
  const scannerRef = useRef(null);
  const html5QrCode = useRef(null);

  const FIXED_ZOOM_LEVEL = 1.7;

  useEffect(() => {
    html5QrCode.current = new Html5Qrcode("reader");

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    };

    html5QrCode.current
      .start(
        { facingMode: "environment" },
        config,
        (decodedText, decodedResult) => {
          setScanResult(decodedText);
          // html5QrCode.current.stop(); // Uncomment if you want to stop scanning after a successful scan
        },
        (errorMessage) => {
          // console.log(errorMessage);
        },
      )
      .then(() => applyFixedZoom())
      .catch((err) => {
        console.error("Error starting scanner:", err);
      });

    return () => {
      if (html5QrCode.current && html5QrCode.current.isScanning) {
        html5QrCode.current
          .stop()
          .catch((err) => console.error("Error stopping scanner:", err));
      }
    };
  }, []);

  const applyFixedZoom = async () => {
    if (html5QrCode.current && !zoomApplied) {
      try {
        const camera =
          await html5QrCode.current.getRunningTrackCameraCapabilities();
        if (camera.isZoomSupported()) {
          await camera.applyZoom(FIXED_ZOOM_LEVEL);
          setZoomApplied(true);
          console.log(
            `Fixed zoom of ${FIXED_ZOOM_LEVEL}x applied successfully.`,
          );
        } else {
          console.log("Zoom is not supported by the current device");
        }
      } catch (error) {
        console.error("Error applying fixed zoom:", error);
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-strokedark">
      <div
        id="reader"
        ref={scannerRef}
        className="aspect-[4/3] w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-lg"
      ></div>
      {scanResult && (
        <p className="mt-4 text-lg font-semibold">
          Scanned Result: {scanResult}
        </p>
      )}
      {zoomApplied && (
        <p className="text-gray-600 mt-2 text-sm">
          Camera zoomed to {FIXED_ZOOM_LEVEL}x
        </p>
      )}
    </div>
  );
};

export default QRCodeScanner;
*/
/*
const QRCodeScanner = () => {
  const [scanResult, setScanResult] = useState("");
  const [zoomApplied, setZoomApplied] = useState(false);
  const scannerRef = useRef(null);
  const html5QrCode = useRef(null);

  const FIXED_ZOOM_LEVEL = 1.7;

  useEffect(() => {
    html5QrCode.current = new Html5Qrcode("reader");

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    };

    html5QrCode.current
      .start(
        { facingMode: "environment" },
        config,
        (decodedText, decodedResult) => {
          setScanResult(decodedText);
          // html5QrCode.current.stop(); // Uncomment if you want to stop scanning after a successful scan
        },
        (errorMessage) => {
          // console.log(errorMessage);
        },
      )
      .then(() => applyFixedZoom())
      .catch((err) => {
        console.error("Error starting scanner:", err);
      });

    return () => {
      if (html5QrCode.current && html5QrCode.current.isScanning) {
        html5QrCode.current
          .stop()
          .catch((err) => console.error("Error stopping scanner:", err));
      }
    };
  }, []);

  const applyFixedZoom = async () => {
    if (html5QrCode.current && !zoomApplied) {
      try {
        const camera =
          await html5QrCode.current.getRunningTrackCameraCapabilities();
        if (camera.isZoomSupported()) {
          await camera.applyZoom(FIXED_ZOOM_LEVEL);
          setZoomApplied(true);
          console.log(
            `Fixed zoom of ${FIXED_ZOOM_LEVEL}x applied successfully.`,
          );
        } else {
          console.log("Zoom is not supported by the current device");
        }
      } catch (error) {
        console.error("Error applying fixed zoom:", error);
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-strokedark">
      <div
        id="reader"
        ref={scannerRef}
        className="aspect-[4/3] w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-lg"
      ></div>
      {scanResult && (
        <p className="mt-4 text-lg font-semibold">
          Scanned Result: {scanResult}
        </p>
      )}
      {zoomApplied && (
        <p className="text-gray-600 mt-2 text-sm">
          Camera zoomed to {FIXED_ZOOM_LEVEL}x
        </p>
      )}
    </div>
  );
};

export default QRCodeScanner;
*/

const QRCodeScanner = () => {
  const [scanResult, setScanResult] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);
  const scannerRef = useRef(null);
  const html5QrCode = useRef(null);

  useEffect(() => {
    html5QrCode.current = new Html5Qrcode("reader");

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    };

    html5QrCode.current
      .start(
        { facingMode: "environment" },
        config,
        (decodedText, decodedResult) => {
          setScanResult(decodedText);
          // html5QrCode.current.stop(); // Uncomment if you want to stop scanning after a successful scan
        },
        (errorMessage) => {
          // console.log(errorMessage);
        },
      )
      .catch((err) => {
        console.error("Error starting scanner:", err);
      });

    return () => {
      if (html5QrCode.current && html5QrCode.current.isScanning) {
        html5QrCode.current
          .stop()
          .catch((err) => console.error("Error stopping scanner:", err));
      }
    };
  }, []);

  const handleZoomChange = async (e) => {
    const newZoomLevel = parseFloat(e.target.value);
    setZoomLevel(newZoomLevel);

    if (html5QrCode.current) {
      try {
        const camera =
          await html5QrCode.current.getRunningTrackCameraCapabilities();
        if (camera.isZoomSupported()) {
          await camera.applyZoom(newZoomLevel);
        } else {
          console.log("Zoom is not supported by the current device");
        }
      } catch (error) {
        console.error("Error applying zoom:", error);
      }
    }
  };

  return (
    <div>
      <div
        id="reader"
        ref={scannerRef}
        style={{ width: "100%", maxWidth: "600px" }}
      ></div>
      <div>
        <label htmlFor="zoom">Zoom: </label>
        <input
          type="range"
          id="zoom"
          name="zoom"
          min="1"
          max="5"
          step="0.1"
          value={zoomLevel}
          onChange={handleZoomChange}
        />
        <span>{zoomLevel.toFixed(1)}x</span>
      </div>
      {scanResult && <p>Scanned Result: {scanResult}</p>}
    </div>
  );
};

export default QRCodeScanner;
