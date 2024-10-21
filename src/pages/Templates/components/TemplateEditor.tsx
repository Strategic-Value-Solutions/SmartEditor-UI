//@ts-nocheck
import ReactQuillEditor from '@/components/custom/react-quill-editor'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import templateApi from '@/service/templateApi'
import { updateTemplate } from '@/store/slices/templateSlice'
import { getErrorMessage } from '@/utils'
import he from 'he'
import { Edit, Pencil, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'

// Hardcoded variables list with sample values
const defaultVariables = [
  {
    label: 'Annotation Data',
    value: 'annotationData',
    sample: `{
      "type": "Group",
      "version": "6.1.0",
      // ... (sample data truncated for brevity)
    }`,
    type: 'object',
  },
  {
    label: 'Created By Name',
    value: 'createdByName',
    sample: 'John Doe',
    type: 'text',
  },
  {
    label: 'Created By Email',
    value: 'createdByEmail',
    sample: 'john.doe@example.com',
    type: 'text',
  },
  { label: 'Status', value: 'status', sample: 'Pending', type: 'text' },
]

const wrapInCurlyBraces = (variable: string): string => {
  return `{{${variable}}}`
}

// Replace the variables in the content with sample data
const replaceVariablesWithSampleData = (content, variables) => {
  let updatedContent = content
  variables.forEach(({ value, sample }) => {
    const regex = new RegExp(`{{${value}}}`, 'g')
    updatedContent = updatedContent.replace(regex, sample || `{{${value}}}`)
  })
  return updatedContent
}

const TemplateEditor = ({ template }) => {
  const [content, setContent] = useState(template?.content)
  const [previewContent, setPreviewContent] = useState('')
  const [customVariables, setCustomVariables] = useState([]) // Separate state for custom variables
  const [newVariable, setNewVariable] = useState({
    label: '',
    type: 'text',
  })
  const [editIndex, setEditIndex] = useState(null) // Track the custom variable being edited
  const [originalValue, setOriginalValue] = useState('') // Store the original value before editing
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false) // Control dialog visibility
  const [variableToDelete, setVariableToDelete] = useState(null) // Store variable index for deletion
  const dispatch = useDispatch()

  // Combine default and custom variables for rendering and preview
  const combinedVariables = [...defaultVariables, ...customVariables]

  // Function to update both content and preview
  const handleEditorChange = (value) => {
    setContent(value)
    const updatedContent = replaceVariablesWithSampleData(
      value,
      combinedVariables
    )
    setPreviewContent(updatedContent)
  }

  const handleUpdateTemplate = async () => {
    try {
      const response = await templateApi.updateTemplate(template.id, {
        content,
      })
      dispatch(updateTemplate(response))
      toast.success('Template updated successfully')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  // Handle loading sample data into preview
  const handleLoadSampleData = () => {
    const updatedContent = replaceVariablesWithSampleData(
      content,
      combinedVariables
    )
    setPreviewContent(updatedContent)
  }

  const fetchTemplateAttributes = async () => {
    try {
      const query = `?templateId=${template.id}`
      const response = await templateApi.getTemplateAttributes(query)

      // Map the response to extract the necessary fields for each attribute
      const attributes = response.map((attr) => ({
        id: attr.id,
        label: attr.name, // Assuming 'name' corresponds to the label
        value: attr.name.replace(/\s+/g, '').toLowerCase(), // Generate value from name
        type: attr.type,
        sample: '', // Add sample if needed
      }))

      setCustomVariables(attributes)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  useEffect(() => {
    if (template?.id) {
      fetchTemplateAttributes()
    }
  }, [template?.id])

  // Effect to update the preview initially with replaced variables
  useEffect(() => {
    const updatedContent = replaceVariablesWithSampleData(
      content,
      combinedVariables
    )
    setPreviewContent(updatedContent)
  }, [content, customVariables])

  const handleAddOrUpdateVariable = async () => {
    if (!newVariable.label) {
      toast.error('Please fill in the variable name and select a type.')
      return
    }

    const newVariableKey = newVariable.label.replace(/\s+/g, '').toLowerCase()

    // Check for duplicates, ignoring the one being edited
    const isDuplicate = customVariables.some(
      (variable, index) =>
        variable.value.toLowerCase() === newVariableKey && index !== editIndex
    )

    if (isDuplicate) {
      toast.error('Variable name already exists. Please use a different name.')
      return
    }

    const newVariableEntry = {
      ...newVariable,
      value: newVariableKey,
      sample: '', // Sample data can be provided later
    }

    try {
      if (editIndex !== null) {
        // Update existing variable
        const updatedVariables = [...customVariables]
        const oldVariable = customVariables[editIndex]
        updatedVariables[editIndex] = newVariableEntry

        // API call to update the attribute
        const attributeId = oldVariable.id // Assuming each custom variable has an `id`
        await templateApi.updateTemplateAttributes(attributeId, {
          name: newVariable.label,
          type: newVariable.type,
        })

        // Replace the old variable value with the new one in the content
        const updatedContent = content.replace(
          new RegExp(`{{${oldVariable.value}}}`, 'g'),
          `{{${newVariableKey}}}`
        )
        setContent(updatedContent)
        setPreviewContent(
          replaceVariablesWithSampleData(updatedContent, combinedVariables)
        )
        setEditIndex(null)
        setCustomVariables(updatedVariables)
        toast.success('Variable updated successfully.')
      } else {
        // Add a new variable as before
        const { id: templateId } = template
        const response = await templateApi.addTemplateAttributes({
          templateId,
          name: newVariable.label,
          type: newVariable.type,
        })

        // Add new variable locally after API success
        setCustomVariables((prev) => [...prev, newVariableEntry])
        toast.success('Variable added successfully.')
      }

      setNewVariable({ label: '', type: 'text' })
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleEditVariable = (index) => {
    const variableToEdit = customVariables[index]
    setNewVariable({ label: variableToEdit.label, type: variableToEdit.type })
    setEditIndex(index)
    setOriginalValue(variableToEdit.value) // Store the original value for replacement
  }

  const handleDeleteVariable = (index) => {
    setVariableToDelete(index)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteVariable = async () => {
    if (variableToDelete !== null) {
      const variableToRemove = customVariables[variableToDelete]

      try {
        // API call to delete the attribute
        const attributeId = variableToRemove.id // Assuming each custom variable has an `id`
        await templateApi.deleteTemplateAttributes(attributeId)

        // Remove the variable locally after successful deletion
        const updatedVariables = customVariables.filter(
          (_, i) => i !== variableToDelete
        )
        setCustomVariables(updatedVariables)

        // Remove the variable's placeholder from content
        const updatedContent = content.replace(
          new RegExp(`{{${variableToRemove.value}}}`, 'g'),
          ''
        )
        setContent(updatedContent)
        setPreviewContent(
          replaceVariablesWithSampleData(updatedContent, combinedVariables)
        )
        toast.success('Variable removed successfully.')
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setIsDeleteDialogOpen(false)
        setVariableToDelete(null)
      }
    }
  }

  return (
    <div className='p-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6'>
      {/* Left section with editor */}
      <div className='flex-1'>
        <div className='mb-6 flex items-center justify-between w-full'>
          <h1 className='text-2xl font-bold'>
            {template?.name || 'Untitled Template'}
          </h1>
          <Button
            onClick={handleUpdateTemplate}
            className='mt-4 flex h-8 items-center justify-center gap-2'
          >
            Update Template
            <Pencil size={14} />
          </Button>
        </div>

        {template?.description && (
          <p className='mb-4 text-lg text-gray-700'>{template.description}</p>
        )}

        {/* Instructions for using variables */}
        <div className='mb-4 p-4 bg-gray-100 rounded-md'>
          <h2 className='font-semibold mb-2'>Available Variables:</h2>
          <ul className='list-disc ml-4 text-sm'>
            {combinedVariables.map((variable, index) => (
              <li key={index} className='flex items-center justify-between'>
                {wrapInCurlyBraces(variable.value)}: {variable.label} (
                {variable.type})
                {/* Show edit and delete icons only for custom variables */}
                {index >= defaultVariables.length && (
                  <div className='flex gap-2'>
                    <Edit
                      className='cursor-pointer'
                      size={16}
                      onClick={() =>
                        handleEditVariable(index - defaultVariables.length)
                      }
                    />
                    <Trash
                      className='cursor-pointer'
                      size={16}
                      onClick={() =>
                        handleDeleteVariable(index - defaultVariables.length)
                      }
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
          <p className='text-xs mt-2 text-gray-600'>
            Use these variables in your template content to insert dynamic
            values.
          </p>
        </div>

        {/* Form for adding or updating custom variables */}
        <div className='mb-4 p-4 bg-gray-100 rounded-md'>
          <h2 className='font-semibold mb-2'>
            {editIndex !== null ? 'Edit Variable' : 'Add Custom Variable'}
          </h2>
          <div className='flex gap-2'>
            <Input
              label='Variable Name'
              value={newVariable.label}
              onChange={(e) =>
                setNewVariable({ ...newVariable, label: e.target.value })
              }
              placeholder='e.g., User Name'
            />
            <Select
              value={newVariable.type}
              onValueChange={(value) =>
                setNewVariable({ ...newVariable, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='text'>Text</SelectItem>
                <SelectItem value='number'>Number</SelectItem>
                <SelectItem value='image'>Image</SelectItem>
                <SelectItem value='color'>Color</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddOrUpdateVariable}>
              {editIndex !== null ? 'Update' : 'Add'}
            </Button>
          </div>
        </div>

        {/* Load Sample Data Button */}
        <Button onClick={handleLoadSampleData} className='mb-4'>
          Load Sample Data
        </Button>

        {/* Quill Editor for Template Content */}
        <ReactQuillEditor
          value={content}
          onChange={handleEditorChange}
          placeholder='Write your template content here...'
          className='min-h-96'
        />
      </div>

      {/* Right section for live preview */}
      <div className='flex-1 p-4 border rounded-md bg-white shadow-md'>
        <h2 className='font-semibold text-xl mb-4'>Live Preview</h2>
        <div dangerouslySetInnerHTML={{ __html: previewContent }} />
      </div>

      {/* Confirmation Dialog for Deletion */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this variable? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDeleteVariable} variant='destructive'>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TemplateEditor
