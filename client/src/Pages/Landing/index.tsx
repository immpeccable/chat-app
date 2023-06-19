import React from "react";
import { Link } from "react-router-dom";

export const Landing: React.FC = () => {
  return (
    <div className="mt-72 flex flex-col items-center justify-center gap-8">
      <Link to="sign-up">
        <button
          type="button"
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm py-2.5 text-center w-60"
        >
          Sign up
        </button>
      </Link>

      <Link to="login">
        <button
          type="button"
          className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm py-2.5 text-center w-60"
        >
          Login
        </button>
      </Link>
    </div>
  );
};
