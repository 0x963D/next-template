import { type Metadata } from "next"

import Section from "@/components/common/section"
import { SignInView } from "@/components/views/sign-in"

export const metadata: Metadata = {
  title: "New Yolk - Sign in"
}

const SignInPage = (): JSX.Element => {
  return (
    <Section>
      <div className='items-center justify-center flex'>
        <SignInView />
      </div>
    </Section>
  )
}

export default SignInPage
