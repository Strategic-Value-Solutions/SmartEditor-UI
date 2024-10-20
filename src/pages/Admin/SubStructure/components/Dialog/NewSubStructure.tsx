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
import subStructureApi from '@/service/subStructureApi'
import {
  addSubStructure,
  updateSubStructure,
} from '@/store/slices/subStructureSlice'
import { getErrorMessage } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

const newSubStructureSchema = z.object({
  name: z.string().nonempty('Sub structure name is required'),
  description: z.string().optional(),
})

const NewSubStructure = ({
  isEdit = false,
  selectedSubStructure,
  onClose,
  open,
}: any) => {
  const { superStructureId } = useParams()
  const dispatch = useDispatch()

  const form = useForm({
    resolver: zodResolver(newSubStructureSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  useEffect(() => {
    if (isEdit && selectedSubStructure) {
      form.setValue('name', selectedSubStructure.name)
      form.setValue('description', selectedSubStructure.description)
      form.setValue('superStructureId', selectedSubStructure.superStructureId)
    } else {
      form.reset()
    }
  }, [isEdit, selectedSubStructure, form])

  const onSubmit = async (data) => {
    try {
      const subStructureData = {
        name: data.name,
        description: data.description,
      }
      if (!superStructureId)
        return toast.error('Please select a super structure')
      if (isEdit) {
        const response = await subStructureApi.updateSubStructure(
          superStructureId,
          selectedSubStructure.id,
          subStructureData
        )
        dispatch(updateSubStructure(response))
      } else {
        const response = await subStructureApi.createSubStructure(
          superStructureId,
          subStructureData
        )
        dispatch(addSubStructure(response))
      }

      onClose()
      form.reset()
    } catch (error) {
      console.error('Form submission error', error)
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Sub Structure' : 'Create New Sub Structure'}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub Structure Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter sub structure name'
                        {...field}
                      />
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
                {isEdit ? 'Update' : 'Create'} Sub Structure
              </Button>
            </form>
          </Form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default NewSubStructure
