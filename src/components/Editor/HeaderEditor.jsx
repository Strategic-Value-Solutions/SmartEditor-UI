// src/components/HeaderEditor/HeaderEditor.js
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HomeIcon from "@mui/icons-material/Home";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, Divider, IconButton } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import imageConstants from "../../Constants/imageConstants";

const HeaderEditor = () => {
  const navigate = useNavigate();
  const currentProject = useSelector((state) => state.project.currentProject);

  function handleClose() {
    navigate("/");
  }

  if (!currentProject) {
    return null; // Or show a loading indicator or a placeholder
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        width: "100%",
        borderBottom: "1px solid #ccc",
      }}
    >
      <Box display="flex" flexDirection="row" alignItems="center" paddingY={1}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="190px"
          borderRadius={2}
          sx={{ padding: 1 }}
        >
          <img
            src={imageConstants.Aeis}
            alt="AEIS"
            style={{
              width: "50px",
              height: "50px",
              objectFit: "contain",
              borderRadius: "10px",
            }}
          />
        </Box>
        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 2, bgcolor: "divider" }}
        />
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
          alignItems="center"
          paddingLeft="5px"
          paddingRight="5px"
        >
          <Box
            display="flex"
            flexDirection="row"
            minWidth="170px"
            maxWidth="100%"
            justifyContent="start"
            alignItems="center"
            gap={2}
          >
            <HomeIcon sx={{ color: "#fff" }} />
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                color: "#000",
              }}
            >
              {currentProject.projectName}
            </Box>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="auto"
            gap="5px"
            sx={{ padding: 1 }}
          >
            <IconButton color="inherit">
              <MoreHorizIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleClose}>
              <HighlightOffIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HeaderEditor;
