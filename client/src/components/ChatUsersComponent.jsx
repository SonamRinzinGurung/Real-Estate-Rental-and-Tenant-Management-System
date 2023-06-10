const ChatUsers = ({ contact, currentUser }) => {
  return (
    <div className="flex justify-between items-center p-2 rounded-md border cursor-pointer hover:bg-slate-200">
      <p className="hidden md:block text-lg font-robotoNormal">
        {contact?.firstName} {contact?.lastName}
      </p>
      <img
        src={contact?.profileImage}
        alt="pfp"
        className="w-8 h-8 rounded-full object-cover md:w-12 md:h-12 "
      />
    </div>
  );
};

export default ChatUsers;
