import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Divider, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { ProjectDataContext } from '../ProjectDataContext'; // Import the ProjectDataContext

const CreateNewProject = ({ setOpenModal }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const [configs, setConfigs] = useState([]);
  const { setProjectsData, configsData, setProjectName } = useContext(ProjectDataContext); // Get configsData and setProjectName from context

  useEffect(() => {
    // Set configs from context data
    setConfigs(configsData);
  }, [configsData]); // Update configs whenever configsData changes

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const onSubmit = async (data) => {
    // Store the project name in the context
    setProjectName(data.projectName);
    
    reset(); // Reset the form fields
    navigate('/editor'); // Navigate to the editor route
  };

  return (
    <Box justifyContent='center' alignItems='center'>
      <Box
        width='350px'
        bgcolor='#FFFFFF'
        borderRadius={5}
        padding={2}
        justifyContent='center'
        alignItems='center'
      >
        <Box display='flex' flexDirection='row' justifyContent='space-between'>
          <Typography variant="h6" gutterBottom>Create New Project</Typography>
          <HighlightOffIcon
            style={{ color: 'grey' }}
            id='exit'
            onClick={handleCloseModal}
          />
        </Box>
        <Divider />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display='flex' flexDirection='column' padding={2} gap='30px'>
            <TextField
              fullWidth
              placeholder='Project Title'
              // {...register('projectName', {
              //   required: 'Project Name is required',
              //   maxLength: 50
              // })}
            />
            <TextField
              fullWidth
              placeholder='Site Name'
              // {...register('projectName', {
              //   required: 'Project Name is required',
              //   maxLength: 50
              // })} // Generate random value
            />
            <FormControl fullWidth>
              <InputLabel id="supermodel-label">Supermodel Type</InputLabel>
              <Select
                labelId="supermodel-label"
                {...register('supermodelType')}
              >
                <MenuItem key="1" value="Orthotropic">Orthotropic</MenuItem>
                <MenuItem key="2" value="Multistory Building">Multistory Building</MenuItem>
                <MenuItem key="3" value="Aviation Project">Aviation Project</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="config-selector-label">Select Configuration</InputLabel>
              <Select
                labelId="config-selector-label"
                defaultValue=""
                label="Select Configuration"
                {...register('config')}
              >
                {configs.map(config => (
                  <MenuItem key={Math.random().toString(36).substring(7)} value={config.mcc}> {/* Generate random key */}
                    {config.model_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              type="submit"
              style={{ backgroundColor: '#4CAF50', color: 'white' }}
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
