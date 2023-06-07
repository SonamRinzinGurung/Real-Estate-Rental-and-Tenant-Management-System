import { useEffect, useState } from "react";
import axiosFetch from "../../utils/axiosCreate";

const ChatMessageOwner = ({ chat, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");

  useEffect(() => {
    getMessage(chat?._id);
  }, [chat]);

  const getMessage = async (chatId) => {
    try {
      const { data } = await axiosFetch.post(`/chat//owner/get-messages`, {
        to: chatId,
      });

      setMessages(data.messages);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await axiosFetch.post(`/chat/owner/send-message`, {
        to: chat?._id,
        message: msgInput,
      });

      const oldMessages = [...messages];
      oldMessages.push({ fromSelf: true, message: msgInput });
      setMessages(oldMessages);
      setMsgInput("");
    } catch (error) {
      console.log(error);
    }
  };

  if (!chat) {
    return <div>Select a chat</div>;
  }

  return (
    <>
      <div>
        {messages?.map((message) => (
          <div key={message._id}>
            <p>{message.message}</p>
          </div>
        ))}
      </div>
      <form className="form" onSubmit={(e) => handleSendMessage(e)}>
        <input
          type="text"
          placeholder="Type a message"
          className=""
          value={msgInput}
          onChange={(e) => {
            setMsgInput(e.target.value);
          }}
        />
        <button type="submit" className="btn">
          🕊️
        </button>
      </form>
    </>
  );
};

export default ChatMessageOwner;
