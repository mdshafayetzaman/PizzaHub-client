import { MongoClient } from 'mongodb'

const mongoUrl = process.env.MONGO_DB_URL?.trim()

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
  // Connect once per server/runtime instance. MongoClient.connect() is safe to
  // call before first operation; caching the promise avoids duplicate connects.
  const connectPromise = mongoClient.connect().catch((error) => {
    // Reset so future requests can retry instead of reusing a broken promise.
    globalThis._pizzaHubMongoClientPromise = undefined
    console.error('[mongodb] Failed to connect MongoClient', error)
    throw error
  })
  // Prevent unhandled rejection during module init/build; callers can still await.
  void connectPromise.catch(() => undefined)
  globalThis._pizzaHubMongoClientPromise = connectPromise
}

export const mongoClientPromise =
  globalThis._pizzaHubMongoClientPromise ?? mongoClient.connect()

export const db = mongoClient.db(process.env.MONGO_DB_NAME || 'pizza-hut')
