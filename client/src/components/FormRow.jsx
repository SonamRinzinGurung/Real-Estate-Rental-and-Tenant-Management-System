import React from "react";

const FormRow = ({ labelName, type }) => {
  return (
    <div className="mb-6 ">
      <input
        className="shadow border rounded w-full py-2 px-3 focus:outline-none focus:shadow-outline focus:border-tertiary"
        type={type}
        placeholder={labelName}
        required
      />
    </div>
  );
};

export default FormRow;
