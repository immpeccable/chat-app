import axios, { AxiosResponse } from "axios";
import { I_USER } from "../../types";
import { ENDPOINT } from "../../constants";

export async function newUser(user: I_USER): Promise<AxiosResponse<any>> {
  console.log(user);
  const response = await axios.post(`${ENDPOINT}/new-user`, user, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}
