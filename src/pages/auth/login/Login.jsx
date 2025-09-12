import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { Checkbox } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import { ViewIcon, ViewOffSlashIcon } from "hugeicons-react";

import WomanEatingImage from "../../../assets/images/woman-eating.svg";
import { Button } from "../../../components";

const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: yup.boolean(),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const logoRef = useRef(null);

  useEffect(() => {
    const logo = logoRef.current;
    if (logo) {
      logo.classList.add("initial-load");

      setTimeout(() => {
        logo.classList.remove("initial-load");
      }, 1500);
    }
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
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
    console.log(data);
    // await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="relative h-full min-h-screen overflow-hidden">
      <img
        src="/dummy-path/background.png"
        alt="Background"
        className="fixed inset-0 w-full h-full object-cover"
      />
      <div className="fixed inset-0 bg-primary" />

      <img
        src={WomanEatingImage}
        alt="Character"
        className="hidden lg:block absolute -bottom-10 -left-5 animate-slide-in-left w-[54rem] h-[54rem] max-w-4xl"
      />

      <div className="relative z-10 flex justify-end m-5 my-10 lg:m-10 min-h-[90vh]">
        <div className="w-full max-w-3xl bg-white rounded-[12px] lg:rounded-[68px] shadow-2xl p-8 md:p-12 lg:p-12 overflow-y-auto">
          <div className="flex justify-center mb-6">
            <img
              ref={logoRef}
              src="/logo.svg"
              alt="Brand Logo"
              className="w-32 h-auto animate-zoom-in hover-shake md:w-36 lg:w-40 xl:w-46 transition-all duration-200"
            />
          </div>

          <h2 className="text-4xl font-bold text-primary mb-6">Welcome Back</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-base font-medium text-gray-900 mb-2"
              >
                Username
              </label>
              <input
                {...register("username")}
                type="text"
                id="username"
                className={`w-full px-4 py-3 font-medium rounded-xl border-2 bg-[#F7F7F7] transition-colors focus:outline-none ${
                  errors.username
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-base font-medium text-gray-900 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`w-full px-4 py-3 pr-12 bg-[#F7F7F7] rounded-xl border-2 transition-colors focus:outline-none ${
                    errors.password
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-green-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <ViewOffSlashIcon size={20} />
                  ) : (
                    <ViewIcon size={20} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
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
                    <span className="text-base font-medium text-gray-600 font-primary">
                      Remember Me
                    </span>
                  </Checkbox>
                )}
              />
            </div>
            <Button
              type="submit"
              size="xl"
              disabled={isSubmitting}
              loading={isSubmitting}
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
