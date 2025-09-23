import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { Checkbox } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import { ViewIcon, ViewOffSlashIcon } from "hugeicons-react";

import WomanEatingImage from "../../../assets/images/woman-eating.svg";
import LoginBgImage from "../../../assets/images/login-bg.svg";
import { Button } from "../../../components";
import { Link } from "react-router-dom";

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
    // login logic
  };

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
        className="animate-slide-in-left absolute -bottom-20 -left-5 hidden h-[50rem] w-[50rem] max-w-4xl lg:block"
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 lg:justify-end lg:px-10">
        <div className="min-h-[50vh] w-full max-w-3xl overflow-y-auto rounded-[12px] bg-white p-8 shadow-2xl md:p-12 lg:min-h-[90vh] lg:rounded-[68px] lg:p-12">
          <div className="mb-6 flex justify-center">
            <img
              ref={logoRef}
              src="/logo.svg"
              alt="Brand Logo"
              className="animate-zoom-in hover-shake h-auto w-32 transition-all duration-200 md:w-36 lg:w-40 xl:w-46"
            />
          </div>

          <h2 className="text-primary mb-6 text-xl font-bold md:text-2xl lg:text-4xl">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="username" className="mb-2 block text-base font-medium text-gray-900">
                Username
              </label>
              <input
                {...register("username")}
                type="text"
                id="username"
                placeholder="Email address"
                className={`w-full rounded-xl border-2 bg-[#F7F7F7] px-4 py-3 font-medium transition-colors focus:outline-none ${
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
              <label htmlFor="password" className="mb-2 block text-base font-medium text-gray-900">
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
              disabled={isSubmitting}
              loading={isSubmitting}
              variant="primary"
              className="w-full"
            >
              Login
            </Button>

            <div className="mt-4 flex flex-col items-start space-y-2 text-start text-base font-medium text-gray-600">
              <Link to="/admin/dashboard">Super admin's dashboard</Link>
              <Link to="/cashier/dashboard">Cashier's dashboard</Link>
              <Link to="/kitchen/dashboard">Kitchen's dashboard</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
