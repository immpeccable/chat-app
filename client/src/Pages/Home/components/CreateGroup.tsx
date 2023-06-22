import React, { ReactNode, useEffect, useRef, useState } from "react";
import tmpImg from "../../../assets/react.svg";
import { useDebounceValue } from "../hooks/useDebounceValue";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createChatroom, fetchFriends } from "../api";
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
  const [searchParam, setSearchParam] = useState("");
  const [participants, setParticipants] = useState(new Set<I_USER>());
  const debouncedSearchParam = useDebounceValue(
    searchParam,
    DEBOUNCE_TIMEOUT_INTERVAL
  );

  const groupNameRef = useRef<HTMLInputElement>(null);

  const { refetch: refetchFriends, data: friends } = useQuery({
    queryFn: () => fetchFriends(debouncedSearchParam),
    queryKey: ["fetchFriends"],
    onError: (err) => {
      console.log("error: ", err);
    },
  });

  const { mutate: handleNewChatroom } = useMutation({
    mutationFn: () =>
      createChatroom([...participants], groupNameRef.current?.value),
    mutationKey: ["createChatroom"],
  });

  useEffect(() => {
    refetchFriends();
  }, [debouncedSearchParam]);

  return (
    <aside
      className={`flex flex-col min-h-full items-center bg-darkGreen border-r-white border-r-[1px] border-opacity-40
       transition-all absolute left-4 top-4 duration-200 overflow-hidden ease-in-out z-20 ${
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
        id="group-name"
        ref={groupNameRef}
        placeholder="Grup ismini giriniz..."
        className="bg-inherit border-b-[.5px] border-opacity-10 text-sm opacity-80 w-[85%] py-1 outline-none mt-6"
      />
      <div className="flex flex-row flex-wrap w-[85%] mt-12 mb-2 gap-4">
        {[...participants].map((participant, _) => (
          <div className="flex flex-row gap-3 items-center">
            <img src={tmpImg} alt="profile-image" className="w-4 h-4" />
            <h3 className="text-sm opacity-90">{participant.username}</h3>
            <button
              onClick={() =>
                setParticipants(
                  (prev) => new Set([...prev].filter((x) => x !== participant))
                )
              }
            >
              <img src={tmpImg} className="w-2 h-2" />
            </button>
          </div>
        ))}
      </div>
      <input
        type="text"
        name="searchname"
        className="bg-inherit border-b-[.5px] border-opacity-10 text-sm opacity-80 w-[85%] py-1 outline-none"
        placeholder="Kişi adını yazın..."
        onChange={(e) => setSearchParam(e.target.value)}
      />
      <ul className="w-full px-12 mt-8">
        {friends?.map((user: I_USER) => {
          return (
            !participants.has(user) && (
              <li
                onClick={() =>
                  setParticipants((prev) => new Set(prev.add(user)))
                }
                className="flex flex-row py-2 cursor-pointer w-full  px-1 hover:bg-white hover:bg-opacity-5 items-center border-b-[1px] border-gray-100 border-opacity-20 gap-6"
              >
                <img src={tmpImg} className="w-8 h-8 rounded-full" />
                <div className="flex flex-col">
                  <h2 className="text-md">{user.username}</h2>
                  <h3 className="text-sm opacity-70">dummy data</h3>
                </div>
              </li>
            )
          );
        })}
      </ul>
      <button
        className="absolute bottom-20 z-30"
        onClick={() => handleNewChatroom()}
      >
        <img
          className="w-4 h-4 rounded-full"
          src={tmpImg}
          alt="create-group-button"
        />
      </button>
    </aside>
  );
}
