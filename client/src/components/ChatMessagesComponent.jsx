import { useEffect, useState, useRef, useCallback } from "react";
import axiosFetch from "../utils/axiosCreate";
import { ChatInput } from "../components";
import { Link } from "react-router-dom";

const ChatMessages = ({ chat, currentUser, socket, fromTenant }) => {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [socketMessage, setSocketMessage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const getMessage = useCallback(
    async (chatId) => {
      try {
        setIsLoaded(false);

        const { data } = await axiosFetch.post(
          `/chat/${fromTenant ? "tenant" : "owner"}/get-messages`,
          {
            to: chatId,
          }
        );

        setIsLoaded(true);
        setMessages(data.messages);
      } catch (error) {
        console.log(error);
      }
    },
    [fromTenant]
  );

  useEffect(() => {
    getMessage(chat?._id);
  }, [chat, getMessage]);

  const handleSendMessage = async (msgInput) => {
    try {
      await axiosFetch.post(
        `/chat/${fromTenant ? "tenant" : "owner"}/send-message`,
        {
          to: chat?._id,
          message: msgInput,
        }
      );

      socket.current.emit("sendMsg", {
        to: chat?._id,
        from: currentUser?._id,
        message: msgInput,
      });

      const oldMessages = [...messages];
      oldMessages.push({ fromSelf: true, message: msgInput });
      setMessages(oldMessages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (socket?.current) {
      socket.current.on("receiveMsg", (msg) => {
        setSocketMessage({
          fromSelf: false,
          message: msg,
        });
      });
    }
  }, [socketMessage]);

  useEffect(() => {
    socketMessage && setMessages((prev) => [...prev, socketMessage]);
  }, [socketMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <p className="font-display text-base md:text-xl lg:text-2xl text-center">
          Loading...
        </p>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <p className="font-display text-base md:text-xl lg:text-2xl text-center">
          Click on a chat to start messaging
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col w-full"
      style={{
        maxHeight: "500px",
      }}
    >
      <Link
        to={`${fromTenant ? "/tenant/owner-user" : "/owner/tenant-user"}/${
          chat?.slug
        }`}
      >
        <div className="flex items-center gap-4 py-4 cursor-pointer">
          <img
            src={chat?.profileImage}
            alt="pfp"
            className="w-8 h-8 rounded-full object-cover md:w-12 md:h-12"
          />
          <p className="font-roboto  md:text-lg">
            {chat?.firstName} {chat?.lastName}
          </p>
        </div>
      </Link>

      <div className="overflow-auto">
        {chat && messages?.length === 0 && (
          <div className="flex justify-center items-center h-64 w-full">
            <p className="font-display text-base md:text-xl lg:text-2xl text-center">
              No messages yet
            </p>
          </div>
        )}

        {messages?.map((message, index) => (
          <div
            className={`flex ${
              message.fromSelf ? "justify-end" : "justify-start"
            }`}
            key={index}
            ref={scrollRef}
          >
            <div
              className={`flex items-center gap-4 p-1 md:p-2 rounded-2xl my-1 ${
                !message.fromSelf ? "bg-primary text-white" : "bg-white"
              }`}
            >
              <p>{message.message}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <ChatInput handleSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatMessages;
