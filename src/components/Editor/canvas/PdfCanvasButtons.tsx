import { RootState } from '@/store'
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { useSelector } from 'react-redux'

interface PdfCanvasButtonsProps {
  editor: any
  changePage: (value: number) => void
  pick: any
  handleSaveAnnotations: () => void
  zoomIn: () => void
  zoomOut: () => void
  resetTransform: () => void
}

export default function PdfCanvasButtons({
  editor,
  changePage,
  pick,
  handleSaveAnnotations,
  zoomIn,
  zoomOut,
  resetTransform,
}: PdfCanvasButtonsProps) {
  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject
  )

  return (
    <div className='fixed bottom-2 z-50 flex w-full items-center justify-center gap-3'>
      {editor.currPage > 1 && (
        <button
          onClick={() => changePage(-1)}
          className='p-1 hover:bg-gray-200 rounded-md bg-gray-100 border border-gray-300 transition duration-150 shadow-md'
        >
          <ChevronLeft className='w-5 h-5' />
        </button>
      )}

      <div className='flex items-center justify-center p-1 rounded-md bg-gray-100 border border-gray-300 shadow-md text-sm export-exclude'>
        <span>
          Page {editor.currPage} of {editor.numPages}
        </span>
      </div>

      {editor.currPage < editor.numPages && (
        <button
          onClick={() => changePage(1)}
          className='p-1 hover:bg-gray-200 rounded-md bg-gray-100 border border-gray-300 transition duration-150 shadow-md export-exclude'
        >
          <ChevronRight className='w-5 h-5' />
        </button>
      )}

      <button
        onClick={() => {
          zoomIn()
        }}
        className='p-1 hover:bg-gray-200 rounded-md bg-gray-100 border border-gray-300 transition duration-150 shadow-md export-exclude'
        id='zoom-in'
      >
        <ZoomIn className='w-5 h-5' />
      </button>

      <button
        onClick={() => {
          zoomOut()
        }}
        className='p-1 hover:bg-gray-200 rounded-md bg-gray-100 border border-gray-300 transition duration-150 shadow-md export-exclude'
        id='zoom-out'
      >
        <ZoomOut className='w-5 h-5' />
      </button>

      <button
        id='pan'
        type='button'
        title='Toggle Pan Mode'
        onClick={() => editor.setAllowPinchZoom(!editor.allowPinchZoom)}
        className='p-1 hover:bg-gray-200 rounded-md bg-gray-100 border border-gray-300 transition duration-150 shadow-md export-exclude'
      >
        {editor.allowPinchZoom ? (
          <Pause className='w-5 h-5 text-black' />
        ) : (
          <Play className='w-5 h-5 text-black' />
        )}
      </button>

      <button
        onClick={() => {
          resetTransform()
        }}
        id='rotate-ccw'
        className='p-1 hover:bg-gray-200 rounded-md bg-gray-100 border border-gray-300 transition duration-150 shadow-md export-exclude'
      >
        <RotateCcw className='w-5 h-5' />
      </button>
    </div>
  )
}
