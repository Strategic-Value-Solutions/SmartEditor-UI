//@ts-nocheck
import { Button } from '@/components/ui/Button'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/Select'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Pencil } from 'lucide-react'
import React, { useState } from 'react'

const ProjectAccess = () => {
  const [collaborators, setCollaborators] = useState([
    {
      name: 'John Doe',
      email: 'john@example.com',
      projects: [
        { name: 'Project A', access: 'Read', totalPages: 10, pageAccess: [] },
        { name: 'Project B', access: 'Write', totalPages: 5, pageAccess: [] },
      ],
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      projects: [
        { name: 'Project C', access: 'Write', totalPages: 7, pageAccess: [] },
      ],
    },
  ])
  const [selectedCollaboratorIndex, setSelectedCollaboratorIndex] = useState(0)
  const [selectedPages, setSelectedPages] = useState([])
  const [currentProjectIndex, setCurrentProjectIndex] = useState(null)
  const [lastClickedPage, setLastClickedPage] = useState(null)

  const handlePageClick = (page) => {
    if (lastClickedPage !== null && lastClickedPage !== page) {
      const start = Math.min(lastClickedPage, page)
      const end = Math.max(lastClickedPage, page)
      const range = Array.from({ length: end - start + 1 }, (_, i) => start + i)
      const newSelectedPages = [...new Set([...selectedPages, ...range])]
      setSelectedPages(newSelectedPages)
    } else {
      if (selectedPages.includes(page)) {
        setSelectedPages(selectedPages.filter((p) => p !== page))
      } else {
        setSelectedPages([...selectedPages, page])
      }
    }
    setLastClickedPage(page)
  }

  const handleSavePages = () => {
    if (selectedCollaboratorIndex !== null && currentProjectIndex !== null) {
      const updatedCollaborators = [...collaborators]
      updatedCollaborators[selectedCollaboratorIndex].projects[
        currentProjectIndex
      ].pageAccess = selectedPages
      setCollaborators(updatedCollaborators)
      setSelectedPages([])
      setCurrentProjectIndex(null)
      setLastClickedPage(null)
    }
  }

  const handleProjectAccessChange = (projectIndex, newAccess) => {
    const updatedCollaborators = [...collaborators]
    updatedCollaborators[selectedCollaboratorIndex].projects[
      projectIndex
    ].access = newAccess
    setCollaborators(updatedCollaborators)
  }

  const handleCollaboratorSelect = (index) => {
    setSelectedCollaboratorIndex(index)
    setCurrentProjectIndex(null)
    setSelectedPages([])
  }

  const selectedCollaborator = collaborators[selectedCollaboratorIndex]

  return (
    <div className='flex flex-col lg:flex-row h-full bg-gray-100 dark:bg-gray-900'>
      {/* Sidebar: Vertical Tab Bar */}
      <div className='w-full lg:w-1/4 bg-white dark:bg-gray-800 p-4'>
        <h3 className='text-md font-semibold text-gray-700 dark:text-gray-300 mb-4'>
          Collaborators
        </h3>
        <ul className='space-y-2'>
          {collaborators.map((collaborator, index) => (
            <li key={index}>
              <Button
                className={`w-full h-8 text-left p-2 rounded-md ${
                  selectedCollaboratorIndex === index
                    ? 'bg-gray-400 dark:bg-gray-700 text-white font-semibold border-dotted shadow-2xl'
                    : 'dark:text-gray-300'
                }`}
                onClick={() => handleCollaboratorSelect(index)}
              >
                {collaborator.name}
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content: Project Details */}
      <div className='w-full lg:w-3/4 p-4 lg:p-6'>
        <h2 className='text-lg font-medium text-gray-700 dark:text-gray-300 mb-4'>
          Project Access - {selectedCollaborator.name}
        </h2>
        <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>
          {selectedCollaborator.email}
        </p>

        <div className='bg-white dark:bg-gray-800 p-4 rounded-lg overflow-x-auto'>
          <Table className='min-w-full dark:bg-gray-800'>
            <TableHeader>
              <TableRow>
                <TableHead className='dark:text-gray-300'>
                  Project Name
                </TableHead>
                <TableHead className='dark:text-gray-300'>
                  Access Level
                </TableHead>
                <TableHead className='dark:text-gray-300'>Edit Pages</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedCollaborator.projects.map((project, projectIndex) => (
                <TableRow key={projectIndex} className='dark:border-gray-700'>
                  <TableCell className='dark:text-gray-300'>
                    {project.name}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={project.access}
                      onValueChange={(value) =>
                        handleProjectAccessChange(projectIndex, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue className='dark:text-gray-300'>
                          {project.access}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className='dark:bg-gray-700'>
                        <SelectItem value='Read'>Read</SelectItem>
                        <SelectItem value='Write'>Write</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className='flex h-8 items-center justify-center gap-2 p-2 dark:bg-gray-700 dark:text-gray-300'
                          onClick={() => {
                            setSelectedPages(project.pageAccess)
                            setCurrentProjectIndex(projectIndex)
                          }}
                        >
                          <Pencil className='w-3 h-3 mr-1' />
                          Edit Pages
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='bg-white dark:bg-gray-800 p-4 rounded-lg '>
                        <DialogClose className='absolute right-2 top-2'>
                          <span className='sr-only'>Close</span>
                        </DialogClose>
                        <h3 className='text-md font-semibold mb-4 dark:text-gray-300'>
                          Edit Page Access - {project.name}
                        </h3>
                        <div className='flex flex-wrap gap-2'>
                          {Array.from(
                            { length: project.totalPages },
                            (_, i) => (
                              <Button
                                key={i}
                                className={`p-1 w-8 border rounded text-sm ${
                                  selectedPages.includes(i + 1)
                                    ? 'bg-blue-200 dark:bg-blue-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                                onClick={() => handlePageClick(i + 1)}
                              >
                                {i + 1}
                              </Button>
                            )
                          )}
                        </div>
                        <div className='flex justify-end space-x-2 mt-4'>
                          <Button
                            className='flex h-8 items-center justify-center gap-2 p-2 dark:bg-blue-700 dark:text-gray-300'
                            onClick={handleSavePages}
                          >
                            Save Changes
                          </Button>
                          <DialogClose asChild>
                            <Button className='flex h-8 items-center justify-center gap-2 p-2 dark:bg-gray-700 dark:text-gray-300'>
                              Cancel
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default ProjectAccess
