import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'

type ListViewProps = {
  configurations: any[]
  handleDeleteButtonClick: (configuration: any) => void
  handleEditButtonClick: (configuration: any) => void
  handleShowConfigurationEditor: (configuration: any) => void
}

type ListProps = {
  configurations: any[]
  handleDeleteButtonClick: (configuration: any) => void
  handleEditButtonClick: (configuration: any) => void
  handleShowConfigurationEditor: (configuration: any) => void
  title: string
}

const List = ({
  configurations,
  handleDeleteButtonClick,
  handleEditButtonClick,
  title,
  handleShowConfigurationEditor,
}: ListProps) => {
  return (
    <div className='mt-4'>
      <h4 className='text-xl font-semibold mb-2'>{title}</h4>
      <Table className='w-full'>
        <TableHeader>
          <TableRow>
            <TableHead>Model Configuration Name</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {configurations.length > 0 ? (
            configurations.map((configuration: any, index: any) => (
              <TableRow key={configuration.id || index}>
                <TableCell
                  onClick={() => handleShowConfigurationEditor(configuration)}
                  className='cursor-pointer text-blue-500 hover:underline'
                >
                  {configuration.modelName}
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <Button
                      variant='outline'
                      className='h-8 w-8 p-1 flex items-center justify-center'
                      onClick={() => handleEditButtonClick(configuration)}
                    >
                      <Pencil size={15} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteButtonClick(configuration)}
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
                No model configurations available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

const ListView = ({
  configurations,
  handleDeleteButtonClick,
  handleEditButtonClick,
  handleShowConfigurationEditor,
}: ListViewProps) => {
  return (
    <>
      <List
        configurations={configurations}
        handleDeleteButtonClick={handleDeleteButtonClick}
        handleEditButtonClick={handleEditButtonClick}
        title='Model Configurations'
        handleShowConfigurationEditor={handleShowConfigurationEditor}
      />
    </>
  )
}

export default ListView
