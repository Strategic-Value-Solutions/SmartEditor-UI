import { UserAuthForm } from './use-auth-form'
import imageConstants from '@/constants/imageConstants'
import { Link, useNavigate } from 'react-router-dom'

export const metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.',
}

export default function Auth() {
  const navigate = useNavigate()

  const redirectToLandingPage = () => {
    navigate('/')
  }

  return (
    <>
      <div className='container relative hidden h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div
          className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'
          style={{
            backgroundImage: `url(${imageConstants.logo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div
            className='relative z-20 flex items-center text-lg font-medium cursor-pointer'
            onClick={redirectToLandingPage}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='mr-2 h-6 w-6'
            >
              <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
            </svg>
            Smart Editor
          </div>
          <div className='relative z-20 mt-auto text-white'>
            <blockquote className='space-y-2'>
              <p className='text-2xl font-bold'>
                &ldquo;Digitize the way of work&rdquo;
              </p>
              <footer className='text-sm'>Smart Editor</footer>
            </blockquote>
          </div>
        </div>
        <div className='lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center items-center space-y-6 sm:w-[70%] border rounded-md p-4'>
            <div className='flex flex-col space-y-2 text-center'>
              <h1 className='text-2xl font-semibold tracking-tight'>Login</h1>
              <p className='text-sm text-muted-foreground'>
                Login to use the Services
              </p>
            </div>
            <UserAuthForm />
            <p className='px-8 text-center text-sm text-muted-foreground'>
              By clicking continue, you agree to our{' '}
              <Link
                to='/terms'
                className='underline underline-offset-4 hover:text-primary'
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                to='/privacy'
                className='underline underline-offset-4 hover:text-primary'
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
