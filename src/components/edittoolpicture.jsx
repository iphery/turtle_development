import { CommonInput, CommonInputFile } from "@/components/input";
import { useEffect, useState } from "react";
import { FaGlasses } from "react-icons/fa";
import { IoScan } from "react-icons/io5";
import { CommonButton, CommonButtonFull } from "./button";
import { API_URL, IMAGE_URL } from "@/utils/constant";
import { useMediaQuery } from "react-responsive";
import { MdCameraAlt } from "react-icons/md";
import { compressImage } from "@/utils/compressimage";

export default function EditToolPicture({
  data,
  onClose,
  showCamera,
  cameraResult,
  idAsset,
}) {
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
  const [compressedImage, setCompressedImage] = useState(null);

  useEffect(() => {
    if (data.image_url != "") {
      const url = `${IMAGE_URL}/${data.image_url}`;
      setFilePreview(url);
      console.log(data);
    }
  }, []);

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
        <div className="w-1/2">Picture</div>
        <div className="w-full">
          <div className="relative">
            <input
              className={`w-full rounded-sm border-[1.5px] bg-white  px-2 py-1 outline-none transition ${
                inputDataError[0] ? "border-red" : "border-stroke"
              } bg-transparent text-black focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
              placeholder={"File"}
              type="file"
              input={file}
              accept=".jpeg"
              onChange={input_file_change}
            />
            {inputDataError[0] ? (
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
            console.log(file);

            if (!file) {
              error[0] = true;
              localError[0] = true;
              setInputDataError(error);
              setFileErrorMessage("Required");
            } else {
              localError[0] = false;
              setFileErrorMessage("");
              /*
              if (file.size > 512000) {
                error[0] = true;
                localError[0] = true;
                setInputDataError(error);
                setFileErrorMessage("File exceed 500kB");
              } else {
                localError[0] = false;
                setFileErrorMessage("");
              }
                */
            }

            if (!localError.includes(true)) {
              setOnSubmit(true);
              const formData = new FormData();
              const apiurl = `${API_URL}/edittoolpicture`;
              formData.append("file", file);
              formData.append("idAsset", idAsset);

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
