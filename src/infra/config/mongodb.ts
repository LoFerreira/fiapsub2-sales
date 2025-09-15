import { MongoClient, Db, Collection, Document } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

const MONGODB_URI = process.env.MONGODB_URI || "";
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "fiapsub2-sales";

export async function connectMongo(): Promise<Db> {
  if (db) return db;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI não definido nas variáveis de ambiente");
  }

  client = new MongoClient(MONGODB_URI);
  await client.connect();
  await client.db(MONGODB_DB_NAME).command({ ping: 1 });
  db = client.db(MONGODB_DB_NAME);
  try {
    const firstHost = (client.options?.hosts as any)?.[0]?.host ?? "cluster";
    console.log(`[mongo] conectado: db=${MONGODB_DB_NAME} host=${firstHost}`);
  } catch {
    console.log(`[mongo] conectado: db=${MONGODB_DB_NAME}`);
  }
  return db;
}

export function getDb(): Db {
  if (!db) {
    throw new Error("MongoDB não conectado. Chame connectMongo() primeiro.");
  }
  return db;
}

export function getCollection<T extends Document = Document>(
  name: string
): Collection<T> {
  return getDb().collection<T>(name);
}

export async function disconnectMongo(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
