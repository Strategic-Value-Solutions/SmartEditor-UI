import React, { useContext } from 'react';
import { Box, CircularProgress } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GridViewIcon from '@mui/icons-material/GridView';
import ExtFileComponent from '../ExtFileComponent';
import { ProjectDataContext } from '../../ProjectDataContext'; // Ensure the path is correct

const MainLandingPageComponent = () => {
  // Use useContext to access the projects data from context
  const { projectsData } = useContext(ProjectDataContext);

  if (!projectsData) {
    // Show a loading spinner or similar indicator while the data is being loaded
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" marginTop="10px" marginLeft="150px">
      <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%" marginLeft="50px">
        <Box display="flex" flexDirection="column" paddingBottom="5px" marginLeft="20px" height="30px">
          <Box>Recent</Box>
          <Box display="flex" flexDirection="row" width="20px">
            <Box>Sort</Box>
            <KeyboardArrowDownIcon />
          </Box>
        </Box>
        <Box display="flex" flexDirection="row" gap="10px" justifyContent="flex-end">
          <FormatListBulletedIcon />
          <GridViewIcon />
        </Box>
      </Box>
      <Box display="inline-flex" flexDirection="row" gap="10px" marginTop="10px" flexWrap="wrap" maxWidth="1200px" marginLeft="60px" marginRight="100px" overflow="hidden">
        {projectsData.map((project, index) => (
          <ExtFileComponent
            filename={project.title}
            createdAt={project.edition}
            key={project.id || index}  // It's better to use unique identifiers when available
          />
        ))}
      </Box>
    </Box>
  );
};

export default MainLandingPageComponent;
