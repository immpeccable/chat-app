import React, { ReactNode, useRef, useState } from "react";
import tmpImg from "../../../assets/react.svg";
import { I_FRIEND_REQUEST, I_USER } from "../../../types";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  acceptFriendRequest,
  displayFriendRequest,
  rejectFriendRequest,
} from "../api";
import { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

interface I_PROPS {
  isDisplayFriendRequestSectionOpen: boolean;
  setIsDisplayFriendRequestSectionOpen: (value: boolean) => void;
}

export default function DisplayFriendRequest({
  isDisplayFriendRequestSectionOpen,
  setIsDisplayFriendRequestSectionOpen,
}: I_PROPS): ReactNode {
  const [friendRequests, setFriendRequests] = useState<I_FRIEND_REQUEST[]>([]);
  const navigate = useNavigate();

  const { isLoading: displayLoading, refetch: refetchFriendRequests } =
    useQuery({
      queryFn: () => displayFriendRequest(),
      queryKey: ["displayFriendRequest"],
      onSuccess: (result) => {
        setFriendRequests(result?.data.requests);
      },
      onError: (err: AxiosError) => {
        if (err.response?.status == 401) {
          navigate("/");
          localStorage.removeItem("jwt");
        }
      },
    });

  const { isLoading: acceptLoading, mutate: acceptMutate } = useMutation({
    mutationFn: (request: I_FRIEND_REQUEST) => acceptFriendRequest(request),
    mutationKey: ["acceptFriendRequest"],
    onSuccess: (res: AxiosResponse) => {
      console.log("success: ", res);
      refetchFriendRequests();
    },
    onError: (err: AxiosError) => {
      console.log("error: ", err.response?.status);
    },
  });

  const { isLoading: rejectLoading, mutate: rejectMutate } = useMutation({
    mutationFn: (request: I_FRIEND_REQUEST) => rejectFriendRequest(request),
    mutationKey: ["rejectFriendRequest"],
    onSuccess: (res: AxiosResponse) => {
      console.log("success: ", res);
      refetchFriendRequests();
    },
    onError: (err: AxiosError) => {
      console.log("error: ", err.response?.status);
    },
  });

  return (
    <aside
      className={`flex flex-col h-full items-center bg-darkGreen border-r-white border-r-[1px] border-opacity-40
       transition-all absolute left-4 top-4 duration-200 overflow-hidden ease-in-out z-20 ${
         isDisplayFriendRequestSectionOpen
           ? "w-[calc(25%-2rem)] visible"
           : "w-0 invisible"
       }`}
    >
      <header
        className={`flex flex-col justify-end w-full h-28 pb-4 px-4 transition-all duration-200 ease-in-out bg-lightGreen`}
      >
        <div className="flex flex-row items-center gap-4">
          <button
            onClick={() => setIsDisplayFriendRequestSectionOpen(false)}
            className="w-4 h-4"
          >
            <img src={tmpImg} alt="back-button" />
          </button>
          <h3 className="opacity-90 text-md font-semibold ml-12">
            Arkadaşlık İstekleri
          </h3>
        </div>
      </header>
      <ul className="w-full px-12 mt-8">
        {friendRequests.map((request: I_FRIEND_REQUEST) => {
          return (
            <li className="flex flex-row py-2 items-center border-b-[1px] border-gray-100 border-opacity-20 gap-6 w-full">
              <img src={tmpImg} className="w-8 h-8 rounded-full" />
              <div className="flex flex-col">
                <h2 className="text-md">{request.from}</h2>
                <h3 className="text-sm opacity-70">dummy data</h3>
              </div>
              <div className="flex flex-col gap-2">
                <button className="ml-auto">
                  <img
                    onClick={() => acceptMutate(request)}
                    src={tmpImg}
                    className="w-6 h-6"
                  />
                </button>
                <button
                  onClick={() => rejectMutate(request)}
                  className="ml-auto"
                >
                  <img src={tmpImg} className="w-6 h-6" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
