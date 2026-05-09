import jwt from "jsonwebtoken"

// No database connection needed - using JSON file storage

export const createJWT = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    })

    // Change sameSite from strict to none when you deploy your app
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict", //prevent CSRF attack
        maxAge: 1 * 24 * 60 * 60 * 1000, //1 day
    })
}
