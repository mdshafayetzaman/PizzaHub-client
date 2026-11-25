import { betterAuth } from 'better-auth'
import { mongodbAdapter } from '@better-auth/mongo-adapter'
import { jwt } from 'better-auth/plugins/jwt'

import { db, mongoClient } from './mongodb'

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: mongodbAdapter(db, {
    client: mongoClient,
  }),
  plugins: [jwt()],
  user: {
    additionalFields: {
      role: {
        type: ['customer', 'vendor', 'admin'],
        required: true,
        defaultValue: 'customer',
        input: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
})
