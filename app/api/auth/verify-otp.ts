import bcrypt from "bcryptjs"
import Decimal from "decimal.js"

import prisma from "@/lib/prisma"

const verifyOtp = async (
  otp: string,
  prismaOtpId: string,
  email: string
): Promise<
  | {
      status: number
      success: boolean
      error: string
      data?: undefined
    }
  | {
      status: number
      success: boolean
      data: {
        id: number
        name: string | null
        email: string | null
      }
      error?: undefined
    }
> => {
  try {
    // Fetch the OTP record from the database
    const prismaOtp = await prisma.oneTimePasswords.findUnique({ where: { id: parseInt(prismaOtpId) } })

    if (prismaOtp === null) {
      return { status: 400, success: false, error: "Code not found" }
    }

    // Check if the OTP has expired
    if (new Decimal(Math.floor(Date.now() / 1000)) > prismaOtp.expiresAt) {
      return { status: 400, success: false, error: "Code has expired" }
    }

    // Check if the OTP is for the correct email
    if (prismaOtp.email !== email) {
      return { status: 400, success: false, error: "Invalid email" }
    }

    // Check if the OTPs match
    const otpMatch = await bcrypt.compare(otp, prismaOtp.otp)
    if (!otpMatch) {
      return { status: 400, success: false, error: "Invalid code" }
    }

    // OTP is valid and has not expired, so we can delete it now
    await prisma.oneTimePasswords.delete({ where: { id: parseInt(prismaOtpId) } })

    // Fetch the user from the database
    const prismaUser = await prisma.user.findUnique({ where: { email }, select: { id: true, name: true, email: true } })

    if (prismaUser === null || prismaUser === undefined) {
      return { status: 400, success: false, error: "User not found" }
    }

    // Respond with a success status
    return {
      status: 200,
      success: true,
      data: {
        id: prismaUser.id,
        name: prismaUser.name,
        email: prismaUser.email
      }
    }
  } catch (err) {
    console.error(err)
    return { status: 500, success: false, error: "Could not verify OTP" }
  }
}

export { verifyOtp }
