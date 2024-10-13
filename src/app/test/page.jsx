"use client";

import { useState } from "react";
import { Test1 } from "@/components/test";

export default function Page() {
  const [switch1, setSwitch1] = useState(false);
  const [inputValue, setInputValue] = useState("");
  /*
  if (switch1) {
    return (
      <Test1
        onClose={() => {
          setSwitch1(false);
        }}
      />
    );
  }
*/
  return (
    <>
      <input></input>
      {switch1 ? (
        <Test1
          inputValue={inputValue}
          onClose={() => {
            setSwitch1(false);
          }}
        />
      ) : (
        <div>
          <div>ini halaman utama</div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter some text"
          />
          <button
            onClick={() => {
              setSwitch1(true);
            }}
          >
            next
          </button>
        </div>
      )}
    </>
  );
}
