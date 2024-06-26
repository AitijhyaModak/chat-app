"use client";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";

export default function AuthForm() {
  const [variant, setVariant] = useState("LOGIN");

  return (
    <form className="p-6 bg-[#1e293b] rounded-lg flex flex-col gap-5">
      {variant === "REGISTER" ? (
        <Input inputName="Name" type="text"></Input>
      ) : null}

      <Input inputName="Email" type="text"></Input>
      <Input inputName="Password" type="password"></Input>

      {variant === "REGISTER" ? (
        <Input inputName="Confirm Password" type="password"></Input>
      ) : null}

      <SubmitButton variant={variant}></SubmitButton>
      <OrContinueWith></OrContinueWith>
      <GoogleButton></GoogleButton>
      <ToggleText variant={variant} setVariant={setVariant}></ToggleText>
    </form>
  );
}

function Input({ type, inputName }) {
  return (
    <input
      type={type}
      className="h-10 p-2 px-4 bg-[#2F3949] rounded-lg outline-none focus:border-2 focus:border-cyan-600"
      placeholder={inputName}
    />
  );
}

function SubmitButton({ variant }) {
  return (
    <button className="border-2 border-cyan-600 h-10 rounded-lg mt-2 hover:border-cyan-700 hover:text-cyan-600">
      {variant === "REGISTER" ? "Sign Up" : "Sign In"}
    </button>
  );
}

function OrContinueWith() {
  return (
    <div className="border-t-2 border-t-gray-600 flex justify-center mt-2">
      <span className="text-gray-500 font-bold -mt-3 bg-[#1e293b] px-2">
        Or continue with
      </span>
    </div>
  );
}

function GoogleButton() {
  return (
    <button className="border-2 border-cyan-600 h-10 rounded-lg hover:border-cyan-700 hover:text-cyan-600 flex justify-center items-center gap-5">
      <FaGoogle className="fill-cyan-500"></FaGoogle>
      <span>Google</span>
    </button>
  );
}

function ToggleText({ variant, setVariant }) {
  function ToggleVariant() {
    if (variant === "REGISTER") setVariant("LOGIN");
    else setVariant("REGISTER");
  }

  if (variant === "LOGIN") {
    return (
      <p className="text-gray-400">
        Don't have an account?{" "}
        <span
          onClick={ToggleVariant}
          className="underline text-cyan-500 cursor-pointer"
        >
          Sign Up
        </span>
      </p>
    );
  }

  return (
    <p className="text-gray-400">
      Already have an account?{" "}
      <span
        onClick={ToggleVariant}
        className="underline text-cyan-500 cursor-pointer"
      >
        Sign In
      </span>
    </p>
  );
}
