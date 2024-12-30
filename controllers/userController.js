import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
        res.status(500).json({ message: "An error occured while registering!", error })
    }
}

export const userLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and Password fields are required!" })
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Incorrect username or password!", success: false })
        }
        const userPasswordMatch = await bcrypt.compare(password, user.password);
        if (!userPasswordMatch) {
            return res.status(400).json({ message: "Incorrect username or password!", success: false })
        }
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.JWT_SECRETE_KEY, { expiresIn: '1d' });
        res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({ message: "User login successfull!" })
    } catch (error) {
        res.status(500).json({ message: "An error occured while loggin in!", error })
    }
}

export const userLogout = async (req, res) => {
    try {
        res.status(200).cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: 'strict' }).json({ message: "User logged out!" })
    } catch (error) {
        res.send(error);
    }
}