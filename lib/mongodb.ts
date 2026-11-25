import { MongoClient } from 'mongodb'

const mongoUrl = process.env.MONGO_DB_URL

if (!mongoUrl) {
  throw new Error('MONGO_DB_URL is not set')
}

/**
 * Cache the MongoDB client across hot reloads in development so we do not
 * exhaust connections while keeping the same client instance Better Auth uses.
 */
declare global {
  var _pizzaHubMongoClient: MongoClient | undefined
}

export const mongoClient =
  global._pizzaHubMongoClient ?? new MongoClient(mongoUrl)

if (process.env.NODE_ENV !== 'production') {
  global._pizzaHubMongoClient = mongoClient
}

export const db = mongoClient.db('pizza-hut')
