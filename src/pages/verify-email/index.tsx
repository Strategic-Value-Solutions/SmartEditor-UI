import { Button } from '@/components/ui/button'
import { paths } from '@/router'
import authApi from '@/service/authApi'
import { AppDispatch, RootState } from '@/store'
import { setUser } from '@/store/slices/authSlice'
import { getErrorMessage } from '@/utils'
import { Mail } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

// Memoized EmailVerification component to prevent unnecessary re-renders
const EmailVerification = React.memo(() => {
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const [isResent, setIsResent] = useState(false)
  const [timer, setTimer] = useState(0) // Timer state
  const location = useLocation() // Get current location to check for query params
  const token = new URLSearchParams(location.search).get('token') // Get 'token' from query params
  const navigate = useNavigate()
  // Function to handle resend email logic
  const handleResend = useCallback(async () => {
    try {
      setLoading(true)
      await authApi.sendVerificationEmail() // Invoke the resend verification email API
      setIsResent(true) // Set the resend status
      toast.success('Verification email resent successfully!') // Show success toast
      setTimer(30) // Start the 30-second countdown
    } catch (error) {
      toast.error(getErrorMessage(error)) // Handle error
    } finally {
      setLoading(false)
    }
  }, [])

  // Function to handle email verification logic
  const handleVerification = useCallback(async () => {
    try {
      setLoading(true)
      const query = `?token=${token}` // Build the query with the token
      await authApi.verifyEmail(query) // Call API to verify the email using the token
      dispatch(
        setUser({
          ...user,
          isEmailVerified: true,
        })
      )
      navigate(paths.projects.path)
      toast.success('Email verified successfully!')
    } catch (error) {
      toast.error(getErrorMessage(error)) // Handle error
    } finally {
      setLoading(false)
    }
  }, [token])

  // Effect to trigger resend email on first load if there's no token
  useEffect(() => {
    if (!token) {
      handleResend() // Resend email only on the first load when token is absent
    }
  }, [token, handleResend])

  // Effect to handle countdown for the timer
  useEffect(() => {
    if (timer > 0) {
      setIsResent(false) // Reset the resend status
      const countdown = setTimeout(() => setTimer(timer - 1), 1000)
      return () => clearTimeout(countdown) // Cleanup the timer
    }
  }, [timer])

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4'>
      <div className='bg-white p-6 rounded-lg shadow-md w-full max-w-md'>
        <div className='text-center'>
          <Mail className='h-12 w-12 text-blue-500 mx-auto mb-4' />
          <h1 className='text-2xl font-bold mb-2'>Verify Your Email</h1>
          <p className='text-gray-600 mb-4'>
            {token
              ? 'Click the button below to verify your email.'
              : 'We have sent a verification email to your inbox. Please check your email and click the verification link to complete your registration.'}
          </p>

          {token ? (
            // Show "Verify" button if token is present
            <Button
              onClick={handleVerification}
              disabled={loading}
              className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500 transition duration-300'
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>
          ) : (
            // Show resend button if token is not present
            <>
              {!isResent ? (
                <Button
                  onClick={handleResend}
                  className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500 transition duration-300'
                  disabled={timer > 0 || loading} // Disable button during countdown
                >
                  {loading
                    ? 'Sending...'
                    : timer > 0
                      ? `Resend Email in ${timer}s`
                      : 'Resend Verification Email'}
                </Button>
              ) : (
                <div className='text-green-600 text-sm'>
                  Verification email resent!
                </div>
              )}

              <p className='text-gray-500 text-sm mt-4'>
                Didn't receive the email? Be sure to check your spam folder or{' '}
                <Button
                  onClick={handleResend}
                  variant='link'
                  className='text-blue-600 underline hover:no-underline'
                  disabled={timer > 0} // Disable link during countdown
                >
                  try resending
                </Button>
                .
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
})

export default EmailVerification
