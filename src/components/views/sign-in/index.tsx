import Section from "@/components/common/section"
import { UserSignInForm } from "@/components/views/sign-in/userSignInForm"

const SignInView = (): JSX.Element => {
  return (
    <Section crosses>
      <div className='items-center justify-center flex'>
        <div className='border px-8 py-12 rounded-xl w-96'>
          <UserSignInForm />
        </div>
      </div>
    </Section>
  )
}

export default SignInView 
