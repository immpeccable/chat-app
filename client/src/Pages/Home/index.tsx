import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import tmpImg from "../../assets/react.svg";
import CreateFriendRequest from "./components/CreateFriendRequest";
import DisplayFriendRequest from "./components/DisplayFriendRequest";
import CreateGroup from "./components/CreateGroup";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { fetchChatrooms, getLoggedUser } from "./api";
import { I_CHATROOM } from "../../types";
import { ChatroomInterface } from "./components/ChatroomInterface";
import { io, Socket } from "socket.io-client";
import { ENDPOINT } from "../../constants";

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

  const [socket, setSocket] = useState<Socket>();

  const { data: chatrooms, isLoading: isChatroomsLoading } = useQuery({
    queryFn: fetchChatrooms,
    queryKey: ["getChatrooms"],
    onError: (err: AxiosError) => {
      console.log("chatrooms: ", err.response);
    },
  });

  const [focusedChatroom, setFocusedChatroom] = useState<I_CHATROOM>();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    const newSocket = io(ENDPOINT, {
      auth: {
        token: jwt,
      },
    });

    newSocket.on(
      "messageReceived",
      (username: string, message: string, chatroomID: string) => {
        console.log(username, message, chatroomID);
      }
    );
    setSocket(newSocket);
  }, []);

  const { data: user } = useQuery({
    queryFn: getLoggedUser,
    queryKey: ["loggedUser"],
  });

  async function handleLogout() {
    localStorage.removeItem("jwt");
    navigate("/");
  }

  return (
    <main className="flex flex-row h-[calc(100vh-2rem)]">
      <aside className="w-[30%] flex flex-col items-center border-r-white border-r-[1px] border-opacity-40">
        <header className="flex flex-row justify-between items-center bg-lightGreen p-4 w-full">
          <img
            src={tmpImg}
            alt="profile-photo"
            className="w-8 h-8 rounded-full"
          />
          <h2> {user?.username} </h2>
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
            <li
              onClick={() => {
                console.log("room: ", room);
                setFocusedChatroom(room);
              }}
              className="flex flex-row cursor-pointer hover:bg-white hover:bg-opacity-5 py-2 items-center border-b-[1px] border-gray-100 border-opacity-20 gap-6 w-full"
            >
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

        <button
          className="mt-auto bg-lightGreen w-full py-2 mr-4 rounded-lg hover:bg-white hover:bg-opacity-[.15]"
          onClick={handleLogout}
        >
          Logout
        </button>
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
      {focusedChatroom && socket && (
        <ChatroomInterface id={focusedChatroom._id} socket={socket} />
      )}
    </main>
  );
};
