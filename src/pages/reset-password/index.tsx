import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// For showing success/error messages
import authApi from '@/service/authApi'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

// Assuming you have an API service to handle auth

const ResetPassword = () => {
  const location = useLocation() // To access the query string
  const token = new URLSearchParams(location.search).get('token') // Extract the token from query string
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error('Both password fields are required')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (!token) {
      toast.error('Reset token is missing')
      return
    }

    try {
      setLoading(true)
      // Call the API to reset the password with the token and new password
      const data = { password }
      await authApi.resetPassword(`?token=${token}`, data)
      toast.success('Password reset successfully')
      navigate('/auth')
    } catch (error) {
      toast.error('Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container flex justify-center items-center h-screen'>
      <div className='border p-6 rounded-md w-full max-w-md'>
        <h2 className='text-2xl font-semibold text-center mb-4'>
          Reset Password
        </h2>
        <div className='space-y-4'>
          <Input
            type='password'
            placeholder='Enter new password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type='password'
            placeholder='Confirm new password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button
            className='w-full'
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? 'Setting New Password...' : 'Set New Password'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
