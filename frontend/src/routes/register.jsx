import React from "react";
import RegisterForm from "../components/register-form";

export const Register = () => {
  return (
    <section>
      <div className="bg-slate-800 border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-30 relative">
        <h1 className="text-4xl text-white font-bold text-center mb-6">
          Register
        </h1>
        <RegisterForm />
      </div>
    </section>
  );
};
