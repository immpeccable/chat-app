import React, { ReactNode, useRef } from "react";
import tmpImg from "../../../assets/react.svg";

interface I_PROPS {
  isDisplayFriendRequestSectionOpen: boolean;
  setIsDisplayFriendRequestSectionOpen: (value: boolean) => void;
}

export default function DisplayFriendRequest({
  isDisplayFriendRequestSectionOpen,
  setIsDisplayFriendRequestSectionOpen,
}: I_PROPS): ReactNode {
  return (
    <aside
      className={`flex flex-col items-center bg-darkGreen border-r-white border-r-[1px] border-opacity-40 transition-all absolute left-4 top-4 duration-200 overflow-hidden ease-in-out z-20 ${
        isDisplayFriendRequestSectionOpen
          ? "w-[calc(30%-.5rem)] visible"
          : "w-0 invisible"
      }`}
    >
      <header
        className={`flex flex-col justify-end w-full h-28 pb-4 px-4 transition-all duration-200 ease-in-out bg-lightGreen`}
      >
        <div className="flex flex-row items-center gap-4">
          <button
            onClick={() => setIsDisplayFriendRequestSectionOpen(false)}
            className="w-4 h-4"
          >
            <img src={tmpImg} alt="back-button" />
          </button>
          <h3 className="opacity-90 text-md font-semibold ml-12">
            Arkadaşlık İstekleri
          </h3>
        </div>
      </header>

      {/* you are supposed to render friends here */}
    </aside>
  );
}
