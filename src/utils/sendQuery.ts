import { Pool, PoolClient, QueryResult } from "pg";

const config = () => {
  //konfiguracija baze
  const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
      rejectUnauthorized: false, // Set to true in production for security
    },
  });
  return pool;
};

async function sendQuery(
  queryText: string,
  params: any[] = []
): Promise<QueryResult | null> {
  let client: PoolClient | Pool | null = null;
  try {
    //povezivanje s bazom - dohvat instance veze
    client = await config();
    console.log("Connected to the database successfully");

    const result = await client.query(queryText, params);
    return result;
  } catch (error) {
    console.error("Failed to execute query:", error);
    return null;
  } finally {
    if (client) {
      client.end();
    }
  }
}

export default sendQuery;
