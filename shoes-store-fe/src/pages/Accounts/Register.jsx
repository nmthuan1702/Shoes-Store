import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axiosClient from "../../api/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const registerAPI = async (username, email, password) => {
    try {
      const { data } = await axiosClient.post("/auth/register-user", {
        username,
        email,
        password,
      });
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      reset();
      return data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Đăng ký thất bại!");
      throw error;
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerAPI(data.username, data.email, data.password);
      setTimeout(() => {
        navigate("/login");
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
          {/* Left side - Welcome message */}
          <div className="w-full md:w-1/2 bg-red-500 p-8 flex flex-col items-center justify-center text-white">
            <h2 className="text-2xl font-bold mb-4">Đã có tài khoản?</h2>
            <p className="text-center mb-8">
              Đăng nhập ngay để truy cập vào tài khoản của bạn và tiếp tục hành
              trình!
            </p>
            <button
              onClick={() => navigate("/login")}
              className=" cursor-pointer border-2 border-white py-2 px-10 rounded-full hover:bg-red-400 transition-colors"
            >
              ĐĂNG NHẬP
            </button>
          </div>

          {/* Right side - Registration Form */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-center mb-8">Đăng ký</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Tên đăng nhập
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  className={`w-full px-4 py-3 rounded bg-gray-100 border ${
                    errors.username ? "border-red-500" : "border-transparent"
                  } focus:border-gray-300 focus:outline-none`}
                  {...register("username", {
                    required: "Tên đăng nhập không được để trống",
                    minLength: {
                      value: 3,
                      message: "Tên đăng nhập phải có ít nhất 3 ký tự",
                    },
                  })}
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Nhập email"
                  className={`w-full px-4 py-3 rounded bg-gray-100 border ${
                    errors.email ? "border-red-500" : "border-transparent"
                  } focus:border-gray-300 focus:outline-none`}
                  {...register("email", {
                    required: "Email không được để trống",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email không hợp lệ",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Mật khẩu
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  className={`w-full px-4 py-3 rounded bg-gray-100 border ${
                    errors.password ? "border-red-500" : "border-transparent"
                  } focus:border-gray-300 focus:outline-none`}
                  {...register("password", {
                    required: "Mật khẩu không được để trống",
                    minLength: {
                      value: 6,
                      message: "Mật khẩu phải có ít nhất 6 ký tự",
                    },
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Xác nhận mật khẩu
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  className={`w-full px-4 py-3 rounded bg-gray-100 border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-transparent"
                  } focus:border-gray-300 focus:outline-none`}
                  {...register("confirmPassword", {
                    required: "Vui lòng xác nhận mật khẩu",
                    validate: (value) =>
                      value === watch("password") ||
                      "Mật khẩu xác nhận không khớp",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
              >
                {isLoading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
};

export default Register;
