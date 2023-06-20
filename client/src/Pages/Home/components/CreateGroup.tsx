import React, { ReactNode, useRef } from "react";
import tmpImg from "../../../assets/react.svg";

interface I_PROPS {
  isCreateGroupSectionOpen: boolean;
  setIsCreateGroupSectionOpen: (value: boolean) => void;
}

export default function CreateGroup({
  isCreateGroupSectionOpen,
  setIsCreateGroupSectionOpen,
}: I_PROPS): ReactNode {
  const searchFriendsForNewChatRef = useRef<HTMLInputElement>(null);
  return (
    <aside
      className={`flex flex-col items-center bg-darkGreen border-r-white border-r-[1px] border-opacity-40 transition-all absolute left-4 top-4 duration-200 overflow-hidden ease-in-out z-20 ${
        isCreateGroupSectionOpen
          ? "w-[calc(30%-.5rem)] visible"
          : "w-0 invisible"
      }`}
    >
      <header
        className={`flex flex-col justify-end w-full h-28 pb-4 px-4 transition-all duration-200 ease-in-out bg-lightGreen`}
      >
        <div className="flex flex-row items-center gap-4">
          <button
            onClick={() => setIsCreateGroupSectionOpen(false)}
            className="w-4 h-4"
          >
            <img src={tmpImg} alt="back-button" />
          </button>
          <h3 className="opacity-90 text-md font-semibold ml-12">
            Gruba katılımcı ekle
          </h3>
        </div>
      </header>
      <input
        type="text"
        name="searchname"
        ref={searchFriendsForNewChatRef}
        className="bg-inherit mt-8 border-b-[.5px] border-opacity-10 text-sm opacity-80 w-[85%] py-1 outline-none"
        placeholder="Kişi adını yazın..."
      />

      {/* you are supposed to render friends here */}
    </aside>
  );
}
