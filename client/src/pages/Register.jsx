import React from "react";
import FormRow from "../components/FormRow";
import FormSelect from "../components/FormSelect";
const Register = () => {
  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="flex flex-col justify-center items-center h-full max-w-xl mx-auto">
        <h1 className="font-bold text-4xl text-gray-800 font-mono text-center my-4 py-5">
          Register
        </h1>
        <form className="flex flex-row bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 hover:shadow-xl flex-wrap">
          <FormRow labelName="first name" type="text" />
          <FormRow labelName="last name" type="text" />
          <FormRow labelName="email" type="email" />
          <FormRow labelName="address" type="text" />
          <FormRow labelName="phone number" type="text" />
          <FormRow labelName="age" type="text" />
          <FormSelect
            labelName="gender"
            options={["male", "female", "other"]}
          />
          <FormRow labelName="password" type="password" />
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
