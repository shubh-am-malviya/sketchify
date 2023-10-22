import { io } from "socket.io-client";
const URL =
	process.env.NODE_ENV === "production"
		? "https://sketchify-server.onrender.com"
		: "http://localhost:3001";
export const socket = io(URL);
