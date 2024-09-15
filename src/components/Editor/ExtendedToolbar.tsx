import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from '../ui/tooltip'
import { useEditor } from '@/components/Editor/CanvasContext'
import imageConstants from '@/constants/imageConstants'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'

function ExtendedToolbar({
  tools,
  // canvas,
  // showExtendedToolbar,
  // createRect,
  // fileReaderInfo,
  // toggleExtendedToolbar,
}: any) {
  const isCollapsed = useSelector(
    (state: RootState) => state.sidebar.isCollapsed
  )
  const { currentProjectModel: pick } = useSelector(
    (state: RootState) => state.projectModels
  )
  const editor = useEditor() as any

  return (
    <div
      className={`grid grid-cols-2 items-start justify-start gap-3 fixed z-50 bg-gradient-to-br border bg-gray-100 border-gray-300 w-24 p-1 transition-all duration-300 left-0 top-0 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent`}
      id='toolbar'
    >
      {tools.map((tool: any, index: any) => {
        console.log(tool.imageUrl)

        return (
          <TooltipProvider key={`${index}-provider`}>
            <Tooltip>
              <TooltipTrigger>
                <button
                  key={`${index}-primary`}
                  type='button'
                  className='p-2 hover:bg-gray-200 rounded invert'
                  onClick={() => editor.addIcon(imageConstants[tool.imageUrl])}
                  style={{
                    filter: 'invert(0)', // Ensure icons aren't too light
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Add subtle shadow
                  }}
                >
                  <img
                    src={imageConstants[tool.imageUrl]}
                    alt={tool?.name?.toLowerCase()}
                    className='max-w-full' // Ensure full visibility
                    style={{
                      filter: 'contrast(1.2)', // Increase contrast for clarity
                    }}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tool.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      })}
    </div>
  )
}

export default ExtendedToolbar
