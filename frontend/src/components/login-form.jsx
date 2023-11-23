import React from "react";
import { useForm } from "react-hook-form";
import { AiOutlineUnlock } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const email = watch("email");
  const password = watch("password");
  const navigate = useNavigate();

  const logIn = async () => {
    try {
      await axios({
        method: "POST",
        data: {
          email,
          password,
        },
        withCredentials: true,
        url: "http://localhost:5000/login",
      });

      toast.success("User authenticated!");
      navigate("/");
    } catch (err) {
      //Error
      toast.error(err.response?.data || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(logIn)}>
      <div className="formInput">
        <input
          className="peer"
          placeholder=""
          {...register("email", {
            required: true,
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Entered value does not match email format",
            },
          })}
          aria-invalid={errors.email ? "true" : "false"}
        />
        <label className="inputLabel" htmlFor="">
          Your Email
        </label>
        <BiUser className="absolute top-4 right-4" />
      </div>
      {errors.email?.type === "required" && (
        <p className=" text-red-500" role="alert">
          Email is required
        </p>
      )}
      <p className=" text-red-500" role="alert">
        {errors.email?.message}
      </p>
      <div className="formInput">
        <input
          className="peer"
          type="password"
          placeholder=""
          {...register("password", { required: true })}
          aria-invalid={errors.password ? "true" : "false"}
        />
        <label className="inputLabel" htmlFor="">
          Your Password
        </label>
        <AiOutlineUnlock className="absolute top-4 right-4" />
      </div>
      {errors.password?.type === "required" && (
        <p className=" text-red-500" role="alert">
          Password is required
        </p>
      )}
      <button
        className="w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors duration-300 py-2"
        type="submit"
      >
        Login
      </button>
      <div>
        <span className="mt-4 flex justify-center gap-2">
          New Here?
          <Link className="text-blue-500" to="/register">
            Create an Account
          </Link>
        </span>
      </div>
    </form>
  );
};

export default LoginForm;
