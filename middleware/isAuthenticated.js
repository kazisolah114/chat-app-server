import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "User not authenticated!" });
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRETE_KEY);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token!" });
        }
        req.id = decoded.userId;
        next()
    } catch (error) {
        res.status(401).json({ message: "User not authenticated!" })
    }
}
export default isAuthenticated;