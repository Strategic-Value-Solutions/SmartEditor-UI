import React, { useState, useEffect } from "react";
import { Box, Button, Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import TemplateCard from "./TemplateCard";
import AddNewTemplate from "./Addtemplate";
import { setConfigs } from "../../redux/slices/configurationSlice"; // Adjust the path accordingly

const Template = () => {
  const [openModal, setOpenModal] = useState(false);

  const dispatch = useDispatch();
  const configsData = useSelector(
    (state) => state.configurations.configsData || []
  );

  // useEffect(() => {
  //   refreshConfigs();
  // }, []);

  const handleNewButtonClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // const refreshConfigs = async () => {
  //   try {
  //     const response = await fetch("http://127.0.0.1:8000/api/configmodels/");
  //     const data = await response.json();
  //     dispatch(setConfigs(data));
  //   } catch (error) {
  //     console.error("Failed to fetch configurations:", error);
  //   }
  // };

  return (
    <Box
      display="flex"
      flexDirection="column"
      marginTop={"10px"}
      marginLeft={"200px"}
      gap={"15px"}
      minWidth={"500px"}
    >
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
      >
        <Box>My Configurations ({configsData.length})</Box>
        <Button
          onClick={handleNewButtonClick}
          sx={{
            bgcolor: "#E22A34",
            color: "white",
            "&:hover": {
              bgcolor: "#ca604f",
              color: "white",
            },
            borderRadius: "20px",
            textTransform: "none",
          }}
        >
          Create New Configuration
        </Button>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"row"}
        gap={"20px"}
        flexWrap={"wrap"}
      >
        {configsData.map((config) => (
          <TemplateCard
            key={config._id}
            _id={config._id}
            fields_data={config.fields_data}
            title={`${config.model_name}`}
            // refreshConfigs={refreshConfigs}
          />
        ))}
      </Box>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          maxHeight={"100vh"}
        >
          <AddNewTemplate
            setOpenModal={setOpenModal}
            // refreshConfigs={refreshConfigs}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default Template;
