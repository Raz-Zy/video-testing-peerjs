import { auth } from "../auth";

export const headerToken = async () => {
  const session = await auth();

  // console.log("session in headerToken: ", session)

  const token = session?.accessToken;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};
