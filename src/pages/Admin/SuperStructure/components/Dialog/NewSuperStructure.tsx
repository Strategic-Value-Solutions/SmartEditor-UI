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
import superStructureApi from '@/service/superStructureApi'
import {
  addSuperStructure,
  updateSuperStructure,
} from '@/store/slices/superStructureSlice'
import { getErrorMessage } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

const newSuperStructureSchema = z.object({
  name: z.string().nonempty('Super structure name is required'),
  description: z.string().optional(),
})

const NewSuperStructure = ({
  isEdit = false,
  selectedSuperStructure,
  onClose,
  open,
  setFilteredSuperStructures,
}: any) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const form = useForm({
    resolver: zodResolver(newSuperStructureSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  useEffect(() => {
    if (isEdit && selectedSuperStructure) {
      form.setValue('name', selectedSuperStructure.name)
      form.setValue('description', selectedSuperStructure.description)
    } else {
      form.reset()
    }
  }, [isEdit, selectedSuperStructure, form])

  const onSubmit = async (data) => {
    try {
      const superStructureData = {
        name: data.name,
        description: data.description,
      }

      if (isEdit) {
        const response = await superStructureApi.updateSuperStructure(
          selectedSuperStructure.id,
          superStructureData
        )
        dispatch(updateSuperStructure(response))
      } else {
        const response =
          await superStructureApi.createSuperStructure(superStructureData)

        dispatch(addSuperStructure(response))
      }

      onClose()
      form.reset()
    } catch (error) {
      console.error('Form submission error', error)
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Edit Super Structure' : 'Create New Super Structure'}
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
                      <FormLabel>Super Structure name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter super structure name'
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
                  {isEdit ? 'Update' : 'Create'} Super Structure
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default NewSuperStructure
