import Notice from "../models/notification.js"
import Task from "../models/task.js"
import User from "../models/user.js"

export const createTask = async (req, res) => {
    try {
        const { userId } = req.user

        const { title, team, stage, date, priority, assets } = req.body

        let text = "New task has been assigned to you"
        if (team?.length > 1) {
            text = text + ` and ${team?.length - 1} others.`
        }

        text =
            text +
            ` The task priority is set a ${priority} priority, so check and act accordingly. The task date is ${new Date(
                date
            ).toDateString()}. Thank you!!!`

        const activity = {
            type: "assigned",
            activity: text,
            by: userId,
        }

        const task = await Task.create({
            title,
            team,
            stage: stage.toLowerCase(),
            date,
            priority: priority.toLowerCase(),
            assets,
            activities: activity,
        })

        await Notice.create({
            team,
            text,
            task: task._id,
        })

        res.status(200).json({
            status: true,
            task,
            message: "Task created successfully.",
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}

export const duplicateTask = async (req, res) => {
    try {
        const { id } = req.params

        const task = await Task.findById(id)

        const newTask = await Task.create({
            title: task.title + " - Duplicate",
            team: task.team,
            subTasks: task.subTasks,
            assets: task.assets,
            priority: task.priority,
            stage: task.stage,
            date: task.date,
            activities: task.activities,
        })

        //alert users of the task
        let text = "New task has been assigned to you"
        if (task.team && task.team.length > 1) {
            text = text + ` and ${task.team.length - 1} others.`
        }

        text =
            text +
            ` The task priority is set a ${
                task.priority
            } priority, so check and act accordingly. The task date is ${new Date(
                task.date
            ).toDateString()}. Thank you!!!`

        await Notice.create({
            team: task.team,
            text,
            task: newTask._id,
        })

        res.status(200).json({
            status: true,
            message: "Task duplicated successfully.",
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}

export const postTaskActivity = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.user
        const { type, activity } = req.body

        const task = await Task.findById(id)

        const data = {
            type,
            activity,
            by: userId,
            date: new Date().toISOString(),
        }

        const updatedTask = await Task.findByIdAndUpdate(id, {
            activities: [...(task.activities || []), data],
        })

        res.status(200).json({
            status: true,
            message: "Activity posted successfully.",
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}

export const dashboardStatistics = async (req, res) => {
    try {
        const { userId, isAdmin } = req.user

        const allTasks = await Task.find({ isTrashed: false })

        // Show all tasks on dashboard
        const filteredTasks = allTasks

        const users = await User.find()
        const usersMap = users.reduce((acc, user) => {
            acc[user._id] = user
            return acc
        }, {})

        // Group task by stage and calculate counts
        const groupTaskks = filteredTasks.reduce((result, task) => {
            const stage = task.stage

            if (!result[stage]) {
                result[stage] = 1
            } else {
                result[stage] += 1
            }

            return result
        }, {})

        // Group tasks by priority
        const groupData = Object.entries(
            filteredTasks.reduce((result, task) => {
                const { priority } = task

                result[priority] = (result[priority] || 0) + 1
                return result
            }, {})
        ).map(([name, total]) => ({ name, total }))

        // calculate total tasks and enrich with user data
        const totalTasks = filteredTasks?.length
        const last10Task = filteredTasks?.slice(0, 10).map((task) => ({
            ...task,
            team: task.team
                ? task.team.map((id) => usersMap[id] || { _id: id })
                : [],
        }))

        const summary = {
            totalTasks,
            last10Task,
            users: isAdmin ? users.filter((u) => u.isActive).slice(0, 10) : [],
            tasks: groupTaskks,
            graphData: groupData,
        }

        res.status(200).json({
            status: true,
            message: "Successfully",
            ...summary,
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}

export const getTasks = async (req, res) => {
    try {
        const { stage, isTrashed } = req.query

        let allTasks = await Task.find({ isTrashed: isTrashed ? true : false })

        if (stage) {
            allTasks = allTasks.filter((t) => t.stage === stage)
        }

        // Get user data for team members
        const users = await User.find()
        const usersMap = users.reduce((acc, user) => {
            acc[user._id] = user
            return acc
        }, {})

        const tasks = allTasks.map((task) => ({
            ...task,
            team: task.team
                ? task.team.map((id) => usersMap[id] || { _id: id })
                : [],
        }))

        res.status(200).json({
            status: true,
            tasks: tasks.sort((a, b) => b._id - a._id),
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}

export const getTask = async (req, res) => {
    try {
        const { id } = req.params

        const task = await Task.findById(id)

        if (!task) {
            return res.status(404).json({ status: false, message: "Task not found" })
        }

        // Get user data
        const users = await User.find()
        const usersMap = users.reduce((acc, user) => {
            acc[user._id] = user
            return acc
        }, {})

        const enrichedTask = {
            ...task,
            team: task.team
                ? task.team.map((id) => usersMap[id] || { _id: id })
                : [],
            activities: task.activities
                ? task.activities.map((act) => ({
                      ...act,
                      by: usersMap[act.by] || { _id: act.by },
                  }))
                : [],
        }

        res.status(200).json({
            status: true,
            task: enrichedTask,
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}

export const createSubTask = async (req, res) => {
    try {
        const { title, tag, date } = req.body

        const { id } = req.params

        const newSubTask = {
            title,
            date,
            tag,
        }

        const task = await Task.findById(id)

        const updatedTask = await Task.findByIdAndUpdate(id, {
            subTasks: [...(task.subTasks || []), newSubTask],
        })

        res.status(200).json({
            status: true,
            message: "SubTask added successfully.",
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params
        const { title, date, team, stage, priority, assets } = req.body

        const updatedTask = await Task.findByIdAndUpdate(id, {
            title,
            date,
            priority: priority.toLowerCase(),
            assets,
            stage: stage.toLowerCase(),
            team,
        })

        res.status(200).json({
            status: true,
            message: "Task updated successfully.",
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}

export const trashTask = async (req, res) => {
    try {
        const { id } = req.params

        const updatedTask = await Task.findByIdAndUpdate(id, {
            isTrashed: true,
        })

        res.status(200).json({
            status: true,
            message: `Task trashed successfully.`,
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}

export const deleteRestoreTask = async (req, res) => {
    try {
        const { id } = req.params
        const { actionType } = req.query

        if (actionType === "delete") {
            await Task.findByIdAndDelete(id)
        } else if (actionType === "deleteAll") {
            await Task.deleteMany({ isTrashed: true })
        } else if (actionType === "restore") {
            const resp = await Task.findById(id)
            await Task.findByIdAndUpdate(id, { isTrashed: false })
        } else if (actionType === "restoreAll") {
            await Task.updateMany(
                { isTrashed: true },
                { isTrashed: false }
            )
        }

        res.status(200).json({
            status: true,
            message: `Operation performed successfully.`,
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}
