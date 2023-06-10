import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllContacts } from "../../features/tenantUser/tenantUserSlice";
import { PageLoading, ChatUsers, ChatMessages } from "../../components";
import { io } from "socket.io-client";

const TenantChat = () => {
  const dispatch = useDispatch();
  const socket = useRef();

  const { contacts, isLoading } = useSelector((state) => state.tenantUser);
  const { user } = useSelector((state) => state.auth);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentSelectedChatIndex, setCurrentChatIndex] = useState(null);

  useEffect(() => {
    if (user) {
      socket.current = io(process.env.REACT_APP_API_HOST);
      socket.current.emit("addUser", user._id);
    }
  }, [user]);

  useEffect(() => {
    dispatch(getAllContacts({ name: "" }));
  }, [dispatch]);

  const handleCurrentChatChange = (contact, index) => {
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
    <div className="flex flex-col flex-wrap justify-center gap-8 md:justify-start mt-12 mb-8 mx-2 md:mx-4">
      <h1 className="font-heading font-bold">Chat</h1>
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

        <ChatMessages
          chat={currentChat}
          currentUser={user.slug}
          socket={socket}
          fromTenant
        />
      </div>
    </div>
  );
};

export default TenantChat;
