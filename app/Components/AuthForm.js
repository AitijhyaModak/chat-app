"use client";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import LoadingComponent from "./LoadingComponent";

export default function AuthForm() {
  const [variant, setVariant] = useState("LOGIN");
  const { register, handleSubmit, reset } = useForm();
  const [fetching, setFetching] = useState(false);
  const router = useRouter();
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status === "authenticated") router.push("/home");
  }, [session?.status]);

  return (
    <form className="p-6 bg-[#1e293b] rounded-lg flex flex-col gap-5">
      {variant === "REGISTER" ? (
        <Input
          inputName="Username"
          type="text"
          register={register}
          fetching={fetching}
        ></Input>
      ) : null}

      <Input
        inputName="Email"
        type="text"
        register={register}
        fetching={fetching}
      ></Input>
      <Input
        inputName="Password"
        type="password"
        register={register}
        fetching={fetching}
      ></Input>

      {variant === "REGISTER" ? (
        <Input
          inputName="ConfirmPassword"
          type="password"
          register={register}
          fetching={fetching}
        ></Input>
      ) : null}

      <SubmitButton
        reset={reset}
        variant={variant}
        handleSubmit={handleSubmit}
        fetching={fetching}
        setFetching={setFetching}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
      ></SubmitButton>
      <OrContinueWith></OrContinueWith>
      <GoogleButton
        setFetching={setFetching}
        fetching={fetching}
        setIsLoading={setIsLoading}
      ></GoogleButton>
      <ToggleText variant={variant} setVariant={setVariant}></ToggleText>
      <LoadingComponent isLoading={isLoading}></LoadingComponent>
    </form>
  );
}

function Input({ type, inputName, register, fetching }) {
  return (
    <input
      type={type}
      disabled={fetching}
      className="disabled:cursor-not-allowed h-10 p-2 px-4 bg-[#2F3949] rounded-lg outline-none focus:border-2 focus:border-cyan-600 disabled:opacity-30"
      placeholder={inputName}
      {...register(inputName)}
    />
  );
}

function SubmitButton({
  variant,
  handleSubmit,
  setFetching,
  fetching,
  reset,
  setIsLoading,
}) {
  const router = useRouter();
  async function onSubmitButtonClick(formData) {
    if (variant === "REGISTER") {
      if (
        !formData.Username ||
        !formData.Password ||
        !formData.Email ||
        !formData.ConfirmPassword
      ) {
        toast.error("Input fields cannot be empty");
        return;
      }

      if (formData.Username.length < 3) {
        toast.error("Username should have atleast 3 characters");
        return;
      }

      if (formData.Password.length < 5) {
        toast.error("Password should have atleast 5 characters");
        return;
      }

      if (formData.ConfirmPassword !== formData.Password) {
        toast.error("Re-entered password does not match");
        return;
      }

      setFetching(true);
      try {
        await axios.post("/api/register", formData);
        toast.success("Account created succesfully");
        reset();
      } catch (error) {
        console.log(error.response.data);
        toast.error(error.response.data);
      }
      setFetching(false);
    } else {
      if (!formData.Email || !formData.Password) {
        toast.error("Credentials cannot be empty");
        return;
      }

      setFetching(true);
      try {
        const res = await signIn("credentials", {
          redirect: false,
          ...formData,
        });
        console.log(res);
        if (res && res.ok) {
          toast.success("Logged In");
          setIsLoading(true);
          router.push("/home");
        } else toast.error("Invalid Credentials");
      } catch (error) {
        console.log("SIGN IN ERROR");
      }
      setFetching(false);
    }
  }

  return (
    <button
      disabled={fetching}
      onClick={handleSubmit(onSubmitButtonClick)}
      className="disabled:cursor-not-allowed disabled:opacity-30 border-2 border-cyan-600 h-10 rounded-lg mt-2  active:bg-green-400"
    >
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

function GoogleButton({ fetching, setFetching, setIsLoading }) {
  async function googleSignIn(e) {
    e.preventDefault();
    setFetching(true);
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/home", redirect: true });
    setFetching(false);
  }

  return (
    <button
      onClick={googleSignIn}
      disabled={fetching}
      className="disabled:opacity-35 disabled:cursor-not-allowed border-2 border-cyan-600 h-10 rounded-lg active:bg-green-400 flex justify-center items-center gap-5"
    >
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
