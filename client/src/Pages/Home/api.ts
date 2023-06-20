import axios from "axios";
import { ENDPOINT } from "../../constants";

export async function mockRequest(jwt: string | null) {
  const result = await axios.get(`${ENDPOINT}/home`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  console.log(result);
  return result;
}
