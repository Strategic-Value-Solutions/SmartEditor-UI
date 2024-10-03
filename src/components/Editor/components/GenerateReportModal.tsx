import { useEditor } from '../CanvasContext/CanvasContext'
import ReactQuillEditor from '@/components/custom/react-quill-editor'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import annotationApi from '@/service/annotationApi'
import { getErrorMessage } from '@/utils'
// Import vfs_fonts to solve font issue
import htmlToPdfmake from 'html-to-pdfmake'
import pdfMake from 'pdfmake/build/pdfmake'
// Import pdfmake
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

// Import htmlToPdfmake

pdfMake.vfs = pdfFonts.pdfMake.vfs // Set the pdf fonts

interface GenerateReportModalProps {
  showGenerateReportModal: boolean
  handleCloseGenerateReportModal: () => void
  template: any
}

// Function to replace placeholders in the template with actual values
const replacePlaceholders = (templateContent: string, data: any) => {
  let updatedContent = templateContent

  // Replace single image placeholder
  updatedContent = updatedContent.replace(
    /{{customImage}}/g,
    data.customImage
      ? `<img src="${data.customImage}" alt="Custom Image" style="max-width: 100%;" />`
      : '' // Handle the case where no image is uploaded
  )

  return updatedContent
    .replace(/{{annotationData}}/g, data.annotationData || '')
    .replace(/{{createdByName}}/g, data.createdByName || 'Unknown')
    .replace(/{{createdByEmail}}/g, data.createdByEmail || 'No email')
    .replace(/{{status}}/g, data.status || 'No status')
}

// Function to download content as PDF using pdfMake
const handleDownloadPDF = (content: string, customImage: string | null) => {
  // Convert HTML content to pdfMake-compatible format
  const pdfContent = htmlToPdfmake(content)

  // Define document structure for pdfMake
  const documentDefinition = {
    content: [
      ...pdfContent,
      // If there is an image, add it to the PDF content
      customImage
        ? {
            text: 'Uploaded Image:',
            margin: [0, 20, 0, 10],
          }
        : '',
      customImage
        ? {
            image: customImage,
            width: 300, // Set a fixed size for the image
            height: 150, // Adjust height for better visibility
            alignment: 'left',
            margin: [0, 0, 0, 20], // Add margin below the image
          }
        : '',
    ],
  }

  // Generate and download the PDF
  pdfMake.createPdf(documentDefinition).download('report.pdf')
}

export default function GenerateReportModal({
  showGenerateReportModal,
  handleCloseGenerateReportModal,
  template,
}: GenerateReportModalProps) {
  const editor = useEditor()
  const [creatorDetails, setCreatorDetails] = useState<any>(null) // To store creator details
  const [content, setContent] = useState(template?.content || '')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  useEffect(() => {
    setContent(template?.content || '')
  }, [template])

  // Fetch annotation and creator details
  useEffect(() => {
    const fetchAnnotation = async () => {
      try {
        const annotation = await annotationApi.getAnnotationById(
          editor.selectedAnnotation.id
        )
        setCreatorDetails(annotation.createdBy) // Set creator details from fetched annotation
      } catch (error) {
        toast.error(getErrorMessage(error))
      }
    }

    fetchAnnotation()
  }, [editor.selectedAnnotation])

  // Get the selected annotation data from the editor context or the fetched creatorDetails
  const selectedAnnotationData = {
    annotationData:
      JSON.stringify(editor.selectedAnnotation) || 'No annotation data',
    customImage: uploadedImage || '', // No image if not uploaded
    createdByName: creatorDetails?.name || 'Unknown', // Use creatorDetails for name
    createdByEmail: creatorDetails?.email || 'No email', // Use creatorDetails for email
    status: editor.selectedAnnotation?.status || 'No status',
  }

  // Function to handle file input and convert image to Data URI (single image)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        // Add the image Data URI
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file) // Convert image to Data URI
    }
  }

  // Replace placeholders in the template content
  const previewContent = replacePlaceholders(content, selectedAnnotationData)

  return (
    <Dialog
      open={showGenerateReportModal}
      onOpenChange={handleCloseGenerateReportModal}
    >
      <DialogContent className='max-w-7xl p-6'>
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
          <DialogDescription>
            Generate a report for the selected annotation.
          </DialogDescription>
        </DialogHeader>

        {/* Flex layout to show editor on the left and preview on the right */}
        <div className='flex gap-6 mt-4'>
          {/* Left side: React Quill Editor */}
          <div className='w-1/2'>
            <ReactQuillEditor
              value={content}
              placeholder='Write your template content here...'
              className='min-h-[400px]'
              onChange={(value) => setContent(value)} // Update content state
            />

            {/* File input for single image upload */}
            <div className='mt-4'>
              <input
                type='file'
                accept='image/*'
                onChange={handleImageUpload} // Handle single image upload
              />
            </div>

            {/* Display uploaded image with remove option */}
            {uploadedImage && (
              <div className='mt-4'>
                <h3>Uploaded Image:</h3>
                <div className='flex items-center gap-4'>
                  <img
                    src={uploadedImage}
                    alt='Uploaded Image'
                    className='w-12 h-12 object-cover'
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right side: Live preview of the content */}
          <div
            className='w-full p-4 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 overflow-hidden'
            style={{
              maxWidth: '600px', // Fixed width for preview container
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
          >
            <h2 className='text-lg font-semibold mb-2'>Preview</h2>
            <div
              className='prose dark:prose-invert overflow-hidden text-ellipsis'
              dangerouslySetInnerHTML={{ __html: previewContent }}
            ></div>

            {/* Button to download the PDF */}
            <div className='mt-4'>
              <button
                onClick={() => handleDownloadPDF(previewContent, uploadedImage)} // Pass image and content
                className='bg-blue-500 text-white py-2 px-4 rounded'
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
