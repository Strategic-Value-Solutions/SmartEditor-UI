import React, { useState, useCallback, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HeaderEditor from "../components/Editor/HeaderEditor";
import VerticalSideBarEditorComponent from "../components/Editor/VerticalSideBarEditor";
import Whiteboard from "../components/WhiteBoard/whiteboard";

const EditorPage = () => {
  const [fileReaderInfo, setFileReaderInfo] = useState({
    file: "",
    totalPages: null,
    currentPageNumber: 1,
    currentPage: "",
  });

  const updateFileReaderInfo = useCallback((data) => {
    try {
      setFileReaderInfo((prev) => ({ ...prev, ...data }));
    } catch (error) {
      console.error("Failed to update fileReaderInfo:", error);
    }
  }, []);

  const onClickNextPage = () => {
    if (
      fileReaderInfo.totalPages &&
      fileReaderInfo.currentPageNumber < fileReaderInfo.totalPages
    ) {
      updateFileReaderInfo({
        currentPageNumber: fileReaderInfo.currentPageNumber + 1,
      });
    }
  };

  const onClickPreviousPage = () => {
    if (fileReaderInfo.currentPageNumber > 1) {
      updateFileReaderInfo({
        currentPageNumber: fileReaderInfo.currentPageNumber - 1,
      });
    }
  };

  const sidebarWidth = "64px";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <HeaderEditor />
      <Box sx={{ display: "flex", flexGrow: 1, position: "relative" }}>
        <VerticalSideBarEditorComponent />
        <Box
          sx={{
            position: "absolute",
            top: "38%",
            left: sidebarWidth,
            zIndex: 10,
            pl: 8,
          }}
        >
          <IconButton
            onClick={onClickPreviousPage}
            sx={{
              borderRadius: "50%",
              color: "#fff",
              backgroundColor: "darkgrey",
              "&:hover": {
                backgroundColor: "#a9a9a9",
              },
              "&.Mui-disabled": {
                backgroundColor: "rgba(169, 169, 169, 0.5)",
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Box sx={{ flexGrow: 1, overflow: "auto", mx: sidebarWidth }}>
          <Whiteboard
            aspectRatio={16 / 8.5}
            fileReaderInfo={fileReaderInfo}
            updateFileReaderInfo={updateFileReaderInfo}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: "38%",
            right: sidebarWidth,
            zIndex: 10,
            pl: 2,
          }}
        >
          <IconButton
            onClick={onClickNextPage}
            sx={{
              borderRadius: "50%",
              color: "#fff",
              backgroundColor: "darkgrey",
              "&:hover": {
                backgroundColor: "#a9a9a9",
              },
              "&.Mui-disabled": {
                backgroundColor: "rgba(169, 169, 169, 0.5)",
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default EditorPage;
