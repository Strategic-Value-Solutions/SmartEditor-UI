import MainLandingPageComponent from '@/components/home/MainLandingPageComponent'
import { useState } from 'react'
const HomePage = () => {
  const [currentPath, setCurrentPath] = useState('Dashboard')

  const onClickPath = (path: any) => {
    setCurrentPath(path)
  }

  return (
    // <Box display='flex' flexDirection='column' width={'100%'}>
    //   {/* <HeaderHome onClickPath={onClickPath} /> */}
    //   <Box display='flex' flexDirection='row' width={'100%'}>
    //     {/* <Leftsidebar /> */}
    //     {/* <Divider orientation='vertical' flexItem /> */}
    //     {currentPath === 'Dashboard' && }
    //     {currentPath === 'ManageTemplates' && <Template />}
    //   </Box>
    // </Box>
    <MainLandingPageComponent />
    // <AppShell />
  )
}

export default HomePage
