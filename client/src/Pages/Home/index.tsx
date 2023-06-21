import React, { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import tmpImg from "../../assets/react.svg";
import CreateFriendRequest from "./components/CreateFriendRequest";
import DisplayFriendRequest from "./components/DisplayFriendRequest";
import CreateGroup from "./components/CreateGroup";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { fetchChatrooms } from "./api";
import { I_CHATROOM } from "../../types";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isCreateGroupSectionOpen, setIsCreateGroupSectionOpen] =
    useState(false);
  const [
    isCreateFriendRequestSectionOpen,
    setIsCreateFriendRequestSectionOpen,
  ] = useState(false);

  const [
    isDisplayFriendRequestSectionOpen,
    setIsDisplayFriendRequestSectionOpen,
  ] = useState(false);

  const { data: chatrooms, isLoading: isChatroomsLoading } = useQuery({
    queryFn: fetchChatrooms,
    queryKey: ["getChatrooms"],
    onSuccess: (res) => {
      // console.log("chatrooms: ", res);
    },
    onError: (err: AxiosError) => {
      console.log("chatrooms: ", err.response);
    },
  });
  // console.log(isChatroomsLoading);

  async function handleLogout() {
    localStorage.removeItem("jwt");
    navigate("/");
  }

  //   const { refetch, isLoading } = useQuery({
  //     queryFn: () => mockRequest(JWT),
  //     queryKey: ["mock"],
  //   });

  return (
    <main className="flex flex-row">
      <aside className="w-[30%] flex flex-col items-center border-r-white border-r-[1px] border-opacity-40">
        <header className="flex flex-row justify-between items-center bg-lightGreen p-4 w-full">
          <img
            src={tmpImg}
            alt="profile-photo"
            className="w-8 h-8 rounded-full"
          />
          <ul className="flex flex-row gap-2 items-center">
            <li
              onClick={() => setIsDisplayFriendRequestSectionOpen(true)}
              className=""
            >
              <img src={tmpImg} alt="icon" className="w-4 h-4" />
            </li>
            <li onClick={() => setIsCreateFriendRequestSectionOpen(true)}>
              <img src={tmpImg} alt="icon" className="w-4 h-4" />
            </li>
            <li onClick={() => setIsCreateGroupSectionOpen(true)}>
              <img src={tmpImg} alt="icon" className="w-4 h-4" />
            </li>
          </ul>
        </header>
        <div className="flex flex-row text-white bg-lightGreen text-sm items-center rounded-md mt-2 w-[90%] gap-6">
          <img src={tmpImg} alt="search-icon" className="w-4 h-4 ml-4" />
          <input
            className="text-white placeholder-opacity-50 bg-inherit py-2 w-full outline-none"
            type="text"
            placeholder="Arayın veya yeni sohbet başlatın"
          />
        </div>
        <ul className="mt-10 w-full px-4">
          {chatrooms?.map((room: I_CHATROOM) => (
            <li className="flex flex-row cursor-pointer hover:bg-white hover:bg-opacity-5 py-2 items-center border-b-[1px] border-gray-100 border-opacity-20 gap-6 w-full">
              <img src={tmpImg} className="w-8 h-8 rounded-full" />
              <div className="flex flex-col">
                <h2 className="text-md">{room.name}</h2>
                <h3 className="text-sm opacity-70">dummy data</h3>
              </div>
              <div className="flex flex-col gap-2 ml-auto">
                <button className="ml-auto">
                  <img src={tmpImg} className="w-6 h-6" />
                </button>
                <button className="ml-auto">
                  <img src={tmpImg} className="w-6 h-6" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </aside>
      <CreateGroup
        isCreateGroupSectionOpen={isCreateGroupSectionOpen}
        setIsCreateGroupSectionOpen={setIsCreateGroupSectionOpen}
      />
      <CreateFriendRequest
        isCreateFriendRequestSectionOpen={isCreateFriendRequestSectionOpen}
        setIsCreateFriendRequestSectionOpen={
          setIsCreateFriendRequestSectionOpen
        }
      />
      <DisplayFriendRequest
        isDisplayFriendRequestSectionOpen={isDisplayFriendRequestSectionOpen}
        setIsDisplayFriendRequestSectionOpen={
          setIsDisplayFriendRequestSectionOpen
        }
      />
    </main>
  );
};
