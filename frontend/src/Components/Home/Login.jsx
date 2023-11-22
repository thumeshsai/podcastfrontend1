/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Login = ({ setPopupVisible, type, isPopupVisible }) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [Loading, setLoading] = useState(false);
  const onClose = () => {
    setPopupVisible(false);
    setEmail("");
    setPassword("");
    setUsername("");
    setError("");
  };

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setUsername("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = {};
    if (isLogin) {
      // For Login
      requestData.email = email;
      requestData.password = password;
      requestData.role = type.toLowerCase();
    } else {
      // For Registration
      requestData.username = username;
      requestData.email = email;
      requestData.password = password;
      requestData.role = type.toLowerCase();
    }
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    setLoading(true);
    Axios.post(
      isLogin
        ? `${backendUrl}/credentials/login`
        : `${backendUrl}/credentials/register`,
      requestData,
      {
        withCredentials: true,
      }
    )
      .then((res) => {
        if (isLogin) {
          if (res.status === 200) {
            //localStorage.setItem("token", res.data.jwt);
            if (type.toLowerCase() === "user") {
              navigate("/user");
            } else {
              navigate("/admin");
            }
          } else {
            setError(res.data.message);
          }
        } else {
          if (res.status === 201) {
            alert("Registration Successful");
            handleToggleForm();
          } else {
            setError(res.data.message);
          }
        }
        setLoading(false);
      })
      .catch((res, err) => {
        setLoading(false);
        setError(res.response.data.message);
      });
  };

  return (
    <>
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={Loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
      <div
        className={`fixed bg-gray-300 bg-opacity-70 inset-0 flex items-center justify-center z-50 ${
          isPopupVisible ? "" : "hidden"
        }`}
      >
        <div className="bg-white p-4 rounded-lg sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {isLogin ? type + " Login" : type + " Register"}
          </h2>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold">
                Email
              </label>
              <input
                type="email"
                className="w-full p-2 border rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold">
                Password
              </label>
              <input
                type="password"
                className="w-full p-2 border rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-gray-500"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>
          <div className="flex justify-around">
            <button
              onClick={handleToggleForm}
              className="bg-gray-300 hover-bg-gray-400 rounded-lg py-2 px-4 mr-2 hover:bg-green-500 hover:text-white"
            >
              {isLogin ? "Register" : "Login"}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 hover-bg-gray-400 rounded-lg py-2 px-4 hover:bg-red-500 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
