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
  superStructures: any[]
  handleDeleteButtonClick: (superStructure: any) => void
  handleEditButtonClick: (superStructure: any) => void
  handleCardClick: (superStructure: any) => void
}

type ListProps = {
  superStructures: any[]
  handleDeleteButtonClick: (superStructure: any) => void
  handleEditButtonClick: (superStructure: any) => void
  handleCardClick: (superStructure: any) => void
  title: string
}

const List = ({
  superStructures,
  handleDeleteButtonClick,
  handleEditButtonClick,
  title,
  handleCardClick,
}: ListProps) => {
  return (
    <div className='mt-4'>
      <h4 className='text-xl font-semibold mb-2'>{title}</h4>
      <Table className='w-full'>
        <TableHeader>
          <TableRow>
            <TableHead>Super Structure Name</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {superStructures.length > 0 ? (
            superStructures.map((superStructure: any, index: any) => (
              <TableRow key={superStructure.id || index}>
                <TableCell
                  className='cursor-pointer text-blue-500 hover:underline'
                  onClick={() => handleCardClick(superStructure)}
                >
                  {superStructure.name}
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <Button
                      variant='outline'
                      className='h-8 w-8 p-1 flex items-center justify-center'
                      onClick={() => handleEditButtonClick(superStructure)}
                    >
                      <Pencil size={15} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteButtonClick(superStructure)}
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
                No superStructures available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

const ListView = ({
  superStructures,
  handleDeleteButtonClick,
  handleEditButtonClick,
  handleCardClick,
}: ListViewProps) => {
  return (
    <>
      <List
        handleCardClick={handleCardClick}
        superStructures={superStructures}
        handleDeleteButtonClick={handleDeleteButtonClick}
        handleEditButtonClick={handleEditButtonClick}
        title='Super Structures'
      />
    </>
  )
}

export default ListView
