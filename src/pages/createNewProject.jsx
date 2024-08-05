// src/components/CreateNewProject/CreateNewProject.js
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentProject, addProject } from "../redux/slices/projectSlice";

const CreateNewProject = ({ setOpenModal }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const configsData = useSelector(
    (state) => state.configurations.configsData || []
  );
  const [configs, setConfigs] = useState([]);

  useEffect(() => {
    // Set configs from Redux state
    setConfigs(configsData);
  }, [configsData]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const onSubmit = async (data) => {
    const projectData = {
      projectName: data.projectName,
      siteName: data.siteName,
      supermodelType: data.supermodelType,
      config: configs.find((config) => config._id === data.config),
    };

    // Store the project data in the Redux state
    dispatch(setCurrentProject(projectData));
    dispatch(addProject(projectData));

    reset(); // Reset the form fields
    navigate("/editor"); // Navigate to the editor route
  };

  return (
    <Box justifyContent="center" alignItems="center">
      <Box
        width="350px"
        bgcolor="#FFFFFF"
        borderRadius={5}
        padding={2}
        justifyContent="center"
        alignItems="center"
      >
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Typography variant="h6" gutterBottom>
            Create New Project
          </Typography>
          <HighlightOffIcon
            style={{ color: "grey" }}
            id="exit"
            onClick={handleCloseModal}
          />
        </Box>
        <Divider />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" flexDirection="column" padding={2} gap="30px">
            <TextField
              fullWidth
              placeholder="Project Title"
              {...register("projectName", {
                required: "Project Name is required",
                maxLength: 50,
              })}
            />
            <TextField
              fullWidth
              placeholder="Site Name"
              {...register("siteName", {
                required: "Site Name is required",
                maxLength: 50,
              })}
            />
            <FormControl fullWidth>
              <InputLabel id="supermodel-label">Supermodel Type</InputLabel>
              <Select
                labelId="supermodel-label"
                {...register("supermodelType")}
              >
                <MenuItem key="1" value="Orthotropic">
                  Orthotropic
                </MenuItem>
                <MenuItem key="2" value="Multistory Building">
                  Multistory Building
                </MenuItem>
                <MenuItem key="3" value="Aviation Project">
                  Aviation Project
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="config-selector-label">
                Select Configuration
              </InputLabel>
              <Select
                labelId="config-selector-label"
                defaultValue=""
                label="Select Configuration"
                {...register("config")}
              >
                {configs.map((config) => (
                  <MenuItem
                    key={config._id} // Use config._id as the key
                    value={config._id}
                  >
                    {config.model_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              type="submit"
              style={{ backgroundColor: "#4CAF50", color: "white" }}
            >
              Create Project
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default CreateNewProject;
