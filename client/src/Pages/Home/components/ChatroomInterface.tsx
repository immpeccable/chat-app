import React, { useEffect, useRef, useState } from "react";
import tmpImg from "../../../assets/react.svg";
import { I_CHATROOM, I_MESSAGE } from "../../../types";
import { Socket } from "socket.io-client";
import { useQuery } from "@tanstack/react-query";
import { findChatroomById } from "../api";

interface I_PROPS {
  id: string;
  socket: Socket;
}

export const ChatroomInterface = ({ id, socket }: I_PROPS) => {
  const messageRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<I_MESSAGE[]>([]);
  const [chatroom, setChatroom] = useState<I_CHATROOM>();

  const { refetch, isLoading } = useQuery({
    queryFn: () => findChatroomById(id),
    queryKey: ["findChatroomById"],
    onSuccess: (res: I_CHATROOM) => {
      setChatroom(res);
    },
  });

  useEffect(() => {
    refetch();
  }, [id]);

  useEffect(() => {
    if (chatroom) {
      setMessages(chatroom.messages);
    }
  }, [chatroom]);

  useEffect(() => {
    socket.on(
      "messageReceived",
      (username: string, content: string, chatroomID: string) => {
        console.log("message received: ", username, content, chatroomID);
        console.log("this chatrooms info is: ", chatroom);
        if (chatroomID == id) {
          console.log("hello world we are on the same page");
          const message: I_MESSAGE = { from: username, content: content };
          setMessages([...messages, message]);
        }
      }
    );
  }, [socket, messages, id, chatroom]);

  function sendMessage() {
    if (!messageRef.current?.value) return;
    socket.emit("messageSent", messageRef.current?.value, id);
  }

  return (
    <section className="w-full flex flex-col">
      <header className="flex flex-row gap-4 items-center bg-lightGreen p-4 w-full ">
        <img src={tmpImg} alt="chatroom-image" />
        <h3> {chatroom?.name} </h3>
      </header>

      <ul className="grow bg-black h-[90vh] overflow-scroll">
        {messages.map((message) => (
          <li>
            {message.from}
            {message.content}
          </li>
        ))}
      </ul>
      <div className="bg-lightGreen py-2   flex flex-row items-center gap-4 px-6">
        <img src={tmpImg} alt="first" className="w-6 h-6" />
        <img src={tmpImg} alt="second" className="w-6 h-6" />
        <input
          placeholder="Bir mesaj yazın"
          type="text"
          id="message-content"
          className=" py-2 px-4 bg-lighterGreen grow rounded-lg outline-none text-sm"
          ref={messageRef}
        />
        <img
          onClick={sendMessage}
          src={tmpImg}
          alt="third"
          className="w-6 h-6"
        />
        <img src={tmpImg} alt="last" className="w-6 h-6" />
      </div>
    </section>
  );
};
