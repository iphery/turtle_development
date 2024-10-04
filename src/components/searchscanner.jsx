"use client";

import { Scanner } from "@yudiel/react-qr-scanner";

export const SearchScanner = ({ exit, onScanResult }) => {
  const exit_scanner = () => {
    //onScanResult("1");
    exit();
  };

  return (
    <div>
      <div onClick={exit_scanner} className="bg-white p-2 text-center">
        Exit scanner
      </div>
      <div className="flex min-h-screen items-center  bg-boxdark-2">
        <Scanner
          onScan={(result) => {
            onScanResult(result[0].rawValue);
            exit();
          }}
        />
      </div>
    </div>
  );
};
