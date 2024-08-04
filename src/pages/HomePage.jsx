import React, { useState } from 'react';
import Divider from '@mui/material/Divider';
import { Box } from '@mui/system';
import HeaderHome from '../components/home/HeaderHome';
import MainLandingPageComponent from '../components/home/MainLandingPageComponent';
import Leftsidebar from '../components/home/LeftSideBar';
import Template from '../components/templates/Template';

const HomePage = () => {
    const [currentPath, setCurrentPath] = useState("Dashboard");

    const onClickPath = (path) => {
      setCurrentPath(path);
    }

    return (
        <Box display="flex" flexDirection="column" width={"100%"}>
            <HeaderHome onClickPath={onClickPath}/>
            <Box display="flex" flexDirection="row" width={"100%"}>
                <Leftsidebar />
                <Divider orientation="vertical" flexItem />
                {currentPath === "Dashboard" && <MainLandingPageComponent />}
                {currentPath === "ManageTemplates" && <Template />}
            </Box>
        </Box>
    );
}

export default HomePage;
