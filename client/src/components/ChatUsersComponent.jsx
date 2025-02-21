import moment from "moment";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const ChatUsers = ({ chat, currentUser }) => {
  const truncateMessage = (message, maxLength) => {
    if (message.length > maxLength) {
      return message.substring(0, maxLength) + '...';
    }
    return message;
  };

  const getShortenedTime = (date) => {
    const duration = moment.duration(moment().diff(date));
    if (duration.asSeconds() < 60) {
      return `now`;
    } else if (duration.asMinutes() < 60) {
      return `${Math.floor(duration.asMinutes())}m`;
    } else if (duration.asHours() < 24) {
      return `${Math.floor(duration.asHours())}h`;
    } else if (duration.asDays() < 7) {
      return `${Math.floor(duration.asDays())}d`;
    } else if (duration.asWeeks() < 4) {
      return `${Math.floor(duration.asWeeks())}w`;
    } else if (duration.asMonths() < 12) {
      return `${Math.floor(duration.asMonths())}mo`;
    } else {
      return `${Math.floor(duration.asYears())}y`;
    }
  };
  return (
    <div className="flex justify-start gap-4 items-center px-2 py-1 rounded-md border cursor-pointer hover:bg-slate-200">
      <img
        src={chat?.profileImage}
        alt="pfp"
        className="w-8 h-8 rounded-full object-cover md:w-12 md:h-12 "
      />
      <div className={`hidden md:flex font-robotoNormal flex-col ${chat?.sender !== currentUser?._id && !chat?.isRead && "font-semibold"}`}>
        <div>
          {chat?.firstName} {chat?.lastName}
        </div>

        {
          chat.message && (
            <div className="flex text-slate-400 text-sm gap-1">
              <span className="text-sm">{chat?.sender === currentUser?._id && "You: "}{truncateMessage(chat.message, 25)}</span>
              <span>·</span>
              <span className="">
                {getShortenedTime(chat.createdAt)}
              </span>
            </div>
          )
        }
      </div>
      {
        chat?.sender !== currentUser?._id && !chat?.isRead && (
          <div className="flex ml-auto font-semibold mr-2">
            <FiberManualRecordIcon fontSize="small" color="info" />
          </div>
        )
      }
    </div>
  );
};

export default ChatUsers;
