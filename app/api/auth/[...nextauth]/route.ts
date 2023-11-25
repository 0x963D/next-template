import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { type Session, type SessionStrategy, type User } from "next-auth"
import { type Adapter } from "next-auth/adapters"
import { type JWT } from "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
import Email, { type EmailConfig } from "next-auth/providers/email"
import Google, { type GoogleProfile } from "next-auth/providers/google"

import { EMAIL_FROM, EMAIL_SERVER, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET } from "@/config/constants"
// import { login } from "@/lib/auth"
import prisma from "@/lib/prisma"

import sendVerificationRequest from "../email-link"
import { verifyOtp } from "../verify-otp"

export const authOptions = {
  secret: NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma) as Adapter,
  // Configure one or more authentication providers
  providers: [
    Email({
      server: EMAIL_SERVER,
      from: EMAIL_FROM,
      async sendVerificationRequest({
        identifier,
        url,
        provider
      }: {
        identifier: string
        url: string
        provider: EmailConfig
      }) {
        const prismaUser = await prisma.user.findUnique({
          where: {
            email: identifier
          }
        })

        if (prismaUser !== null) {
          sendVerificationRequest({
            identifier,
            url,
            provider
          }).catch((error: Error) => {
            console.error("SEND_VERIFICATION_EMAIL_ERROR", identifier, error)
          })
        }
      }
    }),
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      async profile(profile: GoogleProfile) {
        const response: {
          id: string
          firstName: string
          lastName: string
          name: string
          email: string
          email_verified: boolean
          image: string
          role: string
        } = {
          id: profile.sub,
          firstName: profile.given_name,
          lastName: profile.family_name,
          name: profile.name,
          email: profile.email,
          email_verified: profile.email_verified,
          image: profile.picture,
          role: "user"
        }

        return response
      }
    }),
    Credentials({
      credentials: {
        // Add your OTP credential field here
        otp: { label: "OTP", type: "text", value: "", placeholder: "" },
        email: { label: "Email", type: "text", value: "", placeholder: "" },
        prismaOtpId: { label: "Prisma OTP ID", type: "text", value: "", placeholder: "" }
      },
      authorize: async (credentials) => {
        if (credentials !== undefined) {
          // Check if the OTP is valid
          const response = await verifyOtp(credentials.otp, credentials.prismaOtpId, credentials.email)

          // Handle response and return user data if successful
          if (response.success && response.data !== undefined) {
            return {
              id: response.data.id.toString(),
              name: response.data.name,
              email: response.data.email
            }
          } else {
            throw new Error("Code verification failed 🤯")
          }
        } else {
          throw new Error("Code missing 🤯")
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user }: { user: User }) {
      if (user.email !== null) {
        const prismaUser = await prisma.user.findUnique({
          where: {
            email: user.email
          }
        })
        if (prismaUser !== null) {
          return true
        }
      }
      return false
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      const prismaUser = await prisma.user.findUnique({
        where: {
          email: session.user.email
        }
      })

      if (prismaUser !== null) {
        session.user = prismaUser
      }

      return session
    }
  },
  session: {
    strategy: "jwt" as SessionStrategy
  },
  pages: {
    signIn: "/sign-in",
    signUp: "/sign-up"
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
