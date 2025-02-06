const notificationService = {
    notifications: new Map(),

    addNotifications(userId, notification) {
        const userNotifications = this.notifications.get(userId) || [];
        userNotifications.push({
            id: Date.now() + userId,
            ...notification,
            read: false,
            createAt: new Date()
        })
        this.notifications.set(userId, userNotifications)
        return userNotifications[userNotifications.length - 1]
    },

    markAsRead(userId, notificationId) {
        const userNotifications = this.notifications.get(userId)

        if (userNotifications) {
            const notification = userNotifications.find(n => n.id === notificationId)
            if (notification) {
                notification.read = true
            }
        }
    }
}

export default notificationService;