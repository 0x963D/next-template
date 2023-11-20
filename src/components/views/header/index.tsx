import Link from "next/link"
import { signIn, useSession } from "next-auth/react"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/common/icons"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { MainNav } from "@/components/views/header/mainNav"

import { TeamSwitcher } from "./teamSwitcher"
import { UserNav } from "./userNav"

const HeaderView = (): JSX.Element => {
  const { data: session } = useSession()
  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background'>
      <div className='border-b'>
        <div className='flex h-16 items-center px-4'>
          <Link href='/' className='flex items-center space-x-2'>
            <Icons.logo className='h-6 w-6' />
          </Link>
          <TeamSwitcher className='mx-4' />
          <MainNav items={siteConfig.mainNav} />
          <div className='ml-auto flex items-center space-x-4 '>
            <ThemeToggle />
            {session !== null ? (
              <UserNav />
            ) : (
              <div className='ml-auto flex items-center space-x-4 '>
                {/* <Link href='/auth/login'> */}
                <Button
                  variant={"outline"}
                  onClick={() => {
                    signIn().catch((err) => {
                      console.log(err)
                    })
                  }}
                >
                  Log In
                </Button>
                {/* </Link> */}
                <Link href='/signup'>
                  <Button>Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export { HeaderView }
