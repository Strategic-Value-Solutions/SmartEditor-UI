import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, IconButton, MenuItem, Select, FormControl, InputLabel, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { ProjectDataContext } from '../../ProjectDataContext'; // Ensure the path is correct

const AddNewTemplate = ({ setOpenModal }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const { configsData, setConfigsData } = useContext(ProjectDataContext);
    const [fields, setFields] = useState([]);
    const [selectedConfigs, setSelectedConfigs] = useState([]);

    const handleSelectConfig = (config) => {
        const isAlreadySelected = selectedConfigs.some(selected => selected.id === config.id);
        if (isAlreadySelected) {
            setSelectedConfigs(selectedConfigs.filter(selected => selected.id !== config.id));
        } else {
            setSelectedConfigs([...selectedConfigs, config]);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const onSubmit = data => {
        const fieldsData = fields.map(field => ({
            name: field.fieldName,
            type: field.fieldType
        }));

        const newConfig = {
            id: Math.max(...configsData.map(c => c.id)) + 1, // generate a new unique ID
            model_name: data.modelName,
            fields_data: fieldsData,
            associated_configs: selectedConfigs,
            last_update: new Date().toISOString() // Add a timestamp for the last update
        };

        setConfigsData([...configsData, newConfig]);
        console.log("New configuration added successfully:", newConfig);
        reset();
        handleCloseModal();
    };

    const addField = () => {
        setFields([...fields, { fieldName: '', fieldType: '' }]);
    };

    return (
        <Box bgcolor="background.paper" boxShadow={3} p={3} borderRadius={2} sx={{ width: 'auto', maxWidth: '600px', margin: 'auto', marginTop: '10vh' }}>
            <Typography variant="h6" gutterBottom>Create New Model Configuration</Typography>
            <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 8, right: 8 }}><CloseIcon /></IconButton>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Model Name"
                    {...register('modelName', { required: 'Model name is required' })}
                    error={!!errors.modelName}
                    helperText={errors.modelName?.message}
                />
                {fields.map((field, index) => (
                    <Box key={index} display="flex" gap={2} alignItems="center">
                        <TextField
                            fullWidth
                            label="Field Name"
                            value={field.fieldName}
                            onChange={e => setFields(fields.map((f, i) => i === index ? { ...f, fieldName: e.target.value } : f))}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Field Type</InputLabel>
                            <Select
                                value={field.fieldType}
                                onChange={e => setFields(fields.map((f, i) => i === index ? { ...f, fieldType: e.target.value } : f))}
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
                        <IconButton onClick={() => setFields(fields.filter((_, i) => i !== index))}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                ))}
                <Button startIcon={<AddIcon />} onClick={addField} variant="outlined" sx={{ my: 2 }}>
                    Add Field
                </Button>
                <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="subtitle1">Select Configurations:</Typography>
                    {configsData.map(config => (
                        <Button
                            key={config.id}
                            onClick={() => handleSelectConfig(config)}
                            variant="contained"
                            color={selectedConfigs.some(c => c.id === config.id) ? "secondary" : "primary"}
                            sx={{ m: 1 }}
                        >
                            {config.model_name}
                        </Button>
                    ))}
                </Box>
                <Box display="flex" justifyContent="space-between">
                    <Button type="submit" variant="contained" sx={{ bgcolor: '#4CAF50', color: 'white' }}>Create</Button>
                    <Button onClick={handleCloseModal} variant="contained" sx={{ bgcolor: '#f44336', color: 'white' }}>Cancel</Button>
                </Box>
            </Box>
        </Box>
    );
};

export default AddNewTemplate;
