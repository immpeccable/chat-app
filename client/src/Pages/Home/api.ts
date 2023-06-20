import axios from "axios";
import { ENDPOINT } from "../../constants";

export async function findByUsername(jwt: string | null, username: string) {
  if (!username) {
    return null;
  }
  console.log(jwt, username);
  const result = await axios.get(`${ENDPOINT}/find-people`, {
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
