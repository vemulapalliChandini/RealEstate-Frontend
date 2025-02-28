import { io } from "socket.io-client";

let socket;
export const getSocket = () => {
  if (!socket) {
    socket = io("https://your-socket-server-url"); // Replace with your socket server URL
    console.log("Socket initialized");
  }
  return socket;
};
