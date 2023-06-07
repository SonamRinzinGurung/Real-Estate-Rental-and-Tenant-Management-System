import { useEffect } from "react";

const ChatUserOwner = ({ contact, currentUser }) => {
  return (
    <div className="border">
      name: {contact?.firstName} {contact?.lastName} <br />
      email: {contact?.email} <br />
    </div>
  );
};

export default ChatUserOwner;
