import Joi from 'joi'

// Define a schema to validate the environment variables
const envSchema = Joi.object({
  VITE_API_ROOT: Joi.string().uri().required(),
  VITE_GOOGLE_CLIENT_ID: Joi.string().required(),
  VITE_GOOGLE_CLIENT_SECRET: Joi.string().required(),
}).unknown()

const envVars = {
  VITE_API_ROOT: import.meta.env.VITE_API_ROOT,
  VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  VITE_GOOGLE_CLIENT_SECRET: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
}

// Validate the environment variables against the schema
const { error, value: validatedEnv } = envSchema.validate(envVars)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export const config = {
  api: {
    url: validatedEnv.VITE_API_ROOT,
  },
  google: {
    clientId: validatedEnv.VITE_GOOGLE_CLIENT_ID,
    clientSecret: validatedEnv.VITE_GOOGLE_CLIENT_SECRET,
  },
}
