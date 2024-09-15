import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table'
import { PROJECT_ACCESS_ROLES } from '@/Tours/constants'
import { Button } from '@/components/ui/button'
import StatusCapsule from '@/components/ui/status-capsule'
import { Pencil, Trash2 } from 'lucide-react'

type ListViewProps = {
  inProgressProjects: any[]
  draftProjects: any[]
  completedProjects: any[]
  sharedProjects: any[]
  handleRedirectToProjectModelScreen: (project: any) => void
  handleDeleteButtonClick: (project: any) => void
  handleEditButtonClick: (project: any) => void
}

type ListProps = {
  projects: any[]
  handleRedirectToProjectModelScreen: (project: any) => void
  handleDeleteButtonClick: (project: any) => void
  handleEditButtonClick: (project: any) => void
  title: string
}

const List = ({
  projects,
  handleRedirectToProjectModelScreen,
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
            <TableHead>Project Name</TableHead>
            <TableHead>Client Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Permission</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length > 0 ? (
            projects.map((project: any, index: any) => (
              <TableRow key={project.id || index}>
                <TableCell
                  onClick={() => handleRedirectToProjectModelScreen(project)}
                  className='cursor-pointer text-blue-500 hover:underline'
                >
                  {project.name}
                </TableCell>
                <TableCell>{project.clientName || 'N/A'}</TableCell>
                <TableCell>
                  <StatusCapsule status={project.status} />
                </TableCell>
                <TableCell>
                  {project.permission || PROJECT_ACCESS_ROLES.OWNER}
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <Button
                      variant='outline'
                      className='h-8 w-8 p-1 flex items-center justify-center'
                      onClick={() => handleEditButtonClick(project)}
                    >
                      <Pencil size={15} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteButtonClick(project)}
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
                No projects available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

const ListView = ({
  inProgressProjects,
  draftProjects,
  completedProjects,
  sharedProjects,
  handleRedirectToProjectModelScreen,
  handleDeleteButtonClick,
  handleEditButtonClick,
}: ListViewProps) => {
  return (
    <>
      <List
        projects={inProgressProjects}
        handleRedirectToProjectModelScreen={handleRedirectToProjectModelScreen}
        handleDeleteButtonClick={handleDeleteButtonClick}
        handleEditButtonClick={handleEditButtonClick}
        title='In Progress'
      />

      {sharedProjects.length > 0 && (
        <List
          projects={sharedProjects}
          handleRedirectToProjectModelScreen={
            handleRedirectToProjectModelScreen
          }
          handleDeleteButtonClick={handleDeleteButtonClick}
          handleEditButtonClick={handleEditButtonClick}
          title='Shared'
        />
      )}

      <List
        projects={draftProjects}
        handleRedirectToProjectModelScreen={handleRedirectToProjectModelScreen}
        handleDeleteButtonClick={handleDeleteButtonClick}
        handleEditButtonClick={handleEditButtonClick}
        title='Draft'
      />

      <List
        projects={completedProjects}
        handleRedirectToProjectModelScreen={handleRedirectToProjectModelScreen}
        handleDeleteButtonClick={handleDeleteButtonClick}
        handleEditButtonClick={handleEditButtonClick}
        title='Completed'
      />
    </>
  )
}

export default ListView
