import { type Metadata } from "next"

import SignUpView from "@/components/views/sign-up"

export const metadata: Metadata = {
  title: "New Yolk - Sign Up"
}

const SignUpPage = (): JSX.Element => {
  return <SignUpView />
}

export default SignUpPage
