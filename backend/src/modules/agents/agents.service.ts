import { pool } from "../../db";

export const getAgentByEmail = async (email: string) => {
    const q = `SELECT * FROM agents WHERE email = $1`;
    const result = await pool.query(q, [email]);
    return result.rows[0];
}
