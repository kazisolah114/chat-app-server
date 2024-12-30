import bcrypt from 'bcryptjs'
import { User } from '../models/userModel.js';

export const userRegister = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required!" })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password does not match!" })
        }
        const user = await User.findOne({ username })
        if (user) {
            return res.status(400).json({ message: "User already exists!" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePhoto: gender === "male" ? `https://avatar.iran.liara.run/public/boy?${username}` : `https://avatar.iran.liara.run/public/girl?${username}`
        })
        res.status(200).json({ message: "Registration successfull!", success: true })
    } catch (error) {
        res.status(500).json({ message: "An error occured", error })
    }
}