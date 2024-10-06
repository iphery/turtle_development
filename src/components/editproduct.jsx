import { CommonInput, CommonInputFile } from "@/components/input";
import { useEffect, useState } from "react";
import { FaGlasses } from "react-icons/fa";
import { IoScan } from "react-icons/io5";
import { CommonButtonFull } from "./button";
import { API_URL } from "@/utils/constant";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function EditProduct({
  data,
  onClose,
  showScanner,
  scanResult,
}) {
  const router = useRouter();
  const [inputData, setInputData] = useState({
    description: "",
    barcode: "",
    unit: "",
    category: "",
  });
  const [inputDataError, setInputDataError] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState();
  const [onSubmit, setOnSubmit] = useState(false);
  const [fileErrorMessage, setFileErrorMessage] = useState("");
  const [barcodeErrorMessage, setBarcodeErrorMessage] = useState(false);

  useEffect(() => {
    console.log(data);
    setInputData(data);
  }, []);

  useEffect(() => {
    console.log("hasil secan");
    console.log(scanResult);
    if (scanResult != null && scanResult != "") {
      setInputData((prev) => ({ ...prev, barcode: scanResult }));
    }
  }, [scanResult]);

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

  const close_modal = () => {
    onClose(false);
  };

  return (
    <div>
      <div className="mb-3 flex justify-evenly">
        <div
          className="w-1/2"
          onClick={() => {
            console.log(inputData);
          }}
        >
          Description
        </div>
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
        <div className="flex w-1/2  justify-start">
          <div>Barcode</div>
          <div className="ml-3 text-danger " onClick={showScanner}>
            <IoScan className="h-5 w-5" />
          </div>
        </div>
        <div className="w-full">
          <CommonInput
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

      <div className="mt-5">
        <CommonButtonFull
          label={"Save"}
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

            if (inputData.barcode == "") {
              error[1] = true;
              localError[1] = true;
              setBarcodeErrorMessage("Required");
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

            if (!localError.includes(true)) {
              setOnSubmit(true);
              const apiurl = `${API_URL}/updateproduct`;
              const response = await axios.post(apiurl, {
                data: inputData,
                idProduct: data.id_product,
              });

              if (response.status == 200) {
                const data = await response.data;
                console.log(data);

                if (data["error"] == 1) {
                  error[1] = true;
                  localError[1] = true;

                  setBarcodeErrorMessage(data["message"]);
                  setInputDataError(error);
                } else {
                  localError[1] = false;
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
