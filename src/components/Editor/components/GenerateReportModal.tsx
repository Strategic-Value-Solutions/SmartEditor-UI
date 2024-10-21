//@ts-nocheck
import { useEditor } from '../CanvasContext/CanvasContext'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import templateApi from '@/service/templateApi'
import { getErrorMessage } from '@/utils'
import he from 'he'
import htmlToPdfmake from 'html-to-pdfmake'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

pdfMake.vfs = pdfFonts.pdfMake.vfs

interface GenerateReportModalProps {
  showGenerateReportModal: boolean
  handleCloseGenerateReportModal: () => void
  template: any
}

const replacePlaceholders = (templateContent: string, data: any) => {
  let updatedContent = templateContent

  Object.keys(data).forEach((key) => {
    const value = data[key] || `{{${key}}}`
    const regex = new RegExp(`{{${key}}}`, 'gi')
    if ((key === 'customImage' || key === 'image') && data[key]) {
      updatedContent = updatedContent.replace(
        regex,
        `<img src="${data[key]}" alt="${key}" style="max-width: 100%; width: 300px; height: auto;"/>`
      )
    } else {
      updatedContent = updatedContent.replace(regex, value)
    }
  })

  return updatedContent
}

const handleDownloadPDF = (content: string) => {
  // Decode the HTML content using he before passing it to htmlToPdfmake
  const decodedContent = he.decode(content)

  const pdfContent = htmlToPdfmake(decodedContent, {
    images: true,
    defaultStyles: {
      p: { fontSize: 12, margin: [0, 5] },
      ul: { margin: [0, 5], listType: 'disc' },
      li: { margin: [0, 2] },
      h1: { fontSize: 24, bold: true, marginBottom: 5 },
      h2: { fontSize: 20, bold: true, marginBottom: 5 },
      h3: { fontSize: 18, bold: true, marginBottom: 5 },
      img: { margin: [0, 5] },
    },
  })

  const documentDefinition = {
    content: pdfContent,
  }

  pdfMake.createPdf(documentDefinition).download('report.pdf')
}

export default function GenerateReportModal({
  showGenerateReportModal,
  handleCloseGenerateReportModal,
  template,
}: GenerateReportModalProps) {
  if (!showGenerateReportModal) return null

  const editor = useEditor()
  const [creatorDetails, setCreatorDetails] = useState<any>(template?.createdBy)
  const [content, setContent] = useState(template?.content || '')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [templateAttributes, setTemplateAttributes] = useState<any[]>([])
  const [formData, setFormData] = useState<any>({})
  const [previewContent, setPreviewContent] = useState('')
  const fetchTemplateAttributes = async () => {
    try {
      const query = `?templateId=${template.id}`
      const response = await templateApi.getTemplateAttributes(query)
      const attributes = response.map((attr) => ({
        id: attr.id,
        label: attr.name,
        value: attr.name.replace(/\s+/g, '').toLowerCase(),
        type: attr.type,
      }))
      setTemplateAttributes(attributes)

      const initialFormData = attributes.reduce(
        (acc, attr) => ({ ...acc, [attr.value]: '' }),
        {}
      )
      setFormData(initialFormData)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  useEffect(() => {
    setCreatorDetails(template?.createdBy)
    setContent(template?.content || '')
    setTemplateAttributes(template?.attributes || [])
  }, [template])

  useEffect(() => {
    if (template.id) {
      fetchTemplateAttributes()
    }
  }, [template.id])

  useEffect(() => {
    setContent(template?.content || '')
  }, [template])

  useEffect(() => {
    const updatedContent = replacePlaceholders(content, selectedAnnotationData)
    setPreviewContent(updatedContent)
  }, [content, formData, uploadedImage, creatorDetails])

  const handleFileChange = (name: string, file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64Image = reader.result as string
      setFormData((prev) => ({
        ...prev,
        [name]: base64Image,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  console.log(creatorDetails)
  const selectedAnnotationData = {
    ...formData,
    annotationData:
      JSON.stringify(editor?.selectedAnnotation) || 'No annotation data',
    customImage: uploadedImage || '',
    createdByName: creatorDetails?.name || 'Unknown',
    createdByEmail: creatorDetails?.email || 'No email',
    status: editor?.selectedAnnotation?.status || 'No status',
  }

  return (
    <Dialog
      open={showGenerateReportModal}
      onOpenChange={handleCloseGenerateReportModal}
    >
      <DialogContent className='max-w-7xl p-6'>
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
          <DialogDescription>
            Fill in the details and generate a report for the selected
            annotation.
          </DialogDescription>
        </DialogHeader>

        <div className='flex gap-6 mt-4'>
          <div className='w-1/2'>
            <form>
              {templateAttributes.map((attr) => (
                <div key={attr.id} className='mb-4'>
                  <label className='block text-sm font-medium mb-2'>
                    {attr.label}
                  </label>
                  {attr.type === 'image' ? (
                    <input
                      type='file'
                      accept='image/*'
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileChange(attr.value, file)
                      }}
                    />
                  ) : (
                    <Input
                      type={
                        attr.type === 'number'
                          ? 'number'
                          : attr.type === 'color'
                            ? 'color'
                            : 'text'
                      }
                      value={formData[attr.value] || ''}
                      onChange={(e) =>
                        handleInputChange(attr.value, e.target.value)
                      }
                      placeholder={`Enter ${attr.label}`}
                    />
                  )}
                </div>
              ))}
            </form>

            <div className='mt-4'>
              <Button
                onClick={() => handleDownloadPDF(previewContent, uploadedImage)}
              >
                Download PDF
              </Button>
            </div>
          </div>

          <div className='w-full p-4 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 overflow-hidden'>
            <h2 className='text-lg font-semibold mb-2'>Preview</h2>
            <div
              className='prose dark:prose-invert max-w-[50rem]'
              style={{
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap', // Ensures line breaks are respected
              }}
              dangerouslySetInnerHTML={{
                __html: he.decode(previewContent || ''),
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
