import { Pool } from 'pg';
import "dotenv/config"

const postgreDb = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }  
});

export default postgreDb;
