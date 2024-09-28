import { Button } from '@/components/ui/button'
import { useState } from 'react'

const Index = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const toggleOption = (option: string) => {
    setSelectedOptions((prevSelected) =>
      prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option)
        : [...prevSelected, option]
    )
  }

  const options = ['Pending', 'Working', 'Completed']

  return (
    <div className='flex flex-col items-center gap-6 p-6'>
      <h2 className='text-xl font-semibold text-gray-800'>Choose Options</h2>

      <div className='flex flex-col gap-3'>
        {options.map((option) => (
          <Button
            key={option}
            onClick={() => toggleOption(option)}
            className={`w-48 py-2 px-4 rounded-md text-lg font-medium transition-colors duration-300 ${
              selectedOptions.includes(option)
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {option}
          </Button>
        ))}
      </div>

      <div className='mt-6'>
        <p className='text-gray-600 text-md'>Selected Options:</p>
        {selectedOptions.length > 0 ? (
          <ul className='mt-2 flex flex-col gap-1 text-lg font-medium'>
            {selectedOptions.map((opt) => (
              <li key={opt} className='text-gray-800'>
                {opt}
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-gray-500 mt-2'>No options selected.</p>
        )}
      </div>
    </div>
  )
}

export default Index
