"use client";

import React, { useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useState } from "react";

export default function SignaturePad() {
  const [trimmedDataURL, setTrimmedDataURL] = useState([]);
  const sigCanvas = useRef(null);

  const canvasContainer = useRef(null);

  const clear = () => sigCanvas.current.clear();

  const save = () => {
    const base64Signature = sigCanvas.current
      .getTrimmedCanvas()
      .toDataURL("image/png");
    //console.log(base64Signature);
    const now = new Date();
    const array = { image: base64Signature, timestamp: now.toLocaleString() };

    setTrimmedDataURL((prev) => [...prev, array]);

    //setSignatureText(base64Signature);
  };

  useEffect(() => {
    const resizeCanvas = () => {
      const canvasWidth = canvasContainer.current.offsetWidth;
      sigCanvas.current.clear();
      sigCanvas.current.getCanvas().width = canvasWidth;
      sigCanvas.current.getCanvas().height = 200;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    console.log(trimmedDataURL);
    console.log(trimmedDataURL.length);
  }, [trimmedDataURL]);

  return (
    <div className="signature-container p-2">
      <h1>Signature Pad</h1>
      <div
        ref={canvasContainer}
        className="sigCanvasContainer mx-auto w-full max-w-lg"
      >
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            className: "sigCanvas w-full h-48 border border-gray-500",
          }} // Tailwind CSS classes here
        />
      </div>
      <div className="flex flex-row p-2">
        <button onClick={clear} className="rounded-lg border p-2">
          Clear
        </button>
        <div className="mr-2"></div>
        <button onClick={save} className="rounded-lg border p-2">
          Save
        </button>
      </div>

      <div className="mt-10">Result</div>

      {trimmedDataURL.map((item, index) => {
        return (
          <div className="mb-2 border p-2" key={index}>
            <img src={item.image} />
            <div>{`${item.timestamp}`}</div>
          </div>
        );
      })}
    </div>
  );
}
