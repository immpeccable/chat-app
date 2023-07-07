import React, { useReducer } from "react";
import { I_ACTION, I_USER, ACTION_TYPES } from "../../types";
import { useMutation } from "@tanstack/react-query";
import { newUser } from "./api";
import { useNavigate } from "react-router-dom";

function reducer(state: I_USER, action: I_ACTION): I_USER {
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
    case ACTION_TYPES.changeProfileImage: {
      return { ...state, profileImage: action.value };
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
    _id: "",
  });

  const navigate = useNavigate();

  console.log(userState);

  const { mutate } = useMutation({
    mutationFn: () => newUser(userState),
    mutationKey: ["new-user"],
    onSuccess: () => {
      navigate("/login");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <div className="flex flex-col items-center">
      <form
        className="flex flex-col gap-4 items-center justify-center mt-20"
        encType="multipart/form-data"
      >
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
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                aria-hidden="true"
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 ">
                {userState.profileImage
                  ? `${userState.profileImage.name} is uploaded`
                  : "Upload your profile image"}
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                userDispatch({
                  type: ACTION_TYPES.changeProfileImage,
                  value: e.target.files && e.target.files[0],
                });
              }}
            />
          </label>
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
