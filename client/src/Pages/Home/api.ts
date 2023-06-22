import axios, { AxiosResponse } from "axios";
import { ENDPOINT } from "../../constants";
import { I_FRIEND_REQUEST, I_USER } from "../../types";

export async function findByUsername(username: string) {
  const jwt = localStorage.getItem("jwt");
  if (!username) return null;
  const result = await axios.get(`${ENDPOINT}/find-possible-friends`, {
    params: {
      username: username,
    },
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return result.data;
}

export async function sendFriendRequest(to: I_USER) {
  const jwt = localStorage.getItem("jwt");

  const result = await axios.post(
    `${ENDPOINT}/new-friend-request`,
    {
      to: to,
    },
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  console.log("send friend request: ", result);
  return result;
}

export async function displayFriendRequest() {
  const jwt = localStorage.getItem("jwt");

  const result = await axios.get(`${ENDPOINT}/display-friend-requests`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return result;
}

export async function acceptFriendRequest(request: I_FRIEND_REQUEST) {
  const jwt = localStorage.getItem("jwt");
  const result = await axios.post(
    `${ENDPOINT}/accept-friend-request`,
    {
      request: request,
    },
    { headers: { Authorization: `Bearer ${jwt}` } }
  );
  console.log("accept friend request: ", result);
  return result;
}
export async function rejectFriendRequest(request: I_FRIEND_REQUEST) {
  const jwt = localStorage.getItem("jwt");

  const result = await axios.post(
    `${ENDPOINT}/reject-friend-request`,
    {
      request: request,
    },
    { headers: { Authorization: `Bearer ${jwt}` } }
  );
  console.log("rejct friend request: ", result);
  return result;
}

export async function fetchFriends(searchUsername: string): Promise<I_USER[]> {
  const jwt = localStorage.getItem("jwt");

  const result = await axios.get(`${ENDPOINT}/friends`, {
    params: {
      searchUsername: searchUsername,
    },
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return result.data.friends;
}

export async function createChatroom(
  participants: I_USER[],
  groupName: string | undefined
) {
  const jwt = localStorage.getItem("jwt");
  if (!groupName || !participants || !jwt) return;
  console.log("createChatroom1");
  const response = await axios.post(
    `${ENDPOINT}/new-chatroom`,
    {
      participants: participants,
      groupName: groupName,
    },
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  console.log("chatroom created: ", response);
  return response;
}

export async function fetchChatrooms() {
  const jwt = localStorage.getItem("jwt");
  const response = await axios.get(`${ENDPOINT}/chatrooms-for-user`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response.data.chatrooms;
}

export async function findChatroomById(chatroom_id: string) {
  const jwt = localStorage.getItem("jwt");
  console.log(chatroom_id);
  const response = await axios.get(`${ENDPOINT}/chatroom-by-id`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    params: {
      chatroom_id: chatroom_id,
    },
  });
  console.log("response: ", response);
  return response.data.chatroom;
}

export async function getLoggedUser(): Promise<I_USER> {
  const jwt = localStorage.getItem("jwt");
  const response = await axios.get(`${ENDPOINT}/logged-user`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response.data.user;
}
