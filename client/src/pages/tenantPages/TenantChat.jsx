import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTenantChats } from "../../features/tenantUser/tenantUserSlice";
import { PageLoading, ChatUsers, ChatMessages } from "../../components";
import { socket } from "../../socket";

const TenantChat = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { chats, isLoading } = useSelector((state) => state.tenantUser);
  const { user } = useSelector((state) => state.auth);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentSelectedChatIndex, setCurrentChatIndex] = useState(null);

  useEffect(() => {
    dispatch(getTenantChats());
  }, [dispatch]);

  // set the current chat to location state if it exists
  useEffect(() => {
    if (location?.state) {
      handleCurrentChatChange(location.state)
    }
  }, [location.state])

  const handleCurrentChatChange = (chat) => {
    socket?.emit("markAsRead", {
      receiverID: user?._id,
      senderId: chat?._id,
    });

    setCurrentChat(chat);
    setCurrentChatIndex(chat?._id);
  };

  if (isLoading) {
    return <PageLoading />;
  }
  if (chats?.length === 0) {
    return (
      <div className="mt-12">
        <h3 className="font-robotoNormal text-center">
          No chat available. Add a contact to start chatting.
        </h3>
      </div>
    );
  }
  return (
    <div className="flex flex-col flex-wrap justify-center gap-8 md:justify-start mt-12 mb-8 px-6 md:mx-4">
      <h3 className="font-heading font-bold">Chat</h3>
      <div
        className="flex gap-4"
        style={{
          maxHeight: "500px",
        }}
      >
        <div className="flex flex-col gap-4 w-1/3 overflow-y-auto overflow-x-hidden">
          {chats?.map((chat) => (
            <div
              key={chat?._id}
              onClick={() => handleCurrentChatChange(chat)}
            >
              <div
                className={`${
                  currentSelectedChatIndex === chat?._id && "bg-slate-300"
                } rounded-md`}
              >
                <ChatUsers chat={chat} currentUser={user} />
              </div>
            </div>
          ))}
        </div>
        {currentChat === null ? (
          <div className="flex justify-center items-center h-64 w-full">
            <p className="font-display text-base md:text-xl lg:text-2xl text-center">
              Click on a chat to start messaging
            </p>
          </div>
        ) : (
          <ChatMessages
            chat={currentChat}
              currentUser={user}
              fromTenant
              handleCurrentChatChange={handleCurrentChatChange}
            />
        )}
      </div>
    </div>
  );
};

export default TenantChat;
