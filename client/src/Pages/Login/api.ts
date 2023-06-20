import axios from "axios";
import { ENDPOINT } from "../../constants";

export async function handleLogin(username: string, password: string) {
  const result = await axios.post(`${ENDPOINT}/login`, {
    username: username,
    password: password,
  });
  console.log(result);
  return result;
}
