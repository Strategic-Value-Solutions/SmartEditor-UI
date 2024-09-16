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
      className={`fixed z-50 bg-gradient-to-br border bg-gray-100 border-gray-300 w-24 p-1 transition-all duration-300 left-0 top-0 h-full overflow-y-auto`}
      id='toolbar'
    >
      <div className='flex flex-col items-center justify-center p-2 text-sm bg-blue-950 text-white rounded-sm'>
        <p>Components </p>
        <div className='flex items-center justify-center'>
          ({tools.length})
        </div>
      </div>
      <div className='flex flex-col items-center justify-center gap-3 h-[calc(100vh-90px)] mt-2 mx-auto'>
        {tools.map((tool: any, index: any) => {
          return (
            <TooltipProvider key={`${index}-provider`}>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    key={`${index}-primary`}
                    type='button'
                    className='p-1 hover:bg-gray-200 rounded white border border-gray-300 w-10 h-10 flex items-center justify-center bg-white'
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
                      // filter: 'invert(0)', // Ensure icons aren't too light
                      // boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Add subtle shadow
                    }}
                  >
                    <img
                      src={imageConstants[tool.imageUrl]}
                      alt={tool?.name?.toLowerCase()}
                      className='w-full' // Ensure full visibility
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
    </div>
  )
}

export default ExtendedToolbar
