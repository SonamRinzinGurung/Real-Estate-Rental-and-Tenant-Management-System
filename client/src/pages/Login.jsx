import { useEffect } from "react";
import FormRow from "../components/FormRow";
import { useDispatch, useSelector } from "react-redux";
import { loginOwner, loginTenant } from "../features/auth/authSlice";
import { useNavigate, useParams } from "react-router-dom";
const Login = () => {
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
      email: e.target[0].value,
      password: e.target[1].value,
      role: param.role,
    };
    if (param.role === "owner") {
      dispatch(loginOwner({ userInfo }));
    } else if (param.role === "tenant") {
      dispatch(loginTenant({ userInfo }));
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 hover:shadow-xl w-96"
      >
        <h1 className="font-bold text-4xl text-gray-800 font-mono text-center my-4 py-5">
          Login
        </h1>
        <FormRow labelName="email" type="email" />

        <FormRow labelName="password" type="password" />

        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
