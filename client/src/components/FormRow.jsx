import React from "react";

const FormRow = ({ labelName, type }) => {
  return (
    <div className="mb-6 mx-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2 capitalize"
        htmlFor="password"
      >
        {labelName}
      </label>
      <input
        className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
        id={labelName}
        type={type}
        required
      />
    </div>
  );
};

export default FormRow;
