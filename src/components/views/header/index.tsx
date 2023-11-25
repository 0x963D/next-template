"use client"

import React, { useEffect, useState } from "react"
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
  const { status } = useSession()
  const [, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = (): void => {
      const isScrolled = window.scrollY > 0
      setScrolled(isScrolled)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background'>
      <div className='border-b'>
        <div className='flex h-16 items-center px-4'>
          <Link href='/' className='flex items-center space-x-2'>
            <Icons.logo className='h-6 w-6' />
          </Link>
          <MainNav items={siteConfig.mainNav} />

          {status === "authenticated" && (
            <React.Fragment>
              <TeamSwitcher className='mx-4' />
            </React.Fragment>
          )}
          <div className='ml-auto flex items-center space-x-4 '>
            <ThemeToggle />
            {status === "authenticated" ? (
              <UserNav />
            ) : (
              <div className='ml-auto flex items-center space-x-4 '>
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
                <Link href='/sign-up'>
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
