import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import imageConstants from '@/constants/imageConstants'
import { paths } from '@/router'
import authApi from '@/service/authApi'
import { AppDispatch } from '@/store'
import { setAuth } from '@/store/slices/authSlice'
import { getErrorMessage } from '@/utils'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Signup = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  })

  const inputs = [
    { name: 'email', type: 'email', placeholder: 'Email', label: 'Email' },
    { name: 'name', type: 'text', placeholder: 'Name', label: 'Full Name' },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      label: 'Password',
    },
    {
      name: 'confirmPassword',
      type: 'password',
      placeholder: 'Confirm Password',
      label: 'Confirm Password',
    },
  ]

  const handleSignup = async () => {
    const { email, password, confirmPassword, name } = formData
    if (!email) {
      toast.error('Please enter your email address')
      return
    }
    if (!password) {
      toast.error('Please enter a password')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (!name) {
      toast.error('Please enter your name')
      return
    }

    // Password strength validation
    const passwordRegex =
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
    if (!passwordRegex.test(password)) {
      toast.error(
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character'
      )
      return
    }

    // Try signup with the API
    try {
      setLoading(true)
      const response = await authApi.signup(formData)
      const { user, tokens } = response
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('accessToken', JSON.stringify(tokens.access))
      localStorage.setItem('refreshToken', JSON.stringify(tokens.refresh))
      dispatch(
        setAuth({
          isAuthenticated: true,
          user,
          accessToken: tokens.access,
          refreshToken: tokens.refresh,
        })
      )
      navigate(paths.projects.path)
    } catch (err) {
      toast.error(getErrorMessage(err)) // Display the error message from the backend
    } finally {
      setLoading(false) // Set loading to false once request completes
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  return (
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
        <div className='relative z-20 mt-auto text-white'>
          <blockquote className='space-y-2'>
            <p className='text-2xl font-bold'>
              &ldquo;Empowering Your Experience&rdquo;
            </p>
            <footer className='text-sm'>Smart Editor</footer>
          </blockquote>
        </div>
      </div>

      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center items-center space-y-6 sm:w-[70%] border rounded-md p-4'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>Sign Up</h1>
            <p className='text-sm text-muted-foreground'>
              Create an account to use our services.
            </p>
          </div>

          <div className='space-y-4 w-full'>
            {inputs.map((input) => (
              <Input
                key={input.name}
                type={input.type}
                name={input.name}
                placeholder={input.placeholder}
                value={formData[input.name]}
                onChange={handleChange}
                required
                className='w-full border rounded-md p-2'
              />
            ))}

            <Button
              className='w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition duration-300'
              onClick={handleSignup}
              disabled={loading} // Disable the button when loading
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>

          <p className='px-8 text-center text-sm text-muted-foreground'>
            By clicking "Create Account", you agree to our{' '}
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

          <p className='text-center text-sm mt-4 text-gray-700'>
            Already have an account?{' '}
            <Link
              to='/auth'
              className='underline underline-offset-4 hover:text-primary text-gray-900'
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
