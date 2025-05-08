import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axiosClient from "../../api/axiosClient";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loginAPI = async (username, password) => {
    try {
      const { data } = await axiosClient.post("/auth/login", {
        username,
        password,
      });
      const { token, expiresAt, role } = data.data;
      Cookies.set("token", token, {
        expires: new Date(expiresAt),
        path: "/",
      });
      Cookies.set("role", role, {
        expires: new Date(expiresAt),
        path: "/",
      });
      Cookies.set("username", username, {
        expires: new Date(expiresAt),
        path: "/",
      });
      toast.success("Đăng nhập thành công!");
      return role;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    setIsLoading(true);
    try {
      const role = await loginAPI(username, password);
      setTimeout(() => {
        if (role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/index");
        }
      }, 1000);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Login Form */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-center mb-8">
              Đăng nhập
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="mb-1">
                  Tên đăng nhập
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full px-4 py-3 rounded bg-gray-100 border border-transparent focus:border-gray-300 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="mb-1">
                  Mật khẩu
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded bg-gray-100 border border-transparent focus:border-gray-300 focus:outline-none"
                />
              </div>
              <div className="mb-6 text-right">
                <a
                  href="/forgot-password"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
              >
                {isLoading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
              </button>
            </form>
          </div>

          {/* Right side - Welcome message */}
          <div className="w-full md:w-1/2 bg-red-500 p-8 flex flex-col items-center justify-center text-white">
            <h2 className="text-2xl font-bold mb-4">Xin chào, bạn mới!</h2>
            <p className="text-center mb-8">
              Nhập thông tin cá nhân của bạn và bắt đầu hành trình cùng chúng
              tôi!
            </p>
            <button
              onClick={() => navigate("/register")}
              className=" cursor-pointer border-2 border-white py-2 px-10 rounded-full hover:bg-red-400 transition-colors"
            >
              ĐĂNG KÝ
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
};

export default Login;
