import React from "react";
import tmpImg from "../../../assets/react.svg";
import { I_CHATROOM } from "../../../types";

export const ChatroomInterface: React.FC<I_CHATROOM> = ({
  name,
  participants,
  authorized_participants,
  owner,
  messages,
}) => {
  return (
    <section className="w-full flex flex-col">
      <header className="flex flex-row gap-4 items-center bg-lightGreen p-4 w-full ">
        <img src={tmpImg} alt="chatroom-image" />
        <h3> {name} </h3>
      </header>
      <div className="grow">hell0</div>
      {/* here you should render message */}
      <div className="bg-lightGreen py-2   flex flex-row items-center gap-4 px-6">
        <img src={tmpImg} alt="first" className="w-6 h-6" />
        <img src={tmpImg} alt="second" className="w-6 h-6" />
        <input
          placeholder="Bir mesaj yazın"
          type="text"
          id="message-content"
          className=" py-2 px-4 bg-lighterGreen grow rounded-lg outline-none text-sm"
        />
        <img src={tmpImg} alt="third" className="w-6 h-6" />
        <img src={tmpImg} alt="last" className="w-6 h-6" />
      </div>
    </section>
  );
};
