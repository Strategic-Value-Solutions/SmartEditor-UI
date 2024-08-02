import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Grid2X2, List } from 'lucide-react'
import { useContext } from 'react'
import { ProjectDataContext } from '../../store/ProjectDataContext' // Ensure the path is correct
import ExtFileComponent from '../ExtFileComponent'
import { Input } from '../ui/input'

const MainLandingPageComponent = () => {
  // Use useContext to access the projects data from context
  const { projectsData } = useContext(ProjectDataContext)

  if (!projectsData) {
    // Show a loading spinner or similar indicator while the data is being loaded
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent'></div>
      </div>
    )
  }

  return (
    <div className='mt-2 flex flex-col'>
      <div className='ml-1 flex w-full flex-row justify-between'>
        <p className='ml-4 flex h-8 flex-col pb-1 text-2xl'>Projects</p>
        <div className='flex flex-row justify-end gap-2'>
          <Input placeholder='Search project...'  className='w-[20vw]'/>
          <Tabs
            orientation='vertical'
            defaultValue='overview'
            className='space-y-4'
          >
            <div className='w-full overflow-x-auto pb-2'>
              <TabsList>
                <TabsTrigger value='overview'>
                  {' '}
                  <List />
                </TabsTrigger>
                <TabsTrigger value='analytics'>
                  {' '}
                  <Grid2X2 />
                </TabsTrigger>
              </TabsList>
            </div>
            {/* <TabsContent value='overview' className='space-y-4'></TabsContent> */}
          </Tabs>
        </div>
      </div>
      <div className='mt-2 inline-flex flex-row flex-wrap gap-2 overflow-hidden'>
        {projectsData.map((project: any, index: any) => (
          <ExtFileComponent
            filename={project.title}
            createdAt={project.edition}
            key={project.id || index} // It's better to use unique identifiers when available
          />
        ))}
        {projectsData.map((project: any, index: any) => (
          <ExtFileComponent
            filename={project.title}
            createdAt={project.edition}
            key={project.id || index} // It's better to use unique identifiers when available
          />
        ))}
        {projectsData.map((project: any, index: any) => (
          <ExtFileComponent
            filename={project.title}
            createdAt={project.edition}
            key={project.id || index} // It's better to use unique identifiers when available
          />
        ))}
        {projectsData.map((project: any, index: any) => (
          <ExtFileComponent
            filename={project.title}
            createdAt={project.edition}
            key={project.id || index} // It's better to use unique identifiers when available
          />
        ))}
        {projectsData.map((project: any, index: any) => (
          <ExtFileComponent
            filename={project.title}
            createdAt={project.edition}
            key={project.id || index} // It's better to use unique identifiers when available
          />
        ))}
      
      </div>
    </div>
  )
}

export default MainLandingPageComponent
