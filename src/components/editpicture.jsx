import { CommonInput, CommonInputFile } from "@/components/input";
import { useEffect, useState } from "react";
import { FaGlasses } from "react-icons/fa";
import { IoScan } from "react-icons/io5";
import { CommonButton, CommonButtonFull } from "./button";
import { API_URL, IMAGE_URL } from "@/utils/constant";
import { useMediaQuery } from "react-responsive";

export default function EditPicture({ data, onClose, showCamera, scanResult }) {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });
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

  useEffect(() => {
    if (data.image_url != "") {
      const url = `${IMAGE_URL}/${data.image_url}`;
      setFilePreview(url);
      console.log(data);
    }
  }, []);

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
            {inputDataError[4] ? (
              <span className="mt-1 text-sm text-red">{fileErrorMessage}</span>
            ) : (
              <></>
            )}
          </div>
          {isSmallScreen ? (
            <div className="my-2 flex flex-row">
              <div>or</div>
              <div
                onClick={showCamera}
                className="ml-2 cursor-default hover:text-strokedark"
              >
                Take a Picture
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      {file || filePreview ? (
        <div className="flex justify-center">
          <img src={filePreview} className="h-30" />
        </div>
      ) : (
        <div className="flex justify-center">No picture found</div>
      )}

      <div className="mt-5">
        <CommonButtonFull
          label={"Submit"}
          onload={onSubmit}
          disabled={onSubmit}
          onClick={async (e) => {
            e.preventDefault();
            const localError = [false];
            const error = [...inputDataError];

            if (!file) {
              error[0] = true;
              localError[0] = true;
              setInputDataError(error);
              setFileErrorMessage("Required");
            } else {
              if (file.size > 512000) {
                error[0] = true;
                localError[0] = true;
                setInputDataError(error);
                setFileErrorMessage("File exceed 500kB");
              } else {
                localError[0] = false;
                setFileErrorMessage("");
              }
            }

            if (!localError.includes(true)) {
              setOnSubmit(true);
              const formData = new FormData();
              const apiurl = `${API_URL}/editpicture`;
              formData.append("file", file);
              formData.append("idProduct", data.id_product);

              const response = await fetch(apiurl, {
                method: "POST",
                body: formData,
              });

              if (response.status == 200) {
                //const data = await response.json();
                //console.log(data);
                close_modal();
              }
              setOnSubmit(false);
            }
          }}
        ></CommonButtonFull>
      </div>
    </div>
  );
}
