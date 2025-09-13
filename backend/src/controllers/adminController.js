import postgreDb from "../config/postgreSQL.js";
import bcrypt from "bcrypt";
import { InputDataValidate, InputStoreDataValidate } from "../utils/InputDataValidate.js";

export const addUser = async (req, res) => {
    try {
        const { name, email, password, address} = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const { valid, message } = InputDataValidate(name, email, address, password);
        if (!valid) {
            return res.status(400).json({ message });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        let role = "user";

        // Insert into DB
        await postgreDb.query(
            'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5)',
            [name, email, hashedPassword, address, role]
        );

        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        console.error('Error adminController addUser :', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


export const addAdmin = async (req, res) => {
    try {
        const { name, email, password, address} = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const { valid, message } = InputDataValidate(name, email, address, password);
        if (!valid) {
            return res.status(400).json({ message });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        let role = "admin";

        // Insert into DB
        await postgreDb.query(
            'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5)',
            [name, email, hashedPassword, address, role]
        );

        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        console.error('Error adminController addUser :', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const addStore = async (req, res) => {
    try {
        

        const { name, email, address, owner_id } = req.body;

        // Validation
        if (!name || !email || !address || !owner_id) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const { valid, message } = InputStoreDataValidate(name, email, address);
        if (!valid) {
            return res.status(400).json({ message });
        }

        // Check if owner exists and is a store_owner
        const ownerResult = await postgreDb.query(
            "SELECT * FROM users WHERE id = $1 AND role = $2",
            [owner_id, "store_owner"]
        );

        if (ownerResult.rows.length === 0) {
            return res.status(400).json({ message: "Invalid store owner" });
        }

        // Insert into DB
        await postgreDb.query(
            `INSERT INTO stores (name, email, address, owner_id)
             VALUES ($1, $2, $3, $4)`,
            [name, email, address, owner_id]
        );

        res.status(201).json({ message: "Store created successfully" });

    } catch (error) {
        console.error("Error storeController addStore ", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const changeRole = async (req, res) => {
    try {

        const { userId, role } = req.body;

        if (!role || !userId) {
            return res.status(400).json({ message: 'Field is required' });
        }

        // Update role in DB
        const result = await postgreDb.query(
            'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
            [role, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User role updated successfully', user: result.rows[0] });

    } catch (error) {
        console.error('Change Role Error in AdminController:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


export const getAdminDashboard = async (req, res) => {
  try {
    const userCountResult = await postgreDb.query(
      "SELECT COUNT(*) AS total_users FROM users"
    );

    const storeCountResult = await postgreDb.query(
      "SELECT COUNT(*) AS total_stores FROM stores"
    );

    const ratingCountResult = await postgreDb.query(
      "SELECT COUNT(*) AS total_ratings FROM ratings"
    );

    res.status(200).json({
      totalUsers: parseInt(userCountResult.rows[0].total_users, 10),
      totalStores: parseInt(storeCountResult.rows[0].total_stores, 10),
      totalRatings: parseInt(ratingCountResult.rows[0].total_ratings, 10),
    });

  } catch (error) {
    console.error("Error in getAdminDashboard:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllStores = async (req, res) => {
  try {
    const result = await postgreDb.query(
      `SELECT id, name, email, address, rating, owner_id
       FROM stores 
       ORDER BY name ASC`
    );

    res.status(200).json({
      stores: result.rows
    });

  } catch (error) {
    console.error("Error in getAllStores AdminController", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const result = await postgreDb.query(
      `SELECT id, name, email, address, role 
       FROM users 
       ORDER BY name ASC`
    );

    res.status(200).json({
      users: result.rows
    });

  } catch (error) {
    console.error("Error in getAllUsers AdminController", error.message);
    res.status(500).json({ message: "Server error" });
  }
};