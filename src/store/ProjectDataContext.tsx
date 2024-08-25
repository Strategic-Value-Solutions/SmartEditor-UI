/* eslint-disable react/prop-types */
import { createContext, useEffect, useState, ReactNode } from 'react'

interface Project {
  id: number
  title: string
  client: string
  project_type: string
  edition: string
  version: string
  sequence_number: string
  description: string
  span: string
  pick: string
}

interface Config {
  id: number
  modelName: string
  mcc: string
  fieldsData: {
    field1: string
    field2: string
    field3: string
  }
  lastUpdate: string
  associatedConfigs: any[]
}

interface ProjectDataContextProps {
  configsData: Config[]
  setConfigsData: React.Dispatch<React.SetStateAction<Config[]>>
  projectsData: Project[]
  setProjectsData: React.Dispatch<React.SetStateAction<Project[]>>
  name: string
  setProjectName: React.Dispatch<React.SetStateAction<string>>
}

const ProjectDataContext = createContext<ProjectDataContextProps | any>(
  undefined
)

interface ProviderProps {
  children: ReactNode
}

const ProjectDataContextProvider = ({ children }: ProviderProps) => {
  const [projectsData, setProjectsData] = useState<Project[]>(() => {
    const storedProjectsData = localStorage.getItem('projectsData')
    return storedProjectsData
      ? JSON.parse(storedProjectsData)
      : [
          {
            id: 101,
            title: 'Project 1',
            client: 'Client 1',
            project_type: 'Type 1',
            edition: 'Edition 1',
            version: '1.0',
            sequence_number: '123',
            description: 'Description for Project 1',
            span: 'Span 1',
            pick: 'Pick 1',
          },
          {
            id: 102,
            title: 'Project 2',
            client: 'Client 2',
            project_type: 'Type 2',
            edition: 'Edition 2',
            version: '2.0',
            sequence_number: '456',
            description: 'Description for Project 2',
            span: 'Span 2',
            pick: 'Pick 2',
          },
        ]
  })

  const [name, setProjectName] = useState<string>(() => {
    const storedProjectName = localStorage.getItem('name')
    return storedProjectName ? JSON.parse(storedProjectName) : ''
  })

  const [configsData, setConfigsData] = useState<Config[]>(() => {
    const storedConfigsData = localStorage.getItem('configsData')
    return storedConfigsData ? JSON.parse(storedConfigsData) : []
  })

  useEffect(() => {
    localStorage.setItem('configsData', JSON.stringify(configsData))
    localStorage.setItem('projectsData', JSON.stringify(projectsData))
    localStorage.setItem('name', JSON.stringify(name))
  }, [configsData, projectsData, name])

  const value: ProjectDataContextProps = {
    configsData,
    setConfigsData,
    projectsData,
    setProjectsData,
    name,
    setProjectName,
  }

  return (
    <ProjectDataContext.Provider value={value}>
      {children}
    </ProjectDataContext.Provider>
  )
}

export { ProjectDataContext, ProjectDataContextProvider }
