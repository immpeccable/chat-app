import React, { ReactNode, useEffect, useRef, useState } from "react";
import tmpImg from "../../../assets/react.svg";
import { useDebounceValue } from "../hooks/useDebounceValue";
import { useQuery } from "@tanstack/react-query";
import { fetchFriends } from "../api";
import { I_USER } from "../../../types";

interface I_PROPS {
  isCreateGroupSectionOpen: boolean;
  setIsCreateGroupSectionOpen: (value: boolean) => void;
}

const DEBOUNCE_TIMEOUT_INTERVAL = 500;

export default function CreateGroup({
  isCreateGroupSectionOpen,
  setIsCreateGroupSectionOpen,
}: I_PROPS): ReactNode {
  const [searchParam, setSearhParam] = useState("");

  const debouncedSearchParam = useDebounceValue(
    searchParam,
    DEBOUNCE_TIMEOUT_INTERVAL
  );

  const { refetch: refetchFriends, data: friends } = useQuery({
    queryFn: () => fetchFriends(debouncedSearchParam),
    queryKey: ["fetchFriends"],
    onSuccess: (res) => {
      console.log("friends: ", res);
    },
    onError: (err) => {
      console.log("error: ", err);
    },
  });

  useEffect(() => {
    refetchFriends();
  }, [debouncedSearchParam]);

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
        className="bg-inherit mt-8 border-b-[.5px] border-opacity-10 text-sm opacity-80 w-[85%] py-1 outline-none"
        placeholder="Kişi adını yazın..."
        onChange={(e) => setSearhParam(e.target.value)}
      />
      <ul className="w-full px-12 mt-8">
        {friends?.map((user: I_USER) => {
          return (
            <li className="flex flex-row py-2 items-center border-b-[1px] border-gray-100 border-opacity-20 gap-6 w-full">
              <img src={tmpImg} className="w-8 h-8 rounded-full" />
              <div className="flex flex-col">
                <h2 className="text-md">{user.username}</h2>
                <h3 className="text-sm opacity-70">dummy data</h3>
              </div>
              <button className="ml-auto">
                <img src={tmpImg} className="w-6 h-6" />
              </button>
            </li>
          );
        })}
      </ul>
      {/* you are supposed to render friends here */}
    </aside>
  );
}
