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
import { compressImage } from "@/utils/compressimage";
import { MdCameraAlt } from "react-icons/md";
import { useMediaQuery } from "react-responsive";

export default function NewProduct({
  onClose,
  showScanner,
  scanResult,
  showCamera,
  cameraResult,
  inputData,
  setInputData,
  file,
  setFile,
  filePreview,
  setFilePreview,
}) {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });
  const [inputDataError, setInputDataError] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const [onSubmit, setOnSubmit] = useState(false);
  const [fileErrorMessage, setFileErrorMessage] = useState("");
  const [barcodeErrorMessage, setBarcodeErrorMessage] = useState("");
  const [compressedImage, setCompressedImage] = useState(null);

  useEffect(() => {
    console.log(scanResult);
    setInputData((prev) => ({ ...prev, barcode: scanResult }));
    console.log(inputData);
  }, [scanResult]);

  const display_scanner = () => {
    // const temp = JSON.stringify(inputData);
    //localStorage.setItem("tempNewProduct", temp);
    showScanner();
  };

  useEffect(() => {
    if (cameraResult) {
      setFile(cameraResult);
      setFilePreview(URL.createObjectURL(cameraResult));
    }
  }, [cameraResult]);

  const input_file_change = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const compressedFile = await compressImage(file, {
        maxSizeMB: 0.5, // Compress to 0.5MB
        maxWidthOrHeight: 1024, // Max width/height of 1024px
      });

      setCompressedImage(compressedFile);

      //const selectedFile = event.target.files[0];
      //setFile(selectedFile);
      //setFilePreview(URL.createObjectURL(selectedFile));
      setFile(compressedFile);
      setFilePreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error("Failed to compress image:", error);
    }
  };

  /*
  useEffect(() => {
    if (file) {
      if (file.size > 512000) {
        const newdata = [...inputDataError];
        newdata[4] = true;
        setInputDataError(newdata);
      } else {
        const newdata = [...inputDataError];
        newdata[4] = false;
        setInputDataError(newdata);
      }
    }
  }, [file]);
  */

  const close_modal = () => {
    onClose(false);
  };

  return (
    <div>
      <div className="mb-3 flex justify-evenly">
        <div className="flex w-1/2  justify-start">
          <div className="flex items-center">Barcode</div>
          <div
            className="ml-3 flex items-center text-danger"
            onClick={() => {
              display_scanner();
            }}
          >
            <IoScan className="h-5 w-5" />
          </div>
        </div>
        <div className="w-full">
          <CommonInput
            placeholder={"Leave empty if not available"}
            input={inputData.barcode}
            onInputChange={(val) => {
              setInputData((prev) => ({ ...prev, barcode: val }));
            }}
            error={inputDataError[1]}
            errorMessage={barcodeErrorMessage}
            onChg={() => {
              const newdata = [...inputDataError];
              newdata[1] = false;
              setInputDataError(newdata);
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
        <div className="w-1/2">Initial Stock</div>
        <div className="w-full">
          <CommonInputNumber
            input={inputData.initial_stock}
            onInputChange={(val) => {
              setInputData((prev) => ({ ...prev, initial_stock: val }));
            }}
          ></CommonInputNumber>
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
              onChange={input_file_change}
            />
            {inputDataError[4] ? (
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
                  showCamera();

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

      <div className="mt-8">
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

            /*
            if (inputData.barcode == "") {
              error[1] = true;
              localError[1] = true;
              setInputDataError(error);
            } else {
              localError[1] = false;
            }
*/
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
            /*
            if (!file) {
              error[4] = true;
              localError[4] = true;
              setInputDataError(error);
              setFileErrorMessage("Required");
            } else {
              
              if (file.size > 512000) {
                error[4] = true;
                localError[4] = true;
                setInputDataError(error);
                setFileErrorMessage("File exceed 500kB");
              } else {
                localError[4] = false;
                setFileErrorMessage("");
              }
                
              localError[4] = false;
              setFileErrorMessage("");
            }
              */

            if (!localError.includes(true)) {
              setOnSubmit(true);
              const formData = new FormData();
              const apiurl = `${API_URL}/createproduct`;
              if (file) {
                formData.append("file", file);
                formData.append("withImage", 1);
              } else {
                formData.append("withImage", 0);
              }

              formData.append("description", inputData.description);
              formData.append("barcode", inputData.barcode);
              formData.append("unit", inputData.unit);
              formData.append("category", inputData.category);
              formData.append("location", inputData.location);
              formData.append("initial_stock", inputData.initial_stock);

              const response = await fetch(apiurl, {
                method: "POST",
                body: formData,
              });

              if (response.status == 200) {
                const data = await response.json();
                //console.log(data);
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
              }
              setOnSubmit(false);
            }
          }}
        ></CommonButtonFull>
      </div>
    </div>
  );
}
