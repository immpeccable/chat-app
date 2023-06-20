import React, { ReactNode, useEffect, useRef, useState } from "react";
import tmpImg from "../../../assets/react.svg";
import { useDebounceValue } from "../hooks/useDebounceValue";
import { useQuery } from "@tanstack/react-query";
import { findByUsername } from "../api";
import { I_USER } from "../../Signup/types";

interface I_PROPS {
  isCreateFriendRequestSectionOpen: boolean;
  setIsCreateFriendRequestSectionOpen: (value: boolean) => void;
}

const DEBOUNCE_TIMEOUT = 500;

export default function CreateFriendRequest({
  isCreateFriendRequestSectionOpen,
  setIsCreateFriendRequestSectionOpen,
}: I_PROPS): ReactNode {
  const [searchParam, setSearchParam] = useState("");
  const debouncedSearchParam = useDebounceValue(searchParam, DEBOUNCE_TIMEOUT);
  const jwt = localStorage.getItem("jwt");

  const { isLoading, data, refetch } = useQuery({
    queryFn: () => findByUsername(jwt, debouncedSearchParam),
    queryKey: ["findByUsername"],
  });

  useEffect(() => {
    refetch();
  }, [debouncedSearchParam]);

  return (
    <aside
      className={`flex flex-col items-center bg-darkGreen border-r-white border-r-[1px] border-opacity-40 transition-all absolute left-4 top-4 duration-200 overflow-hidden ease-in-out z-20 ${
        isCreateFriendRequestSectionOpen
          ? "w-[calc(30%-.5rem)] visible"
          : "w-0 invisible"
      }`}
    >
      <header
        className={`flex flex-col justify-end w-full h-28 pb-4 px-4 transition-all duration-200 ease-in-out bg-lightGreen`}
      >
        <div className="flex flex-row items-center gap-4">
          <button
            onClick={() => setIsCreateFriendRequestSectionOpen(false)}
            className="w-4 h-4"
          >
            <img src={tmpImg} alt="back-button" />
          </button>
          <h3 className="opacity-90 text-md font-semibold ml-12">
            Arkadaş Ekle
          </h3>
        </div>
      </header>
      <input
        type="text"
        name="searchname"
        className="bg-inherit mt-8 border-b-[.5px] border-opacity-10 text-sm opacity-80 w-[85%] py-1 outline-none"
        placeholder="Kişi adını yazın..."
        onChange={(e) => {
          setSearchParam(e.target.value);
        }}
      />
      <ul>
        {data?.users?.map((user: I_USER) => {
          return <li>{user.username}</li>;
        })}
      </ul>
      {/* you are supposed to render friends here */}
    </aside>
  );
}
