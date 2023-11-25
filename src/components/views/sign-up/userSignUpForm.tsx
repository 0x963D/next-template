"use client"

import * as React from "react"
import { useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { toast } from "react-toastify"

import { cn } from "@/lib/shadcn"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/common/icons"

interface UserSignUpFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserSignUpForm = ({ className, ...props }: UserSignUpFormProps): React.JSX.Element => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const firstName = useRef("")
  const lastName = useRef("")
  const email = useRef("")
  const phone = useRef("")
  const password = useRef("")
  const router = useRouter()

  const onSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault()
    setIsLoading(true)

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: firstName.current,
        lastName: lastName.current,
        email: email.current,
        phone: phone.current,
        password: password.current
      })
    }

    const response = await fetch("/api/register", requestOptions)
    const res = await response.json()

    if (res.status === 200) {
      const signInRes = await signIn("credentials", {
        firstName: res.user.firstName,
        lastName: res.user.lastName,
        email: res.user.email,
        phone: res.user.phone,
        password: res.user.password,
        redirect: false
      })
      if (signInRes?.error === null) {
        router.push("/login")
      }
    } else if (res.status === 400) {
      toast.error("Email is already used. Try to Log In instead")
      setTimeout(() => {
        router.push("/sign-in")
      }, 2000)
    } else if (res.status === 500) {
      toast.error("Internal Server Error. Please contact an administrator")
      setTimeout(() => {
        router.push("/sign-up")
      }, 2000)
    }

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  const handleFormSubmit = (event: React.SyntheticEvent): void => {
    onSubmit(event).catch((err) => {
      console.log(err)
    })
  }

  return (
    <div className={cn("grid gap-4", className)} {...props}>
      <form onSubmit={handleFormSubmit}>
        <div className='grid gap-4'>
          <div className='grid gap-4'>
            <div className='flex gap-4'>
              <div className='flex flex-col gap-1'>
                <Label htmlFor='firstName'>First Name</Label>
                <Input
                  required
                  id='firstName'
                  type='test'
                  autoCapitalize='none'
                  autoComplete='name'
                  autoCorrect='off'
                  disabled={isLoading}
                  onChange={(e) => (firstName.current = e.target.value)}
                />
              </div>
              <div className='flex flex-col gap-1'>
                <Label htmlFor='lastName'>Last Name</Label>
                <Input
                  required
                  id='lastName'
                  type='test'
                  autoCapitalize='none'
                  autoComplete='name'
                  autoCorrect='off'
                  disabled={isLoading}
                  onChange={(e) => (lastName.current = e.target.value)}
                />
              </div>
            </div>

            <div className='flex flex-col gap-1'>
              <Label htmlFor='email'>Email address</Label>
              <Input
                required
                id='email'
                type='email'
                autoCapitalize='none'
                autoComplete='email'
                autoCorrect='off'
                disabled={isLoading}
                onChange={(e) => (email.current = e.target.value)}
              />
            </div>

            <div className='flex flex-col gap-1'>
              <Label htmlFor='phone'>Phone number</Label>
              <Input
                required
                id='phone'
                name='phone'
                type='tel'
                maxLength={15}
                autoComplete='tel'
                autoCorrect='off'
                disabled={isLoading}
                onChange={(e) => (phone.current = e.target.value)}
              />
              {/* <PhoneInput
                inputProps={{
                  name: "phone",
                  required: true,
                  autoFocus: true
                }}
                inputClass='text-black'
                dropdownClass='bg-black'
                buttonClass='bg-black'
                searchClass='bg-black'
                enableSearch={true}
                searchPlaceholder='Search country or code'
                country={"us"}
                value={phone.current}
                onChange={(e) => (phone.current = e)}
              /> */}
            </div>
            <div className='flex flex-col gap-1'>
              <Label htmlFor='password'>Password</Label>
              <Input
                required
                id='password'
                type='password'
                autoCapitalize='none'
                autoComplete='new-password'
                autoCorrect='off'
                disabled={isLoading}
                onChange={(e) => (password.current = e.target.value)}
              />
            </div>
          </div>

          <Button disabled={isLoading} variant='white'>
            {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
            CONTINUE
          </Button>
        </div>
      </form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>Or register with</span>
        </div>
      </div>
      <Button
        variant='white'
        type='button'
        disabled={isLoading}
        // onClick={() => signIn("google", { callbackUrl: NEXTAUTH_URL })}
        className='bg-sky-600 hover:bg-sky-600 hover:text-white'
      >
        {isLoading ? (
          <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <Icons.google className='mr-2 h-4 w-4' />
        )}
        Google
      </Button>
      <div className='flex flex-row items-center gap-1'>
        <h1 className='text-xs text-gray-500 font-semibold tracking-tight'>Have an account?</h1>
        <Link className='text-xs text-blue-500 font-semibold tracking-tight hover:underline' href={"/sign-in"}>
          Sign in
        </Link>
      </div>
    </div>
  )
}

export { UserSignUpForm }
