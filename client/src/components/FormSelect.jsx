import React from "react";

const FormSelect = ({ labelName, options }) => {
  return (
    <div className="mb-2 flex">
      <label className="block text-gray-700 text-sm font-semibold self-center mr-2 capitalize">
        {labelName}
      </label>
      <select className="shadow border rounded w-full py-2 px-3 capitalize focus:outline-none focus:shadow-outline">
        {options.map((option, index) => {
          return (
            <option key={index} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default FormSelect;
