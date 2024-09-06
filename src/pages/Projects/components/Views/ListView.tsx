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
      <h4 className='text-xl font-semibold'>{title}</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length > 0 ? (
            projects.map((project: any, index: any) => (
              <TableRow key={project.id || index}>
                <TableCell
                  onClick={() => handleRedirectToProjectModelScreen(project)}
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
        <>
          <List
            projects={sharedProjects}
            handleRedirectToProjectModelScreen={
              handleRedirectToProjectModelScreen
            }
            handleDeleteButtonClick={handleDeleteButtonClick}
            handleEditButtonClick={handleEditButtonClick}
            title='Shared'
          />
        </>
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
