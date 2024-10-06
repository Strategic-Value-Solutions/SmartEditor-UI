import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import authApi from '@/service/authApi'
import { getErrorMessage } from '@/utils'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleForgotPassword = async () => {
    try {
      if (!email) {
        toast.error('Please enter your email address')
        return
      }
      setLoading(true)
      await authApi.forgotPassword({ email })
      navigate('/auth')
      toast.success('Password reset link sent!')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container flex justify-center items-center h-screen'>
      <div className='border p-6 rounded-lg shadow-md w-full max-w-md bg-white'>
        <h2 className='text-2xl font-bold text-gray-800 text-center mb-6'>
          Forgot Password
        </h2>
        <div className='space-y-4'>
          <Input
            type='email'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none'
          />
          <Button
            className='w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition duration-300'
            onClick={handleForgotPassword}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </div>
        <p className='text-center text-sm text-gray-500 mt-4'>
          Remembered your password?{' '}
          <Link to='/auth' className='underline text-gray-900'>
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
