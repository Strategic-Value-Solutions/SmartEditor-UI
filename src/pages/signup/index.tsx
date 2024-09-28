// Signup.tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = async () => {
    // TODO: Handle sign-up logic, including sending verification email
    console.log('Signup with Email:', email)
    console.log('Signup with Password:', password)

    // Example: Call API to register and send verification email
    // await signupUser({ email, password });
    // await sendVerificationEmail(email);
  }

  return (
    <div className='container flex justify-center items-center h-screen'>
      <div className='border p-6 rounded-md w-full max-w-md'>
        <h2 className='text-2xl font-semibold text-center mb-4'>Sign Up</h2>
        <div className='space-y-4'>
          <Input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button className='w-full' onClick={handleSignup}>
            Create Account
          </Button>
        </div>
        <p className='text-center text-sm text-muted mt-4'>
          Already have an account?{' '}
          <Link to='/login' className='underline'>
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
