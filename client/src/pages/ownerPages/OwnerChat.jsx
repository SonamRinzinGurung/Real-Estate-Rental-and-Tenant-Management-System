import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllContacts } from "../../features/ownerUser/ownerUserSlice";
import { PageLoading, ChatUsers, ChatMessages } from "../../components";
import { socket } from "../../socket";
const OwnerChat = () => {
  const dispatch = useDispatch();
  const { contacts, isLoading } = useSelector((state) => state.ownerUser);
  const { user } = useSelector((state) => state.auth);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentSelectedChatIndex, setCurrentChatIndex] = useState(null);

  useEffect(() => {
    dispatch(getAllContacts({ name: "" }));
  }, [dispatch]);

  const handleCurrentChatChange = (contact, index) => {
    socket?.emit("markAsRead", {
      receiverID: user?._id,
      senderId: contact?._id,
    });
    setCurrentChat(contact);
    setCurrentChatIndex(index);
  };

  if (isLoading) {
    return <PageLoading />;
  }
  if (contacts?.length === 0) {
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
          {contacts?.map((contact, index) => (
            <div
              key={contact?._id}
              onClick={() => handleCurrentChatChange(contact, index)}
            >
              <div
                className={`${
                  currentSelectedChatIndex === index && "bg-slate-300"
                } rounded-md`}
              >
                <ChatUsers contact={contact} currentUser={user.slug} />
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
          <ChatMessages chat={currentChat} currentUser={user} socket={socket} />
        )}
      </div>
    </div>
  );
};

export default OwnerChat;
