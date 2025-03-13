import { io } from "socket.io-client";

let socket;
export const getSocket = () => {
  if (!socket) {
    socket = io("https://172.17.13.106:3000"); // Replace with your socket server URL
    console.log("Socket initialized");
  }
  return socket;
};
