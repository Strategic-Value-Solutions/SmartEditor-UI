//@ts-nocheck
import { Separator } from '../ui/separator'
import { About } from './components/About'
import { Features } from './components/Features'
import Hero from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Services } from './components/Services'
import { ChevronUp } from 'lucide-react'
import moment from 'moment'
import { useRef } from 'react'

const Landing = () => {
  const scrollableDivRef = useRef(null)

  const scrollTop = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div
      ref={scrollableDivRef}
      className='overflow-y-scroll h-screen hide-scrollbar'
    >
      <Hero />
      <About />
      <HowItWorks />
      <Features />
      <Services />
      <Separator />
      <div className='mt-7 flex flex-col items-center justify-center gap-4 py-12'>
        <p className='text-muted-foreground text-sm'>
          © {moment().format('YYYY')} Stratvals. All rights reserved.
        </p>
      </div>
      <button
        onClick={scrollTop}
        className={`fixed bottom-6 right-6 p-3 rounded-full bg-gray-600 text-white shadow-lg hover:bg-gray-700 transition-opacity duration-300`}
        style={{ zIndex: 1000 }}
        aria-label='Scroll to top'
      >
        <ChevronUp size={24} className='text-white' />
      </button>
    </div>
  )
}

export default Landing
