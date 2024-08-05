import React, { useState } from "react";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  updateConfig,
  deleteConfig,
} from "../../redux/slices/configurationSlice";

const TemplateCard = ({ _id, title, fields_data = [] }) => {
  // Default to an empty array
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [modelName, setModelName] = useState(title);
  const [fields, setFields] = useState(fields_data);

  const dispatch = useDispatch();

  const handleEditModalOpen = () => setOpenEditModal(true);
  const handleEditModalClose = () => setOpenEditModal(false);
  const handleDeleteModalOpen = () => setOpenDeleteModal(true);
  const handleDeleteModalClose = () => setOpenDeleteModal(false);

  const handleDelete = () => {
    dispatch(deleteConfig(_id));
    handleDeleteModalClose();
  };

  const handleEdit = () => {
    const updatedConfig = { _id, model_name: modelName, fields_data: fields };
    dispatch(updateConfig(updatedConfig));
    handleEditModalClose();
  };

  const handleAddField = () => {
    setFields([...fields, { name: "", type: "" }]);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = fields.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
    setFields(updatedFields);
  };

  const handleDeleteField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: 240,
        height: 150,
        m: 1,
        bgcolor: "background.paper",
        boxShadow: 3,
        borderRadius: "12px",
        overflow: "hidden",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ fontWeight: "bold", mt: 2, mx: 2 }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          my: 1,
        }}
      >
        <SettingsIcon sx={{ fontSize: 40 }} onClick={handleEditModalOpen} />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          p: 1,
        }}
      >
        <Button startIcon={<SettingsIcon />} onClick={handleEditModalOpen}>
          Edit
        </Button>
        <Button
          startIcon={<DeleteIcon />}
          onClick={handleDeleteModalOpen}
          color="error"
        >
          Delete
        </Button>
      </Box>

      {/* Edit Modal */}
      <Dialog open={openEditModal} onClose={handleEditModalClose}>
        <DialogTitle>Edit Template</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            label="Model Name"
          />
          {fields.map((field, index) => (
            <Box key={index} display="flex" alignItems="center" mt={2}>
              <TextField
                label="Field Name"
                value={field.name}
                onChange={(e) =>
                  handleFieldChange(index, "name", e.target.value)
                }
                sx={{ mr: 1 }}
              />
              <FormControl fullWidth>
                <InputLabel>Field Type</InputLabel>
                <Select
                  value={field.type}
                  onChange={(e) =>
                    handleFieldChange(index, "type", e.target.value)
                  }
                  label="Field Type"
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="number">Number</MenuItem>
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="pdf">PDF File</MenuItem>
                  <MenuItem value="image">Image File</MenuItem>
                  <MenuItem value="3d">3D File</MenuItem>
                </Select>
              </FormControl>
              <IconButton
                onClick={() => handleDeleteField(index)}
                color="error"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddField}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            Add Field
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditModalClose}>Cancel</Button>
          <Button onClick={handleEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={openDeleteModal} onClose={handleDeleteModalClose}>
        <DialogTitle>Delete Template</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this template?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteModalClose}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplateCard;
