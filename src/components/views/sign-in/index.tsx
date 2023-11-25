import { UserSignInForm } from "@/components/views/sign-in/userSignInForm"

const SignInView = (): JSX.Element => {
  return (
    <div className='border px-8 py-12 rounded-xl w-96'>
      <UserSignInForm />
    </div>
  )
}

export { SignInView }
