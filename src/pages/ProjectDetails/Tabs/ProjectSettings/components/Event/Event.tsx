import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'

const Index = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const options = [
    { value: 'send-mail', label: 'Send Mail' },
    { value: 'post-data', label: 'Post Data' },
    { value: 'generate-report', label: 'Generate Report' },
  ]

  const handleSelectOption = (value: string) => {
    setSelectedOptions(
      (prevSelected) =>
        prevSelected.includes(value)
          ? prevSelected.filter((item) => item !== value) // Remove if already selected
          : [...prevSelected, value] // Add if not selected
    )
  }

  return (
    <div className='flex flex-col items-center gap-6 p-6'>
      <h2 className='text-xl font-semibold text-gray-800'>Choose Actions</h2>

      <div className='w-64'>
        <Select onValueChange={handleSelectOption}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select actions' />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Display selected options as chips */}
      <div className='mt-6'>
        <p className='text-gray-600 text-md'>Selected Options:</p>
        {selectedOptions.length > 0 ? (
          <div className='mt-2 flex flex-wrap gap-2'>
            {selectedOptions.map((opt) => (
              <div
                key={opt}
                className='flex items-center gap-2 bg-gray-200 rounded-full px-4 py-2 text-gray-800 text-sm font-medium'
              >
                {options.find((o) => o.value === opt)?.label}
                <Button
                  variant='ghost'
                  className='ml-2 text-gray-500 hover:text-gray-800'
                  onClick={() => handleSelectOption(opt)}
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-gray-500 mt-2'>No options selected.</p>
        )}
      </div>
    </div>
  )
}

export default Index
