'use client'

import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { config } from '@/config/config'
import { cn } from '@/lib/utils'
import { paths } from '@/router'
import authApi from '@/service/authApi'
import { setAuth } from '@/store/slices/authSlice'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { useState } from 'react'
import * as React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onGoogleSuccess = async ({ credential }: any) => {
    setIsLoading(true)
    try {
      const response: any = await authApi.loginWithGoogle({ credential })
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
      toast.error('Google Sign In was unsuccessful. Try again later')
    } finally {
      setIsLoading(false)
    }
  }

  const onGoogleFailure = () => {
    toast.error('Google Sign In was unsuccessful. Try again later')
  }

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement email and password login logic
    
    
  }

  return (
    <div className={cn('flex flex-col gap-6 w-full', className)} {...props}>
      <form className='space-y-6' onSubmit={handleEmailSignIn}>
        <div className='space-y-4'>
          <div>
            <Label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </Label>
            <Input
              id='email'
              placeholder='name@example.com'
              type='email'
              autoComplete='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-gray-500 sm:text-sm'
            />
          </div>

          <div>
            <Label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password
            </Label>
            <Input
              id='password'
              placeholder='**********'
              type='password'
              autoComplete='current-password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-gray-500 sm:text-sm'
            />
          </div>

          {/* Forgot Password Link */}
          <div className='flex justify-end'>
            <Link
              to='/forgot-password'
              className='text-sm font-medium text-indigo-600 hover:text-indigo-500'
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button
          type='submit'
          disabled={isLoading}
          className='w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition duration-300'
        >
          {isLoading ? (
            <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            'Sign In with Email'
          )}
        </Button>
      </form>

      <div className='relative my-4'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-white px-2 text-gray-500'>Or continue with</span>
        </div>
      </div>

      <div className='flex justify-center'>
        {isLoading ? (
          <div className='flex items-center gap-2'>
            <p>Signing in ...</p>
            <Icons.spinner className='h-4 w-4 animate-spin' />
          </div>
        ) : (
          <GoogleOAuthProvider clientId={config.google.clientId}>
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={onGoogleFailure}
              logo_alignment='center'
              width={350}
            />
          </GoogleOAuthProvider>
        )}
      </div>
    </div>
  )
}
