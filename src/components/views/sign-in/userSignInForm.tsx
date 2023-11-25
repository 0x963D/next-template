"use client"

import * as React from "react"
import { useEffect, useRef, useState, type ChangeEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type OneTimePasswords } from "@prisma/client"
import { AlertCircle, Edit } from "lucide-react"
import { signIn, type SignInResponse } from "next-auth/react"
import { toast } from "react-toastify"

import { NEXTAUTH_URL, PRODUCTION_CANONICAL_URL } from "@/config/constants"
import upsertData from "@/lib/api/upsertData"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/common/icons"
import Loading from "@/components/common/loading"

const UserSignInForm = (): JSX.Element => {
  const router = useRouter()
  const [resendLoading, setResendLoading] = useState<boolean>(false)
  const [verifyLoading, setVerifyLoading] = useState<boolean>(false)
  const [emailLoading, setEmailLoading] = useState<boolean>(false)
  const [googleLoading, setGoogleLoading] = useState<boolean>(false)
  const [verifyError, setVerifyError] = useState<boolean>(false)
  const [otpExpired, setOtpExpired] = useState<boolean>(false)
  const [otpSent, setOtpSent] = useState<boolean>(false)
  const [otpCountdown, setOtpCountdown] = useState<number>(0)
  const [prismaOtp, setPrismaOtp] = useState<OneTimePasswords>()

  const [otpInputs, setOtpInputs] = useState<string[]>(Array(6).fill(""))
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(6).fill(null))

  const email = useRef("")
  // const password = useRef("")

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const generateMagicLink = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault()
    setEmailLoading(true)

    const res: SignInResponse | undefined = await signIn("email", {
      email: email.current,
      redirect: false,
      callbackUrl: NEXTAUTH_URL
    })

    if (res?.error === "EmailSignin" && res.url === null) {
      toast.error("Email not found, please sign up.")
    }
  }

  const generateOtp = (): void => {
    setOtpInputs(Array(6).fill(""))
    inputRefs.current[0]?.focus()
    setVerifyError(false)
    setVerifyLoading(false)
    setResendLoading(true)
    // Fetch OTP from the server
    upsertData({
      url: "/api/auth/generate-otp",
      method: "POST",
      payload: {
        email: email.current
      }
    })
      .then((res) => {
        if (res.success === true) {
          setPrismaOtp(res.data as OneTimePasswords)
          setOtpCountdown(30)
          setOtpSent(true)
          setOtpExpired(false)
          setResendLoading(false)
          const interval = setInterval(() => {
            setOtpCountdown((prevCountdown) => prevCountdown - 1)
          }, 1000)

          setTimeout(() => {
            clearInterval(interval)
            setEmailLoading(false)
            setOtpExpired(true)
            deleteOtp(res.data.id).catch((err) => {
              console.log(err)
            })
          }, 30000)
        } else {
          toast.error(res.error)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const deleteOtp = async (prismaOtpId: number): Promise<void> => {
    upsertData({
      url: "/api/auth/delete-otp",
      method: "POST",
      payload: {
        otpId: prismaOtpId
      }
    }).catch((err) => {
      console.log(err)
      toast.error(err.error)
    })
  }

  const handleFormSubmit = (event: React.SyntheticEvent): void => {
    event.preventDefault()
    generateOtp()
  }

  const handleGoogleSignIn = (): void => {
    setGoogleLoading(true)
    signIn("google", { callbackUrl: NEXTAUTH_URL }).catch((err) => {
      console.log(err)
    })
  }

  useEffect(() => {
    // Focus on the first input when the component mounts
    inputRefs.current[0]?.focus()
  }, [])

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>): void => {
    // If backspace is pressed and the current input is empty, move to the previous input and select its content
    if (event.key === "Backspace") {
      if (otpInputs[index] === "") {
        inputRefs.current[index - 1]?.focus()
      }
    }

    // if right arrow is pressed, move to the next input
    if (event.key === "ArrowRight") {
      inputRefs.current[index + 1]?.focus()
    }

    // if left arrow is pressed, move to the previous input
    if (event.key === "ArrowLeft") {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value

    // Update the corresponding input value in the state
    setOtpInputs((prevInputs) => {
      const newInputs = [...prevInputs]
      newInputs[index] = value
      return newInputs
    })

    // Move focus to the next input
    if (index < 5 && value !== "") {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleEditClick = (): void => {
    setOtpSent(false)
    setEmailLoading(false)
    setOtpInputs(Array(6).fill(""))
  }

  const handleResendClick = (): void => {
    if (otpExpired) generateOtp()
  }

  useEffect(() => {
    const handleSignIn = async (otp: string): Promise<void> => {
      if (prismaOtp === undefined) return
      await signIn("credentials", {
        prismaOtpId: prismaOtp.id.toString(),
        otp,
        email: email.current,
        redirect: false,
        callbackUrl: NEXTAUTH_URL
      })
        .catch((err) => {
          console.log(err)
        })
        .then((res) => {
          console.log("🚀 ~ file: userSignInForm.tsx:150 ~ handleSignIn ~ res:", res)
          if (res?.ok === true) {
            router.push("/")
          } else {
            setVerifyError(true)
            toast.error(res?.error)
            setVerifyLoading(false)
          }
        })
    }
    // when all the inputs are filled, validate the OTP
    if (otpInputs.every((input) => input !== "")) {
      const otp = otpInputs.join("")
      setVerifyLoading(true)
      setVerifyError(false)
      handleSignIn(otp).catch((err) => {
        console.error(err)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpInputs, prismaOtp])

  return (
    <div className='flex flex-col gap-8'>
      {!otpSent ? (
        <React.Fragment>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight'>Sign in</h1>
            <h1 className='text-sm text-gray-500 font-semibold tracking-tight'>
              to continue to {PRODUCTION_CANONICAL_URL.slice(8)}
            </h1>
          </div>
          <div className={"grid gap-4"}>
            <form onSubmit={handleFormSubmit}>
              <div className='grid gap-4'>
                <div className='grid gap-4'>
                  <div className='flex flex-col gap-1'>
                    <Label htmlFor='email'>Email address</Label>
                    <Input
                      id='email'
                      type='email'
                      autoCapitalize='none'
                      autoComplete='email'
                      autoCorrect='off'
                      disabled={emailLoading}
                      onChange={(e) => (email.current = e.target.value)}
                    />
                  </div>
                  {/* <div className='flex flex-col gap-1'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  autoCapitalize='none'
                  autoComplete='current-password'
                  autoCorrect='off'
                  disabled={emailLoading}
                  onChange={(e) => (password.current = e.target.value)}
                />
              </div> */}
                </div>
                <Button disabled={emailLoading} variant='white'>
                  {emailLoading && (
                    <div className='flex justify-between'>
                      <Loading width='16' height='16' />
                    </div>
                  )}
                  <span className='ml-2'>CONTINUE</span>
                </Button>
              </div>
            </form>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>Or authenticate with</span>
              </div>
            </div>
            <Button
              variant='white'
              type='button'
              disabled={googleLoading}
              onClick={handleGoogleSignIn}
              className='bg-[#4285F4] hover:bg-[#4285F4] hover:text-white'
            >
              {googleLoading ? (
                <div className='flex justify-between'>
                  <Loading width='16' height='16' />
                </div>
              ) : (
                <Icons.google className='mr-2 h-4 w-4' />
              )}
              <span className='ml-2'>Google</span>
            </Button>
            <div className='flex flex-row items-center gap-1'>
              <h1 className='text-xs text-gray-500 font-semibold tracking-tight'>No account?</h1>
              <Link className='text-xs text-blue-500 font-semibold tracking-tight hover:underline' href={"/sign-up"}>
                Sign up
              </Link>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <div className='flex flex-col gap-8'>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight'>Check your email</h1>
            <h1 className='text-sm text-gray-500 font-semibold tracking-tight'>
              to continue to {PRODUCTION_CANONICAL_URL.slice(8)}
            </h1>
          </div>
          <div className='border rounded-2xl p-2 flex justify-between items-center w-2/3 px-4'>
            <h1 className='text-sm  text-gray-500 font-semibold tracking-tight'>{email.current}</h1>
            <Edit className='w-4 h-4 text-blue-500 hover:cursor-pointer hover:opacity-80' onClick={handleEditClick} />
          </div>
          <div>
            <h1 className='text-sm font-semibold tracking-tight'>Verification code</h1>
            <h1 className='text-xs text-gray-500 font-semibold tracking-tight '>
              Enter the verification code sent to your email address
            </h1>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex gap-2 items-center'>
              {otpInputs.map((input, index) => (
                <input
                  key={index}
                  onKeyDown={(event) => {
                    handleKeyDown(index, event)
                  }}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type='string'
                  className={`w-8 h-8 text-center border-b-4 rounded bg-transparent text-white focus:outline-none ${
                    input !== "" && "border-blue-500"
                  } ${verifyError && "border-red-600 "} ${verifyLoading && "opacity-50"}`}
                  disabled={verifyLoading}
                  maxLength={1}
                  value={input}
                  onChange={(event) => {
                    handleInputChange(index, event)
                  }}
                />
              ))}
              {verifyLoading && <Loading width='20' height='20' />}
            </div>
            {verifyError && (
              <div className='flex gap-1'>
                <AlertCircle className='w-4 h-4 text-red-600' />
                <h1 className='text-xs font-semibold tracking-tight text-red-600'>Incorrect code</h1>
              </div>
            )}
          </div>

          <div className='flex gap-2 items-center'>
            <h1
              className={`text-xs font-semibold tracking-tight text-blue-500 cursor-default ${
                otpExpired && "hover:cursor-pointer hover:underline"
              } ${!otpExpired && "opacity-50"}`}
              onClick={handleResendClick}
            >
              Did not receive a code? Resend {otpCountdown > 0 && `(${otpCountdown})`}
            </h1>
            {resendLoading && <Loading width='16' height='16' />}
          </div>

          <h1
            className='text-xs font-semibold tracking-tight cursor-pointer hover:underline text-blue-500'
            onClick={handleEditClick}
          >
            Use another method
          </h1>
        </div>
      )}
    </div>
  )
}

export { UserSignInForm }
