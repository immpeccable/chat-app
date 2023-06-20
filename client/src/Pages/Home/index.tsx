import React, { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import tmpImg from "../../assets/react.svg";
import CreateFriendRequest from "./components/CreateFriendRequest";
import DisplayFriendRequest from "./components/DisplayFriendRequest";
import CreateGroup from "./components/CreateGroup";
import { useNavigate } from "react-router-dom";

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
      <section className="ml-20">
        <button onClick={handleLogout}>LOGOUT</button>
      </section>
    </main>
  );
};
