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
  attributes: {
    field1: string
    field2: string
    field3: string
  }
  lastUpdate: string
  associatedConfigs: any[]
}

interface ProjectDataContextProps {
  modelConfigurationsData: Config[]
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
    return storedProjectsData ? JSON.parse(storedProjectsData) : []
  })

  const [name, setProjectName] = useState<string>(() => {
    const storedProjectName = localStorage.getItem('name')
    return storedProjectName ? JSON.parse(storedProjectName) : ''
  })

  const [modelConfigurationsData, setConfigsData] = useState<Config[]>(() => {
    const storedConfigsData = localStorage.getItem('modelConfigurationsData')
    return storedConfigsData ? JSON.parse(storedConfigsData) : []
  })

  useEffect(() => {
    localStorage.setItem('modelConfigurationsData', JSON.stringify(modelConfigurationsData))
    localStorage.setItem('projectsData', JSON.stringify(projectsData))
    localStorage.setItem('name', JSON.stringify(name))
  }, [modelConfigurationsData, projectsData, name])

  const value: ProjectDataContextProps = {
    modelConfigurationsData,
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
