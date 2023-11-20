import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/common/icons"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm = ({ className, ...props }: UserAuthFormProps): React.JSX.Element => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(event: React.SyntheticEvent): Promise<void> {
    event.preventDefault()
    setIsLoading(true)

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
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleFormSubmit}>
        <div className='grid gap-2'>
          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='email'>
              Email
            </Label>
            <Input
              id='email'
              placeholder='name@example.com'
              type='email'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>Or continue with</span>
        </div>
      </div>
      <Button variant='outline' type='button' disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <Icons.google className='mr-2 h-4 w-4' />
        )}
        Google
      </Button>
      <Button variant='outline' type='button' disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <Icons.gitHub className='mr-2 h-4 w-4' />
        )}
        Github
      </Button>
    </div>
  )
}

export { UserAuthForm }
