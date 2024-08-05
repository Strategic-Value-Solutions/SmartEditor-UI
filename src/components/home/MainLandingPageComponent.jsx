// src/components/MainLandingPageComponent/MainLandingPageComponent.js
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GridViewIcon from "@mui/icons-material/GridView";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import ExtFileComponent from "../ExtFileComponent";

const MainLandingPageComponent = () => {
  // Use useSelector to access the projects data from Redux store
  const projectsData = useSelector((state) => state.project.projectsData || []);

  if (!Array.isArray(projectsData) || projectsData.length === 0) {
    // Show a loading spinner or similar indicator while the data is being loaded
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      marginTop="10px"
      marginLeft="150px"
    >
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        width="100%"
        marginLeft="50px"
      >
        <Box
          display="flex"
          flexDirection="column"
          paddingBottom="5px"
          marginLeft="20px"
          height="30px"
        >
          <Typography>Recent</Typography>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Typography>Sort</Typography>
            <KeyboardArrowDownIcon />
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          gap="10px"
          justifyContent="flex-end"
        >
          <FormatListBulletedIcon />
          <GridViewIcon />
        </Box>
      </Box>
      <Box
        display="inline-flex"
        flexDirection="row"
        gap="10px"
        marginTop="10px"
        flexWrap="wrap"
        maxWidth="1200px"
        marginLeft="60px"
        marginRight="100px"
        overflow="hidden"
      >
        {projectsData.map((project) => (
          <ExtFileComponent
            filename={project.projectName}
            createdAt={project.edition}
            key={project._id}
            project={project} // Pass the entire project object
          />
        ))}
      </Box>
    </Box>
  );
};

export default MainLandingPageComponent;
