import {
  CommonInput,
  CommonInputFile,
  CommonInputNumber,
} from "@/components/input";
import { useEffect, useState } from "react";
import { FaGlasses } from "react-icons/fa";
import { IoScan } from "react-icons/io5";
import { CommonButtonFull } from "./button";
import { API_URL } from "@/utils/constant";
import { useMediaQuery } from "react-responsive";
import { MdCameraAlt } from "react-icons/md";
import { AiOutlineScan } from "react-icons/ai";

export default function NewTool({
  onClose,
  showScanner,
  showCamera,
  cameraResult,
  inputData,
  setInputData,
  file,
  setFile,
  filePreview,
  setFilePreview,
}) {
  const [inputDataError, setInputDataError] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });

  const [onSubmit, setOnSubmit] = useState(false);
  const [fileErrorMessage, setFileErrorMessage] = useState("");
  const [barcodeErrorMessage, setBarcodeErrorMessage] = useState("");

  const display_scanner = () => {
    showScanner();
  };

  const display_camera = () => {
    showCamera();
  };

  /*
  useEffect(() => {
    if (file) {
      if (file.size > 512000) {
        const newdata = [...inputDataError];
        newdata[5] = true;
        setInputDataError(newdata);
      } else {
        const newdata = [...inputDataError];
        newdata[5] = false;
        setInputDataError(newdata);
      }
    }
  }, [file]);
*/

  useEffect(() => {
    console.log("hahaha");
    if (cameraResult) {
      console.log(cameraResult);
      setFile(cameraResult);
      setFilePreview(URL.createObjectURL(cameraResult));
    }
  }, [cameraResult]);

  useEffect(() => {
    const temp = localStorage.getItem("tempNewTool");
    console.log("ini disini");
    console.log(temp);
    if (temp != "") {
      const parseTemp = JSON.parse(temp);

      console.log(parseTemp);
    }
  }, []);

  const close_modal = () => {
    onClose(false);
  };

  return (
    <div className="overflow-y-auto">
      <div className="mb-3 flex justify-evenly">
        <div className="flex w-1/2  justify-start">
          <div className="flex items-center">Barcode</div>
          <div
            className="ml-1 flex items-center text-danger"
            onClick={() => {
              display_scanner();
            }}
          >
            <AiOutlineScan className="h-5 w-5" />
          </div>
        </div>
        <div className="w-full">
          <CommonInput
            placeholder={"Leave empty if not available"}
            input={inputData.barcode}
            onInputChange={(val) => {
              setInputData((prev) => ({ ...prev, barcode: val }));
            }}
          ></CommonInput>
        </div>
      </div>
      <div className="mb-3 flex justify-evenly">
        <div className="w-1/2">Description</div>
        <div className="w-full">
          <CommonInput
            input={inputData.description}
            onInputChange={(val) => {
              setInputData((prev) => ({ ...prev, description: val }));
            }}
            error={inputDataError[0]}
            errorMessage={"Required"}
            onChg={() => {
              const newdata = [...inputDataError];
              newdata[0] = false;
              setInputDataError(newdata);
            }}
          ></CommonInput>
        </div>
      </div>

      <div className="mb-3 flex justify-evenly">
        <div className="w-1/2">Quantity</div>
        <div className="w-full">
          <CommonInputNumber
            input={inputData.quantity}
            onInputChange={(val) => {
              setInputData((prev) => ({ ...prev, quantity: val }));
            }}
            error={inputDataError[1]}
            errorMessage={"Required"}
            onChg={() => {
              const newdata = [...inputDataError];
              newdata[1] = false;
              setInputDataError(newdata);
            }}
          ></CommonInputNumber>
        </div>
      </div>

      <div className="mb-3 flex justify-evenly">
        <div className="w-1/2">Unit</div>
        <div className="w-full">
          <CommonInput
            input={inputData.unit}
            onInputChange={(val) => {
              setInputData((prev) => ({ ...prev, unit: val }));
            }}
            error={inputDataError[2]}
            errorMessage={"Required"}
            onChg={() => {
              const newdata = [...inputDataError];
              newdata[2] = false;
              setInputDataError(newdata);
            }}
          ></CommonInput>
        </div>
      </div>
      <div className="mb-3 flex justify-evenly">
        <div className="w-1/2">Category</div>
        <div className="w-full">
          <CommonInput
            input={inputData.category}
            onInputChange={(val) => {
              setInputData((prev) => ({ ...prev, category: val }));
            }}
            error={inputDataError[3]}
            errorMessage={"Required"}
            onChg={() => {
              const newdata = [...inputDataError];
              newdata[3] = false;
              setInputDataError(newdata);
            }}
          ></CommonInput>
        </div>
      </div>

      <div className="mb-3 flex justify-evenly">
        <div className="w-1/2">Location</div>
        <div className="w-full">
          <CommonInput
            input={inputData.location}
            onInputChange={(val) => {
              setInputData((prev) => ({ ...prev, location: val }));
            }}
            error={inputDataError[4]}
            errorMessage={"Required"}
            onChg={() => {
              const newdata = [...inputDataError];
              newdata[4] = false;
              setInputDataError(newdata);
            }}
          ></CommonInput>
        </div>
      </div>

      <div className="mb-3 flex justify-evenly">
        <div className="w-1/2">Detail Location</div>
        <div className="w-full">
          <CommonInput
            input={inputData.detail_location}
            onInputChange={(val) => {
              setInputData((prev) => ({ ...prev, detail_location: val }));
            }}
          ></CommonInput>
        </div>
      </div>

      <div className="mb-3 flex justify-evenly">
        <div className="w-1/2">Note</div>
        <div className="w-full">
          <CommonInput
            input={inputData.note}
            onInputChange={(val) => {
              setInputData((prev) => ({ ...prev, note: val }));
            }}
          ></CommonInput>
        </div>
      </div>
      <div className="mb-3 flex justify-evenly">
        <div className="w-1/2">Picture</div>
        <div className="w-full">
          <div className="relative">
            <input
              className={`w-full rounded-sm border-[1.5px] bg-white  px-2 py-1 outline-none transition ${
                inputDataError[4] ? "border-red" : "border-stroke"
              } bg-transparent text-black focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
              placeholder={"File"}
              type="file"
              input={file}
              accept=".jpeg"
              onChange={(event) => {
                const selectedFile = event.target.files[0];
                setFile(selectedFile);
                setFilePreview(URL.createObjectURL(selectedFile));
              }}
            />
            {inputDataError[5] ? (
              <span className="mt-1 text-sm text-red">{fileErrorMessage}</span>
            ) : (
              <></>
            )}
          </div>
          {isSmallScreen ? (
            <div className="mt-2 flex items-center justify-start">
              <span className="mr-2 ">or Take a Picture</span>
              <span
                onClick={() => {
                  display_camera();

                  console.log("dsd");
                }}
              >
                {" "}
                <MdCameraAlt className="h-6 w-6" />
              </span>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      {file ? (
        <div className="flex justify-center">
          <img src={filePreview} className="h-30" />
        </div>
      ) : (
        <></>
      )}

      <div className="mt-5">
        <CommonButtonFull
          label={"Submit"}
          onload={onSubmit}
          disabled={onSubmit}
          onClick={async (e) => {
            e.preventDefault();
            const localError = [false, false, false, false];
            const error = [...inputDataError];
            if (inputData.description == "") {
              error[0] = true;
              localError[0] = true;
              setInputDataError(error);
            } else {
              localError[0] = false;
            }

            if (inputData.quantity == "" || inputData.quantity == 0) {
              error[1] = true;
              localError[1] = true;
              setInputDataError(error);
            } else {
              localError[1] = false;
            }

            if (inputData.unit == "") {
              error[2] = true;
              localError[2] = true;
              setInputDataError(error);
            } else {
              localError[2] = false;
            }

            if (inputData.category == "") {
              error[3] = true;
              localError[3] = true;

              setInputDataError(error);
            } else {
              localError[3] = false;
            }

            if (inputData.location == "") {
              error[4] = true;
              localError[4] = true;

              setInputDataError(error);
            } else {
              localError[4] = false;
            }
            /*
            if (!file) {
              error[5] = true;
              localError[5] = true;
              setInputDataError(error);
              setFileErrorMessage("Required");
            } else {
              if (file.size > 512000) {
                error[5] = true;
                localError[5] = true;
                setInputDataError(error);
                setFileErrorMessage("File exceed 500kB");
              } else {
                localError[5] = false;
                setFileErrorMessage("");
              }
            }
*/
            console.log(inputData);

            if (!localError.includes(true)) {
              setOnSubmit(true);
              const formData = new FormData();
              const apiurl = `${API_URL}/newtool`;
              if (file) {
                formData.append("file", file);
                formData.append("withImage", 1);
              } else {
                formData.append("withImage", 0);
              }

              formData.append("description", inputData.description);
              formData.append("quantity", inputData.quantity);
              formData.append("unit", inputData.unit);
              formData.append("category", inputData.category);
              formData.append("location", inputData.location);
              formData.append("detail_location", inputData.detail_location);
              formData.append("note", inputData.note);

              const response = await fetch(apiurl, {
                method: "POST",
                body: formData,
              });

              if (response.status == 200) {
                const data = await response.json();
                close_modal();
                //console.log(data);

                /*
                if (data["error"] == 1) {
                  error[1] = true;
                  localError[1] = true;
                  setInputDataError(error);
                  setBarcodeErrorMessage(data["message"]);
                } else {
                  error[1] = false;
                  localError[1] = false;
                  setInputDataError(error);
                  close_modal();
                }
                  */
              }
              setOnSubmit(false);
            }
          }}
        ></CommonButtonFull>
      </div>
    </div>
  );
}
