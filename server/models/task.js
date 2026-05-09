import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TASKS_FILE = path.join(__dirname, "../data/tasks.json")

class Task {
    static async readTasks() {
        try {
            const data = await fs.readFile(TASKS_FILE, "utf-8")
            return JSON.parse(data || "[]")
        } catch (error) {
            return []
        }
    }

    static async writeTasks(tasks) {
        await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2))
    }

    static async findOne(query) {
        const tasks = await this.readTasks()
        return tasks.find((t) => {
            for (const key in query) {
                if (t[key] !== query[key]) return false
            }
            return true
        })
    }

    static async findById(id) {
        const tasks = await this.readTasks()
        return tasks.find((t) => t._id === id)
    }

    static async find(query = {}) {
        const tasks = await this.readTasks()
        return tasks.filter((t) => {
            for (const key in query) {
                if (key === "$nin") continue
                if (t[key] !== query[key]) return false
            }
            return true
        })
    }

    static async create(data) {
        const tasks = await this.readTasks()
        const id = Date.now().toString()

        const newTask = {
            _id: id,
            title: data.title,
            date: data.date || new Date().toISOString(),
            priority: data.priority || "normal",
            stage: data.stage || "todo",
            activities: Array.isArray(data.activities) ? data.activities : [data.activities],
            subTasks: data.subTasks || [],
            assets: data.assets || [],
            team: data.team || [],
            isTrashed: data.isTrashed || false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        tasks.push(newTask)
        await this.writeTasks(tasks)
        return newTask
    }

    static async findByIdAndUpdate(id, updateData) {
        const tasks = await this.readTasks()
        const taskIndex = tasks.findIndex((t) => t._id === id)

        if (taskIndex === -1) return null

        tasks[taskIndex] = {
            ...tasks[taskIndex],
            ...updateData,
            updatedAt: new Date().toISOString(),
        }

        await this.writeTasks(tasks)
        return tasks[taskIndex]
    }

    static async findByIdAndDelete(id) {
        const tasks = await this.readTasks()
        const filteredTasks = tasks.filter((t) => t._id !== id)
        await this.writeTasks(filteredTasks)
        return true
    }

    static async updateMany(query, update) {
        const tasks = await this.readTasks()
        const updatedTasks = tasks.map((task) => {
            let matches = true
            for (const key in query) {
                if (Array.isArray(task[key]) && Array.isArray(query[key])) {
                    matches = task[key].some((v) => query[key].includes(v))
                } else if (task[key] !== query[key]) {
                    matches = false
                }
            }
            return matches ? { ...task, ...update } : task
        })
        await this.writeTasks(updatedTasks)
        return true
    }

    static async deleteMany(query) {
        const tasks = await this.readTasks()
        const filteredTasks = tasks.filter((task) => {
            for (const key in query) {
                if (task[key] === query[key]) return false
            }
            return true
        })
        await this.writeTasks(filteredTasks)
        return true
    }
}

export default Task
