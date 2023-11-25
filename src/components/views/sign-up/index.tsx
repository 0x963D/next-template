import { PRODUCTION_CANONICAL_URL } from "@/config/constants"
import { UserSignUpForm } from "@/components/views/sign-up/userSignUpForm"

const SignUpView = (): JSX.Element => {
  return (
    <div className='border px-8 py-12 rounded-xl'>
      <div className='flex flex-col gap-8'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Create your account</h1>
          <h1 className='text-sm text-gray-500 font-semibold tracking-tight'>
            to continue to {PRODUCTION_CANONICAL_URL.slice(8)}
          </h1>
        </div>
        <UserSignUpForm />
      </div>
    </div>
  )
}

export { SignUpView }
