import React from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../store/slices/restoranSlice";
const Login = () => {
  // create useref
  const { users } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const usernameRef = useRef();
  const passwordRef = useRef();

  const navigate = useNavigate();
  const onSubmit = (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    const user = users.find((user) => user.username === username);

    if (user && user.password === password) {
      sessionStorage.setItem("user", user.role);
      dispatch(setUser(user.role));

      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      }
      if (user.role === "chef") {
        navigate("/chef/chefscreen", { replace: true });
      }
    } else {
      alert("Kullanıcı adı veya şifre hatalı");
    }
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-1/3">
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              ref={usernameRef}
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              ref={passwordRef}
              type="password"
              className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="******************"
            />
            {/* <p className="text-red-500 text-xs italic">
              Please choose a password.
            </p> */}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
