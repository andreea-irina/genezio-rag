import pg from "pg";

export async function initDB(pool: pg.Pool, name: string = "test") {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS users (id serial PRIMARY KEY,name VARCHAR(255))"
  );

  await pool.query("INSERT INTO users (name) VALUES ($1)", [name]);
  const result = await pool.query("select * from users");

  return JSON.stringify(result.rows);
}
