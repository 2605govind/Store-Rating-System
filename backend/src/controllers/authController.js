import postgreDb  from "../config/postgreSQL.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import { InputDataValidate } from '../utils/InputDataValidate.js'


export const register = async (req, res) => {
    try {
        const { name, email, address, password } = req.body;

        if (!name || !email || !address || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // validation
        const { valid, message } = InputDataValidate(name, email, address, password);
        if (!valid) {
            return res.status(400).json({ message });
        }

        // check if user is exists
        const userExist = await postgreDb .query("SELECT * FROM users WHERE email=$1", [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let role = "user"

        // insert into Database
        const newUser = await postgreDb .query(
            "INSERT INTO users (name, email, address, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role",
            [name, email, address, hashedPassword, role]
        );


        // JWT Token
        const token = jwt.sign(
            { id: newUser.rows[0].id, role: newUser.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 2 * 60 * 60 * 1000 // 2hr me expire hoga
        });

        res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });

    } catch (err) {
        console.error("Error in authController register " + err.message);
        res.status(500).json({ message: "Server error" });
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await postgreDb .query("SELECT * FROM users WHERE email=$1", [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: "Invalid Creadential" });
        }

        const IsCorrectPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!IsCorrectPassword) {
            return res.status(400).json({ message: "Invalid Creadential" });
        }


        // JWT Token
        const token = jwt.sign(
            { id: user.rows[0].id, role: user.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 2 * 60 * 60 * 1000 // 2hr me expire hoga
        });

        res.json({ message: "Login successful", user: user.rows[0] });
    } catch (err) {
        console.error("Error in authController login " + err.message);
        res.status(500).json({ message: "Server error" });
    }
}

export const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
    });
    res.json({ message: "Logged out successfully" });
}

export const updatePassword = async (req, res) => {
    const { newPassword } = req.body;
    const userId = req.user.id;

    try {
        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }

        //pasword validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message: "Password must be 8-16 characters, include 1 uppercase & 1 special char",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const result = await postgreDb .query("UPDATE users SET password=$1 WHERE id=$2 RETURNING id, name, email", [hashedPassword, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Password updated successfully", user: result.rows[0] });

    } catch (error) {
        console.error("Error at UpdatePassword authController");
        res.status(500).json({ message: "Server error" });
    }
}