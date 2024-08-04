import React from 'react';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Box } from '@mui/system';

const ExtFileComponent = ({ filename, createdAt }) => {
  return (
    <Box width="190px" height="238px" p={2} display="flex" flexDirection="column" bgcolor="#FFFFFF" borderRadius="16px">
      <Box
        display="flex"
        height="150px" // Set a fixed height for the icon container
        justifyContent="center"
        alignItems="center"
        sx={{ backgroundColor: 'lightgray', borderRadius: '8px', overflow: 'hidden' }}
      >
        <InsertDriveFileIcon
          sx={{ fontSize: '100px', color: 'white' }} // Use fontSize instead of width/height percentage
        />
      </Box>
      <Box textAlign="left" fontWeight="bold" pt={1} px={1} flexGrow={1}>
        {filename}
      </Box>
    </Box>
  );
};

export default ExtFileComponent;
