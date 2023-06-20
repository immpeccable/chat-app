import axios from "axios";
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
  if (result.status == 200) {
    return result.data;
  }
  return null;
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
  console.log("friend requests: ", result);
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
