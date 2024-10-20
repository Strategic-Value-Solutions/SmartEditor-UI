import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pencil, Trash2 } from 'lucide-react'

type ListViewProps = {
  subStructures: any[]
  handleDeleteButtonClick: (subStructure: any) => void
  handleEditButtonClick: (subStructure: any) => void
}

type ListProps = {
  subStructures: any[]
  handleDeleteButtonClick: (subStructure: any) => void
  handleEditButtonClick: (subStructure: any) => void
  title: string
}

const List = ({
  subStructures,
  handleDeleteButtonClick,
  handleEditButtonClick,
  title,
}: ListProps) => {
  return (
    <div className='mt-4'>
      <h4 className='text-xl font-semibold mb-2'>{title}</h4>
      <Table className='w-full'>
        <TableHeader>
          <TableRow>
            <TableHead>Sub Structure Name</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subStructures.length > 0 ? (
            subStructures.map((subStructure: any, index: any) => (
              <TableRow key={subStructure.id || index}>
                <TableCell className='cursor-pointer text-blue-500 hover:underline'>
                  {subStructure.name}
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <Button
                      variant='outline'
                      className='h-8 w-8 p-1 flex items-center justify-center'
                      onClick={() => handleEditButtonClick(subStructure)}
                    >
                      <Pencil size={15} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteButtonClick(subStructure)}
                      variant='destructive'
                      className='h-8 w-8 p-1 flex items-center justify-center'
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className='text-center py-4 text-gray-500'>
                No subStructures available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

const ListView = ({
  subStructures,
  handleDeleteButtonClick,
  handleEditButtonClick,
}: ListViewProps) => {
  return (
    <>
      <List
        subStructures={subStructures}
        handleDeleteButtonClick={handleDeleteButtonClick}
        handleEditButtonClick={handleEditButtonClick}
        title='Sub Structures'
      />
    </>
  )
}

export default ListView
