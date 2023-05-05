import {io, Socket} from "socket.io-client";

export const socket: Socket = io("wss://ptserver.capthndsme.xyz/client", {
   autoConnect: false,
   reconnectionDelayMax: 7000,
   reconnection: true,
   reconnectionAttempts: Infinity
});

// For debugging purposes
// @ts-ignore
window.__DEBUG_SOCKET__ = socket; 