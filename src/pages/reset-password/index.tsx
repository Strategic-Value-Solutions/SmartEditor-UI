import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import authApi from '@/service/authApi'
import Joi from 'joi'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const ResetPassword = () => {
  const location = useLocation()
  const token = new URLSearchParams(location.search).get('token')
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Define Joi schema for password validation
  const passwordSchema = Joi.object({
    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(
        new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])')
      )
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password cannot be longer than 30 characters',
        'string.pattern.base':
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match',
    }),
  })

  const handleResetPassword = async () => {
    const { error } = passwordSchema.validate(
      { password, confirmPassword },
      { abortEarly: false }
    )

    if (error) {
      error.details.forEach((err) => toast.error(err.message))
      return
    }

    if (!token) {
      toast.error('Reset token is missing')
      return
    }

    try {
      setLoading(true)
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
