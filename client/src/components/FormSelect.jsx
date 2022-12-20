import React from "react";

const FormSelect = ({ labelName, options }) => {
  return (
    <div className="mb-6 mx-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2 capitalize"
        htmlFor="password"
      >
        {labelName}
      </label>
      <select className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline">
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
