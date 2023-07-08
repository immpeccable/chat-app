import { useEffect, useRef, useState } from "react";
import tmpImg from "../../../assets/react.svg";
import { I_CHATROOM, I_MESSAGE, I_USER } from "../../../types";
import { Socket } from "socket.io-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { findChatroomById, getLoggedUser, updateChatroomState } from "../api";
import { sendIcon } from "../../../assets";

interface I_PROPS {
  id: string;
  socket: Socket;
  refetchUser: () => unknown;
}

export const ChatroomInterface = ({ id, socket, refetchUser }: I_PROPS) => {
  const messageRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<I_MESSAGE[]>([]);
  const [chatroom, setChatroom] = useState<I_CHATROOM>();

  const { data: user } = useQuery({
    queryFn: getLoggedUser,
    queryKey: ["loggedUser"],
  });

  useQuery({
    queryFn: () => findChatroomById(id),
    queryKey: ["findChatroomById"],
    onSuccess: (res: I_CHATROOM) => {
      setChatroom(res);
      setMessages(res.messages);
    },
  });

  useEffect(() => {
    const messageInputElement: HTMLElement | null =
      document.getElementById("message-content");

    if (messageInputElement) {
      messageInputElement.onkeydown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          sendMessage(e);
        }
      };
    }
  }, []);

  const { mutate: updateChatroom } = useMutation({
    mutationKey: ["update-chatroom-state"],
    mutationFn: () =>
      updateChatroomState(
        id,
        messages.length,
        messages[messages.length - 1].content,
        messages[messages.length - 1].from_username
      ),
    onSuccess: () => {
      refetchUser();
    },
  });
  console.log("component is rendered");
  useEffect(() => {
    if (messages.length > 0) {
      console.log();
      console.log("is chatroom updated");
      updateChatroom();
    }
  }, [messages, updateChatroom]);

  useEffect(() => {
    socket.on(
      "messageReceived",
      (
        username: string,
        content: string,
        profile_image_url: string,
        chatroomID: string
      ) => {
        if (chatroomID == id) {
          const message: I_MESSAGE = {
            from_username: username,
            content: content,
            from_profile_image_url: profile_image_url,
          };
          setMessages([...messages, message]);
        }
      }
    );
  }, [socket, messages, id, chatroom]);

  const sendMessage = (e: any) => {
    if (!messageRef.current?.value) return;
    if (e instanceof KeyboardEvent) {
      e.preventDefault();
    }

    socket.emit("messageSent", messageRef.current?.value, id);
    messageRef.current.value = "";
  };

  let futureRenderedUsername = "";

  return (
    <section className="flex flex-col grow">
      <header className="flex flex-row gap-4 items-center bg-lightGreen p-4 w-full ">
        <img src={tmpImg} alt="chatroom-image" />
        <h3> {chatroom?.name} </h3>
      </header>

      <ul
        id="message-list"
        className="grow bg-black h-[80vh] flex flex-col-reverse px-12 py-4 gap-4 overflow-scroll"
      >
        {messages
          .slice()
          .reverse()
          .map((message: I_MESSAGE, i) => {
            if (i < messages.length - 1) {
              futureRenderedUsername =
                messages[messages.length - i - 2].from_username;
            } else {
              futureRenderedUsername = "";
            }
            let createdAt: Date = new Date(Date.now());
            if (message.createdAt) {
              createdAt = new Date(message.createdAt); // Assuming you have a valid date object in `createdAt`
            }
            const hourMinute = createdAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return message.from_username == user?.username ? (
              <li className="flex flex-row gap-3 bg-midGreen ml-auto py-1 pl-4 pr-16 text-sm rounded-lg relative">
                <h3 className="text-sm"> {message.content}</h3>
                <h4 className="text-[0.6rem] mt-auto absolute bottom-[1px] right-[6px]">
                  {hourMinute}
                </h4>
              </li>
            ) : (
              <li className="flex flex-row gap-3">
                <img
                  src={message.from_profile_image_url || tmpImg}
                  alt="profile-image"
                  className={`w-8 h-8 rounded-full ${
                    futureRenderedUsername != message.from_username
                      ? "visible"
                      : "invisible"
                  }`}
                />
                <div className="flex flex-row bg-lightGreen rounded-lg px-2 py-1 relative gap-4">
                  <div className="flex flex-col">
                    {futureRenderedUsername != message.from_username && (
                      <h2 className="text-red-600 text-sm">
                        {message.from_username}
                      </h2>
                    )}

                    <h3 className="text-sm"> {message.content}</h3>
                  </div>

                  <h4 className="text-[0.6rem] mt-auto">{hourMinute}</h4>
                </div>
              </li>
            );
          })}
      </ul>
      <form className="bg-lightGreen py-2   flex flex-row items-center gap-4 px-6">
        <img src={tmpImg} alt="first" className="w-6 h-6" />
        <img src={tmpImg} alt="second" className="w-6 h-6" />
        <input
          placeholder="Bir mesaj yazın"
          type="text"
          id="message-content"
          className=" py-2 px-4 bg-lighterGreen grow rounded-lg outline-none text-sm"
          ref={messageRef}
        />

        <button onClick={sendMessage}>
          <img src={sendIcon} className="w-6 h-6" />
        </button>
        <img src={tmpImg} alt="last" className="w-6 h-6" />
      </form>
    </section>
  );
};
