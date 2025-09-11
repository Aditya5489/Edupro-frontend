import { io } from "socket.io-client";

const baseURL = import.meta.env.VITE_API_URL;

let socket;

export const initSocket = async () => {
  if (socket) return socket; 

  const options = {
    reconnectionAttempts: Infinity, 
    timeout: 10000,
    transports: ["websocket"],
  };

  socket = io(baseURL, options);

  return socket;
};
