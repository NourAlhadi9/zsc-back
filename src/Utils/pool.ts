import { Pool } from "pg";
import { config } from "../Config/config";

export const pg = new Pool({
  connectionString: config.database.url,
  ssl: {
    rejectUnauthorized: false
  }
});
