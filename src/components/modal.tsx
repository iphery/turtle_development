import React, { Children } from "react";
import { HiOutlineXMark } from "react-icons/hi2";

export const CustomModal = ({
  isVisible,
  onClose,
  isSmallWidth,
  children,
  autoClose = false,
}: {
  isVisible: boolean;
  isSmallWidth: string;
  onClose: () => void;
  children: React.ReactNode;
  autoClose?: boolean;
}) => {
  if (!isVisible) return null;

  const handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    //if ((e.target as HTMLElement).id === "wrapper") onClose();
  };

  return (
    <div
      className="fixed inset-0 flex   items-center justify-center bg-black bg-opacity-25 backdrop-blur-sm"
      id="wrapper"
      onClick={handleClose}
    >
      <div
        className={`w-full ${isSmallWidth == "sm" ? "sm:w-1/3" : isSmallWidth == "md" ? "md:w-1/2" : "sm:w-2/3"}   px-5`}
      >
        {!autoClose && (
          <div className="flex justify-end  p-1">
            <div
              className=" justify center flex h-8 w-8 cursor-pointer items-center  rounded-full p-2 text-xl text-white hover:bg-primary hover:bg-opacity-20"
              onClick={() => onClose()}
            >
              <HiOutlineXMark />
            </div>
          </div>
        )}
        <div className="max-h-[calc(100vh-100px)] overflow-y-auto rounded-lg bg-white p-10">
          {children}
        </div>
      </div>
    </div>
  );
};
