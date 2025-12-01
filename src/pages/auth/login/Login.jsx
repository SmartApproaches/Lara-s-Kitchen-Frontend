import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Checkbox } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import { ViewIcon, ViewOffSlashIcon } from "hugeicons-react";

import WomanEatingImage from "../../../assets/images/woman-eating.svg";
import LoginBgImage from "../../../assets/images/login-bg.svg";
import { Button } from "../../../components";
import { loginAuth, resetError } from "../../../redux/features/auth/loginSlice";

const loginSchema = yup.object().shape({
  username: yup.string().email("Please enter a valid email address").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: yup.boolean(),
});

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const logoRef = useRef(null);

  const isLoggedIn = useSelector((state) => state.login?.isLoggedIn);
  const loading = useSelector((state) => state.login?.loading);
  const user = useSelector((state) => state.login?.userLogin);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    dispatch(loginAuth({ email: data.username, password: data.password }));
  };

  useEffect(() => {
    const logo = logoRef.current;
    if (logo) {
      logo.classList.add("initial-load");

      setTimeout(() => {
        logo.classList.remove("initial-load");
      }, 1500);
    }
  }, []);

  useEffect(() => {
    if (user?.role?.role === "super_admin") {
      navigate("/admin/dashboard");
    } else if (user?.role?.role === "kitchen") {
      navigate("/kitchen/dashboard");
    } else if (user?.role?.role === "cashier") {
      navigate("/cashier/dashboard");
    }
  }, [isLoggedIn, navigate, location, user]);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  return (
    <div className="relative h-full min-h-screen overflow-hidden">
      <img
        src={LoginBgImage}
        alt="Background"
        className="fixed inset-0 h-full w-full object-cover"
      />

      <img
        src={WomanEatingImage}
        alt="Character"
        className="animate-slide-in-left fixed -bottom-28 -left-5 hidden h-[35rem] w-[35rem] max-w-4xl lg:block xl:h-[50rem] xl:w-[50rem]"
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 lg:justify-end lg:px-10 xl:px-16">
        <div className="w-full max-w-md overflow-y-auto my-4 rounded-[12px] bg-white p-6 shadow-2xl sm:max-w-lg sm:p-8 md:max-w-xl md:p-10 lg:min-h-[90vh] lg:max-w-2xl lg:rounded-[68px] lg:p-12 xl:max-w-2xl">
          <div className="mb-6 flex justify-center">
            <img
              ref={logoRef}
              onClick={() => navigate("/")}
              src="/logo.svg"
              alt="Brand Logo"
              className="animate-zoom-in hover-shake h-auto w-24 transition-all duration-200 sm:w-28 md:w-32 lg:w-36 xl:w-40"
            />
          </div>

          <h2 className="text-primary mb-4 text-lg font-bold sm:mb-6 sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 md:space-y-6">
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-medium text-gray-900 sm:mb-2 sm:text-base"
              >
                Username
              </label>
              <input
                {...register("username")}
                type="text"
                id="username"
                placeholder="Email address"
                className={`w-full rounded-xl border-2 bg-[#F7F7F7] px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none sm:px-4 sm:py-3 sm:text-base ${
                  errors.username
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-900 sm:mb-2 sm:text-base"
              >
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  className={`w-full rounded-xl border-2 bg-[#F7F7F7] px-4 py-3 pr-12 transition-colors focus:outline-none ${
                    errors.password
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-green-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-600"
                >
                  {showPassword ? <ViewOffSlashIcon size={20} /> : <ViewIcon size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            <div className="flex items-center">
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  >
                    <span className="font-primary text-base font-medium text-gray-600">
                      Remember Me
                    </span>
                  </Checkbox>
                )}
              />
            </div>
            <Button
              type="submit"
              size="xl"
              disabled={loading}
              loading={loading}
              variant="primary"
              className="w-full"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
