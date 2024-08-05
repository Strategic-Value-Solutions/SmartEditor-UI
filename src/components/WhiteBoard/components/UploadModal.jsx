// src/components/UploadModal/UploadModal.js
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setProjectSettings } from "../../../redux/slices/annotationSlice";
import { useEffect, useState } from "react";

function UploadModal({
  uploadImageRef,
  uploadPdfRef,
  isOpen,
  setIsOpen,
  projectId,
  uploadImage,
  onFileChange,
}) {
  const dispatch = useDispatch();
  const projectSettings = useSelector(
    (state) => state.annotations.projectSettings[projectId]
  );
  const [pickNumber, setPickNumber] = useState(
    projectSettings?.pickNumber || ""
  );

  useEffect(() => {
    if (projectSettings) {
      setPickNumber(projectSettings.pickNumber);
    }
  }, [projectSettings]);

  const handleSaveSettings = () => {
    dispatch(
      setProjectSettings({
        projectId,
        settings: { pickNumber },
      })
    );
    setIsOpen(false);
  };

  const handleUploadImage = (e) => {
    uploadImage(e);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      dispatch(
        setProjectSettings({
          projectId,
          settings: { imageFile: reader.result },
        })
      );
    };
    reader.readAsDataURL(file);
  };

  const handleUploadPdf = (e) => {
    onFileChange(e);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      dispatch(
        setProjectSettings({
          projectId,
          settings: { pdfFile: reader.result },
        })
      );
    };
    reader.readAsDataURL(file);
  };

  if (projectSettings?.imageFile || projectSettings?.pdfFile) {
    return null;
  }

  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          p: 4,
          borderRadius: 4,
          minWidth: 300,
          maxWidth: "90vw",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Typography variant="h6" color="text.primary" gutterBottom>
          Upload File and Select Type
        </Typography>
        <FormControl
          fullWidth
          sx={{
            mb: 2,
          }}
        >
          <InputLabel id="pick-number-label">Selections</InputLabel>
          <Select
            labelId="pick-number-label"
            value={pickNumber}
            onChange={(e) => setPickNumber(e.target.value)}
            label="Selections"
            defaultValue=""
          >
            <MenuItem value="Master Structure">Master Structure</MenuItem>
            <MenuItem value="Project Area">Project Area</MenuItem>
            <MenuItem value="Inspection Area">Inspection Area</MenuItem>
            <MenuItem value="Inspection Type">Inspection Type</MenuItem>
            <MenuItem value="Component">Component</MenuItem>
          </Select>
        </FormControl>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-around",
            mb: 2,
          }}
        >
          <Button
            variant="contained"
            component="label"
            sx={{
              backgroundColor: "#2979ff",
              ":hover": {
                backgroundColor: "#5393ff",
              },
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              ref={uploadImageRef}
              onChange={handleUploadImage}
            />
          </Button>
          <Button
            variant="contained"
            component="label"
            sx={{
              backgroundColor: "#ff5722",
              ":hover": {
                backgroundColor: "#ff8a50",
              },
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Upload PDF
            <input
              type="file"
              hidden
              accept=".pdf"
              ref={uploadPdfRef}
              onChange={handleUploadPdf}
            />
          </Button>
        </Box>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            gap: 1,
          }}
        >
          <Button
            onClick={handleSaveSettings}
            variant="contained"
            sx={{
              backgroundColor: "#00e676",
              color: "white",
              ":hover": {
                backgroundColor: "#33eb91",
              },
            }}
            color="primary"
          >
            Submit
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            variant="outlined"
            sx={{
              borderColor: "#00e676",
              color: "#00e676",
              ":hover": {
                borderColor: "#00e676",
                color: "#00e676",
              },
            }}
            color="secondary"
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default UploadModal;
