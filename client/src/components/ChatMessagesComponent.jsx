import { useEffect, useState, useRef, useCallback, useContext } from "react";
import axiosFetch from "../utils/axiosCreate";
import { ChatInput } from "../components";
import { Link } from "react-router-dom";
import { SocketContext } from "../utils/SocketContext";
import { useDispatch } from "react-redux";
import { addOwnerRecentMessage } from "../features/ownerUser/ownerUserSlice";
import { addTenantRecentMessage } from "../features/tenantUser/tenantUserSlice";

const ChatMessages = ({ chat, currentUser, fromTenant, handleCurrentChatChange }) => {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [isLoaded, setIsLoaded] = useState(false);
  const { socketMessage, sendMessage } =
    useContext(SocketContext);
  const dispatch = useDispatch();
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

      sendMessage(currentUser?._id, chat?._id, msgInput);

      const oldMessages = [...messages];
      oldMessages.push({ fromSelf: true, message: msgInput });
      setMessages(oldMessages);

      if (fromTenant) {
        dispatch(addTenantRecentMessage({ chatId: chat?._id, message: msgInput }));
      } else {
        dispatch(addOwnerRecentMessage({ chatId: chat?._id, message: msgInput }));
      }

      handleCurrentChatChange(chat, chat?._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    if (socketMessage && socketMessage.to === currentUser?._id && socketMessage.from === chat?._id) {
      setMessages((prev) => [...prev, socketMessage]);
    }

    if (fromTenant) {
      dispatch(addTenantRecentMessage({ chatId: socketMessage?.from, message: socketMessage?.message }));
    } else {
      dispatch(addOwnerRecentMessage({ chatId: socketMessage?.from, message: socketMessage?.message }));
    }

  }, [socketMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
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

  // if (!chat) {
  //   return (
  //     <div className="flex justify-center items-center h-64 w-full">
  //       <p className="font-display text-base md:text-xl lg:text-2xl text-center">
  //         Click on a chat to start messaging
  //       </p>
  //     </div>
  //   );
  // }

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
              message.fromSelf ? "justify-end ml-5" : "justify-start mr-5"
            }`}
            key={index}
            ref={scrollRef}
          >
            <div
              className={`flex items-center gap-4 p-1 md:p-2 rounded-2xl my-1 max-w-xl ${
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
