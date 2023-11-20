import * as React from "react"
import Link from "next/link"

import type { NavItem } from "@/types/nav"
import { cn } from "@/lib/utils"

interface MainNavProps {
  items: NavItem[]
}

export function MainNav({ items }: MainNavProps): React.JSX.Element {
  return (
    <div className='flex gap-4 md:gap-8'>
      <nav className={cn("flex items-center space-x-4 lg:space-x-6")}>
        {items?.map(
          (item, index) =>
            item.href != null && (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                  item.disabled === true && "cursor-not-allowed opacity-80"
                )}
              >
                {item.title}
              </Link>
            )
        )}
      </nav>
    </div>
  )
}
