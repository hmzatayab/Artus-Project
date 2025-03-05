import { Server as SocketIOServer } from "socket.io";
import { Server } from "http";

let io: SocketIOServer;

export const initializeSocket = (server: Server) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: "http://localhost:5173", 
        },
    });

    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);

        // Handle incoming notifications
        socket.on("send_notification", (data) => {
            io.emit("receive_notification", data);
        });

        socket.on("disconnect", () => {
            console.log(`User Disconnected: ${socket.id}`);
        });
    });
};

export const getSocketInstance = () => io;
