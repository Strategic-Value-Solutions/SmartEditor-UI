import React from 'react';
import { Box } from '@mui/system';
import { Button, Divider } from '@mui/material';
import { IconButton } from '@mui/material'; 
import imageConstants from '../../Constants/imageConstants';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings'; // Added settings icon import

const HeaderHome = ({ onClickPath }) => {
    return (
      <Box
        display="flex"
        width="100%"
        flexDirection="row"
        flexGrow={1}
        position="sticky"
        top={0}
        zIndex={100}
        sx={{ backgroundColor: 'white', borderBottom: '1px solid #E0E0E0', padding: '10px 0' }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="190px"
        >
          <img src={imageConstants.Aeis} alt="AEIS" style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '10px' }} />
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          flexGrow={1}
          justifyContent="space-between"
          paddingX="20px"
        >
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap="60px"
          >
            <Button onClick={() => onClickPath("Dashboard")} sx={{ color: 'black', display: 'flex', alignItems: 'center', gap: '10px', '&:hover': { bgcolor: 'rgb(254, 246, 243)', color: '#E22A34' } }}>
              <DashboardIcon />
              Dashboard
            </Button>
            <Divider orientation="vertical" flexItem />
            <Button onClick={() => onClickPath("Folders")} sx={{ color: 'black', display: 'flex', alignItems: 'center', gap: '10px', '&:hover': { bgcolor: 'rgb(254, 246, 243)', color: '#E22A34' } }}>
              <FolderIcon />
              Folders
            </Button>
            <Divider orientation="vertical" flexItem />
            <Button onClick={() => onClickPath("ManageTemplates")} sx={{ color: 'black', display: 'flex', alignItems: 'center', gap: '10px', '&:hover': { bgcolor: 'rgb(254, 246, 243)', color: '#E22A34' } }}>
              <SettingsIcon />
              Manage Configs
            </Button>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap="20px"
          >
            <HelpOutlineIcon />
            <NotificationsNoneIcon />
            <CloudQueueIcon />
            <AccountCircleIcon />
          </Box>
        </Box>
      </Box>
    );
  };
  
  export default HeaderHome;