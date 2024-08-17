'use client'

import { Icons } from '@/components/ui/icons'
import { config } from '@/config/config'
import { cn } from '@/lib/utils'
import authApi from '@/service/authApi'
import { setAuth } from '@/store/slices/authSlice'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { useState } from 'react'
import * as React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)

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
      navigate('/projects')
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }
  const onGoogleFailure = () => {
    console.log('Google Sign In was unsuccessful. Try again later')
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      {/* <form onSubmit={onSubmit}>
        <div className='grid gap-2'>
          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='email'>
              Email
            </Label>
            <Input
              id='email'
              placeholder='name@example.com'
              type='email'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              disabled={isLoading}
            />
          </div>
          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='password'>
              Password
            </Label>
            <Input
              id='password'
              placeholder='**********'
              type='text'
              autoCapitalize='none'
              autoCorrect='off'
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            Sign In
          </Button>
        </div>
      </form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>
            Or continue with
          </span>
        </div>
      </div> */}

      <div className='w-full'>
        {isLoading ? (
          <div className='flex items-center justify-center gap-2'>
            <p>Signing in ...</p>
            <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
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
