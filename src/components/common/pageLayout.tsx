import React, { type ReactElement } from "react"

import { TailwindIndicator } from "@/components/common/tailwind-indicator"
import { HeaderView } from "@/components/views/header"

const PageLayout = ({ children }: { children: ReactElement }): ReactElement => {
  return (
    <React.Fragment>
      <main>
        <div className='relative flex min-h-screen flex-col'>
          <HeaderView />
          <div className='overflow-hidden pt-16 lg:pt-20 flex-1'>{children}</div>
        </div>
        <TailwindIndicator />
      </main>
    </React.Fragment>
  )
}

export default PageLayout
