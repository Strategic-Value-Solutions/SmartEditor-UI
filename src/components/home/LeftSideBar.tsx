import DeleteIcon from '@mui/icons-material/Delete'
import GroupsIcon from '@mui/icons-material/Groups'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import SaveIcon from '@mui/icons-material/Save'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Divider, Modal } from '@mui/material'
import { useState } from 'react'
import CreateNewProject from '../../pages/createNewProject'

const Leftsidebar = () => {
  const [openModal, setOpenModal] = useState(false)

  const handleNewButtonClick = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  return (
    <Box display='flex' flexDirection='row' bgcolor='white'>
      <Box
        width='200px'
        height='100vh'
        position='fixed'
        sx={{ backgroundColor: 'white', overflow: 'auto' }}
      >
        <Box display='flex' flexDirection='column' gap={2} padding={2}>
          <Button
            variant='contained'
            sx={{
              borderRadius: 20,
              backgroundColor: 'blue',
              color: 'white',
              marginTop: 2,
            }}
            onClick={handleNewButtonClick}
          >
            New Project
          </Button>
          {[
            { icon: <HomeIcon />, text: 'Home' },
            { icon: <SearchIcon />, text: 'Search' },
            { icon: <SaveIcon />, text: 'Save' },
            { icon: <InfoIcon />, text: 'Info' },
            { icon: <InsertDriveFileIcon />, text: 'Your Files' },
            { icon: <GroupsIcon />, text: 'Shared Files' },
            { icon: <DeleteIcon />, text: 'Deleted' },
          ].map((item, index) => (
            <Button
              key={index}
              startIcon={item.icon}
              variant='text'
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                color: 'black',
                width: '100%',
              }}
              onClick={() => console.log(`${item.text} clicked`)}
            >
              {item.text}
            </Button>
          ))}
        </Box>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box bgcolor='background.paper' boxShadow={24} p={4} borderRadius={2}>
            {/* <CreateNewProject setOpenModal={setOpenModal} /> */}
          </Box>
        </Modal>
      </Box>
      <Divider orientation='vertical' flexItem />
    </Box>
  )
}

export default Leftsidebar
