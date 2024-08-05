import React from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { Box } from "@mui/system";
import { useDispatch } from "react-redux";
import { setCurrentProject } from "../redux/slices/projectSlice";
import { useNavigate } from "react-router-dom";

const ExtFileComponent = ({ filename, createdAt, project }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    dispatch(setCurrentProject(project));
    navigate("/editor");
  };

  return (
    <Box
      width="190px"
      height="238px"
      p={2}
      display="flex"
      flexDirection="column"
      bgcolor="#FFFFFF"
      borderRadius="16px"
      onClick={handleClick}
    >
      <Box
        display="flex"
        height="150px"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: "lightgray",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <InsertDriveFileIcon sx={{ fontSize: "100px", color: "white" }} />
      </Box>
      <Box textAlign="left" fontWeight="bold" pt={1} px={1} flexGrow={1}>
        {filename}
      </Box>
    </Box>
  );
};

export default ExtFileComponent;
