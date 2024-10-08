import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const AnnotationData = ({ analyticsData }: { analyticsData: any }) => {
  return (
    <div className='w-full'>
      <p className='text-lg font-medium'>Pick 6 Data</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='text-left'>Project</TableHead>
            <TableHead className='text-left'>Component</TableHead>
            <TableHead className='text-left'>Type</TableHead>
            <TableHead className='text-left'>Inspector Name</TableHead>
            <TableHead className='text-left'>Status</TableHead>
            {analyticsData?.[0]?.projectModel?.attributes?.map(
              (attribute: any) => (
                <TableHead className='text-left'>{attribute.name}</TableHead>
              )
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {analyticsData.map((data: any) => (
            <TableRow key={data.id}>
              <TableCell className='text-left'>
                {data?.projectModel?.project?.name}
              </TableCell>
              <TableCell className='text-left'>
                {data.pickModelComponent.name}
              </TableCell>
              <TableCell className='text-left'>
                {data?.pickModelComponent?.pickModel?.type}
              </TableCell>
              <TableCell className='text-left'>{data.createdBy.name}</TableCell>
              <TableCell className='text-left'>{data.status}</TableCell>
              {data?.projectModel?.attributes?.map((attribute: any) => (
                <TableCell className='text-left'>{attribute.value}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default AnnotationData
