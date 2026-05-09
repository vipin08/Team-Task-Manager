import bcrypt from "bcryptjs"
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const USERS_FILE = path.join(__dirname, "../data/users.json")

class User {
    static async readUsers() {
        try {
            const data = await fs.readFile(USERS_FILE, "utf-8")
            return JSON.parse(data || "[]")
        } catch (error) {
            return []
        }
    }

    static async writeUsers(users) {
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
    }

    static async findOne(query) {
        const users = await this.readUsers()
        const user = users.find((u) => {
            if (query.email) return u.email === query.email
            if (query._id) return u._id === query._id
            return false
        })
        return user ? { ...user, matchPassword: this.matchPassword(user) } : null
    }

    static async findById(id) {
        const users = await this.readUsers()
        const user = users.find((u) => u._id === id)
        return user || null
    }

    static async find(query = {}) {
        const users = await this.readUsers()
        return users
    }

    static async create(userData) {
        const users = await this.readUsers()
        const id = Date.now().toString()
        
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(userData.password, salt)

        const newUser = {
            _id: id,
            name: userData.name,
            title: userData.title,
            role: userData.role,
            email: userData.email,
            password: hashedPassword,
            isAdmin: userData.isAdmin || false,
            isActive: userData.isActive !== undefined ? userData.isActive : true,
            tasks: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        users.push(newUser)
        await this.writeUsers(users)
        return newUser
    }

    static async findByIdAndUpdate(id, updateData) {
        const users = await this.readUsers()
        const userIndex = users.findIndex((u) => u._id === id)
        
        if (userIndex === -1) return null

        users[userIndex] = {
            ...users[userIndex],
            ...updateData,
            updatedAt: new Date().toISOString(),
        }

        await this.writeUsers(users)
        return users[userIndex]
    }

    static async findByIdAndDelete(id) {
        const users = await this.readUsers()
        const filteredUsers = users.filter((u) => u._id !== id)
        await this.writeUsers(filteredUsers)
        return true
    }

    static async updateMany(query, update) {
        const users = await this.readUsers()
        const updatedUsers = users.map((user) => {
            if (query.team && user._id === query.team) {
                return { ...user, ...update }
            }
            return user
        })
        await this.writeUsers(updatedUsers)
        return true
    }

    static matchPassword(user) {
        return async function (enteredPassword) {
            return await bcrypt.compare(enteredPassword, user.password)
        }
    }
}

export default User
