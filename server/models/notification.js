import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const NOTIFICATIONS_FILE = path.join(__dirname, "../data/notifications.json")

class Notice {
    static async readNotifications() {
        try {
            const data = await fs.readFile(NOTIFICATIONS_FILE, "utf-8")
            return JSON.parse(data || "[]")
        } catch (error) {
            return []
        }
    }

    static async writeNotifications(notifications) {
        await fs.writeFile(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2))
    }

    static async findOne(query) {
        const notifications = await this.readNotifications()
        return notifications.find((n) => {
            for (const key in query) {
                if (n[key] !== query[key]) return false
            }
            return true
        })
    }

    static async findById(id) {
        const notifications = await this.readNotifications()
        return notifications.find((n) => n._id === id)
    }

    static async find(query = {}) {
        const notifications = await this.readNotifications()
        return notifications.filter((n) => {
            for (const key in query) {
                if (key === "$nin") {
                    if (Array.isArray(n[key]) && Array.isArray(query[key])) {
                        if (n[key].some((v) => query[key].includes(v))) return false
                    }
                } else if (key === "team") {
                    if (!n.team || !Array.isArray(n.team)) return false
                    if (!n.team.includes(query[key])) return false
                } else {
                    if (n[key] !== query[key]) return false
                }
            }
            return true
        })
    }

    static async create(data) {
        const notifications = await this.readNotifications()
        const id = Date.now().toString()

        const newNotification = {
            _id: id,
            team: data.team || [],
            text: data.text || "",
            task: data.task || null,
            notiType: data.notiType || "alert",
            isRead: data.isRead || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        notifications.push(newNotification)
        await this.writeNotifications(notifications)
        return newNotification
    }

    static async findByIdAndUpdate(id, updateData) {
        const notifications = await this.readNotifications()
        const notificationIndex = notifications.findIndex((n) => n._id === id)

        if (notificationIndex === -1) return null

        notifications[notificationIndex] = {
            ...notifications[notificationIndex],
            ...updateData,
            updatedAt: new Date().toISOString(),
        }

        await this.writeNotifications(notifications)
        return notifications[notificationIndex]
    }

    static async findOneAndUpdate(query, updateData) {
        const notifications = await this.readNotifications()
        const notificationIndex = notifications.findIndex((n) => {
            for (const key in query) {
                if (n[key] !== query[key]) return false
            }
            return true
        })

        if (notificationIndex === -1) return null

        notifications[notificationIndex] = {
            ...notifications[notificationIndex],
            ...updateData,
            updatedAt: new Date().toISOString(),
        }

        await this.writeNotifications(notifications)
        return notifications[notificationIndex]
    }

    static async updateMany(query, update) {
        const notifications = await this.readNotifications()
        const updatedNotifications = notifications.map((notification) => {
            let matches = true
            for (const key in query) {
                if (key === "$nin") {
                    if (Array.isArray(notification.isRead)) {
                        if (notification.isRead.some((v) => query[key].includes(v))) {
                            matches = false
                        }
                    }
                } else if (notification[key] !== query[key]) {
                    matches = false
                }
            }
            if (matches) {
                if (update.$push) {
                    return {
                        ...notification,
                        isRead: [...(notification.isRead || []), ...Object.values(update.$push)],
                        updatedAt: new Date().toISOString(),
                    }
                }
                return { ...notification, ...update, updatedAt: new Date().toISOString() }
            }
            return notification
        })
        await this.writeNotifications(updatedNotifications)
        return true
    }

    static async findByIdAndDelete(id) {
        const notifications = await this.readNotifications()
        const filteredNotifications = notifications.filter((n) => n._id !== id)
        await this.writeNotifications(filteredNotifications)
        return true
    }

    static async deleteMany(query) {
        const notifications = await this.readNotifications()
        const filteredNotifications = notifications.filter((notification) => {
            for (const key in query) {
                if (notification[key] === query[key]) return false
            }
            return true
        })
        await this.writeNotifications(filteredNotifications)
        return true
    }
}

export default Notice
