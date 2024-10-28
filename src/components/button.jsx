import { ButtonLoader } from "@/components/loader";

export const CommonButton = ({ label, onload, disabled, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-buttonnormal hover:bg-buttonhover rounded-sm border border-bodydark p-2 text-sm text-strokedark shadow-md"
      disabled={disabled}
    >
      {onload ? <ButtonLoader color={"strokedark"} /> : label}
    </button>
  );
};

export const CommonButtonColor = ({
  color1,
  color2,
  label,
  onload,
  disabled,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-sm border border-bodydark ${color1}  p-2 text-sm text-white shadow-md hover:${color2}`}
      disabled={disabled}
    >
      {onload ? <ButtonLoader color={"white"} /> : label}
    </button>
  );
};

export const CommonButtonFull = ({
  label,
  onload,
  disabled,
  onClick,
  btnColor,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full cursor-default rounded-sm border border-bodydark  p-3 text-sm text-white shadow-md ${disabled ? "bg-bodydark" : "bg-strokedark hover:bg-form-strokedark"}`}
      disabled={disabled}
    >
      {onload ? <ButtonLoader color={btnColor} /> : label}
    </button>
  );
};
