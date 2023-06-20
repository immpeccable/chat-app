import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { mockRequest } from "./api";

export const Home: React.FC = () => {
  const JWT = localStorage.getItem("jwt");

  const { refetch, isLoading } = useQuery({
    queryFn: () => mockRequest(JWT),
    queryKey: ["mock"],
  });

  return (
    <button className="absolute left-1/2 top-1/2 " onClick={() => refetch()}>
      make request
    </button>
  );
};
