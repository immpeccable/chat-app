import { useMutation } from "@tanstack/react-query";
import React, { useRef } from "react";
import { handleLogin } from "./api";
import { useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: () =>
      handleLogin(
        usernameRef.current?.value || "",
        passwordRef.current?.value || ""
      ),

    mutationKey: ["login"],
    onSuccess: (res) => {
      localStorage.setItem("jwt", res.data.jwt);
      navigate("/home");
    },
    onError: (err) => console.log(err),
  });

  const passwordRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  console.log(isLoading);

  return (
    <form className="flex flex-col items-center justify-center mt-40 gap-4">
      <div className="flex flex-col gap-[2px]">
        <label className="text-sm" htmlFor="username">
          Username
        </label>
        <input
          className="py-4 px-[.75rem] bg-inherit text-white border-[1px] border-opacity-50
           border-white rounded-sm text-sm placeholder-opacity-30 w-60"
          type="text"
          name="username"
          placeholder="Enter your username"
          ref={usernameRef}
        />
      </div>
      <div className="flex flex-col gap-[2px]">
        <label className="text-sm" htmlFor="password">
          Password
        </label>
        <input
          className="py-4 px-[.75rem] bg-inherit text-white border-[1px] border-opacity-50
           border-white rounded-sm text-sm placeholder-opacity-30 w-60"
          type="password"
          name="password"
          placeholder="Enter your password"
          ref={passwordRef}
        />
      </div>

      <input
        type="submit"
        className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none
         focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm py-2.5 text-center w-60 mt-4"
        value="Login"
        onClick={(e) => {
          e.preventDefault();
          mutate();
        }}
      />
    </form>
  );
};
