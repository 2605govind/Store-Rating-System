import postgreDb from "../config/postgreSQL.js";
import jwt from 'jsonwebtoken'

const userMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Token is missing" });
    }

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);

        const result = await postgreDb.query("SELECT id, role, name, email, address FROM users WHERE id=$1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = result.rows[0];

        if (req.user.role !== "user") return res.status(403).json({ message: "user only" });

        next();
    } catch (err) {
        console.log("Error at userMiddleware");
        res.status(401).json({ message: "Invalid or expired token" });
    }
}

export default userMiddleware;