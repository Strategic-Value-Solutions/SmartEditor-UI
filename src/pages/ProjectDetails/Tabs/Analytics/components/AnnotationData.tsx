import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import React from 'react'

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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default AnnotationData
