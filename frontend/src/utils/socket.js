import { io } from "socket.io-client";
import { APP_URL } from "../config";

const socket = io(APP_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
});

const connectSocket = (userId) => {
  if (!userId) {
    return;
  }

  socket.auth = { userId };
  if (!socket.connected) {
    socket.connect();
  }
};

const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
export { connectSocket, disconnectSocket };