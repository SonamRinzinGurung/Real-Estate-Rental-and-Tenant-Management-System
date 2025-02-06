import { createContext, useEffect, useState, useMemo } from "react";
import { socket } from "../socket";
import { useSelector } from "react-redux";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socketMessage, setSocketMessage] = useState(null);
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    const { user } = useSelector((store) => store.auth);

    useEffect(() => {
        const onConnect = () => {
            socket.emit("addUser", user?._id);
        };
        socket.connect();
        socket.on("connect", onConnect);
        return () => {
            socket.off("connect", onConnect);
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const handleReceiveMessage = (message) => {
            setSocketMessage({
                fromSelf: false,
                message: message,
            });
        }

        const handleUnreadMessageCount = (unreadMessageCount) => {
            setUnreadMessageCount(unreadMessageCount);
        }

        socket.on("receiveMsg", (message) => {
            handleReceiveMessage(message);
        });

        socket.on("unreadMessageCount", (unreadMessageCount) => {
            handleUnreadMessageCount(unreadMessageCount);
        });

        return () => {
            socket.off("receiveMsg", handleReceiveMessage);
            socket.off("unreadMessageCount", handleUnreadMessageCount);
        };
    }, []);

    const sendMessage = (sender, receiver, message) => {
        socket.emit("sendMsg", {
            to: receiver,
            from: sender,
            message,
        });
    };

    const value = useMemo(
        () => ({
            socketMessage,
            unreadMessageCount,
            sendMessage,
        }),
        [socket, socketMessage, unreadMessageCount]
    );

    return (
        <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
    );
};
