import React, { useReducer } from "react";
import { I_ACTION, I_USER, ACTION_TYPES } from "./types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { newUser } from "./api";

function reducer(state: I_USER, action: I_ACTION): I_USER {
  console.log(state);
  switch (action.type) {
    case ACTION_TYPES.changeUsername: {
      return { ...state, username: action.value };
    }
    case ACTION_TYPES.changeEmail: {
      return { ...state, email: action.value };
    }
    case ACTION_TYPES.changePassword: {
      return { ...state, password: action.value };
    }
    default: {
      throw new Error("Unknown action type");
    }
  }
}

export const Signup: React.FC = () => {
  const [userState, userDispatch] = useReducer(reducer, {
    username: "",
    email: "",
    password: "",
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: () => newUser(userState),
    mutationKey: ["new-user"],
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  console.log(isLoading);

  return (
    <div className="flex flex-col items-center">
      <form className="flex flex-col gap-4 items-center justify-center mt-36">
        <div className="flex flex-col gap-[2px]">
          <label className="text-sm" htmlFor="username">
            Username
          </label>
          <input
            className="py-4 px-[.75rem] bg-inherit text-white border-[1px] border-opacity-50 border-white rounded-sm text-sm placeholder-opacity-30 w-60"
            name="username"
            type="text"
            placeholder="Enter your username"
            onChange={(e) => {
              userDispatch({
                type: ACTION_TYPES.changeUsername,
                value: e.target.value,
              });
            }}
          />
        </div>
        <div className="flex flex-col gap-[2px]">
          <label className="text-sm" htmlFor="email">
            Email
          </label>
          <input
            className="py-4 px-[.75rem] bg-inherit text-white border-[1px] border-opacity-50 border-white rounded-sm text-sm placeholder-opacity-30 w-60"
            name="email"
            type="email"
            placeholder="Enter your email"
            onChange={(e) => {
              userDispatch({
                type: ACTION_TYPES.changeEmail,
                value: e.target.value,
              });
            }}
          />
        </div>
        <div className="flex flex-col gap-[2px]">
          <label className="text-sm" htmlFor="password">
            Password
          </label>
          <input
            className="py-4 px-[.75rem] bg-inherit text-white border-[1px] border-opacity-50 border-white rounded-sm text-sm placeholder-opacity-30 w-60"
            name="password"
            type="password"
            placeholder="Enter your password"
            onChange={(e) => {
              userDispatch({
                type: ACTION_TYPES.changePassword,
                value: e.target.value,
              });
            }}
          />
        </div>
        <input
          value="Sign Up"
          type="submit"
          className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200
           focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm py-2.5 text-center w-60 mt-4 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            mutate();
          }}
        />
      </form>
    </div>
  );
};
