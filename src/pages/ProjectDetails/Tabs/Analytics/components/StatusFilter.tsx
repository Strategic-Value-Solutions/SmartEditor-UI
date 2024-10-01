import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const statusOptions = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Working', label: 'Working' },
  { value: 'Completed', label: 'Completed' },
]

interface StatusFilterProps {
  onStatusChange: (value: string) => void
}

const StatusFilter = ({ onStatusChange }: StatusFilterProps) => {
  return (
    <Select multiple onValueChange={(value) => onStatusChange(value)}>
      <SelectTrigger className='w-64'>
        <SelectValue placeholder='Filter by Status' />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default StatusFilter
