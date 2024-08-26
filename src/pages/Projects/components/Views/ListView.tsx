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

const ListView = ({
  inProgressProjects,
  draftProjects,
  completedProjects,
  handleClick,
  handleDeleteButtonClick,
  handleEditButtonClick,
}: {
  inProgressProjects: any[]
  draftProjects: any[]
  completedProjects: any[]
  handleClick: (project: any) => void
  handleDeleteButtonClick: (project: any) => void
  handleEditButtonClick: (project: any) => void
}) => {
  return (
    <>
      <div className='mt-4'>
        <h4 className='text-xl font-semibold'>In Progress</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inProgressProjects.length > 0 ? (
              inProgressProjects.map((project: any, index: any) => (
                <TableRow key={project.id || index}>
                  <TableCell
                    onClick={() => handleClick(project)}
                    className='cursor-pointer'
                  >
                    {project.name}
                  </TableCell>
                  <TableCell className='flex items-center justify-end gap-2'>
                    <Button
                      variant='outline'
                      className='h-6 rounded p-1'
                      onClick={() => handleEditButtonClick(project)}
                    >
                      <Pencil size={15} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteButtonClick(project)}
                      variant='destructive'
                      className='h-6 rounded bg-red-400 p-1'
                    >
                      <Trash2 size={15} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>No projects in progress.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='mt-4'>
        <h4 className='text-xl font-semibold'>Draft</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {draftProjects.length > 0 ? (
              draftProjects.map((project: any, index: any) => (
                <TableRow key={project.id || index}>
                  <TableCell
                    onClick={() => handleClick(project)}
                    className='cursor-pointer'
                  >
                    {project.name}
                  </TableCell>
                  <TableCell className='flex items-center justify-end gap-2'>
                    <Button
                      variant='outline'
                      className='h-6 rounded p-1'
                      onClick={() => handleEditButtonClick(project)}
                    >
                      <Pencil size={15} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteButtonClick(project)}
                      variant='destructive'
                      className='h-6 rounded bg-red-400 p-1'
                    >
                      <Trash2 size={15} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>No draft projects.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='mt-4'>
        <h4 className='text-xl font-semibold'>Completed</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {completedProjects.length > 0 ? (
              completedProjects.map((project: any, index: any) => (
                <TableRow key={project.id || index}>
                  <TableCell
                    onClick={() => handleClick(project)}
                    className='cursor-pointer'
                  >
                    {project.name}
                  </TableCell>
                  <TableCell className='flex items-center justify-end gap-2'>
                    <Button
                      variant='outline'
                      className='h-6 rounded p-1'
                      onClick={() => handleEditButtonClick(project)}
                    >
                      <Pencil size={15} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteButtonClick(project)}
                      variant='destructive'
                      className='h-6 rounded bg-red-400 p-1'
                    >
                      <Trash2 size={15} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>No completed projects.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default ListView
