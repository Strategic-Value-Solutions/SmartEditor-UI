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
  templates: any[]
  handleDeleteButtonClick: (template: any) => void
  handleEditButtonClick: (template: any) => void
  handleShowTemplateEditor: (template: any) => void
}

type ListProps = {
  templates: any[]
  handleDeleteButtonClick: (template: any) => void
  handleEditButtonClick: (template: any) => void
  handleShowTemplateEditor: (template: any) => void
  title: string
}

const List = ({
  templates,
  handleDeleteButtonClick,
  handleEditButtonClick,
  title,
  handleShowTemplateEditor,
}: ListProps) => {
  return (
    <div className='mt-4'>
      <h4 className='text-xl font-semibold mb-2'>{title}</h4>
      <Table className='w-full'>
        <TableHeader>
          <TableRow>
            <TableHead>Template Name</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.length > 0 ? (
            templates.map((template: any, index: any) => (
              <TableRow key={template.id || index}>
                <TableCell
                  onClick={() => handleShowTemplateEditor(template)}
                  className='cursor-pointer text-blue-500 hover:underline'
                >
                  {template.name}
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <Button
                      variant='outline'
                      className='h-8 w-8 p-1 flex items-center justify-center'
                      onClick={() => handleEditButtonClick(template)}
                    >
                      <Pencil size={15} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteButtonClick(template)}
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
                No templates available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

const ListView = ({
  templates,
  handleDeleteButtonClick,
  handleEditButtonClick,
  handleShowTemplateEditor,
}: ListViewProps) => {
  return (
    <>
      <List
        templates={templates}
        handleDeleteButtonClick={handleDeleteButtonClick}
        handleEditButtonClick={handleEditButtonClick}
        title='Templates'
      />
    </>
  )
}

export default ListView
