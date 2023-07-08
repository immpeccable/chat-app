import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import tmpImg from "../../assets/react.svg";
import CreateFriendRequest from "./components/CreateFriendRequest";
import DisplayFriendRequest from "./components/DisplayFriendRequest";
import CreateGroup from "./components/CreateGroup";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { fetchChatrooms, getLoggedUser } from "./api";
import { I_CHATROOM, I_CHATROOM_STATE } from "../../types";
import { ChatroomInterface } from "./components/ChatroomInterface";
import { io, Socket } from "socket.io-client";
import { ENDPOINT } from "../../constants";
import {
  createFriendRequestImage,
  createGroupImage,
  displayFriendRequestImage,
  searchIcon,
} from "../../assets";

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

  const [chatroomStates, setChatroomStates] = useState(
    new Map<string, I_CHATROOM_STATE>()
  );
  const [focusedChatroom, setFocusedChatroom] = useState<I_CHATROOM>();

  const [chatrooms, setChatrooms] = useState(new Map<string, I_CHATROOM>());

  const { refetch: refetchChatrooms } = useQuery({
    queryFn: fetchChatrooms,
    queryKey: ["getChatrooms"],
    onError: (err: AxiosError) => {
      console.log("chatrooms: ", err.response);
    },
    onSuccess(res) {
      if (res) {
        const map = new Map<string, I_CHATROOM>();

        res.forEach((chr: I_CHATROOM) => {
          map.set(chr._id, chr);
        });
        console.log("map: ", map);
        setChatrooms(map);
      }
    },
  });

  const { data: user, refetch: refetchUser } = useQuery({
    queryFn: getLoggedUser,
    queryKey: ["loggedUser"],
    onSuccess: (res) => {
      if (res) {
        const map = new Map<string, I_CHATROOM_STATE>();
        res.chatrooms.forEach((chr) => {
          map.set(chr.id, chr);
        });
        console.log("chatroom state map: ", chatroomStates);
        setChatroomStates(map);
      }
    },
  });

  useEffect(() => {
    refetchChatrooms();
  }, [isCreateGroupSectionOpen, refetchChatrooms]);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    const newSocket = io(ENDPOINT, {
      auth: {
        token: jwt,
      },
    });

    newSocket.on(
      "messageReceived",
      (
        username: string,
        message: string,
        profile_image_url: string,
        chatroomID: string
      ) => {
        const chatroom = chatrooms.get(chatroomID);
        if (!chatroom) return;

        chatroom?.messages.push({
          from_profile_image_url: profile_image_url,
          from_username: username,
          content: message,
        });

        setChatrooms(new Map(chatrooms.set(chatroomID, chatroom)));

        if (chatroomID == focusedChatroom?._id) {
          const chatroomState = chatroomStates.get(chatroomID);
          if (!chatroomState) return;

          chatroomState.last_message_content = message;
          chatroomState.last_message_count += 1;
          chatroomState.last_message_from = username;

          setChatroomStates(
            new Map(chatroomStates.set(chatroomID, chatroomState))
          );
        }
      }
    );
    setSocket(newSocket);
  }, []);

  async function handleLogout() {
    localStorage.removeItem("jwt");
    navigate("/");
  }

  return (
    <main className="flex flex-row h-[calc(100vh-2rem)]">
      <aside className="w-[calc(33%-1.5rem)] flex flex-col items-center border-r-white border-r-[1px] border-opacity-40">
        <header className="flex flex-row justify-between items-center bg-lightGreen p-4 w-full">
          <img
            src={user?.profileImageUrl || tmpImg}
            alt="profile-photo"
            className="w-8 h-8 rounded-full"
          />
          <h2> {user?.username} </h2>
          <ul className="flex flex-row gap-2 items-center">
            <li
              onClick={() => setIsDisplayFriendRequestSectionOpen(true)}
              className="w-4 h-4 cursor-pointer"
            >
              <img
                src={displayFriendRequestImage}
                alt="display-friends-request"
                className="h-4 w-auto cursor-pointer"
              />
            </li>
            <li onClick={() => setIsCreateFriendRequestSectionOpen(true)}>
              <img
                src={createFriendRequestImage}
                alt="create-friend-request"
                className="w-4 h-4 cursor-pointer"
              />
            </li>
            <li onClick={() => setIsCreateGroupSectionOpen(true)}>
              <img
                src={createGroupImage}
                alt="create-group"
                className="w-4 h-4 cursor-pointer"
              />
            </li>
          </ul>
        </header>
        <div className="flex flex-row text-white bg-lightGreen text-sm items-center rounded-md mt-2 w-[90%] gap-6">
          <img src={searchIcon} alt="search-icon" className="w-4 h-4 ml-4" />
          <input
            className="text-white placeholder-opacity-50 bg-inherit py-2 w-full outline-none"
            type="text"
            placeholder="Arayın veya yeni sohbet başlatın"
          />
        </div>
        <ul className="my-10 w-full px-4 overflow-y-scroll">
          {[...chatrooms]?.map(([key, value]) => {
            let notificationCount = 0;
            const chr_state = chatroomStates.get(key);
            if (chr_state) {
              notificationCount =
                value.messages.length - chr_state.last_message_count;
            }
            const lastMessage = value.messages[value.messages.length - 1];
            let lastMessageDate: Date = new Date(Date.now());
            if (lastMessage && lastMessage.createdAt) {
              lastMessageDate = new Date(lastMessage.createdAt); // Assuming you have a valid date object in `createdAt`
            }
            const hourMinute = lastMessageDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <li
                key={"left-side: " + key}
                onClick={() => {
                  setFocusedChatroom(value);
                }}
                className="flex flex-row cursor-pointer hover:bg-white hover:bg-opacity-5 py-2 items-center border-b-[1px] border-gray-100 border-opacity-20 gap-6 w-full"
              >
                <img src={tmpImg} className="w-8 h-8 rounded-full" />
                <div className="flex flex-col">
                  <h2 className="text-md">{value.name}</h2>
                  <h3 className="text-sm opacity-70">dummy data</h3>
                </div>
                <div className="flex flex-col items-end justify-center ml-auto gap-[2px]">
                  <h2
                    className={`text-[12px] ${
                      notificationCount > 0 ? "text-green-500" : "text-white"
                    }`}
                  >
                    {hourMinute}
                  </h2>
                  {notificationCount > 0 && (
                    <div className="w-5 h-5 rounded-full text-black text-[11px] bg-green-500 flex flex-row items-center justify-center">
                      {notificationCount}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <button
          className="mt-auto bg-lightGreen w-[calc(100%-1rem)] py-2 mr-4 rounded-lg hover:bg-white hover:bg-opacity-[.15]"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>
      <CreateGroup
        key="create-group"
        isCreateGroupSectionOpen={isCreateGroupSectionOpen}
        setIsCreateGroupSectionOpen={setIsCreateGroupSectionOpen}
      />
      <CreateFriendRequest
        key="create-friend-request"
        isCreateFriendRequestSectionOpen={isCreateFriendRequestSectionOpen}
        setIsCreateFriendRequestSectionOpen={
          setIsCreateFriendRequestSectionOpen
        }
      />
      <DisplayFriendRequest
        key="display-friend-request"
        isDisplayFriendRequestSectionOpen={isDisplayFriendRequestSectionOpen}
        setIsDisplayFriendRequestSectionOpen={
          setIsDisplayFriendRequestSectionOpen
        }
      />
      {focusedChatroom && socket && (
        <ChatroomInterface
          key={focusedChatroom._id}
          id={focusedChatroom._id}
          socket={socket}
          refetchUser={refetchUser}
        />
      )}
    </main>
  );
};
