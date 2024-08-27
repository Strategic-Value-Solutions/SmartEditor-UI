import { Statistics } from './Statistics'
import imageConstants from '@/constants/imageConstants'

export const About = () => {
  return (
    <section id='about' className='container '>
      <div className='bg-muted/50 border rounded-lg py-12'>
        <div className='px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12'>
          <img
            src={imageConstants.pilot}
            alt='Company team at work'
            className='w-[300px] object-contain rounded-lg'
          />
          <div className='bg-green-0 flex flex-col justify-between'>
            <div className='pb-6'>
              <h2 className='text-3xl md:text-4xl font-bold'>
                <span className='bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text'>
                  About{' '}
                </span>
                Our Company
              </h2>
              <p className='text-xl text-muted-foreground mt-4'>
                We are pioneers in creating cutting-edge tools that empower
                architects and engineers to bring their visions to life. Our
                mission is to streamline the design process, offering innovative
                solutions that enhance efficiency and precision in every
                project.
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  )
}
