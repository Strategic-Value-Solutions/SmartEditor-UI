import { Button } from '../ui/button'
import { useEditor } from './CanvasContext/CanvasContext'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import imageConstants from '@/constants/imageConstants'
import { MoveLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

export default function ExtendedToolbar({ tools }: { tools: any[] }) {
  const editor = useEditor() as any
  const { projectId } = useParams()
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(`/project/${projectId}`)
  }

  const buttonStyle = {
    background: 'linear-gradient(145deg, #a0a0a0, #808080)',
    boxShadow: '2px 2px 4px #707070, -2px -2px 4px #b0b0b0',
  }

  return (
    <div
      className='fixed z-50 w-36 h-full p-1 overflow-y-auto transition-all duration-300 left-0 top-0'
      style={{
        background: 'linear-gradient(145deg, #e6e6e6, #ffffff)',
        boxShadow: '3px 3px 6px #d1d1d1, -3px -3px 6px #ffffff',
        border: '1px solid #d1d1d1',
      }}
      id='toolbar'
    >
      <div className='flex flex-col items-center justify-center w-full h-20 mt-12 text-white'>
        <Button
          id='back'
          className='flex items-center justify-center w-4/5 px-4 py-2 mb-2 text-white transition rounded-lg h-10 hover:opacity-90'
          onClick={handleBack}
          style={buttonStyle}
          aria-label='Go back'
        >
          <MoveLeft className='mr-2' />
          <span>Back</span>
        </Button>
        <div
          className='flex flex-col items-center justify-center w-4/5 p-2 mb-2 text-sm text-white rounded-lg'
          style={buttonStyle}
        >
          <p>Components</p>
          <div className='flex items-center justify-center'>
            ({tools.length})
          </div>
        </div>
      </div>
      <div className='flex flex-col items-center justify-center gap-4 mt-8  h-[70vh]'>
        {tools.map((tool: any, index: number) => (
          <TooltipProvider key={`${index}-provider`}>
            <Tooltip>
              <TooltipTrigger>
                <button
                  key={`${index}-primary`}
                  type='button'
                  className='flex items-center justify-center w-12 h-12 p-2 transition rounded-lg hover:shadow-lg'
                  onClick={() => {
                    editor.addIcon({
                      icon: imageConstants[tool.imageUrl],
                      tool,
                    })
                    window.localStorage.setItem(
                      'selectedTool',
                      JSON.stringify(tool)
                    )
                  }}
                  style={{
                    background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
                    boxShadow: '2px 2px 4px #d1d1d1, -2px -2px 4px #ffffff',
                  }}
                  aria-label={`Add ${tool.name}`}
                >
                  <img
                    src={imageConstants[tool.imageUrl]}
                    alt={tool?.name?.toLowerCase()}
                    className='w-6 h-6'
                    style={{
                      filter: 'contrast(1.2) brightness(0.9)',
                    }}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tool.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  )
}
