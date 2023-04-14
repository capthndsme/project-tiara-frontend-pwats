import {io} from "socket.io-client";

export const socket = io("wss://ptserver.capthndsme.xyz/client", {
   autoConnect: false
});