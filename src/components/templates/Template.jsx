import React, { useContext, useState } from 'react';
import { Box, Button, Modal } from '@mui/material';
import TemplateCard from './TemplateCard';
import AddNewTemplate from './Addtemplate';
import { ProjectDataContext } from '../../ProjectDataContext'; // Adjust the path accordingly

const Template = () => {
  const [openModal, setOpenModal] = useState(false);

  // Access configs from context
  const { configsData } = useContext(ProjectDataContext);

  const handleNewButtonClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Assuming refreshConfigs still needs to fetch and update context:
  const refreshConfigs = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/configmodels/');
      const data = await response.json();
      // Assuming you have a method to update configs in context
      updateConfigsData(data);  // This method needs to be defined in your context provider
    } catch (error) {
      console.error('Failed to fetch configurations:', error);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      marginTop={'10px'}
      marginLeft={'200px'}
      gap={'15px'}
      minWidth={'500px'}
    >
      <Box
        display={'flex'}
        flexDirection={'row'}
        justifyContent={'space-between'}
      >
        <Box>My Configurations ({configsData.length})</Box>
        <Button
          onClick={handleNewButtonClick}
          sx={{
            bgcolor: '#E22A34',
            color: 'white',
            '&:hover': {
              bgcolor: '#ca604f',
              color: 'white',
            },
            borderRadius: '20px',
            textTransform: 'none'
          }}
        >
          Create New Configuration
        </Button>
      </Box>
      <Box
        display={'flex'}
        flexDirection={'row'}
        gap={'20px'}
        flexWrap={'wrap'}
        >
        {configsData.map(config => (
            <TemplateCard
            key={config.mcc} 
            id={config.mcc}
            title={`${config.model_name}`}
            refreshConfigs={refreshConfigs}
            />
        ))}
        </Box>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          maxHeight={'100vh'}
        >
          <AddNewTemplate setOpenModal={setOpenModal} refreshConfigs={refreshConfigs} />
        </Box>
      </Modal>
    </Box>
  );
};

export default Template;
