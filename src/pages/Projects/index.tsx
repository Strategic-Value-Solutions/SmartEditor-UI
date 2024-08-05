import { ProjectDataContext } from '@/store/ProjectDataContext'
import { useContext } from 'react'
import ProjectCard from './components/ProjectCard'
import Header from './components/Header'

const Projects = () => {
  const { projectsData } = useContext(ProjectDataContext)

  return (
    <div className='flex flex-col'>
      <h3 className='ml-3 flex h-8 flex-col pb-1 text-2xl'>Projects</h3>
      <Header />
      <div className='mt-4 inline-flex flex-row flex-wrap gap-2 overflow-hidden'>
        {projectsData.map((project: any, index: any) => (
          <ProjectCard
            filename={project.title}
            createdAt={project.edition}
            key={project.id || index}
          />
        ))}
        {projectsData.map((project: any, index: any) => (
          <ProjectCard
            filename={project.title}
            createdAt={project.edition}
            key={project.id || index}
          />
        ))}
        {projectsData.map((project: any, index: any) => (
          <ProjectCard
            filename={project.title}
            createdAt={project.edition}
            key={project.id || index}
          />
        ))}
        {projectsData.map((project: any, index: any) => (
          <ProjectCard
            filename={project.title}
            createdAt={project.edition}
            key={project.id || index}
          />
        ))}
        {projectsData.map((project: any, index: any) => (
          <ProjectCard
            filename={project.title}
            createdAt={project.edition}
            key={project.id || index}
          />
        ))}
      </div>
    </div>
  )
}

export default Projects
