import React from "react";
import { twMerge } from "tailwind-merge";
import Label from "./Label";

const Input = ({ label, name, type, value, required, className, onChange, onBlur, disabled, errorMsg }) => {
  const inputStyles = `text-sm font-light bg-white border ${
    errorMsg ? "border-red-500" : "border-neutral-400 hover:border-orange-500 focus:border-orange-500"
  } duration-300 py-2 px-4 rounded-xl`;

  return (
    <div className={twMerge("flex flex-col w-full", className)}>
      {!!label && <Label label={label} htmlFor={name} required={required} errorMsg={errorMsg} />}

      {type === "textarea" ? (
        <textarea
          name={name}
          id={name}
          value={value}
          className={inputStyles + " h-24"}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
        ></textarea>
      ) : (
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          className={inputStyles}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default Input;
