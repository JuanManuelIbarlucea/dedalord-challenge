import React from "react";
import { useForm } from "react-hook-form";
import { AiOutlineUnlock } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const name = watch("name");
  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const navigate = useNavigate();

  const registerUser = async () => {
    try {
      await axios({
        method: "POST",
        data: {
          name,
          email,
          password,
          confirmPassword,
        },
        withCredentials: true,
        url: "http://localhost:5000/register",
      });
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data || "Something went wrong");
      // Error
    }
  };

  return (
    <form onSubmit={handleSubmit(registerUser)}>
      <div className="formInput">
        <input
          className="peer"
          placeholder=""
          {...register("name", {
            required: true,
          })}
          aria-invalid={errors.name ? "true" : "false"}
        />
        <label className="inputLabel" htmlFor="">
          Your Name
        </label>
        <BiUser className="absolute top-4 right-4" />
      </div>
      {errors.name?.type === "required" && (
        <p className=" text-red-500" role="alert">
          Name is required
        </p>
      )}
      <div className="formInput">
        <input
          className="peer"
          placeholder=""
          {...register("email", {
            required: true,
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Needs to be a valid email",
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
      <div className="formInput">
        <input
          className="peer"
          type="password"
          placeholder=""
          {...register("confirmPassword", {
            required: true,
            validate: {
              sameAsPassword: (current) => current === password,
            },
          })}
          aria-invalid={errors.confirmPassword ? "true" : "false"}
        />
        <label className="inputLabel" htmlFor="">
          Confirm Password
        </label>
        <AiOutlineUnlock className="absolute top-4 right-4" />
      </div>
      {errors.confirmPassword?.type === "required" && (
        <p className=" text-red-500" role="alert">
          Password is required
        </p>
      )}
      {errors.confirmPassword?.type === "sameAsPassword" && (
        <p className=" text-red-500" role="alert">
          Passwords must match
        </p>
      )}
      <button
        className="w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors duration-300 py-2"
        type="submit"
      >
        Register
      </button>
      <div>
        <span className="mt-4 flex justify-center gap-2">
          Already registered?
          <Link className="text-blue-500" to="/login">
            Log In
          </Link>
        </span>
      </div>
    </form>
  );
};

export default RegisterForm;
