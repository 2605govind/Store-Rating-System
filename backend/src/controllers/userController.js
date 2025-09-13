import postgreDb from "../config/postgreSQL.js";

export const getStores = async (req, res) => {
  try {
    const userId = req.user.id; 

    const result = await postgreDb.query(
      `
      SELECT 
        s.id,
        s.name,
        s.address,
        COALESCE(AVG(r.rating), 0)::NUMERIC(2,1) AS overall_rating,
        COALESCE(ur.rating, 0) AS user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = $1
      GROUP BY s.id, ur.rating
      ORDER BY s.name ASC
      `,
      [userId]
    );

    res.status(200).json({
      stores: result.rows
    });

  } catch (error) {
    console.error("Error in getStoresForUser:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const submitRating = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { store_id, rating } = req.body;

    // Validation
    if (!store_id || !rating) {
      return res.status(400).json({ message: "all fields are required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Check if rating already exists
    const existing = await postgreDb.query(
      "SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2",
      [userId, store_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "You have already rated this store" });
    }

    // Insert rating
    await postgreDb.query(
      "INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3)",
      [userId, store_id, rating]
    );

    // Update store average rating
    const avgResult = await postgreDb.query(
      "SELECT AVG(rating) AS rating FROM ratings WHERE store_id = $1",
      [store_id]
    );
    const avgRating = avgResult.rows[0].rating;

    await postgreDb.query(
      "UPDATE stores SET rating = $1 WHERE id = $2",
      [avgRating, store_id]
    );

    res.status(201).json({ message: "Rating submitted successfully" });

  } catch (error) {
    console.error("Error in submitRating ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateRating = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { store_id, rating } = req.body;

    if (!store_id || !rating) {
      return res.status(400).json({ message: "all field are required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Check if rating exists
    const existing = await postgreDb.query(
      "SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2",
      [userId, store_id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "You have not rated this store yet" });
    }

    // Update rating
    await postgreDb.query(
      "UPDATE ratings SET rating = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND store_id = $3",
      [rating, userId, store_id]
    );

    // Update store average rating
    const avgResult = await postgreDb.query(
      "SELECT AVG(rating) AS rating FROM ratings WHERE store_id = $1",
      [store_id]
    );
    const avgRating = avgResult.rows[0].rating;

    await postgreDb.query(
      "UPDATE stores SET rating = $1 WHERE id = $2",
      [avgRating, store_id]
    );

    res.status(200).json({ message: "Rating updated successfully" });

  } catch (error) {
    console.error("Error in updateRating ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

