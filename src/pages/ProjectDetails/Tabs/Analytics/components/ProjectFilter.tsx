import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ProjectFilterProps {
  analytics: any
  onFilterChange: (value: string) => void
}

const ProjectFilter = ({ analytics, onFilterChange }: ProjectFilterProps) => {
  return (
    <Select onValueChange={(value) => onFilterChange(value)}>
      <SelectTrigger className='w-56'>
        <SelectValue placeholder='Filter by Project' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='All'>All</SelectItem>
        {analytics &&
          Object.keys(analytics).map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  )
}

export default ProjectFilter
