//@ts-nocheck
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import templateApi from '@/service/templateApi'
import {
  addTemplate,
  updateTemplate
} from '@/store/slices/templateSlice'
import { getErrorMessage } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

// Schema validation
const newTemplateSchema = z.object({
  name: z.string().nonempty('Template name is required'),
  description: z.string().nonempty('Description is required'),
})

const NewTemplate = ({
  isEdit = false,
  selectedTemplate,
  onClose,
  open,
  setFilteredTemplates,
}: any) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const form = useForm({
    resolver: zodResolver(newTemplateSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  useEffect(() => {
    // Pre-populate form fields in case of edit
    if (isEdit && selectedTemplate) {
      form.setValue('name', selectedTemplate.name)
      form.setValue('description', selectedTemplate.description)
    } else {
      form.reset()
    }
  }, [isEdit, selectedTemplate, form])

  // Ensure this is called on form submission
  const onSubmit = async (data) => {
    try {
       // Debug log
      const templateData = {
        name: data.name,
        description: data.description
      }

      if (isEdit) {
        const response = await templateApi.updateTemplate(
          selectedTemplate.id,
          templateData
        )
        dispatch(updateTemplate(response))
      } else {
        const response = await templateApi.createTemplate(templateData)
        
        dispatch(addTemplate(response))
      }

      onClose()
      form.reset()
    } catch (error) {
      console.error('Form submission error', error) // Debug log
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Edit Template' : 'Create New Template'}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <Form {...form}>
              <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)} // Ensure this is correct
                className='space-y-4'
              >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template name</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter Template name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter description' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type='submit'
                  className='mt-2 flex h-8 w-fit items-center justify-center'
                >
                  {isEdit ? 'Update' : 'Create'} Template
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default NewTemplate
