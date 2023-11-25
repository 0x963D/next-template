import crypto from "crypto"
import { type NextRequest } from "next/server"
import bcryptjs from "bcryptjs"

import { EMAIL_FROM, EMAIL_SERVER } from "@/config/constants"
import prisma from "@/lib/prisma"

import sendOneTimePassword from "../email-otp"

export async function POST(req: NextRequest): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ status: 405, success: false, error: "Method not allowed" })
  }

  const payload = (await req.json()) as { email: string }

  if (payload === null) {
    return Response.json({ status: 400, success: false, error: "Payload is missing" })
  }

  // Generate a six digit number using the crypto module
  const otp = crypto.randomInt(100000, 999999)

  // Hash the OTP
  const hashedOtp = await bcryptjs.hash(otp.toString(), 10)

  try {
    // Update the user's OTP in the database
    const prismaOtp = await prisma.oneTimePasswords.create({
      data: {
        email: payload.email,
        otp: hashedOtp,
        expiresAt: Math.floor(Date.now() / 1000) + 30 // OTP expires in 30 seconds
      }
    })

    // Send the OTP to the user
    await sendOneTimePassword({
      to: payload.email,
      otp: otp.toString(),
      provider: {
        server: EMAIL_SERVER,
        from: EMAIL_FROM
      }
    })

    // Respond with a success status
    return Response.json({ status: 200, success: true, data: prismaOtp })
  } catch (err) {
    console.error(err)
    return Response.json({ status: 500, success: false, error: "Could not send verification code" })
  }
}
