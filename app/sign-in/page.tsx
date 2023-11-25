import { type Metadata } from "next"

import SignInView from "@/components/views/sign-in"

export const metadata: Metadata = {
  title: "New Yolk - Sign In"
}

const SignInPage = (): JSX.Element => {
  return <SignInView />
}

export default SignInPage
