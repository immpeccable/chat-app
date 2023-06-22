import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from "./Pages/Landing";
import { Signup } from "./Pages/Signup";
import { Login } from "./Pages/Login";
import { Home } from "./Pages/Home";

export const App: React.FC = () => {
  return (
    <div className="bg-[rgb(19,27,32)] p-4">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
