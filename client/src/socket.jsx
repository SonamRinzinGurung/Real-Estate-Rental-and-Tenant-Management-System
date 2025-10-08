import { io } from 'socket.io-client';
import config from "./config/config.js";

export const socket = io(config.SOCKET_URL);