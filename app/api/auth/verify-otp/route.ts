import { type NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import Decimal from "decimal.js"

import prisma from "@/lib/prisma"

export async function POST(req: NextRequest): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ status: 405, success: false, error: "Method not allowed 🤯" })
  }

  const payload = (await req.json()) as { otp: string; email: string }

  if (payload === null) {
    return Response.json({ status: 400, success: false, error: "No payload 🤯" })
  }

  try {
    const hashedOtp = await bcrypt.hash(payload.otp.toString(), 10)

    // Fetch the OTP record from the database
    const prismaOtp = await prisma.oneTimePasswords.findUnique({ where: { otp: hashedOtp } })

    if (prismaOtp === null) {
      return Response.json({ status: 400, success: false, error: "Invalid code 🤯" })
    }

    // Check if the OTP has expired
    if (new Decimal(Date.now()) > prismaOtp.expiresAt) {
      return Response.json({ status: 400, success: false, error: "Code has expired 🤯" })
    }

    // Check if the OTP is for the correct email
    if (prismaOtp.email !== payload.email) {
      return Response.json({ status: 400, success: false, error: "Invalid email 🤯" })
    }

    // Check if the OTPs match
    const otpMatch = await bcrypt.compare(payload.otp.toString(), prismaOtp.otp)
    if (!otpMatch) {
      return Response.json({ status: 400, success: false, error: "Invalid code 🤯" })
    }

    // OTP is valid and has not expired, so we can delete it now
    await prisma.oneTimePasswords.delete({ where: { otp: payload.otp } })

    // Respond with a success status
    return Response.json({ status: 200, success: true })
  } catch (err) {
    console.error(err)
    return Response.json({ status: 500, success: false, error: "Could not verify code 🤯" })
  }
}
