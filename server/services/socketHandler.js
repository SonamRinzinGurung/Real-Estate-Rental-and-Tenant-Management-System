import Chats from "../models/Chats.js";

const socketHandler = (io) => {
    global.onlineUsers = new Map();

    io.on("connection", (socket) => {
        global.chatSocket = socket;

      socket.on("addUser", (userId) => {
          onlineUsers.set(userId, socket.id);

        Chats.aggregate([
            {
                $match: {
                    chatUsers: userId,
                    sender: { $ne: userId }, // Exclude messages sent by the user
                    isRead: false,
                },
            },
            { $group: { _id: "$sender", count: { $sum: 1 } } },
        ])
            .then((result) => {
                const unreadMessageCount = result.length;
                socket.emit("unreadMessageCount", unreadMessageCount);
            })
            .catch((err) => {
                console.error("Error in getting unread message count:", err);
            });
    });

      socket.on("sendMsg", async (data) => {
          try {
              const { to, from, message } = data;
              const receiverSocketId = onlineUsers.get(to);
      // const notification = notificationService.addNotifications(to, {
      //     type: "NEW_MESSAGE",
      //     message: `New message from ${from}`,
      //     senderInfo: {
      //         userId: from,
      //         messagePreview: message,
      //     },
      // });

          if (receiverSocketId) {
          // Send the message
            io.to(receiverSocketId).emit("receiveMsg", {
                message,
                from,
                to,
            });

            // Send the notification
            // socket.to(receiverSocketId).emit("newNotification", notification);

            const result = await Chats.aggregate([
                {
                    $match: {
                        chatUsers: to,
                        sender: { $ne: to },
                        isRead: false,
                    },
                },

              { $group: { _id: "$sender", count: { $sum: 1 } } },
          ]);

                const unreadMessageCount = result.length;
                io.to(receiverSocketId).emit(
                    "unreadMessageCount",
                    unreadMessageCount
                );
            }
        } catch (error) {
            console.error("Error in sendMsg:", error);
        }
    });

      // Mark messages from a specific sender as read
      socket.on("markAsRead", async (data) => {
          try {
              const { receiverID, senderId } = data;
              // Update messages from the sender to "read"
              await Chats.updateMany(
                  { chatUsers: { $in: [receiverID] }, sender: senderId, isRead: false },
                  { $set: { isRead: true } }
              );
              // Fetch updated unread senders count for the user
              const result = await Chats.aggregate([
            {
                $match: {
                    chatUsers: receiverID,
                    sender: { $ne: receiverID },
                    isRead: false,
                },
            },
            { $group: { _id: "$sender", count: { $sum: 1 } } },
        ]);
          const unreadMessageCount = result.length;

          // Notify the user
          const receiverSocketId = onlineUsers.get(receiverID);

          if (receiverSocketId) {
                io.to(receiverSocketId).emit(
                    "unreadMessageCount",
                    unreadMessageCount
                );
            } else {
                console.log("receiverSocketId not found");
            }
        } catch (err) {
            console.error("Error marking messages as read:", err);
        }
    });

      socket.on("disconnect", () => {
          onlineUsers.forEach((value, key) => {
              if (value === socket.id) {
                  onlineUsers.delete(key);
              }
          });
      });

      socket.on("error", (err) => {
          console.log(`Socket error: ${err}`);
      });
  });
};

export default socketHandler;
