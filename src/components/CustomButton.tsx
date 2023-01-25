import React from "react";

const CustomButton = ({
  btnType = "button",
  title,
  handleClick,
  styles,
  disabled = false,
}: ICustomButton) => {
  return (
    <button
      disabled={disabled}
      type={btnType}
      className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${styles} ${
        disabled ? "opacity-30" : null
      }`}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;

interface ICustomButton {
  btnType: "button" | "submit" | "reset" | undefined;
  title: string;
  handleClick: (e: any) => any;
  styles: string;
  disabled?: boolean;
}
