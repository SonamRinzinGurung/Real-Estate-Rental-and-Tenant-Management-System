import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllContacts } from "../../features/ownerUser/ownerUserSlice";
import { PageLoading, ChatUserOwner, ChatMessageOwner } from "../../components";

const OwnerChat = () => {
  const dispatch = useDispatch();
  const { contacts, isLoading } = useSelector((state) => state.ownerUser);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllContacts({ name: "" }));
  }, [dispatch]);

  const [currentChat, setCurrentChat] = useState(null);
  const [currentSelectedChatIndex, setCurrentChatIndex] = useState(null);

  const handleCurrentChatChange = (contact, index) => {
    setCurrentChat(contact);
    setCurrentChatIndex(index);
  };

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div>
      <h1>Owner Chat</h1>
      <div>
        {contacts?.map((contact, index) => (
          <div
            key={contact?._id}
            onClick={() => handleCurrentChatChange(contact, index)}
          >
            <ChatUserOwner contact={contact} currentUser={user.slug} />
          </div>
        ))}
      </div>

      <ChatMessageOwner chat={currentChat} currentUser={user.slug} />
    </div>
  );
};

export default OwnerChat;
