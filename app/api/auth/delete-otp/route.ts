import { type NextRequest } from "next/server"
import Decimal from "decimal.js"

import prisma from "@/lib/prisma"

export async function POST(req: NextRequest): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ status: 405, success: false, error: "Method not allowed 🤯" })
  }

  const payload = (await req.json()) as { otpId: number }

  if (payload === null) {
    return Response.json({ status: 400, success: false, error: "No payload 🤯" })
  }

  try {
    // Fetch the OTP record from the database
    const prismaOtp = await prisma.oneTimePasswords.findUnique({ where: { id: payload.otpId } })

    if (prismaOtp === null) {
      return Response.json({ status: 400, success: false, error: "Invalid code 🤯" })
    }

    // Check if the OTP has expired
    if (new Decimal(Date.now()) < prismaOtp.expiresAt) {
      return Response.json({ status: 400, success: false, error: "Code didn't expire yet 🤯" })
    }

    // OTP is valid and has not expired, so we can delete it now
    await prisma.oneTimePasswords.delete({ where: { id: payload.otpId } })

    // Respond with a success status
    return Response.json({ status: 200, success: true })
  } catch (err) {
    console.error(err)
    return Response.json({ status: 500, success: false, error: "Could not delete code 🤯" })
  }
}
