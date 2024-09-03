import { HeroCards } from './HeroCards'
import { Button } from './ui/button'
import { buttonVariants } from './ui/button'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { Link } from 'react-router-dom'

export const Hero = () => {
  return (
    <section className='container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10 relative'>
      <div className='text-center lg:text-start space-y-6'>
        <main className='text-5xl md:text-6xl font-bold'>
          <h1 className='inline'>
            <span className='inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text'>
              Shadcn
            </span>{' '}
            landing page
          </h1>{' '}
          for{' '}
          <h2 className='inline'>
            <span className='inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text'>
              React
            </span>{' '}
            developers
          </h2>
        </main>

        <p className='text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0'>
          Build your React landing page effortlessly with the required sections
          to your project.
        </p>
      </div>

      {/* Hero cards sections */}
      <div className='z-10'>
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className='shadow'></div>
    </section>
  )
}
