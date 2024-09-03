//@ts-nocheck
import { customStyles } from './constants'
import { TourProvider, useTour } from '@reactour/tour'

const TourProviderComponent = ({ children }: any) => {
  const { setIsOpen, isOpen, steps } = useTour()
  const handleStoreTourCompletion = () => {
    localStorage.setItem('tourCompleted', 'true')
    setIsOpen(false)
  }

  return (
    <TourProvider steps={steps} styles={customStyles}>
      {children}
    </TourProvider>
  )
}

export default TourProviderComponent
