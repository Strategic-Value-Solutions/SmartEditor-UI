// @ts-nocheck

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ProjectDataContext } from '@/store/ProjectDataContext'
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from '@/components/extension/file-uploader'

const NewProject = ({ open, pickNumber, setPickNumber }) => {
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const form = useForm({
    defaultValues: {
      projectName: '',
      siteName: '',
      superModel: '',
      config: '',
    },
  })
  const [configs, setConfigs] = useState([])
  const { setProjectsData, configsData, setProjectName } =
    useContext(ProjectDataContext) // Get configsData and setProjectName from context

  useEffect(() => {
    // Set configs from context data
    setConfigs(configsData)
  }, [configsData]) // Update configs whenever configsData changes

  const handleModal = () => {
    setOpen(!open)
  }

  const onSubmit = async (data) => {
    // Store the project name in the context
    setProjectName(data.projectName)

    reset() // Reset the form fields
    navigate('/editor') // Navigate to the editor route
  }

  return (
    <>
      
    </>
  )
}

export default NewProject
