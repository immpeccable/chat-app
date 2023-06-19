import React from "react";

export const Header: React.FC = () => {
  return (
    <div className="px-12 py-4 bg-indigo-900 text-white flex flex-row justify-between">
      <h1>Chat App</h1>
      <ul className="flex flex-row gap-6 items-center justify-center">
        <li>Tab 1</li>
        <li>Tab 2</li>
        <li>Tab 3</li>
      </ul>
    </div>
  );
};
