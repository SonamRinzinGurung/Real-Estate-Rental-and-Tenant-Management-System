import FormRow from "../components/FormRow";
import FormSelect from "../components/FormSelect";
import { useDispatch, useSelector } from "react-redux";
import { registerOwner, registerTenant } from "../features/auth/authSlice";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Register = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const param = useParams();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const dispatch = useDispatch();
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
      role: param.role,
    };
    if (param.role === "owner") {
      dispatch(registerOwner({ userInfo }));
    } else if (param.role === "tenant") {
      dispatch(registerTenant({ userInfo }));
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
