import { MongoClient } from 'mongodb'

const mongoUrl = process.env.MONGO_DB_URL?.trim()
const mongoDbName = process.env.MONGO_DB_NAME?.trim() || 'pizza-hut'

if (!mongoUrl) {
  console.error(
    '[mongodb] MONGO_DB_URL is not set. Better Auth/MongoDB features will fail until configured.',
  )
}

/**
 * Cache the MongoDB client across hot reloads in development and across warm
 * Vercel serverless function invocations in production. Reusing the same
 * MongoClient prevents connection storms, closed-topology errors, and index
 * creation races in Better Auth.
 */
declare global {
  var _pizzaHubMongoClient: MongoClient | undefined
  var _pizzaHubMongoClientPromise: Promise<MongoClient> | undefined
}

const resolvedMongoUrl = mongoUrl || 'mongodb://127.0.0.1:27017/pizzahub-missing-env'

const mongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000,
}

export const mongoClient =
  globalThis._pizzaHubMongoClient ?? new MongoClient(resolvedMongoUrl, mongoClientOptions)

if (!globalThis._pizzaHubMongoClient) {
  globalThis._pizzaHubMongoClient = mongoClient
}

function connectMongoClient(client: MongoClient) {
  const connectPromise = client.connect().catch((error) => {
    // Reset so future requests can retry instead of reusing a rejected promise.
    // Keep the same client instance because module exports already reference it.
    if (globalThis._pizzaHubMongoClientPromise === connectPromise) {
      globalThis._pizzaHubMongoClientPromise = undefined
    }
    console.error('[mongodb] Failed to connect MongoClient', error)
    throw error
  })

  // Prevent unhandled rejection during module init/build; callers can still await.
  void connectPromise.catch(() => undefined)
  return connectPromise
}

export function getMongoClientPromise() {
  if (!globalThis._pizzaHubMongoClientPromise) {
    globalThis._pizzaHubMongoClientPromise = connectMongoClient(mongoClient)
  }

  return globalThis._pizzaHubMongoClientPromise
}

export const mongoClientPromise = getMongoClientPromise()

export const db = mongoClient.db(mongoDbName)

export async function getMongoDb() {
  const connectedClient = await getMongoClientPromise()
  return connectedClient.db(mongoDbName)
}
