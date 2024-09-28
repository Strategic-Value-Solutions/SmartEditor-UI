// ResetPassword.tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

const ResetPassword = () => {
  const { token } = useParams() // Assuming the reset token is in the URL
  const [password, setPassword] = useState('')

  const handleResetPassword = async () => {
    // TODO: Handle password reset with token and new password
    console.log('Reset Password Token:', token)
    console.log('New Password:', password)

    // Example: Call API to reset the password
    // await resetPassword({ token, password });
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
          <Button className='w-full' onClick={handleResetPassword}>
            Set New Password
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
