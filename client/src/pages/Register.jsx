import { useState } from "react";
import FormRow from "../components/FormRow";
import FormSelect from "../components/FormSelect";
import axios from "axios";

const Register = () => {
  const [owner, setOwner] = useState({});
  const handleSubmit = (e) => {
    e.preventDefault();
    const userInfo = {
      firstName: e.target[0].value,
      lastName: e.target[1].value,
      email: e.target[2].value,
      address: e.target[3].value,
      phoneNumber: e.target[4].value,
      age: e.target[5].value,
      gender: e.target[6].value,
      password: e.target[7].value,
      role: "owner",
    };
    register(userInfo);
  };

  const register = async (userInfo) => {
    try {
      const { data } = await axios.post("/auth/register", userInfo);
      const { owner, token } = data;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="flex flex-col justify-center items-center h-full max-w-xl mx-auto">
        <h1 className="font-bold text-4xl text-gray-800 font-mono text-center my-4 py-5">
          Register
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-row bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 hover:shadow-xl flex-wrap"
        >
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
              type="submit"
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
