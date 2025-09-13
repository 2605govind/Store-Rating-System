import postgreDb from "../config/postgreSQL.js";


export const getUsersWhoRatedStore = async (req, res) => {
  try {
    const storeOwnerId = req.user.id;

    // Find store of this owner
    const storeResult = await postgreDb.query(
      "SELECT id FROM stores WHERE owner_id = $1",
      [storeOwnerId]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    const storeId = storeResult.rows[0].id;

    // Get all users who rated this store
    const ratingsResult = await postgreDb.query(
      `SELECT u.id, u.name, u.email, r.rating 
       FROM ratings r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.store_id = $1`,
      [storeId]
    );

    res.json({ users: ratingsResult.rows });
  } catch (error) {
    console.error("Error getUsersWhoRatedMyStore ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



export const getAverageRating = async (req, res) => {
  try {

    const storeOwnerId = req.user.id;
    
    const storeResult = await postgreDb.query(
      "SELECT id, name, email, address FROM stores WHERE owner_id = $1",
      [storeOwnerId]
    );
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    const storeId = storeResult.rows[0].id;

    const avgResult = await postgreDb.query(
      "SELECT COALESCE(AVG(rating), 0)::numeric(10,2) as average_rating FROM ratings WHERE store_id = $1",
      [storeId]
    );

    res.json({ averageRating: avgResult.rows[0].average_rating, storeDetails: storeResult.rows[0] });
  } catch (error) {
    console.error("Error getMyAverageRating ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
