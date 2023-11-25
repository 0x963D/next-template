import { type Metadata } from "next"

import Section from "@/components/common/section"
import { SignUpView } from "@/components/views/sign-up"

export const metadata: Metadata = {
  title: "New Yolk - Sign Up"
}
const SignUpPage = (): JSX.Element => {
  return (
    <Section crosses>
      <div className='items-center justify-center flex'>
        <SignUpView />
      </div>
    </Section>
  )
}

export default SignUpPage
