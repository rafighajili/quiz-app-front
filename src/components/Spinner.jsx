import React from "react";

const Spinner = () => {
  return (
    <div className="w-full py-8 flex justify-center">
      <span className="w-16 h-16 rounded-full border-8 border-orange-500 border-t-transparent animate-spin" />
    </div>
  );
};

export default Spinner;
