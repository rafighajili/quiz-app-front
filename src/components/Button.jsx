import { twMerge } from "tailwind-merge";

const Button = ({ children, type, icon, onClick, onSubmit, outlined, color, className, disabled }) => {
  return (
    <button
      type={type}
      className={twMerge(
        `py-2 ${!!icon ? "pl-2" : "pl-4"} pr-4 flex items-center justify-center rounded-xl ${
          outlined
            ? `border ${
                color === "green"
                  ? "border-green-500 bg-green-500 text-green-500"
                  : color === "red"
                  ? "border-red-500 bg-red-500 text-red-500"
                  : "border-orange-500 bg-orange-500 text-orange-500"
              } bg-opacity-0 hover:bg-opacity-10 active:bg-opacity-20`
            : `${color === "green" ? "bg-green-500" : color === "red" ? "bg-red-500" : "bg-orange-500"}
              text-white relative overflow-hidden after:absolute after:z-10 after:w-full after:h-full after:left-0 after:top-0 hover:after:bg-darkener-50 active:after:bg-darkener-100 disabled:brightness-75
              ${disabled && "pointer-events-none"}`
        }`,
        className
      )}
      onClick={onClick}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      <div className={`flex items-center z-20 ${!!icon ? "gap-1" : "gap-0"}`}>
        {!!icon && icon} <span className={`text-sm font-medium w-fit`}>{children}</span>
      </div>
    </button>
  );
};

export default Button;
