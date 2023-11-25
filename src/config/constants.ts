export const IS_PRODUCTION = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true"
export const PRODUCTION_CANONICAL_URL = process.env.NEXT_PUBLIC_PRODUCTION_CANONICAL_URL ?? ""
// ! Authentication
export const NEXTAUTH_URL = process.env.NEXTAUTH_URL ?? ""
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET ?? ""
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? ""
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? ""

// ! Email
export const EMAIL_SERVER = process.env.EMAIL_SERVER ?? ""
export const EMAIL_FROM = process.env.EMAIL_FROM ?? ""

// ! Access keys
export const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN ?? ""
